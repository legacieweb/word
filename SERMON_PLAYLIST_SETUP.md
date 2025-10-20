# 🎵 Spotify-Like Sermon Playlist Setup Guide

## What's New ✨

I've transformed your sermon.html into a beautiful **Spotify-like music streaming interface** for God's Church sermons! 

### Features

#### 👤 User Experience (sermon.html)
- **Modern Dark Theme** - Beautiful Spotify-inspired interface with green accent colors
- **Now Playing Section** - Large album art display with sermon details
- **Full Playback Controls**:
  - Play/Pause button
  - Next/Previous tracks
  - Shuffle (🔀) - Random order
  - Repeat (🔁) - Cycle through: No Repeat → Repeat All → Repeat One
  - Volume control slider
- **Live Queue** - See all upcoming sermons with click-to-play
- **Progress Bar** - Seek through audio, see current time and duration
- **Responsive Design** - Works perfectly on mobile, tablet, and desktop
- **Auto-Load** - Fetches all sermons from MongoDB on page load

#### 🔐 Admin Experience (admin.html)
- **Dual Upload Interfaces**:
  1. Dedicated "Upload New Sermon" section in sidebar
  2. Tab-based upload within "Manage Sermons" panel
- **Easy File Management**:
  - Upload title + audio file
  - Admin PIN verification
  - Progress indicator during upload
  - Instant list refresh after upload
- **Full Sermon Management**:
  - View all uploaded sermons
  - See upload date and duration
  - One-click delete (with PIN confirmation)
  - Refresh list anytime

---

## How to Use

### For Users (Listening to Sermons)

1. **Visit the Playlist Page**
   - Open `sermon.html` in your browser
   - The page automatically loads all sermons from the database

2. **Play Sermons**
   - Click the green ▶️ play button to start
   - Use ⏮ ⏭ to navigate between sermons
   - Click any sermon in the queue to jump to it

3. **Control Playback**
   - 🔀 **Shuffle** - Randomize playlist order
   - 🔁 **Repeat** - Cycle through repeat modes
   - 🔊 **Volume** - Adjust with slider
   - **Progress Bar** - Click to seek forward/backward

---

### For Admins (Uploading Sermons)

1. **Log in to Admin Dashboard**
   - Go to `admin.html`
   - Provide admin PIN when prompted (default: `8372`)

2. **Upload a Sermon - Method 1 (Quick)**
   - Click "📤 Upload New Sermon" in sidebar
   - Enter sermon title
   - Select audio file (MP3, WAV, M4A, etc.)
   - Enter admin PIN
   - Click "📤 Upload Sermon"
   - ✅ Done! The playlist updates automatically

3. **Upload a Sermon - Method 2 (Dashboard)**
   - Click "🎼 Manage Sermons" in sidebar
   - Click "📤 Upload New" tab
   - Fill in title and select audio file
   - Enter admin PIN
   - Click "📤 Upload Sermon"
   - ✅ The sermon appears in the playlist immediately

4. **Manage Uploaded Sermons**
   - Click "📜 All Sermons" tab to view all sermons
   - See sermon name, upload date, and duration
   - Click 🗑️ to delete any sermon (requires PIN confirmation)

---

## API Endpoints

The playlist uses these MongoDB API endpoints:

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/sermons` | GET | None | Get all sermons |
| `/api/sermons/:id/audio` | GET | None | Stream audio for a sermon |
| `/api/sermons/upload` | POST | Admin PIN | Upload new sermon |
| `/api/sermons/:id` | DELETE | Admin PIN | Delete sermon |

---

## Database Structure

Each sermon in MongoDB includes:

```javascript
{
  _id: ObjectId,
  title: String,           // Sermon name
  audio: {
    data: Buffer,          // Audio file binary data
    contentType: String    // MIME type (audio/mp3, etc.)
  },
  duration: Number,        // Duration in seconds (optional)
  isLive: Boolean,         // Live sermon status
  pdfPath: String,         // Path to PDF (optional)
  currentPdfPage: Number,  // Current PDF page
  startedAt: Date,         // When sermon started
  endedAt: Date,           // When sermon ended
  createdAt: Date,         // Upload date/time
  chatMessages: Array      // Chat during sermon
}
```

---

## Customization

### Change Admin PIN
Edit `admin.html` and update:
```javascript
const ADMIN_PIN = '8372';  // Change this to your PIN
```

### Change Theme Colors
In `sermon.html`, search for `.spotify-gradient` and update the color values:
```css
.spotify-gradient {
  background: linear-gradient(135deg, #1db954 0%, #1ed760 100%);  /* Green */
}
```

### Change Server URL
If running on a different server, update all API calls from:
```javascript
http://localhost:3000/api/
```
to your server URL.

---

## Features Explained

### 🔀 Shuffle Mode
- Randomizes the order of all sermons
- Click again to disable shuffle
- Keeps playing without interruption

### 🔁 Repeat Modes
1. **First Click** - Repeat all (loops back to first sermon after last)
2. **Second Click** - Repeat one (repeats current sermon)
3. **Third Click** - No repeat (normal behavior)

### 📊 Queue Display
- Shows all available sermons
- Current playing sermon is highlighted with ♪ icon
- Shows sermon number and duration
- Click any sermon to play immediately

### ⏱️ Progress Bar
- Visual indication of playback progress
- Shows current time and total duration
- Click anywhere to seek to that position

---

## Troubleshooting

### Sermons Don't Load
- Check that MongoDB is running and connected
- Verify `MONGO_URI` in `.env` file
- Check browser console for errors (F12)
- Make sure `server.js` is running on `localhost:3000`

### Audio Won't Play
- Ensure audio file uploaded successfully
- Check browser console for CORS errors
- Try different audio format (MP3 is most compatible)
- Check browser volume isn't muted

### Upload Fails
- Verify admin PIN is correct (default: `8372`)
- Check file size (shouldn't be huge)
- Try smaller audio file first
- Ensure `/api/sermons/upload` endpoint is accessible

### Styling Issues
- Clear browser cache (Ctrl+Shift+Delete)
- Hard refresh page (Ctrl+F5)
- Check that Tailwind CSS CDN is loading

---

## File Changes Summary

### Created/Modified Files
- ✅ **sermon.html** - Complete rewrite with Spotify-like interface
- ✅ **admin.html** - Added upload forms and tab navigation

### New Features
- ✅ Modern dark theme
- ✅ Full playlist management
- ✅ Shuffle and repeat controls
- ✅ Progress tracking and seeking
- ✅ Easy sermon upload for admins
- ✅ Mobile responsive design

---

## Next Steps

1. **Ensure MongoDB Connection**
   - Start your MongoDB server
   - Verify `MONGO_URI` in `.env`

2. **Start the Server**
   ```bash
   npm install  # If needed
   npm start    # Start server.js
   ```

3. **Upload Your First Sermon**
   - Go to admin.html
   - Upload a sermon file
   - Visit sermon.html to see it in the playlist

4. **Share the Link**
   - Members can visit `sermon.html` anytime
   - No login required to listen
   - Works on all devices!

---

## Support Notes

- All uploaded sermons are stored in MongoDB
- Audio files are stored as binary data in the database
- Playlist updates in real-time when new sermons are uploaded
- Works offline once audio is cached by browser

Enjoy your new sermon playlist! 🎵⛪