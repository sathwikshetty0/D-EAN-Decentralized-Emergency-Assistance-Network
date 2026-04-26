const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Alert = require('../models/Alert');
const Log = require('../models/Log');
const { protect } = require('../middleware/auth');
const { roleGuard } = require('../middleware/roleGuard');

// Require admin for all routes
router.use(protect, roleGuard('admin'));

// @route   GET /api/admin/stats
// @desc    Dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const activeAlerts = await Alert.countDocuments({ status: { $in: ['pending', 'accepted', 'en_route'] } });
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const resolvedToday = await Alert.countDocuments({ status: 'resolved', 'timestamps.resolved': { $gte: today } });
    
    const onlineResponders = await User.countDocuments({ role: 'responder', isAvailable: true, isActive: true });
    
    const p2pEvents = await Alert.countDocuments({ routingMode: 'p2p' });

    // Mock chart data for now
    const alertsPerDay = [
      { name: 'Mon', count: 12 }, { name: 'Tue', count: 19 }, { name: 'Wed', count: 15 },
      { name: 'Thu', count: 22 }, { name: 'Fri', count: 18 }, { name: 'Sat', count: 25 }, { name: 'Sun', count: 30 }
    ];

    const alertTypesDistribution = [
      { name: 'Medical', value: 400 }, { name: 'Fire', value: 300 },
      { name: 'Accident', value: 300 }, { name: 'Crime', value: 200 }
    ];

    res.json({
      activeAlerts,
      resolvedToday,
      onlineResponders,
      p2pEvents,
      alertsPerDay,
      alertTypesDistribution
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/admin/alerts
// @desc    All alerts
router.get('/alerts', async (req, res) => {
  try {
    const alerts = await Alert.find()
      .populate('triggeredBy', 'name email')
      .populate('assignedResponder', 'name')
      .sort({ 'timestamps.created': -1 });
    res.json(alerts);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/admin/users
// @desc    All users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/admin/responders
// @desc    All responders
router.get('/responders', async (req, res) => {
  try {
    const responders = await User.find({ role: 'responder' }).select('-password');
    res.json(responders);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/admin/logs
// @desc    System logs
router.get('/logs', async (req, res) => {
  try {
    const logs = await Log.find().populate('actor', 'name').sort({ timestamp: -1 }).limit(100);
    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   PATCH /api/admin/users/:id/toggle
// @desc    Activate/deactivate user
router.patch('/users/:id/toggle', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    user.isActive = !user.isActive;
    await user.save();
    
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   PATCH /api/admin/responders/:id/toggle
// @desc    Activate/deactivate responder
router.patch('/responders/:id/toggle', async (req, res) => {
  try {
    const responder = await User.findById(req.params.id);
    if (!responder || responder.role !== 'responder') return res.status(404).json({ message: 'Responder not found' });
    
    responder.isActive = !responder.isActive;
    await responder.save();
    
    res.json(responder);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/admin/export/alerts
// @desc    Export alerts as CSV (Mock logic to send CSV string)
router.get('/export/alerts', async (req, res) => {
  try {
    const alerts = await Alert.find().populate('triggeredBy', 'name').populate('assignedResponder', 'name');
    
    let csv = 'Alert ID,Type,Status,Mode,Created By,Assigned To,Created At\n';
    alerts.forEach(a => {
      csv += `${a.alertId},${a.emergencyType},${a.status},${a.routingMode},${a.triggeredBy?.name || 'N/A'},${a.assignedResponder?.name || 'N/A'},${a.timestamps.created}\n`;
    });
    
    res.header('Content-Type', 'text/csv');
    res.attachment('alerts.csv');
    res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/admin/export/logs
// @desc    Export logs as CSV
router.get('/export/logs', async (req, res) => {
  try {
    const logs = await Log.find().populate('actor', 'name');
    
    let csv = 'Alert ID,Action,Actor,Role,Mode,Timestamp\n';
    logs.forEach(l => {
      csv += `${l.alertId},${l.action},${l.actor?.name || 'System'},${l.actorRole},${l.routingMode},${l.timestamp}\n`;
    });
    
    res.header('Content-Type', 'text/csv');
    res.attachment('logs.csv');
    res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
