const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Send note to user
router.post('/send-note', async (req, res) => {
  const { userId, message } = req.body;

  if (!userId || !message) {
    return res.status(400).json({ error: 'User ID and message are required.' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    user.notes.push({ message });
    await user.save();

    res.status(200).json({ success: true, message: 'Note saved.' });
  } catch (err) {
    console.error('Error sending note:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
