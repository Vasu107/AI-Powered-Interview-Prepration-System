# Admin Panel - AI-Powered Interview Preparation System

## Overview
The admin panel provides comprehensive management capabilities for the interview preparation platform with MongoDB integration.

## Features

### 🔐 Access Control
- Restricted access to authorized admin emails only
- Secure authentication using NextAuth
- Admin emails configured in `components/AdminProtection.jsx`

### 📊 Dashboard
- Real-time statistics display
- Total users, interviews, and completion rates
- Quick action cards for navigation

### 👥 User Management
- View all registered users
- User details modal with complete information
- Delete users (cascades to remove associated interviews)
- User activity tracking

### 📝 Content Management
- Edit homepage hero section (title & description)
- Manage team member information
- Add/remove team members dynamically
- Real-time content updates

### 📈 Analytics
- Platform usage statistics
- Interview completion rates
- Average performance scores
- User engagement metrics

## Database Integration

### Models Used
- **User**: `app/Models/User.js` - User account information
- **Interview**: `models/Interview.js` - Interview sessions and results
- **Content**: `models/Content.js` - Homepage content management

### Database Connection
- MongoDB connection via `utils/database.js`
- Connection pooling and error handling
- Database: `AskUp_Virtual_Interview`

## API Routes

### Admin Stats
- `GET /api/admin/stats` - Platform statistics

### User Management
- `GET /api/admin/users` - Fetch all users
- `DELETE /api/admin/users/[id]` - Delete specific user

### Content Management
- `GET /api/admin/content` - Fetch homepage content
- `POST /api/admin/content` - Update homepage content

### Analytics
- `GET /api/admin/analytics` - Detailed platform analytics

## Access Instructions

1. **Login**: Use authorized admin email (admin@askup.com)
2. **Navigate**: Go to `/admin` after authentication
3. **Manage**: Use the dashboard to access different management sections

## Admin Email Configuration

Add admin emails in `components/AdminProtection.jsx`:
```javascript
const ADMIN_EMAILS = [
  'admin@askup.com',
  'your-admin@email.com'
];
```

## Environment Variables Required

```env
MONGO_URI=mongodb://localhost:27017/AskUp_Virtual_Interview
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

## Security Features

- Email-based admin verification
- Protected routes with middleware
- Secure database operations
- Input validation and sanitization

## Pages Structure

```
/admin
├── page.jsx          # Main dashboard
├── users/
│   └── page.jsx      # User management
├── content/
│   └── page.jsx      # Content management
├── analytics/
│   └── page.jsx      # Analytics dashboard
└── layout.js         # Admin layout wrapper
```

## Getting Started

1. Ensure MongoDB is running locally
2. Configure admin emails in AdminProtection component
3. Login with authorized admin account
4. Access admin panel at `/admin`

The admin panel is fully functional with MongoDB integration and provides comprehensive management capabilities for the interview preparation platform.