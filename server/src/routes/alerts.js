const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');
const Log = require('../models/Log');
const { protect } = require('../middleware/auth');
const { roleGuard } = require('../middleware/roleGuard');

// Helper to log actions
const createLog = async (alertId, action, actor, actorRole, routingMode, metadata = {}) => {
  await Log.create({
    alertId, action, actor, actorRole, routingMode, metadata
  });
};

// @route   POST /api/alerts
// @desc    Create new alert (user only)
router.post('/', protect, roleGuard('user'), async (req, res) => {
  try {
    const { location, emergencyType, description, routingMode } = req.body;
    
    const alert = await Alert.create({
      triggeredBy: req.user._id,
      location,
      emergencyType,
      description,
      routingMode: routingMode || 'cloud'
    });

    await createLog(alert.alertId, 'ALERT_CREATED', req.user._id, 'user', alert.routingMode, { location, emergencyType });

    // In a real app, socket emission would happen here or in the controller
    // We'll handle socket emission in the socket handler

    res.status(201).json(alert);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/alerts/my
// @desc    Get current user's alert history
router.get('/my', protect, roleGuard('user'), async (req, res) => {
  try {
    const alerts = await Alert.find({ triggeredBy: req.user._id }).sort({ 'timestamps.created': -1 });
    res.json(alerts);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/alerts/active
// @desc    Get current active alert for user
router.get('/active', protect, roleGuard('user'), async (req, res) => {
  try {
    const alert = await Alert.findOne({
      triggeredBy: req.user._id,
      status: { $in: ['pending', 'accepted', 'en_route'] }
    }).populate('assignedResponder', 'name phone skills location zone');
    res.json(alert);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/alerts/:id
// @desc    Get single alert by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const alert = await Alert.findOne({ alertId: req.params.id }).populate('assignedResponder', 'name phone skills').populate('triggeredBy', 'name phone');
    if (!alert) return res.status(404).json({ message: 'Alert not found' });
    res.json(alert);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   PATCH /api/alerts/:id/accept
// @desc    Responder accepts alert
router.patch('/:id/accept', protect, roleGuard('responder'), async (req, res) => {
  try {
    const alert = await Alert.findOne({ alertId: req.params.id });
    if (!alert) return res.status(404).json({ message: 'Alert not found' });
    if (alert.status !== 'pending') return res.status(400).json({ message: 'Alert already accepted or resolved' });

    alert.status = 'accepted';
    alert.assignedResponder = req.user._id;
    alert.timestamps.accepted = Date.now();
    alert.timeline.push({ action: 'ACCEPTED', actor: req.user.name });
    await alert.save();

    await createLog(alert.alertId, 'ALERT_ACCEPTED', req.user._id, 'responder', alert.routingMode);

    res.json(alert);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   PATCH /api/alerts/:id/en-route
// @desc    Responder marks en route
router.patch('/:id/en-route', protect, roleGuard('responder'), async (req, res) => {
  try {
    const alert = await Alert.findOne({ alertId: req.params.id, assignedResponder: req.user._id });
    if (!alert) return res.status(404).json({ message: 'Alert not found or not assigned to you' });

    alert.status = 'en_route';
    alert.timestamps.enRoute = Date.now();
    alert.timeline.push({ action: 'EN_ROUTE', actor: req.user.name });
    await alert.save();

    res.json(alert);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   PATCH /api/alerts/:id/resolve
// @desc    Responder marks resolved
router.patch('/:id/resolve', protect, roleGuard('responder'), async (req, res) => {
  try {
    const alert = await Alert.findOne({ alertId: req.params.id, assignedResponder: req.user._id });
    if (!alert) return res.status(404).json({ message: 'Alert not found or not assigned to you' });

    alert.status = 'resolved';
    alert.timestamps.resolved = Date.now();
    alert.timeline.push({ action: 'RESOLVED', actor: req.user.name });
    await alert.save();

    await createLog(alert.alertId, 'ALERT_RESOLVED', req.user._id, 'responder', alert.routingMode);

    // Update responder stats
    const User = require('../models/User');
    await User.findByIdAndUpdate(req.user._id, { $inc: { totalAlertsResponded: 1 } });

    res.json(alert);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   PATCH /api/alerts/:id/cancel
// @desc    User cancels their alert
router.patch('/:id/cancel', protect, roleGuard('user'), async (req, res) => {
  try {
    const alert = await Alert.findOne({ alertId: req.params.id, triggeredBy: req.user._id });
    if (!alert) return res.status(404).json({ message: 'Alert not found' });
    if (alert.status === 'resolved') return res.status(400).json({ message: 'Cannot cancel resolved alert' });

    alert.status = 'cancelled';
    alert.timestamps.cancelled = Date.now();
    alert.timeline.push({ action: 'CANCELLED', actor: req.user.name });
    await alert.save();

    await createLog(alert.alertId, 'ALERT_CANCELLED', req.user._id, 'user', alert.routingMode);

    res.json(alert);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/alerts/sync-p2p
// @desc    Sync P2P queued alerts to DB
router.post('/sync-p2p', protect, async (req, res) => {
  try {
    const { alerts } = req.body;
    if (!alerts || !Array.isArray(alerts)) {
      return res.status(400).json({ message: 'Alerts array required' });
    }

    const savedAlerts = [];
    for (const a of alerts) {
      let existing = await Alert.findOne({ alertId: a.alertId });
      if (!existing) {
        // Try to sync triggeredBy if it's missing but user is authed
        let triggeredBy = a.triggeredBy || req.user._id;
        
        const newAlert = await Alert.create({
          alertId: a.alertId,
          triggeredBy,
          location: a.location,
          emergencyType: a.emergencyType,
          description: a.description,
          status: a.status || 'pending',
          routingMode: 'p2p',
          isSynced: true,
          timestamps: a.timestamps || { created: Date.now() },
          timeline: a.timeline || [{ action: 'ALERT_CREATED (P2P)', actor: 'System' }]
        });
        savedAlerts.push(newAlert);
        await createLog(newAlert.alertId, 'ALERT_SYNCED_P2P', req.user._id, req.user.role, 'p2p');
      }
    }

    res.json({ message: 'Sync successful', count: savedAlerts.length });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
