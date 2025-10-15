# Quick Start Guide - Testing the Redesign

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- MongoDB running (for user authentication)
- All dependencies installed

### Step 1: Start the Server
```bash
cd d:\desktop\church
node server.js
```

You should see:
```
✅ Server running on http://localhost:3000
✅ MongoDB connected
✅ WebSocket server ready
```

---

## 🧪 Testing Scenarios

### Scenario 1: Test Dashboard (Not Logged In)

1. **Open browser** and navigate to:
   ```
   http://localhost:3000/dashboard.html
   ```
   OR open the file directly:
   ```
   d:\desktop\church\dashboard.html
   ```

2. **Expected behavior:**
   - Shows "Welcome, Guest!"
   - Stats show default values
   - Reels section loads (if server is running)
   - No personal notes section
   - No first-time banner

3. **What to check:**
   - ✅ Vintage design is applied
   - ✅ Stats cards display correctly
   - ✅ Reels grid shows 8 videos
   - ✅ "View All Reels" button works
   - ✅ Logout button is visible
   - ✅ Responsive on mobile

---

### Scenario 2: Test Login Flow

1. **Navigate to login page:**
   ```
   http://localhost:3000/login.html
   ```

2. **Login with test credentials:**
   - Email: `test@example.com`
   - Password: `password123`
   
   (Or create a new account via signup.html)

3. **Expected behavior:**
   - Redirects to dashboard.html
   - Shows "Welcome, [Your Name]!"
   - Personal data loads
   - Reels watched count updates

4. **What to check:**
   - ✅ User name displays correctly
   - ✅ localStorage has 'user' object
   - ✅ Dashboard shows personalized content
   - ✅ Logout works and clears data

---

### Scenario 3: Test Reels (Not Logged In)

1. **Navigate to reels page:**
   ```
   http://localhost:3000/reels.html
   ```

2. **Expected behavior:**
   - Header shows "🔑 Login" button
   - No user name displayed
   - No dashboard button

3. **Try to download a video:**
   - Click on any video to enter watch mode
   - Click the download button (⬇)
   - **Expected:** Login popup appears with 3 buttons:
     - 🔑 Login
     - ✨ Create Account
     - Cancel

4. **What to check:**
   - ✅ Login button visible in header
   - ✅ Download blocked
   - ✅ Popup shows correctly
   - ✅ All 3 buttons work
   - ✅ Login button redirects to login.html
   - ✅ Create Account redirects to signup.html
   - ✅ Cancel closes popup

---

### Scenario 4: Test Reels (Logged In)

1. **First, login:**
   - Go to login.html
   - Login with credentials
   - You'll be redirected to dashboard

2. **Navigate to reels:**
   - Click "View All Reels" from dashboard
   - OR go directly to reels.html

3. **Expected behavior:**
   - Header shows "Welcome, [Name]"
   - Dashboard button (📊) is visible
   - Login button is hidden

4. **Try to download a video:**
   - Click on any video
   - Click download button
   - **Expected:** Download starts immediately (no popup)

5. **What to check:**
   - ✅ User name shows in header
   - ✅ Dashboard button visible
   - ✅ Login button hidden
   - ✅ Download works without popup
   - ✅ Dashboard button links to dashboard.html

---

### Scenario 5: Test Responsive Design

1. **Open dashboard.html**

2. **Resize browser window:**
   - Desktop (> 1024px): 4 column stats, full layout
   - Tablet (640-1024px): 2 column stats, medium layout
   - Mobile (< 640px): 1 column stats, stacked layout

3. **What to check:**
   - ✅ Stats grid adjusts columns
   - ✅ Reels grid adjusts columns
   - ✅ Text sizes change appropriately
   - ✅ Buttons resize
   - ✅ Header text hides on mobile
   - ✅ No horizontal scroll
   - ✅ All content readable

4. **Test on actual mobile device** (optional):
   - Use Chrome DevTools device emulation
   - Or access from phone on same network

---

### Scenario 6: Test Reels Integration

1. **Login and go to dashboard**

2. **Check reels section:**
   - Should show first 8 reels
   - Each reel has thumbnail, title, views
   - Hover effects work
   - Click on reel → goes to reels.html

3. **Check watched count:**
   - Watch some videos in reels.html
   - Return to dashboard
   - "Reels Watched" stat should update

4. **What to check:**
   - ✅ Reels load from API
   - ✅ Thumbnails display
   - ✅ Fallback image works if thumbnail missing
   - ✅ View count shows
   - ✅ Hover effects work
   - ✅ Click navigates to reels.html
   - ✅ Watched count updates

---

## 🔍 Browser Console Testing

### Check localStorage (User Data)

Open browser console (F12) and run:

```javascript
// Check if user is logged in
console.log('User:', localStorage.getItem('user'));

// Check watched videos
console.log('Watched:', localStorage.getItem('watchedVideos'));

// Simulate login (for testing)
localStorage.setItem('user', JSON.stringify({
  name: 'Test User',
  email: 'test@example.com',
  _id: '123456'
}));

// Clear login (simulate logout)
localStorage.removeItem('user');
localStorage.removeItem('userToken');
```

### Check API Response

```javascript
// Test video API
fetch('http://localhost:3000/api/videos')
  .then(res => res.json())
  .then(data => console.log('Videos:', data));

// Test sermon status
fetch('http://localhost:3000/api/sermons/status')
  .then(res => res.json())
  .then(data => console.log('Sermon Status:', data));
```

---

## 🐛 Troubleshooting

### Problem: Reels not loading on dashboard

**Solution:**
1. Check if server is running: `node server.js`
2. Check console for errors (F12)
3. Verify API endpoint: `http://localhost:3000/api/videos`
4. Check if videos exist in `church_videos` folder

### Problem: User name not showing after login

**Solution:**
1. Check localStorage: `localStorage.getItem('user')`
2. Verify login.html saves user data
3. Refresh the page
4. Clear cache and try again

### Problem: Download still blocked after login

**Solution:**
1. Refresh reels.html page
2. Check localStorage has 'user' object
3. Clear localStorage and login again
4. Check browser console for errors

### Problem: Header not updating

**Solution:**
1. Hard refresh: Ctrl + Shift + R (Windows) or Cmd + Shift + R (Mac)
2. Clear browser cache
3. Check if `updateHeaderLoginStatus()` is being called
4. Verify user data in localStorage

### Problem: Responsive design not working

**Solution:**
1. Clear browser cache
2. Check if Tailwind CSS is loading
3. Verify viewport meta tag exists
4. Test in different browser

---

## 📊 Expected Results Summary

### Dashboard (Logged In)
```
✅ User name displays
✅ Stats show correct data
✅ Reels grid loads 8 videos
✅ Hover effects work
✅ Responsive design works
✅ Logout button works
✅ All links functional
```

### Dashboard (Not Logged In)
```
✅ Shows "Guest"
✅ Reels still load
✅ Stats show defaults
✅ No personal notes
✅ Logout still visible
```

### Reels (Logged In)
```
✅ Header shows user name
✅ Dashboard button visible
✅ Login button hidden
✅ Download works
✅ No popup on download
```

### Reels (Not Logged In)
```
✅ Login button visible
✅ No user name shown
✅ No dashboard button
✅ Download blocked
✅ Popup shows with 3 buttons
✅ All popup buttons work
```

---

## 🎯 Quick Test Checklist

Print this and check off as you test:

### Dashboard
- [ ] Page loads without errors
- [ ] Vintage design applied
- [ ] User name shows (if logged in)
- [ ] Stats cards display
- [ ] Reels section loads
- [ ] 8 reels display in grid
- [ ] Thumbnails load
- [ ] View All Reels button works
- [ ] Hover effects work
- [ ] Logout button works
- [ ] Responsive on mobile
- [ ] Responsive on tablet
- [ ] Footer displays

### Reels Header
- [ ] Sticky header works
- [ ] User name shows (if logged in)
- [ ] Dashboard button shows (if logged in)
- [ ] Login button shows (if not logged in)
- [ ] Buttons work correctly
- [ ] Responsive on mobile

### Login Popup
- [ ] Popup appears on download (not logged in)
- [ ] 3 buttons display
- [ ] Login button redirects
- [ ] Create Account button redirects
- [ ] Cancel button closes popup
- [ ] Popup design matches theme
- [ ] Responsive on mobile

### Download Functionality
- [ ] Blocked when not logged in
- [ ] Works when logged in
- [ ] Popup shows correct message
- [ ] No errors in console

### Integration
- [ ] Login → Dashboard flow works
- [ ] Dashboard → Reels flow works
- [ ] Reels → Login flow works
- [ ] Watched count updates
- [ ] User data persists
- [ ] Logout clears data

---

## 🎉 Success Criteria

All features working = **Everything is great!** ✨

If you can complete all scenarios without errors, the redesign is successful!

---

## 📞 Need Help?

1. Check browser console (F12) for errors
2. Verify server is running
3. Check localStorage data
4. Review REDESIGN_SUMMARY.md for details
5. Check VISUAL_GUIDE.md for layout reference

---

*Happy Testing!*
*God's Church Chieko - Walking in Eternal Truth*