# 🎬 Church Reels - Automatic Video Folder System

## 📁 **How It Works**

The reels page now **automatically reads videos** from a local folder! Just drop your MP4 files in the `church_videos` folder and they'll appear instantly.

---

## 🚀 **Quick Start Guide**

### **Step 1: Add Your Videos**
1. Navigate to: `d:\desktop\church\church_videos\`
2. Copy your MP4 video files into this folder
3. Name your files descriptively (e.g., `Sunday_Worship_Service.mp4`, `Pastor_Message.mp4`)
   - Underscores `_` and hyphens `-` will be converted to spaces
   - First letter of each word will be capitalized

### **Step 2: Start the Video Server**
Open a terminal/command prompt and run:

```bash
cd d:\desktop\church
node get_videos.js
```

You should see:
```
✅ Video server running on http://localhost:3001
📁 Videos directory: d:\desktop\church\church_videos
🎬 Place your MP4 files in the church_videos folder
🔄 Videos will be automatically detected!
```

### **Step 3: Open the Reels Page**
1. Open `reels.html` in your browser
2. Videos will automatically load from the folder!

---

## 📂 **Folder Structure**

```
d:\desktop\church\
├── church_videos/              ← Put your MP4 files here
│   ├── Sunday_Worship.mp4
│   ├── Pastor_Message.mp4
│   ├── Youth_Ministry.mp4
│   └── thumbnails/             ← Auto-generated thumbnails
│       ├── Sunday_Worship.jpg
│       ├── Pastor_Message.jpg
│       └── Youth_Ministry.jpg
├── reels.html                  ← Main reels page
├── get_videos.js               ← Video server (Node.js)
├── get_videos.php              ← Alternative server (PHP)
└── REELS_SETUP_GUIDE.md        ← This file
```

---

## 🎯 **Features**

### ✅ **Automatic Detection**
- Drop MP4 files in `church_videos` folder
- Server automatically detects and lists them
- No manual configuration needed!

### ✅ **Auto-Generated Thumbnails**
- Thumbnails are automatically created from video first frame
- Stored in `church_videos/thumbnails/`
- Fallback to placeholder if generation fails

### ✅ **Smart File Naming**
- Filename: `Sunday_Worship_Service.mp4`
- Displayed as: "Sunday Worship Service"
- Automatic capitalization and formatting

### ✅ **Video Metadata**
- File size automatically calculated
- Random views/likes for demo purposes
- Sorted alphabetically by filename

---

## 🔧 **Two Server Options**

### **Option 1: Node.js Server (Recommended)**

**Requirements:** Node.js installed

**Start:**
```bash
node get_videos.js
```

**Stop:** Press `Ctrl+C`

**Port:** 3001

---

### **Option 2: PHP Server**

**Requirements:** PHP installed

**Start:**
```bash
php -S localhost:3001
```

**Access:** `http://localhost:3001/get_videos.php`

**Update reels.html:** Change line 655 to:
```javascript
const VIDEO_API = 'http://localhost:3001/get_videos.php';
```

---

## 📝 **Video File Naming Tips**

### ✅ **Good Names:**
- `Sunday_Worship_Service.mp4` → "Sunday Worship Service"
- `Pastor-John-Message.mp4` → "Pastor John Message"
- `Youth_Ministry_2024.mp4` → "Youth Ministry 2024"
- `Easter_Celebration.mp4` → "Easter Celebration"

### ❌ **Avoid:**
- `video1.mp4` → "Video1" (not descriptive)
- `VID_20240101.mp4` → "Vid 20240101" (unclear)
- Special characters: `@`, `#`, `%`, etc.

---

## 🎨 **Customization**

### **Change Video Descriptions**
Edit `get_videos.js` line 35:
```javascript
description: `Church video - ${title}`,  // Change this
```

To something like:
```javascript
description: `Watch our latest ${title}`,
```

### **Change Thumbnail Generation**
Thumbnails are auto-generated from the 2-second mark of each video.

To change the timestamp, edit `get_videos.php` line 68:
```php
-ss 00:00:02  // Change to 00:00:05 for 5 seconds
```

### **Add Custom Metadata**
Create a `video_info.json` file in `church_videos` folder:
```json
{
  "Sunday_Worship_Service.mp4": {
    "title": "Sunday Morning Worship",
    "description": "Join us for powerful worship and praise",
    "category": "Worship"
  }
}
```

---

## 🐛 **Troubleshooting**

### **Problem: "Video Server Not Running"**

**Solution:**
1. Make sure Node.js is installed: `node --version`
2. Navigate to church folder: `cd d:\desktop\church`
3. Start server: `node get_videos.js`
4. Refresh the reels page

---

### **Problem: "No Videos Found"**

**Solution:**
1. Check if videos are in the correct folder: `d:\desktop\church\church_videos\`
2. Make sure files are `.mp4` format
3. Restart the video server
4. Check server console for errors

---

### **Problem: Thumbnails Not Showing**

**Solution:**
1. Thumbnails are auto-generated on first load
2. Check `church_videos/thumbnails/` folder
3. If using PHP, install FFmpeg for thumbnail generation
4. Fallback: Manually add `.jpg` files with same name as videos

---

### **Problem: CORS Error**

**Solution:**
The server already has CORS enabled. If you still get errors:
1. Make sure you're accessing via `http://` not `file://`
2. Use a local server (Live Server extension in VS Code)
3. Check browser console for specific error

---

## 🎥 **Adding Videos - Complete Workflow**

### **Example: Adding a New Sermon**

1. **Record/Export Video**
   - Export as MP4 format
   - Recommended: 1080p, H.264 codec

2. **Name the File**
   - `Pastor_David_Sermon_Faith.mp4`

3. **Copy to Folder**
   - Place in: `d:\desktop\church\church_videos\`

4. **Refresh Page**
   - The video appears automatically!
   - Thumbnail is auto-generated
   - Title: "Pastor David Sermon Faith"

5. **Done!** 🎉

---

## 📊 **Video Statistics**

The system automatically tracks:
- ✅ File size (in MB)
- ✅ Video count
- ✅ Views (random for demo)
- ✅ Likes (random for demo)

To add real statistics, integrate with a database and update the server code.

---

## 🔐 **Security Notes**

### **For Production Use:**

1. **Add Authentication**
   - Protect video upload/access
   - Use JWT tokens or session management

2. **Validate File Types**
   - Only allow MP4 files
   - Check file size limits
   - Scan for malware

3. **Use HTTPS**
   - Encrypt video streaming
   - Secure API endpoints

4. **Rate Limiting**
   - Prevent abuse
   - Limit API requests

---

## 🚀 **Advanced Features (Future)**

### **Coming Soon:**
- [ ] Video upload interface
- [ ] Edit video metadata (title, description)
- [ ] Delete videos from interface
- [ ] Video categories/tags
- [ ] Search and filter
- [ ] Real view/like tracking
- [ ] Comments system
- [ ] Video analytics dashboard

---

## 📞 **Support**

### **Need Help?**
1. Check the troubleshooting section above
2. Review server console for error messages
3. Check browser console (F12) for JavaScript errors
4. Verify folder permissions

---

## ✨ **Summary**

### **What You Get:**
✅ Automatic video detection  
✅ Auto-generated thumbnails  
✅ Smart file naming  
✅ Instagram/TikTok-style player  
✅ Mobile responsive  
✅ Like and share features  
✅ Swipe navigation  
✅ No manual configuration  

### **What You Do:**
1. Drop MP4 files in `church_videos` folder
2. Run `node get_videos.js`
3. Open `reels.html`
4. Enjoy! 🎉

---

**Made with ❤️ for God's Church Chieko**