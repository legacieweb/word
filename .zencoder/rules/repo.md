# Repository Overview: God's Church Chieko Platform

## Purpose
This project powers the **God's Church Chieko** digital experience, delivering sermons, reels, and church resources to members and visitors. It includes a public-facing site, a member dashboard, and administrative tools for managing content and user engagement.

## Tech Stack
- **Frontend**: Static HTML pages styled with Tailwind CSS via CDN, plus custom inline CSS.
- **Backend**: Node.js with Express for REST APIs and WebSocket support.
- **Database**: MongoDB accessed through Mongoose models.
- **Auth & Security**: Bcrypt for password hashing, JSON Web Tokens pending in current code, admin PIN checks, and CORS handling.
- **File Handling**: Multer and MongoDB GridFS-like storage for sermon audio; static serving for videos and books.

## Key Entry Points
- `index.html`: Public landing page with church message and CTAs.
- `dashboard.html`: Member experience, showing live sermons, reels, schedules, and notes.
- `sermon.html`: Live/recorded sermon playback interface.
- `admin.html`: Administrative panel for live sermons, user oversight, and content management.
- `server.js`: Express app with API routes, WebSocket coordination, and sermon upload logic.

## Core API Routes
- `/api/signup`, `/api/login`: User registration and authentication.
- `/api/sermons/...`: Sermon status, upload, live session control, and audio streaming.
- `/api/admin/users`, `/api/admin/first-time-visitors`: Administrative user management endpoints.
- `/api/admin/send-note`: Admin-to-user communication.
- WebSocket events broadcast sermon start/stop notifications.

## Data Models
- `models/User.js`: Stores credentials, first-time status, source information, and admin notes.
- `models/Sermon.js`: Tracks live/recorded sermon metadata, audio data, and chat logs.
- `models/Schedule.js`: Event scheduling information for dashboard display.
- `models/Admin.js`: Admin credentials (usage minimal in current code).

## Frontend Behavior Highlights
- **Dashboard**: Fetches live sermon status, reels, schedules, and personalized banners for first-time visitors via `localStorage` and API calls.
- **Reels Page**: Loads vertical video reels from the `/church_videos` directory with thumbnails.
- **Admin Panel**: Controls live sermons, uploads audio, manages user notes, and interacts with WebSocket updates.

## Outstanding Considerations
- Authentication relies on static admin env variables; consider JWT or session hardening.
- Sermon audio stored in MongoDB documents; large files may require GridFS or external storage.
- Client-side scripts use `http://localhost:3000` hard-coded endpoints; adjust for deployment.
- Ensure `.env` holds `MONGO_URI`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_PIN`, and other secrets.
- File tree contains numerous documentation files summarizing prior changes—review as needed for context.

## Getting Started
1. Install dependencies: `npm install`
2. Configure environment variables in `.env`
3. Launch server: `npm start`
4. Open `index.html`, `dashboard.html`, or `admin.html` in a browser (served statically or via Express).

This summary will help us navigate and modify the project efficiently during our collaboration.