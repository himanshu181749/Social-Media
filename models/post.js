const mongoose = require('mongoose');

// mongoose.connect('mongodb://127.0.0.1:27017/miniproject');

// const PostSchema = new mongoose.Schema({
// title: { type: String, required: true },
// content: { type: String, required: true },
// // createdAt: { type: Date, default: Date.now },
// user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }
// });

const PostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    username: { type: String, required: true }, // Add this line
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  });
  
  
module.exports = mongoose.model("post", PostSchema);
