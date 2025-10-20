const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: String,
  album: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album',
    required: false
  },
  artist: {
    type: String,
    default: "God's Church"
  },
  audio: {
    data: Buffer,
    contentType: String
  },
  duration: { type: Number, default: 0 }, // in seconds
  description: String,
  coverUrl: String, // URL or path to cover art
  order: { type: Number, default: 0 }, // Order within album
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Song', songSchema);