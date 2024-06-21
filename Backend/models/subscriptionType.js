
const mongoose = require('mongoose');

const subscriptionTypeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  associatedGames: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Game' }]
});

module.exports = mongoose.model('SubscriptionType', subscriptionTypeSchema);
