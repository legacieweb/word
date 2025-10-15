const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: String,
  isFirstTime: Boolean,
  source: String,
  createdAt: { type: Date, default: Date.now },
  notes: [
    {
      message: String,
      date: { type: Date, default: Date.now },
      replies: [
        {
          message: String,
          date: { type: Date, default: Date.now }
        }
      ]
    }
  ]
});

module.exports = mongoose.model('User', userSchema);
