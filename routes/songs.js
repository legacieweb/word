const express = require('express');
const multer = require('multer');
const Song = require('../models/Song');
const Album = require('../models/Album');

const router = express.Router();

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware to verify admin PIN
function verifyAdmin(req, res, next) {
  const pin = req.headers['x-admin-pin'];
  if (!pin || pin !== process.env.ADMIN_PIN) {
    return res.status(403).json({ message: 'Access denied: admin only' });
  }
  next();
}

// ===== GET ALL SONGS =====
router.get('/', async (req, res) => {
  try {
    const songs = await Song.find()
      .populate('album')
      .sort({ createdAt: -1 })
      .lean();
    res.json(songs);
  } catch (err) {
    console.error('Error fetching songs:', err);
    res.status(500).json({ message: 'Failed to fetch songs' });
  }
});

// ===== GET SINGLE SONG AUDIO =====
router.get('/:id/audio', async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).send('Song not found');
    res.set('Content-Type', song.audio.contentType);
    res.send(song.audio.data);
  } catch (err) {
    console.error('Error streaming audio:', err);
    res.status(500).send('Audio streaming error');
  }
});

// ===== UPLOAD NEW SONG (Admin Only) =====
router.post('/upload', verifyAdmin, upload.single('song'), async (req, res) => {
  try {
    const { title, artist, album, description } = req.body;

    if (!title || !req.file) {
      return res.status(400).json({ message: 'Title and audio file required' });
    }

    const newSong = new Song({
      title,
      artist: artist || "God's Church Chieko",
      album: album || null,
      description: description || '',
      audio: {
        data: req.file.buffer,
        contentType: req.file.mimetype
      },
      duration: 0, // Will be calculated on frontend
      createdAt: new Date()
    });

    await newSong.save();

    // If album specified, add song to album
    if (album) {
      await Album.findByIdAndUpdate(
        album,
        { $push: { songs: newSong._id } },
        { new: true }
      );
    }

    res.status(200).json({ message: 'Song uploaded successfully', song: newSong });
  } catch (err) {
    console.error('Error uploading song:', err);
    res.status(500).json({ message: 'Failed to upload song' });
  }
});

// ===== UPDATE SONG (Admin Only) =====
router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const { title, artist, album, description, duration } = req.body;

    const updateData = {};
    if (title) updateData.title = title;
    if (artist) updateData.artist = artist;
    if (description !== undefined) updateData.description = description;
    if (duration) updateData.duration = duration;
    if (album !== undefined) updateData.album = album || null;

    const updatedSong = await Song.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('album');

    if (!updatedSong) return res.status(404).json({ message: 'Song not found' });

    res.json({ message: 'Song updated', song: updatedSong });
  } catch (err) {
    console.error('Error updating song:', err);
    res.status(500).json({ message: 'Failed to update song' });
  }
});

// ===== DELETE SONG (Admin Only) =====
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ message: 'Song not found' });

    // Remove song from album if it belongs to one
    if (song.album) {
      await Album.findByIdAndUpdate(
        song.album,
        { $pull: { songs: song._id } },
        { new: true }
      );
    }

    await Song.findByIdAndDelete(req.params.id);

    res.json({ message: 'Song deleted successfully' });
  } catch (err) {
    console.error('Error deleting song:', err);
    res.status(500).json({ message: 'Failed to delete song' });
  }
});

// ===== GET SONGS BY ALBUM =====
router.get('/album/:albumId', async (req, res) => {
  try {
    const songs = await Song.find({ album: req.params.albumId })
      .sort({ order: 1 })
      .lean();
    res.json(songs);
  } catch (err) {
    console.error('Error fetching album songs:', err);
    res.status(500).json({ message: 'Failed to fetch album songs' });
  }
});

module.exports = router;