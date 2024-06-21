const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  seen: { type: Boolean, default: false }
});

module.exports = mongoose.model('Notification', notificationSchema);
