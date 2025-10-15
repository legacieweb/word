const fs = require('fs');
const path = require('path');
const http = require('http');

const PORT = 3001;
const VIDEOS_DIR = path.join(__dirname, 'church_videos');
const THUMBNAILS_DIR = path.join(VIDEOS_DIR, 'thumbnails');

// Create directories if they don't exist
if (!fs.existsSync(VIDEOS_DIR)) {
    fs.mkdirSync(VIDEOS_DIR, { recursive: true });
}
if (!fs.existsSync(THUMBNAILS_DIR)) {
    fs.mkdirSync(THUMBNAILS_DIR, { recursive: true });
}

// Function to get all videos
function getVideos() {
    const videos = [];
    const allowedExtensions = ['.mp4', '.MP4'];

    try {
        const files = fs.readdirSync(VIDEOS_DIR);

        files.forEach((file, index) => {
            const filePath = path.join(VIDEOS_DIR, file);
            const ext = path.extname(file);

            // Check if it's a video file
            if (fs.statSync(filePath).isFile() && allowedExtensions.includes(ext)) {
                const fileName = path.parse(file).name;
                const thumbnailName = fileName + '.jpg';
                const thumbnailPath = path.join(THUMBNAILS_DIR, thumbnailName);

                // Get file size
                const stats = fs.statSync(filePath);
                const fileSizeMB = (stats.size / 1048576).toFixed(2);

                // Parse title from filename
                const title = fileName.replace(/[_-]/g, ' ')
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');

                videos.push({
                    id: videos.length + 1,
                    title: title,
                    description: `Church video - ${title}`,
                    filename: file,
                    videoUrl: `church_videos/${file}`,
                    thumbnail: fs.existsSync(thumbnailPath)
                        ? `church_videos/thumbnails/${thumbnailName}`
                        : 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=400&q=80',
                    fileSize: `${fileSizeMB} MB`,
                    views: Math.floor(Math.random() * 4500) + 500,
                    likes: Math.floor(Math.random() * 950) + 50
                });
            }
        });

        // Sort by filename
        videos.sort((a, b) => a.filename.localeCompare(b.filename));

    } catch (error) {
        console.error('Error reading videos directory:', error);
    }

    return videos;
}

// Create HTTP server
const server = http.createServer((req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    if (req.url === '/api/videos' && req.method === 'GET') {
        const videos = getVideos();
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: true,
            count: videos.length,
            videos: videos
        }));
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not found' }));
    }
});

server.listen(PORT, () => {
    console.log(`✅ Video server running on http://localhost:${PORT}`);
    console.log(`📁 Videos directory: ${VIDEOS_DIR}`);
    console.log(`🎬 Place your MP4 files in the church_videos folder`);
    console.log(`🔄 Videos will be automatically detected!`);
});