# Freelance Hub
Freelance-MarketPlace Platform<br>
<h3>This project is a full-stack freelance marketplace web app modeled on platforms like Fiverr or Upwork, tailored for students or small businesses. <br>.It enables clients to post job listings, freelancers to bid/apply, and admins to moderate and handle disputes.<br> The application emphasizes secure authentication, role-based access, and seamless interaction between users.</h3>

## Features Implemented

### Client Dashboard
- **Job Posting**: Clients can post new jobs with detailed information
- **Job Management**: View, edit, and delete posted jobs
- **Real-time Statistics**: Dashboard shows active jobs, applications, contracts, and total spent
- **Database Integration**: All job data is stored in MongoDB
- **Authentication**: JWT-based authentication with role-based access

### Freelancer Dashboard
- **Job Browsing**: View all available jobs from the database
- **Job Applications**: Apply for jobs with cover letter, proposed budget, and timeline
- **Application Tracking**: View all submitted applications and their status
- **Real-time Statistics**: Dashboard shows total applications, pending applications, active projects, and earnings
- **Search & Filter**: Filter jobs by category, budget range, and search terms
- **Recent Activity**: View recent application activity

### Job Posting Features
- Job title and category selection
- Detailed job description
- Budget specification
- Deadline setting
- Required skills (comma-separated)
- Automatic status tracking

### Application System
- Cover letter submission
- Proposed budget bidding
- Estimated delivery timeline
- Application status tracking (pending, accepted, rejected)
- Duplicate application prevention

### Database Schema

#### User Schema
```javascript
{
  name: String,
  email: String,
  password: String (hashed),
  role: String ('client' or 'freelancer')
}
```

#### Job Schema
```javascript
{
  clientId: ObjectId (reference to User),
  title: String,
  category: String,
  description: String,
  budget: Number,
  deadline: Date,
  skills: [String],
  status: String ('active', 'pending', 'completed', 'cancelled'),
  applications: Number (default: 0),
  postedDate: Date (default: current date)
}
```

#### Application Schema
```javascript
{
  jobId: ObjectId (reference to Job),
  freelancerId: ObjectId (reference to User),
  coverLetter: String,
  proposedBudget: Number,
  estimatedTime: String,
  status: String ('pending', 'accepted', 'rejected'),
  appliedDate: Date (default: current date)
}
```

## API Endpoints

### Authentication
- `POST /app/login` - User login
- `POST /app/signup` - User registration
- `GET /app/dashboard/client` - Client dashboard (protected)
- `GET /app/dashboard/freelancer` - Freelancer dashboard (protected)

### Client Job Management
- `POST /api/jobs` - Post a new job (client only)
- `GET /api/jobs/client` - Get all jobs for the authenticated client
- `GET /api/dashboard/stats` - Get client dashboard statistics

### Freelancer Job Management
- `GET /api/jobs/all` - Get all active jobs (freelancer only)
- `POST /api/applications` - Submit job application (freelancer only)
- `GET /api/applications/freelancer` - Get freelancer's applications
- `GET /api/freelancer/stats` - Get freelancer dashboard statistics

## Setup Instructions

### 1. **Clone the Repository**
   ```bash
   git clone <your-repository-url>
   cd Devsoc-Core-Project
   ```

### 2. **Install Dependencies**
   ```bash
   npm install
   ```

### 3. **Environment Configuration**
   
   **Create a `.env` file** in the root directory with the following variables:
   
   ```env
   # Server Configuration
   PORT=8000
   NODE_ENV=development
   
   # JWT Secret Key (Replace with your own secret)
   JWT_SECRET=your_jwt_secret_here
   
   # MongoDB Connection String (Replace with your own database)
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name
   
   # Admin Credentials (Replace with your own admin credentials)
   ADMIN_USERNAME=your_admin_username
   ADMIN_PASSWORD=your_admin_password
   
   # Cookie Settings
   COOKIE_SECURE=false
   COOKIE_SAMESITE=lax
   ```

   **Important Notes:**
   - Replace `your_jwt_secret_here` with a strong, random string
   - Replace the MongoDB URI with your own database connection string
   - Set your own admin username and password
   - The `.env` file is automatically ignored by Git for security

### 4. **Database Setup**
   - Create a MongoDB Atlas account (free tier available)
   - Create a new cluster
   - Get your connection string
   - Replace the `MONGODB_URI` in your `.env` file

### 5. **Start the Server**
   ```bash
   npm start
   ```

### 6. **Access the Application**
   - Main app: `http://localhost:8000/app`
   - Client dashboard: `http://localhost:8000/app/dashboard/client` (requires client login)
   - Freelancer dashboard: `http://localhost:8000/app/dashboard/freelancer` (requires freelancer login)
   - Admin dashboard: `http://localhost:8000/app/admin` (use admin credentials from .env)

## Environment Variables Explained

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port number | `8000` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `JWT_SECRET` | Secret key for JWT tokens | `my_super_secret_key_123` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `ADMIN_USERNAME` | Admin login username | `admin` |
| `ADMIN_PASSWORD` | Admin login password | `secure_password` |
| `COOKIE_SECURE` | Enable secure cookies (HTTPS) | `false` (for development) |
| `COOKIE_SAMESITE` | Cookie same-site policy | `lax` |

## Current Status

### ✅ Implemented
- User authentication (login/signup)
- Job posting with database storage
- Job browsing for freelancers
- Job application system
- Application tracking and status management
- Dashboard statistics for both clients and freelancers
- Real-time data updates
- Error handling and notifications
- Search and filter functionality
- Role-based access control

### 🔄 In Progress
- Application acceptance/rejection by clients
- Contract system
- Messaging system
- Payment system

### 📋 Planned
- Job editing and deletion
- File uploads
- Advanced search and filtering
- Rating and review system
- Dispute resolution

## Technical Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcrypt password hashing
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Development**: Nodemon for auto-restart

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- HTTP-only cookies for token storage
- Role-based access control
- Input validation and sanitization
- Duplicate application prevention

## Database Connection

The application connects to MongoDB Atlas using the provided connection string. Make sure to:
- Keep the connection string secure
- Monitor database usage
- Set up proper indexes for performance

## File Structure

```
Devsoc-Core-Project/
├── app.js                 # Main server file with all API endpoints
├── package.json           # Dependencies and scripts
├── public/               # Static files
│   ├── dashboard-client.html    # Client dashboard
│   ├── client-script.js         # Client-side JavaScript
│   ├── client-styles.css        # Client dashboard styles
│   ├── dashboard-freelancer.html # Freelancer dashboard
│   ├── freelancer-scripts.js    # Freelancer-side JavaScript
│   ├── freelancer-styles.css    # Freelancer dashboard styles
│   └── ...                      # Other static files
└── README.md             # This file
```

## Usage Flow

### For Clients:
1. Sign up/login as a client
2. Access client dashboard
3. Post new jobs with details
4. View posted jobs and application counts
5. Monitor dashboard statistics

### For Freelancers:
1. Sign up/login as a freelancer
2. Access freelancer dashboard
3. Browse available jobs
4. Apply for jobs with proposals
5. Track application status
6. Monitor earnings and activity

## Testing the Application

1. **Create Test Users**:
   - Sign up as a client and post some jobs
   - Sign up as a freelancer and apply for jobs

2. **Test Job Posting**:
   - Login as client
   - Post a job with all required fields
   - Verify job appears in freelancer browse jobs

3. **Test Job Application**:
   - Login as freelancer
   - Browse available jobs
   - Apply for a job with cover letter and budget
   - Verify application appears in "My Applications"

4. **Test Dashboard Stats**:
   - Verify stats update after posting jobs/applications
   - Check that initial values are 0 for new users
