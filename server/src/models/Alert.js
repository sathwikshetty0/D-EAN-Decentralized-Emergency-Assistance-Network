const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  alertId: { type: String, unique: true },
  
  triggeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String }
  },
  
  emergencyType: { 
    type: String, 
    enum: ['medical', 'fire', 'accident', 'crime', 'flood', 'other'],
    required: true 
  },
  
  description: { type: String, maxlength: 500 },
  
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'en_route', 'resolved', 'cancelled'],
    default: 'pending'
  },
  
  routingMode: { type: String, enum: ['cloud', 'p2p'], required: true },
  
  priority: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'high' },
  
  assignedResponder: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  responderLocation: {
    lat: { type: Number },
    lng: { type: Number }
  },
  
  timestamps: {
    created: { type: Date, default: Date.now },
    accepted: { type: Date },
    enRoute: { type: Date },
    resolved: { type: Date },
    cancelled: { type: Date }
  },
  
  isSynced: { type: Boolean, default: true },
  
  timeline: [{
    action: String,
    actor: String,
    timestamp: { type: Date, default: Date.now }
  }]
});

// Generate alertId before saving if it doesn't exist
alertSchema.pre('save', function(next) {
  if (!this.alertId) {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    this.alertId = `DEAN-${randomNum}`;
  }
  next();
});

module.exports = mongoose.model('Alert', alertSchema);
