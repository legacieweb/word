const express = require('express');
const Album = require('../models/Album');
const Song = require('../models/Song');

const router = express.Router();

// Middleware to verify admin PIN
function verifyAdmin(req, res, next) {
  const pin = req.headers['x-admin-pin'];
  if (!pin || pin !== process.env.ADMIN_PIN) {
    return res.status(403).json({ message: 'Access denied: admin only' });
  }
  next();
}

// ===== GET ALL ALBUMS =====
router.get('/', async (req, res) => {
  try {
    const albums = await Album.find()
      .populate('songs')
      .sort({ createdAt: -1 })
      .lean();
    res.json(albums);
  } catch (err) {
    console.error('Error fetching albums:', err);
    res.status(500).json({ message: 'Failed to fetch albums' });
  }
});

// ===== GET SINGLE ALBUM =====
router.get('/:id', async (req, res) => {
  try {
    const album = await Album.findById(req.params.id)
      .populate('songs');
    if (!album) return res.status(404).json({ message: 'Album not found' });
    res.json(album);
  } catch (err) {
    console.error('Error fetching album:', err);
    res.status(500).json({ message: 'Failed to fetch album' });
  }
});

// ===== CREATE NEW ALBUM (Admin Only) =====
router.post('/', verifyAdmin, async (req, res) => {
  try {
    const { title, artist, description, releaseDate, songs } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Album title required' });
    }

    const newAlbum = new Album({
      title,
      artist: artist || "God's Church Chieko",
      description: description || '',
      releaseDate: releaseDate || null,
      songs: songs || [],
      createdAt: new Date()
    });

    await newAlbum.save();
    res.status(201).json({ message: 'Album created successfully', album: newAlbum });
  } catch (err) {
    console.error('Error creating album:', err);
    res.status(500).json({ message: 'Failed to create album' });
  }
});

// ===== UPDATE ALBUM (Admin Only) =====
router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const { title, artist, description, releaseDate } = req.body;

    const updateData = {};
    if (title) updateData.title = title;
    if (artist) updateData.artist = artist;
    if (description !== undefined) updateData.description = description;
    if (releaseDate !== undefined) updateData.releaseDate = releaseDate;
    updateData.updatedAt = new Date();

    const updatedAlbum = await Album.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('songs');

    if (!updatedAlbum) return res.status(404).json({ message: 'Album not found' });

    res.json({ message: 'Album updated', album: updatedAlbum });
  } catch (err) {
    console.error('Error updating album:', err);
    res.status(500).json({ message: 'Failed to update album' });
  }
});

// ===== DELETE ALBUM (Admin Only) =====
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);
    if (!album) return res.status(404).json({ message: 'Album not found' });

    // Remove album reference from all songs in this album
    if (album.songs && album.songs.length > 0) {
      await Song.updateMany(
        { _id: { $in: album.songs } },
        { album: null }
      );
    }

    await Album.findByIdAndDelete(req.params.id);

    res.json({ message: 'Album deleted successfully' });
  } catch (err) {
    console.error('Error deleting album:', err);
    res.status(500).json({ message: 'Failed to delete album' });
  }
});

// ===== ADD SONG TO ALBUM (Admin Only) =====
router.post('/:id/add-song', verifyAdmin, async (req, res) => {
  try {
    const { songId } = req.body;

    if (!songId) {
      return res.status(400).json({ message: 'Song ID required' });
    }

    // Update song to add album reference
    const song = await Song.findByIdAndUpdate(
      songId,
      { album: req.params.id },
      { new: true }
    );

    if (!song) return res.status(404).json({ message: 'Song not found' });

    // Add song to album's songs array
    const album = await Album.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { songs: songId } }, // addToSet prevents duplicates
      { new: true }
    ).populate('songs');

    if (!album) return res.status(404).json({ message: 'Album not found' });

    res.json({ message: 'Song added to album', album });
  } catch (err) {
    console.error('Error adding song to album:', err);
    res.status(500).json({ message: 'Failed to add song to album' });
  }
});

// ===== REMOVE SONG FROM ALBUM (Admin Only) =====
router.post('/:id/remove-song', verifyAdmin, async (req, res) => {
  try {
    const { songId } = req.body;

    if (!songId) {
      return res.status(400).json({ message: 'Song ID required' });
    }

    // Remove album reference from song
    await Song.findByIdAndUpdate(
      songId,
      { album: null }
    );

    // Remove song from album
    const album = await Album.findByIdAndUpdate(
      req.params.id,
      { $pull: { songs: songId } },
      { new: true }
    ).populate('songs');

    if (!album) return res.status(404).json({ message: 'Album not found' });

    res.json({ message: 'Song removed from album', album });
  } catch (err) {
    console.error('Error removing song from album:', err);
    res.status(500).json({ message: 'Failed to remove song from album' });
  }
});

module.exports = router;