const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
  title: String,
  artist: {
    type: String,
    default: "God's Church"
  },
  description: String,
  coverUrl: String,
  releaseDate: Date,
  songs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Song'
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Album', albumSchema);