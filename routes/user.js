// routes/user.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/notes/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId, 'notes');
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ notes: user.notes });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
