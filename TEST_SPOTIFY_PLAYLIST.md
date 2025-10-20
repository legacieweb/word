# 🎵 Test Checklist - Spotify Playlist Feature

## Prerequisites ✅

Before testing, ensure:
- [ ] MongoDB server is running (`mongod` command)
- [ ] `.env` file is configured with `MONGO_URI` and `ADMIN_PIN=8372`
- [ ] Node.js dependencies installed (`npm install`)
- [ ] Server running (`npm start` or `node server.js`)
- [ ] Server is accessible at `http://localhost:3000`

---

## Test 1: Admin Upload Functionality ✅

### Step 1: Prepare Test Audio
1. [ ] Have an MP3, WAV, or M4A audio file ready (recommend 10-30 seconds for testing)
2. [ ] Rename it to something meaningful (e.g., `test-sermon.mp3`)

### Step 2: Upload via Admin Panel
1. [ ] Open `http://localhost:3000/admin.html` in browser
2. [ ] Navigate to "🎼 Manage Sermons" in sidebar
3. [ ] Click "📤 Upload New" tab
4. [ ] Fill in:
   - [ ] Sermon Title: "Test Sermon 1"
   - [ ] Select audio file
   - [ ] Admin PIN: `8372`
5. [ ] Click "📤 Upload Sermon"
6. [ ] **Expected:** 
   - [ ] Success alert appears
   - [ ] Upload form clears
   - [ ] Switches to "📜 All Sermons" tab
   - [ ] New sermon appears in the list

### Step 3: Verify in Database
1. [ ] Open MongoDB (e.g., MongoDB Compass)
2. [ ] Navigate to your database → Sermons collection
3. [ ] [ ] New document exists with title "Test Sermon 1"
4. [ ] [ ] Audio data is stored in binary format
5. [ ] [ ] `createdAt` timestamp is recent

### Step 4: Upload Additional Test Sermons
1. [ ] Upload 3-5 more test sermons with different names
2. [ ] [ ] All appear in the admin list
3. [ ] [ ] Each has correct title, date, and duration

---

## Test 2: Playlist Page Loading ✅

### Step 1: Access Playlist
1. [ ] Open `http://localhost:3000/sermon.html` in browser
2. [ ] Page loads without errors

### Step 2: Verify UI Elements
1. [ ] **Header** displays correctly:
   - [ ] ⛪ icon and "God's Church Sermon Playlist" title
   - [ ] 📊 Dashboard button
   - [ ] 🏠 Home button

2. [ ] **Now Playing Section** shows:
   - [ ] Large 🎵 album art placeholder
   - [ ] "Select a sermon to start" text
   - [ ] Progress bar (empty)
   - [ ] Time display "0:00 / 0:00"

3. [ ] **Playback Controls** visible:
   - [ ] 🔀 Shuffle button
   - [ ] ⏮ Previous button
   - [ ] ▶️ Play button (green)
   - [ ] ⏭ Next button
   - [ ] 🔁 Repeat button

4. [ ] **Queue Section** shows:
   - [ ] All uploaded sermons in a list
   - [ ] Sermon titles visible
   - [ ] Duration for each sermon

---

## Test 3: Playback Controls ✅

### Step 1: Play First Sermon
1. [ ] Click the ▶️ green play button
2. [ ] **Expected:**
   - [ ] Audio starts playing
   - [ ] Play button changes to ⏸️ pause icon
   - [ ] Progress bar starts moving
   - [ ] Current time updates

### Step 2: Pause/Resume
1. [ ] Click ⏸️ pause button
2. [ ] [ ] Audio pauses
3. [ ] [ ] Button changes back to ▶️
4. [ ] Click ▶️ again
5. [ ] [ ] Audio resumes from same position

### Step 3: Next Sermon
1. [ ] Click ⏭ (next) button
2. [ ] **Expected:**
   - [ ] Loads next sermon in queue
   - [ ] Now playing title updates
   - [ ] Progress bar resets to 0
   - [ ] Audio starts playing automatically (if was playing)

### Step 4: Previous Sermon
1. [ ] Click ⏮ (previous) button
2. [ ] **Expected:**
   - [ ] Goes back to previous sermon
   - [ ] Title and audio change
   - [ ] Continues playing

---

## Test 4: Advanced Controls ✅

### Step 1: Shuffle Mode
1. [ ] Click 🔀 shuffle button
2. [ ] [ ] Button becomes highlighted/active
3. [ ] [ ] Click next several times - order should be random
4. [ ] Click 🔀 again to disable shuffle
5. [ ] [ ] Button returns to normal state
6. [ ] [ ] Next songs go back to original order

### Step 2: Repeat Modes
1. [ ] Click 🔁 repeat once
2. [ ] [ ] Button becomes highlighted
3. [ ] Play a sermon to the end
4. [ ] [ ] Same sermon repeats automatically
5. [ ] Click 🔁 again (cycle to repeat one mode)
6. [ ] [ ] Button shows 🔂 icon
7. [ ] Play to end - same sermon repeats multiple times
8. [ ] Click 🔁 again (disable repeat)
9. [ ] [ ] Button returns to normal
10. [ ] Play to end - moves to next sermon

### Step 3: Volume Control
1. [ ] Find volume slider
2. [ ] [ ] Drag slider left - volume decreases
3. [ ] [ ] Drag slider right - volume increases
4. [ ] [ ] Mute button (🔊) works

### Step 4: Seek in Audio
1. [ ] Click in middle of progress bar
2. [ ] [ ] Audio jumps to that position
3. [ ] [ ] Current time updates
4. [ ] Click near end of progress bar
5. [ ] [ ] Audio plays near the end
6. [ ] Song continues to completion

---

## Test 5: Queue Interaction ✅

### Step 1: Click Different Sermon
1. [ ] Currently playing: Sermon 1
2. [ ] In queue, click on "Sermon 3"
3. [ ] **Expected:**
   - [ ] Sermon 3 title appears in "Now Playing"
   - [ ] Sermon 3 starts playing
   - [ ] Queue shows Sermon 3 highlighted with ♪ icon

### Step 2: Queue Auto-Update
1. [ ] Let a sermon play to completion
2. [ ] **Expected:**
   - [ ] Automatically plays next sermon in queue
   - [ ] Highlight moves to next song

### Step 3: Empty Queue
1. [ ] Play the last sermon
2. [ ] Let it finish (and reach true end)
3. [ ] **Expected:**
   - [ ] Repeats first song OR stops (depending on repeat mode)

---

## Test 6: Mobile Responsiveness ✅

### On Desktop
1. [ ] Open F12 (Developer Tools)
2. [ ] Click device toggle (📱 icon)
3. [ ] [ ] Select iPhone or similar
4. [ ] **Check layout:**
   - [ ] Album art still visible (smaller)
   - [ ] Controls stack vertically
   - [ ] Queue displays in single column
   - [ ] Text remains readable
   - [ ] Buttons clickable without zooming

### On Actual Mobile Device
1. [ ] Open `sermon.html` on phone/tablet
2. [ ] **Verify:**
   - [ ] All buttons clickable
   - [ ] Audio plays correctly
   - [ ] Landscape and portrait modes work
   - [ ] No layout breaks

---

## Test 7: Data Persistence ✅

### Step 1: Refresh Page
1. [ ] Playing Sermon 2 at 1:30 position
2. [ ] Press F5 to refresh
3. [ ] **Expected:**
   - [ ] Page reloads
   - [ ] All sermons still in queue
   - [ ] List refreshes from server

### Step 2: New Browser Tab
1. [ ] Open new tab
2. [ ] Navigate to `sermon.html`
3. [ ] **Expected:**
   - [ ] All sermons load again
   - [ ] Fresh playlist state
   - [ ] No saved position (browser doesn't remember)

---

## Test 8: Admin Delete Functionality ✅

### Step 1: Delete a Sermon
1. [ ] Go to `admin.html` → "🎼 Manage Sermons"
2. [ ] Click 🗑️ Delete on one of the test sermons
3. [ ] Confirm deletion dialog appears
4. [ ] Enter admin PIN `8372`
5. [ ] Confirm deletion
6. [ ] **Expected:**
   - [ ] Success message
   - [ ] Sermon removed from list
   - [ ] Playlist automatically updates

### Step 2: Verify Removal in Playlist
1. [ ] Go back to `sermon.html`
2. [ ] Refresh (F5)
3. [ ] [ ] Deleted sermon no longer appears in queue
4. [ ] [ ] Other sermons still present

---

## Test 9: Error Handling ✅

### Step 1: Network Error
1. [ ] Stop the Node server (Ctrl+C)
2. [ ] Try to upload a sermon in admin
3. [ ] **Expected:**
   - [ ] Error message appears
   - [ ] Something like "Failed to connect"
   - [ ] User knows something is wrong

### Step 2: Invalid PIN
1. [ ] Try to upload with wrong PIN
2. [ ] **Expected:**
   - [ ] Alert: "Invalid admin PIN"
   - [ ] Upload doesn't proceed

### Step 3: Large File
1. [ ] Try uploading very large audio file (>100MB)
2. [ ] **Expected:**
   - [ ] Either uploads or gives timeout error
   - [ ] Page doesn't freeze

### Step 4: Restart Server
1. [ ] Restart Node server
2. [ ] Go to `sermon.html`
3. [ ] [ ] Reconnects and loads all sermons again

---

## Test 10: Browser Compatibility ✅

Test in multiple browsers (if possible):

### Chrome/Edge
- [ ] Playlist loads
- [ ] Audio plays
- [ ] All controls work

### Firefox
- [ ] Playlist loads
- [ ] Audio plays
- [ ] All controls work

### Safari
- [ ] Playlist loads
- [ ] Audio plays
- [ ] All controls work

---

## Performance Tests ✅

### With Multiple Sermons
1. [ ] Upload 10+ sermons
2. [ ] [ ] Queue still loads quickly
3. [ ] [ ] No lag when clicking songs
4. [ ] [ ] Smooth scrolling in queue

### Long Audio File
1. [ ] Upload a 30+ minute sermon
2. [ ] [ ] Seeking works smoothly
3. [ ] [ ] Progress bar accurate
4. [ ] [ ] No audio stuttering

---

## Final Verification ✅

- [ ] Completed all 10 test categories
- [ ] No console errors (F12)
- [ ] All features working as expected
- [ ] Ready to share with users!

---

## Known Limitations / Notes

- Offline mode not currently supported (requires browser cache)
- Audio files stored in MongoDB (consider GridFS for very large files)
- No user accounts/personal playlists yet
- No search functionality (can be added later)
- Hard-coded `localhost:3000` (update for production deployment)

---

## Debugging Tips

If something doesn't work:

1. **Open Console (F12)**
   - Check for error messages
   - Look for CORS errors
   - Verify API URLs

2. **Check Network Tab**
   - See if API calls succeed
   - Look at response codes (200, 404, 500, etc.)
   - Check response content

3. **Verify MongoDB**
   - Use MongoDB Compass
   - Check if sermons collection exists
   - View documents directly

4. **Check Admin PIN**
   - Default is `8372`
   - Must match in both admin.html and uploads
   - Check .env file

5. **Restart Everything**
   - Stop server (Ctrl+C)
   - Stop MongoDB
   - Clear browser cache
   - Start MongoDB
   - Start server
   - Refresh page

---

## Success Criteria ✅

Your Spotify-like sermon playlist is working perfectly when:

✅ Admins can upload sermons easily  
✅ Users see all sermons immediately in playlist  
✅ Audio plays smoothly with all controls working  
✅ Shuffle and repeat modes function correctly  
✅ Queue auto-advances to next sermon  
✅ Mobile devices display correctly  
✅ No errors in browser console  
✅ Delete functionality removes sermons completely  

🎉 **You're done!** Time to share with your church members!