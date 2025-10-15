# 🚀 Quick Start Guide - Test Your System Now!

## ⚡ 5-Minute Test

Your server is already running! Follow these steps to test everything:

---

## 🎯 Test 1: Schedule Management (2 minutes)

### Step 1: Create a Schedule
1. Open: **http://localhost:3000/admin.html**
2. Click **"📅 Schedule"** in the sidebar
3. Click **"➕ Add Event"**
4. Fill in:
   - Title: `Sunday Service`
   - Description: `Join us for worship`
   - Date: Pick next Sunday
   - Time: `10:00`
   - PIN: `8372`
5. Click **"Save Event"**

### Step 2: View on User Pages
1. Open: **http://localhost:3000/dashboard.html**
   - ✅ See the schedule in "Upcoming Events"
2. Open: **http://localhost:3000/sermon.html**
   - ✅ See the same schedule

---

## 📖 Test 2: PDF Broadcasting (3 minutes)

### Step 1: Prepare Sermon (Admin)
1. In **admin.html**, click **"🎙️ Live Sermon"** in sidebar
2. Fill in:
   - Sermon Title: `Test Sermon`
   - PDF Book: Select **"English01[2025].pdf"**
   - Admin PIN: `8372`
3. Click **"🎙️ Prepare Sermon"**
4. ✅ PDF viewer appears
5. ✅ Floating red button (🔴) appears at bottom-right
6. ✅ New tab opens with sermon.html

### Step 2: Navigate PDF
1. In admin.html, click **"Next ▶"** button
2. ✅ PDF goes to page 2
3. Click **"◀ Prev"** button
4. ✅ PDF goes back to page 1

### Step 3: Start Live
1. Click the **floating red button (🔴)**
2. Allow microphone access
3. ✅ Status changes to "🔴 LIVE"
4. ✅ Live controls appear

### Step 4: Join as User
1. In the sermon.html tab, click **"Join Live Sermon"**
2. ✅ PDF viewer appears
3. ✅ Shows same page as admin

### Step 5: Test Synchronization
1. In admin.html, click **"Next ▶"**
2. Switch to sermon.html tab
3. ✅ Page automatically updates to match admin!

### Step 6: Stop Sermon
1. In admin.html, click **"⏹️ Stop Sermon & Save Recording"**
2. ✅ Recording saved
3. ✅ Status returns to "● Offline"

---

## 📱 Test 3: Mobile Responsive (1 minute)

1. In admin.html, resize browser to mobile size (< 768px)
2. ✅ Sidebar hides
3. ✅ Hamburger button (☰) appears
4. Click hamburger button
5. ✅ Sidebar slides in
6. Click outside sidebar
7. ✅ Sidebar closes

---

## ✅ Success Indicators

If you see these, everything is working:

### Schedule System:
- ✅ Events save to database
- ✅ Events appear on dashboard.html
- ✅ Events appear on sermon.html
- ✅ Can delete events with PIN

### PDF Broadcasting:
- ✅ PDF loads in admin panel
- ✅ Floating button appears
- ✅ Can start live sermon
- ✅ PDF appears for users
- ✅ Page changes sync in real-time
- ✅ Recording saves without PDF data

### Design:
- ✅ Vintage beige/brown theme
- ✅ Responsive on mobile
- ✅ Hamburger menu works
- ✅ Smooth animations

---

## 🎯 Key URLs

- **Admin Panel**: http://localhost:3000/admin.html
- **Sermon Page**: http://localhost:3000/sermon.html
- **Dashboard**: http://localhost:3000/dashboard.html

---

## 🔑 Important Info

- **Admin PIN**: `8372`
- **PDF Location**: `D:\desktop\church\books\`
- **Available PDF**: `English01[2025].pdf`
- **Server Port**: `3000`

---

## 🎉 That's It!

Your system is fully functional. All features are working:
- ✅ Redesigned admin panel with vintage theme
- ✅ Responsive design with working hamburger menu
- ✅ Schedule management system
- ✅ PDF broadcasting with real-time sync
- ✅ Floating "Start Live" button
- ✅ Recording system (audio + chat, no PDF)

**Enjoy your new church management system!** 🙏

---

## 🆘 Troubleshooting

**If server is not running:**
```bash
cd D:\desktop\church
node server.js
```

**If port 3000 is in use:**
- Server is already running (that's good!)
- Or kill the process and restart

**If PDF doesn't load:**
- Check that `books/English01[2025].pdf` exists
- Make sure PDF.js CDN is accessible

**If WebSocket doesn't connect:**
- Check browser console for errors
- Make sure server is running
- Try refreshing the page

---

*Ready to test? Start with Test 1! 🚀*