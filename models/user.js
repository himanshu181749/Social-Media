const mongoose = require('mongoose');

// mongoose.connect('mongodb://127.0.0.1:27017/miniproject');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  age: { type: Number, required: true },
  password: { type: String, required: true },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'post' }],
});


module.exports = mongoose.model("user", UserSchema);
