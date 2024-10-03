// models/Story.js

const mongoose = require('mongoose');

// mongoose.connect('mongodb://127.0.0.1:27017/miniproject');

const storySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: '24h' }, // Automatically delete after 24 hours
});

module.exports = mongoose.model('Story', storySchema);
