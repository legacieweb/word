const mongoose = require('mongoose');

const sermonSchema = new mongoose.Schema({
  title: String,
  audio: {
    data: Buffer,
    contentType: String
  },
  duration: { type: Number, default: 0 }, // in seconds
  chatMessages: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: String,
    message: String,
    timestamp: { type: Date, default: Date.now }
  }],
  isLive: { type: Boolean, default: false },
  pdfPath: { type: String, default: '' }, // PDF book path
  currentPdfPage: { type: Number, default: 1 }, // Current PDF page being broadcast
  startedAt: Date,
  endedAt: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Sermon', sermonSchema);
