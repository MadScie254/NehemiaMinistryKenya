# 🧪 Testing Guide for Nehemia Ministry Website

## 🚀 Server Status
✅ **Server is running on**: http://localhost:3000
✅ **Mock database**: Active (no MongoDB required)
✅ **Authentication**: Working with test accounts

---

## 👥 Test Accounts

### 🔹 Admin Account
- **Email**: `admin@nehemiaministry.org`
- **Password**: `admin123`
- **Role**: Administrator
- **Access**: Full admin panel + dashboard

### 🔸 Member Account  
- **Email**: `member@test.com`
- **Password**: `member123`
- **Role**: Member
- **Access**: Member dashboard only

---

## 🧪 Testing Steps

### 1. 🏠 **Homepage Testing**
- Visit: http://localhost:3000
- ✅ Check if page loads correctly
- ✅ Verify navigation menu
- ✅ Test authentication buttons (Login/Register)

### 2. 🔐 **Authentication Testing**

#### Login Test:
1. Click "Login" button on homepage
2. Use test credentials:
   - Email: `admin@nehemiaministry.org`
   - Password: `admin123`
3. ✅ Should redirect to dashboard based on role

#### Registration Test:
1. Click "Register" button
2. Fill in new user details
3. ✅ Should create account and login automatically

### 3. 📊 **Admin Dashboard Testing**
- **URL**: http://localhost:3000/admin
- **Access**: Login as admin first
- ✅ **Features to test**:
  - Dashboard statistics display
  - User management interface
  - Prayer request moderation
  - Admin navigation menu
  - Logout functionality

### 4. 👤 **Member Dashboard Testing**
- **URL**: http://localhost:3000/dashboard  
- **Access**: Login as member first
- ✅ **Features to test**:
  - Personal statistics (prayers, events, member days)
  - Tab navigation (Overview, Prayers, Events, Profile)
  - Submit prayer request modal
  - Recent prayers display
  - Upcoming events display
  - Ministry involvement section

### 5. 🙏 **Prayer System Testing**

#### From Dashboard:
1. Go to "My Prayers" tab
2. Click "Submit Prayer Request"
3. Fill out prayer form:
   - Title: "Test Prayer Request"
   - Content: "This is a test prayer"
   - Category: Choose any
   - Priority: Choose any
4. ✅ Should submit successfully and appear in prayers list

#### From API directly:
- Test endpoint: `POST /api/prayers`
- Requires authentication header

### 6. 🔄 **Navigation Testing**
Test all navigation links:
- ✅ About page: http://localhost:3000/about.html
- ✅ Sermons: http://localhost:3000/sermons.html
- ✅ Events: http://localhost:3000/events.html
- ✅ Prayer Wall: http://localhost:3000/prayer-wall.html
- ✅ Contact: http://localhost:3000/contact.html
- ✅ Give: http://localhost:3000/give.html

---

## 🔧 **API Testing**

### Authentication Endpoints:
```bash
# Login
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "admin@nehemiaministry.org",
  "password": "admin123"
}

# Profile (requires token)
GET http://localhost:3000/api/auth/profile
Authorization: Bearer YOUR_TOKEN_HERE
```

### Dashboard Endpoints:
```bash
# Get dashboard stats
GET http://localhost:3000/api/dashboard/stats
Authorization: Bearer YOUR_TOKEN_HERE
```

### Prayer Endpoints:
```bash
# Get public prayers
GET http://localhost:3000/api/prayers

# Get my prayers (requires auth)
GET http://localhost:3000/api/prayers/my-prayers
Authorization: Bearer YOUR_TOKEN_HERE

# Submit prayer (requires auth)
POST http://localhost:3000/api/prayers
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "title": "Test Prayer",
  "content": "Please pray for...",
  "category": "general",
  "priority": "medium",
  "isPublic": true
}
```

---

## 🐛 **Expected Behavior**

### ✅ **What Should Work:**
- ✅ User registration and login
- ✅ Role-based dashboard access
- ✅ Prayer submission and display
- ✅ Navigation between pages
- ✅ Authentication state management
- ✅ Responsive design on different screen sizes

### ⚠️ **Known Limitations (Mock Data):**
- ⚠️ Data doesn't persist after server restart
- ⚠️ Limited to mock users and prayers
- ⚠️ Some advanced features may not be fully functional
- ⚠️ Email notifications not active
- ⚠️ Payment processing not connected

---

## 🔍 **Debugging Tips**

### Browser Console:
- Open Developer Tools (F12)
- Check Console tab for JavaScript errors
- Check Network tab for API request/response

### Server Logs:
- Check terminal where server is running
- Look for error messages or API calls

### Common Issues:
1. **"Token invalid"**: Try logging out and back in
2. **"Page not loading"**: Check if server is still running
3. **"API errors"**: Check network connectivity and endpoints

---

## 📱 **Device Testing**

Test on different devices:
- ✅ **Desktop**: Full functionality
- ✅ **Tablet**: Responsive design
- ✅ **Mobile**: Mobile-optimized interface

---

## 🎯 **Key Features to Focus On**

### Priority 1 (Core Features):
1. ✅ Authentication (login/logout/register)
2. ✅ Dashboard access and navigation
3. ✅ Prayer submission and display
4. ✅ Basic navigation between pages

### Priority 2 (Enhanced Features):
1. ✅ Admin panel functionality
2. ✅ User role management
3. ✅ Prayer categorization and filtering
4. ✅ Responsive design

### Priority 3 (Future Enhancements):
1. 🔮 Real database integration
2. 🔮 Email notifications
3. 🔮 Advanced event management
4. 🔮 Payment processing

---

## 🚀 **Quick Start**

1. **Start Server**: `npm start` (already running)
2. **Open Browser**: http://localhost:3000
3. **Login**: Use admin@nehemiaministry.org / admin123
4. **Test Dashboard**: Navigate to different sections
5. **Test Features**: Submit prayer, check statistics
6. **Test Member**: Login as member@test.com / member123

---

## ✅ **Success Criteria**

The website is working correctly if:
- ✅ Users can register and login
- ✅ Dashboards load based on user role
- ✅ Prayer system works (submit/view)
- ✅ Navigation works across all pages
- ✅ No JavaScript console errors
- ✅ Responsive design works on mobile

---

**🎉 Happy Testing!**

*If you encounter any issues, check the browser console and server terminal for error messages.*
