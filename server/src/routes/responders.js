const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { roleGuard } = require('../middleware/roleGuard');

// @route   GET /api/responders
// @desc    List all active/available responders
router.get('/', protect, async (req, res) => {
  try {
    const responders = await User.find({ 
      role: 'responder', 
      isActive: true,
      isAvailable: true 
    }).select('-password');
    res.json(responders);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/responders/stats
// @desc    Responder's own stats
router.get('/stats', protect, roleGuard('responder'), async (req, res) => {
  try {
    const Alert = require('../models/Alert');
    
    // Calculate stats
    const totalResponses = req.user.totalAlertsResponded || 0;
    
    // Count alerts in last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentAlerts = await Alert.countDocuments({
      assignedResponder: req.user._id,
      'timestamps.accepted': { $gte: sevenDaysAgo }
    });

    res.json({
      totalResponses,
      thisWeek: recentAlerts,
      avgResponseTime: "3.2m", // Mocked for now, can be calculated dynamically
      successRate: "95%" // Mocked
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   PATCH /api/responders/location
// @desc    Update responder's current location
router.patch('/location', protect, roleGuard('responder'), async (req, res) => {
  try {
    const { lat, lng } = req.body;
    if (!lat || !lng) return res.status(400).json({ message: 'Coordinates required' });

    const user = await User.findById(req.user._id);
    user.location = {
      lat,
      lng,
      updatedAt: Date.now()
    };
    await user.save();

    res.json(user.location);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
