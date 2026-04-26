const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  alertId: { type: String },
  action: { type: String, required: true },
  actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  actorRole: { type: String },
  metadata: { type: Object },
  routingMode: { type: String, enum: ['cloud', 'p2p'] },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Log', logSchema);
