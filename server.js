const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const User = require('./models/User');
const Admin = require('./models/Admin');
const Sermon = require('./models/Sermon');
const Schedule = require('./models/Schedule');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');

dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const PORT = process.env.PORT || 3000;

// ✅ Live sermon flag
let isSermonLive = false;

// ✅ Middleware to restrict admin-only access
// === Middleware to verify admin using PIN ===
function verifyAdmin(req, res, next) {
  const pin = req.headers['x-admin-pin'];
  if (!pin || pin !== process.env.ADMIN_PIN) {
    return res.status(403).json({ message: 'Access denied: admin only' });
  }
  next();
}

// === Multer config ===
const storage = multer.memoryStorage();
const upload = multer({ storage });

// === Middleware ===
// Allow all origins and methods
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-pin'],
  credentials: false
}));

app.use(express.json());

// Add headers to allow cross-origin access to all resources
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-pin');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  res.header('Cross-Origin-Embedder-Policy', 'unsafe-none');
  next();
});

// Serve static files from root directory (HTML files)
app.use(express.static(__dirname));

// Serve public folder if it exists
app.use(express.static('public'));

// Serve church_videos folder for video files
app.use('/church_videos', express.static(path.join(__dirname, 'church_videos')));

// Serve books folder for PDF files
app.use('/books', express.static(path.join(__dirname, 'books')));

// === MongoDB Connection ===
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB error:', err.message));

// === WebSocket for sermon signaling ===
wss.on('connection', ws => {
  ws.on('message', msg => {
    try {
      const data = JSON.parse(msg);
      if (data.type === 'start-sermon') {
        isSermonLive = true;
      } else if (data.type === 'stop-sermon') {
        isSermonLive = false;
      }

      wss.clients.forEach(client => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(msg);
        }
      });
    } catch (err) {
      console.error('Invalid WS message:', err);
    }
  });

  ws.on('close', () => {
    console.log('🔌 WebSocket disconnected');
  });
});

// === Static Admin Panel ===
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// === API to expose current sermon live status ===
app.get('/api/sermons/status', (req, res) => {
  res.json({ isLive: isSermonLive });
});

// === Route groups ===
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);

// === Signup ===
app.post('/api/signup', async (req, res) => {
  const { name, email, password, isFirstTime, source } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already registered.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, isFirstTime, source });
    await newUser.save();

    res.status(201).json({
      message: 'Signup successful',
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        isFirstTime: newUser.isFirstTime,
        source: newUser.source
      }
    });
  } catch (err) {
    console.error('❌ Signup error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// === User Login ===
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    res.status(200).json({
      message: 'Login successful',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isFirstTime: user.isFirstTime,
        source: user.source
      }
    });
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// === Admin Login ===
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    return res.status(200).json({
      message: 'Admin login successful',
      pin: process.env.ADMIN_PIN
    });
  }
  res.status(401).json({ message: 'Invalid admin credentials.' });
});


// === Admin: Get All Users ===
app.get('/api/admin/users', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).lean();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch users.' });
  }
});

// === Admin: Get First-Time Visitors ===
app.get('/api/admin/first-time-visitors', async (req, res) => {
  try {
    const visitors = await User.find({ isFirstTime: true }).sort({ createdAt: -1 }).lean();
    res.json(visitors);
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch first-time visitors.' });
  }
});

// === Admin: Get User Notes ===
app.get('/api/admin/user-notes/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.notes || []);
  } catch (err) {
    console.error('Error fetching notes:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// === Admin: Send New Note ===
app.post('/api/admin/send-note', async (req, res) => {
  const { userId, message } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.notes = user.notes || [];
    user.notes.push({
      message,
      timestamp: new Date(),
      replies: []
    });
    await user.save();

    res.status(200).json({ message: 'Note added' });
  } catch (err) {
    console.error('❌ Add note error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// === Add Reply to a Note ===
app.post('/api/users/:userId/notes/:noteId/reply', async (req, res) => {
  const { userId, noteId } = req.params;
  const { message } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const note = user.notes.id(noteId);
    if (!note) return res.status(404).json({ message: 'Note not found' });

    note.replies.push({ message, timestamp: new Date() });
    await user.save();

    res.status(200).json({ message: 'Reply added', note });
  } catch (err) {
    console.error('❌ Reply error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// === Upload Sermon (Admin Only) ===
app.post('/api/sermons/upload', verifyAdmin, upload.single('sermon'), async (req, res) => {
  try {
    const newSermon = new Sermon({
      title: req.body.title || 'Untitled Sermon',
      audio: {
        data: req.file.buffer,
        contentType: req.file.mimetype
      },
      createdAt: new Date()
    });
    await newSermon.save();
    res.status(200).json({ message: 'Sermon saved' });
  } catch (err) {
    console.error('❌ Sermon upload error:', err);
    res.status(500).json({ message: 'Failed to save sermon' });
  }
});

// === Get All Sermons ===
app.get('/api/sermons', async (req, res) => {
  try {
    const sermons = await Sermon.find().sort({ createdAt: -1 }).lean();
    res.json(sermons);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch sermons' });
  }
});

// === Get Sermon Audio ===
app.get('/api/sermons/:id/audio', async (req, res) => {
  try {
    const sermon = await Sermon.findById(req.params.id);
    if (!sermon) return res.status(404).send("Not found");
    res.set('Content-Type', sermon.audio.contentType);
    res.send(sermon.audio.data);
  } catch (err) {
    res.status(500).send("Audio streaming error");
  }
});

// === Delete Sermon (Admin Only) ===
app.delete('/api/sermons/:id', verifyAdmin, async (req, res) => {
  try {
    const deleted = await Sermon.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.status(200).json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete error" });
  }
});

// === Start Live Sermon (Admin Only) ===
let currentLiveSermonId = null;

app.post('/api/sermons/start-live', verifyAdmin, async (req, res) => {
  try {
    const { title, pdfPath, pdfPage } = req.body;
    const newSermon = new Sermon({
      title: title || 'Live Sermon',
      isLive: true,
      startedAt: new Date(),
      chatMessages: [],
      pdfPath: pdfPath || '',
      currentPdfPage: pdfPage || 1
    });
    await newSermon.save();
    currentLiveSermonId = newSermon._id;
    isSermonLive = true;
    
    // Broadcast to all WebSocket clients
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ 
          type: 'sermon-started', 
          sermonId: newSermon._id,
          title: newSermon.title,
          pdfPath: newSermon.pdfPath,
          pdfPage: newSermon.currentPdfPage
        }));
      }
    });
    
    res.status(200).json({ message: 'Live sermon started', sermon: newSermon });
  } catch (err) {
    console.error('❌ Start sermon error:', err);
    res.status(500).json({ message: 'Failed to start sermon' });
  }
});

// === Stop Live Sermon (Admin Only) ===
app.post('/api/sermons/stop-live', verifyAdmin, upload.single('audio'), async (req, res) => {
  try {
    if (!currentLiveSermonId) {
      return res.status(400).json({ message: 'No live sermon in progress' });
    }
    
    const sermon = await Sermon.findById(currentLiveSermonId);
    if (!sermon) {
      return res.status(404).json({ message: 'Sermon not found' });
    }
    
    sermon.isLive = false;
    sermon.endedAt = new Date();
    
    // Save audio if provided
    if (req.file) {
      sermon.audio = {
        data: req.file.buffer,
        contentType: req.file.mimetype
      };
      
      // Calculate duration (approximate)
      const durationMs = sermon.endedAt - sermon.startedAt;
      sermon.duration = Math.floor(durationMs / 1000);
    }
    
    await sermon.save();
    
    isSermonLive = false;
    currentLiveSermonId = null;
    
    // Broadcast to all WebSocket clients
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: 'sermon-ended' }));
      }
    });
    
    res.status(200).json({ message: 'Sermon ended and saved', sermon });
  } catch (err) {
    console.error('❌ Stop sermon error:', err);
    res.status(500).json({ message: 'Failed to stop sermon' });
  }
});

// === Get Current Live Sermon ===
app.get('/api/sermons/current-live', async (req, res) => {
  try {
    if (!currentLiveSermonId) {
      return res.json({ isLive: false, sermon: null });
    }
    
    const sermon = await Sermon.findById(currentLiveSermonId)
      .select('-audio') // Don't send audio data
      .lean();
    
    res.json({ isLive: true, sermon });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch live sermon' });
  }
});

// === Send Chat Message to Live Sermon ===
app.post('/api/sermons/chat', async (req, res) => {
  try {
    const { sermonId, userId, userName, message } = req.body;
    
    if (!message || !userName) {
      return res.status(400).json({ message: 'Message and userName required' });
    }
    
    const sermon = await Sermon.findById(sermonId);
    if (!sermon) {
      return res.status(404).json({ message: 'Sermon not found' });
    }
    
    const chatMessage = {
      userId: userId || null,
      userName,
      message,
      timestamp: new Date()
    };
    
    sermon.chatMessages.push(chatMessage);
    await sermon.save();
    
    // Broadcast to all WebSocket clients
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ 
          type: 'chat-message', 
          sermonId,
          message: chatMessage 
        }));
      }
    });
    
    res.status(200).json({ message: 'Chat message sent', chatMessage });
  } catch (err) {
    console.error('❌ Chat error:', err);
    res.status(500).json({ message: 'Failed to send message' });
  }
});

// === Get Chat Messages for a Sermon ===
app.get('/api/sermons/:id/chat', async (req, res) => {
  try {
    const sermon = await Sermon.findById(req.params.id)
      .select('chatMessages title')
      .lean();
    
    if (!sermon) {
      return res.status(404).json({ message: 'Sermon not found' });
    }
    
    res.json({ chatMessages: sermon.chatMessages || [], title: sermon.title });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch chat' });
  }
});

// === VIDEO REELS API ===
// Get all videos from church_videos folder
app.get('/api/videos', (req, res) => {
  const videosDir = path.join(__dirname, 'church_videos');
  const thumbnailsDir = path.join(videosDir, 'thumbnails');
  
  // Create directories if they don't exist
  if (!fs.existsSync(videosDir)) {
    fs.mkdirSync(videosDir, { recursive: true });
  }
  if (!fs.existsSync(thumbnailsDir)) {
    fs.mkdirSync(thumbnailsDir, { recursive: true });
  }
  
  const videos = [];
  const allowedExtensions = ['.mp4', '.MP4'];
  
  try {
    const files = fs.readdirSync(videosDir);
    
    files.forEach(file => {
      const filePath = path.join(videosDir, file);
      const ext = path.extname(file);
      
      // Check if it's a video file
      if (fs.statSync(filePath).isFile() && allowedExtensions.includes(ext)) {
        const fileName = path.parse(file).name;
        const thumbnailName = fileName + '.jpg';
        const thumbnailPath = path.join(thumbnailsDir, thumbnailName);
        
        // Get file info
        const stats = fs.statSync(filePath);
        const fileSizeMB = (stats.size / 1048576).toFixed(2);
        
        // Parse title from filename (replace underscores/hyphens with spaces)
        const title = fileName.replace(/[_-]/g, ' ')
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
        
        videos.push({
          id: videos.length + 1,
          title: title,
          description: 'Church video - ' + title,
          filename: file,
          videoUrl: '/church_videos/' + encodeURIComponent(file),
          thumbnail: fs.existsSync(thumbnailPath) 
            ? '/church_videos/thumbnails/' + encodeURIComponent(thumbnailName)
            : 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=400&q=80',
          fileSize: fileSizeMB + ' MB',
          views: Math.floor(Math.random() * 4500) + 500,
          likes: Math.floor(Math.random() * 950) + 50
        });
      }
    });
    
    // Sort videos by filename
    videos.sort((a, b) => a.filename.localeCompare(b.filename));
    
    res.json({
      success: true,
      count: videos.length,
      videos: videos
    });
  } catch (err) {
    console.error('❌ Error reading videos:', err);
    res.status(500).json({
      success: false,
      message: 'Error reading videos folder',
      error: err.message
    });
  }
});

// === SCHEDULE API ===
// Get all schedules
app.get('/api/schedule', async (req, res) => {
  try {
    const schedules = await Schedule.find().sort({ date: 1 });
    res.json(schedules);
  } catch (err) {
    console.error('❌ Error fetching schedules:', err);
    res.status(500).json({ message: 'Failed to fetch schedules' });
  }
});

// Create new schedule
app.post('/api/schedule', verifyAdmin, async (req, res) => {
  try {
    const { title, description, date, time } = req.body;
    
    if (!title || !date || !time) {
      return res.status(400).json({ message: 'Title, date, and time are required' });
    }
    
    const newSchedule = new Schedule({
      title,
      description,
      date,
      time
    });
    
    await newSchedule.save();
    res.status(201).json({ message: 'Schedule created', schedule: newSchedule });
  } catch (err) {
    console.error('❌ Error creating schedule:', err);
    res.status(500).json({ message: 'Failed to create schedule' });
  }
});

// Delete schedule
app.delete('/api/schedule/:id', verifyAdmin, async (req, res) => {
  try {
    const deleted = await Schedule.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    res.json({ message: 'Schedule deleted' });
  } catch (err) {
    console.error('❌ Error deleting schedule:', err);
    res.status(500).json({ message: 'Failed to delete schedule' });
  }
});

// === PDF BOOKS API ===
// Get list of PDF books
app.get('/api/pdf-books', (req, res) => {
  try {
    const booksDir = path.join(__dirname, 'books');
    
    if (!fs.existsSync(booksDir)) {
      fs.mkdirSync(booksDir, { recursive: true });
      return res.json([]);
    }
    
    const files = fs.readdirSync(booksDir);
    const pdfFiles = files.filter(file => path.extname(file).toLowerCase() === '.pdf');
    
    res.json(pdfFiles);
  } catch (err) {
    console.error('❌ Error reading PDF books:', err);
    res.status(500).json({ message: 'Failed to read PDF books' });
  }
});

// Broadcast PDF page change
app.post('/api/sermons/broadcast-pdf', verifyAdmin, async (req, res) => {
  try {
    const { sermonId, pdfPath, pageNumber } = req.body;
    
    if (!sermonId) {
      return res.status(400).json({ message: 'Sermon ID required' });
    }
    
    // Update sermon with current PDF page
    const sermon = await Sermon.findById(sermonId);
    if (sermon) {
      sermon.currentPdfPage = pageNumber;
      await sermon.save();
    }
    
    // Broadcast to all WebSocket clients
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: 'pdf-page-change',
          sermonId,
          pdfPath,
          pageNumber
        }));
      }
    });
    
    res.json({ message: 'PDF page broadcasted' });
  } catch (err) {
    console.error('❌ Error broadcasting PDF:', err);
    res.status(500).json({ message: 'Failed to broadcast PDF' });
  }
});

// === Start Server ===
server.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
  console.log(`📹 Video API available at http://localhost:${PORT}/api/videos`);
});
