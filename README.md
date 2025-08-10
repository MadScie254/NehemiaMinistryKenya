# Nehemia Ministry Kenya - Official Website

A comprehensive, full-stack ministry management website with authentication, dashboard functionality, and complete content management for Nehemia Ministry Kenya.

## 🌟 Features

### 🔐 Authentication & User Management
- **Secure JWT-based authentication** with role-based access control
- **User registration and login** with email verification
- **Role-based permissions** (Admin, Pastor, Leader, Member)
- **Profile management** with personal information updates
- **Password recovery** and security features

### 📊 Dashboard System
- **Member Dashboard** - Personal prayer requests, event registrations, ministry involvement
- **Admin Dashboard** - Complete ministry management with statistics and oversight
- **Real-time statistics** - User engagement, prayer requests, event participation
- **Activity tracking** - Monitor member engagement and ministry growth

### 🙏 Prayer Wall & Spiritual Features
- **Interactive Prayer Wall** with public/private prayer requests
- **Prayer categories** (Healing, Family, Financial, Spiritual Growth, etc.)
- **Prayer support system** - Members can pray for each other
- **Prayer status tracking** (Active, Answered, Closed)
- **Priority levels** for urgent prayer needs

### 📅 Event Management
- **Complete event system** with registration and attendance tracking
- **Event categories** (Worship Services, Bible Study, Outreach, etc.)
- **Calendar integration** with upcoming events display
- **Event reminders** and notifications
- **Member event history** and participation tracking

### 🎤 Sermons & Content
- **Sermon library** with audio/video support
- **Blog system** for ministry articles and announcements
- **Content categorization** and search functionality
- **Featured content** highlighting important messages
- **Series organization** for sermon collections

### 💰 Donation System
- **Secure donation processing** with multiple payment options
- **Donation tracking** and receipt generation
- **Campaign support** for special ministry projects
- **Financial transparency** with donation reports

### 👥 Leadership & About Pages
- **Leadership profiles** with photos and biographies
- **Ministry history** and statement of faith
- **Team showcase** highlighting ministry workers
- **Contact information** and location details

## 🚀 Technology Stack

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Express Validator** for input validation
- **Helmet** for security headers
- **CORS** for cross-origin requests
- **Rate limiting** for API protection

### Frontend
- **Vanilla JavaScript** with modern ES6+ features
- **Tailwind CSS** for responsive design
- **Font Awesome** for icons
- **Google Fonts** for typography
- **Lottie animations** for engaging visuals
- **Modal systems** for user interactions

### Database Models
- **User Model** - Complete user profiles with roles
- **Prayer Model** - Prayer requests with support tracking
- **Event Model** - Events with registration management
- **Sermon Model** - Sermon library with media support
- **Blog Model** - Content management system
- **Donation Model** - Financial tracking and reporting

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v16.0.0 or higher)
- **npm** (v8.0.0 or higher)
- **MongoDB** (v5.0 or higher)
- **Git** for version control

## ⚡ Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/NehemiaMinistryKenya/website.git
cd website
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
```bash
# Copy the environment template
cp .env.example .env

# Edit the .env file with your configuration
# Update MongoDB URI, JWT secrets, email settings, etc.
```

### 4. Start the Application
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

### 5. Access the Application
- **Main Website**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin
- **Member Dashboard**: http://localhost:3000/dashboard

## 📁 Project Structure

```
nehemia-ministry-kenya/
├── 📄 Main Pages
│   ├── index.html          # Homepage with hero section
│   ├── about.html          # About us and leadership
│   ├── sermons.html        # Sermon library
│   ├── events.html         # Events and calendar
│   ├── blog.html           # Blog and articles
│   ├── prayer-wall.html    # Prayer requests
│   ├── give.html           # Donations and giving
│   ├── contact.html        # Contact information
│   ├── ministries.html     # Ministry departments
│   ├── leadership.html     # Leadership team
│   └── gallery.html        # Photo gallery
│
├── 🎛️ Dashboard Systems
│   ├── admin/
│   │   └── index.html      # Admin panel
│   └── dashboard/
│       └── index.html      # Member dashboard
│
├── 🖥️ Backend Infrastructure
│   ├── backend/
│   │   ├── models/         # Database models
│   │   │   ├── User.js
│   │   │   ├── Prayer.js
│   │   │   ├── Event.js
│   │   │   ├── Sermon.js
│   │   │   ├── Blog.js
│   │   │   └── Donation.js
│   │   ├── routes/         # API routes
│   │   │   ├── auth.js
│   │   │   ├── users.js
│   │   │   ├── prayers.js
│   │   │   ├── events.js
│   │   │   ├── sermons.js
│   │   │   ├── blog.js
│   │   │   ├── donations.js
│   │   │   ├── dashboard.js
│   │   │   └── contact.js
│   │   └── middleware/     # Custom middleware
│   │       └── auth.js
│   └── server.js           # Main server file
│
├── 🎨 Assets & Resources
│   └── assets/
│       ├── js/
│       │   └── auth.js     # Authentication client
│       ├── css/
│       └── images/
│
├── ⚙️ Configuration
│   ├── package.json        # Dependencies and scripts
│   ├── .env.example        # Environment template
│   └── README.md           # This file
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/nehemia-ministry

# JWT Secrets
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-refresh-token-secret

# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# PayPal (for donations)
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-client-secret
```

### Admin Account Setup

The system automatically creates a default admin account:
- **Email**: admin@nehemiaministry.org
- **Password**: ChangeThisPassword123!

**⚠️ Important**: Change the default admin password immediately after first login!

## 👥 User Roles

### 🔹 Member
- Submit prayer requests
- Register for events
- View sermons and blog posts
- Access personal dashboard
- Update profile information

### 🔸 Leader
- All member permissions
- Moderate prayer requests
- Create and manage events
- Post blog articles
- View basic statistics

### 🔸 Pastor
- All leader permissions
- Create and manage sermons
- Advanced event management
- Ministry oversight
- Member guidance

### 🔹 Admin
- All system permissions
- User management
- Complete ministry oversight
- System configuration
- Financial management

## 🛡️ Security Features

- **Password hashing** with bcryptjs
- **JWT token authentication** with refresh tokens
- **Rate limiting** to prevent abuse
- **Input validation** and sanitization
- **CORS protection** for cross-origin requests
- **Helmet.js** for security headers
- **Role-based access control**
- **Session management**

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Prayer Requests
- `GET /api/prayers` - Get public prayers
- `POST /api/prayers` - Submit prayer request
- `POST /api/prayers/:id/pray` - Pray for request
- `GET /api/prayers/my-prayers` - Get user's prayers

### Events
- `GET /api/events` - Get all events
- `POST /api/events/:id/register` - Register for event
- `GET /api/events/my-events` - Get user's events

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/activity` - Get user activity

## 🎨 Design System

### Colors
- **Primary**: Blue tones for trust and spirituality
- **Secondary**: Orange for warmth and community
- **Accent**: Green for growth and hope

### Typography
- **Headings**: Lora (serif) for elegance
- **Body**: Inter (sans-serif) for readability
- **Script**: Dancing Script for spiritual touches

### Components
- **Responsive design** for all devices
- **Accessible navigation** with keyboard support
- **Loading states** and error handling
- **Smooth animations** and transitions

## 🚀 Deployment

### Production Setup

1. **Environment Configuration**
```bash
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
```

2. **Security Checklist**
- [ ] Change default admin password
- [ ] Update JWT secrets
- [ ] Configure email service
- [ ] Set up HTTPS
- [ ] Configure firewall
- [ ] Enable MongoDB authentication

3. **Performance Optimization**
- [ ] Enable gzip compression
- [ ] Set up CDN for static assets
- [ ] Configure caching headers
- [ ] Optimize database indexes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📧 Support

For support and questions:
- **Email**: support@nehemiaministry.org
- **Phone**: +254 XXX XXX XXX
- **Address**: Mukhonje, Kakamega County, Kenya

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Nehemia Ministry Kenya** leadership and community
- **Bishop David Walukhu** and **Reverend Selina Walukhu** for their vision
- All contributors and ministry members
- The open-source community for amazing tools and libraries

---

**Built with ❤️ for the Kingdom of God**

*"For we are God's handiwork, created in Christ Jesus to do good works, which God prepared in advance for us to do." - Ephesians 2:10*
