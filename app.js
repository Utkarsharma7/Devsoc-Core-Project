// Load environment variables
require('dotenv').config();

// Debug: Log environment variables on startup
console.log('Environment check:', {
    ADMIN_USERNAME: process.env.ADMIN_USERNAME || 'Cristiano (fallback)',
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'Ronaldo (fallback)',
    JWT_SECRET: process.env.JWT_SECRET || 'Utkarsh_12345 (fallback)',
    MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Using fallback'
});

//This is the entry point for the server.The backend server is being hosted from here
const express=require('express')
const jwt=require('jsonwebtoken')
const mongoose=require('mongoose')
const bcrypt=require('bcrypt')
const app=express()
const secret_key=process.env.JWT_SECRET || "Utkarsh_12345"
const cookieParser = require('cookie-parser');
const path=require('path')
//Middlewares
app.use(cookieParser());
app.use(express.static('./public'))
app.use(express.json())

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://utkarsh22sharma1:KBKpSyF5hfjAA1I9@cluster.qngupsq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster',{
    useNewUrlParser: true,
    useUnifiedTopology: true
 })

// Schemas
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: String
});

const jobSchema = new mongoose.Schema({
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    budget: { type: Number, required: true },
    deadline: { type: Date, required: true },
    skills: [String],
    status: { type: String, default: 'active', enum: ['active', 'pending', 'completed', 'cancelled'] },
    applications: { type: Number, default: 0 },
    postedDate: { type: Date, default: Date.now }
});

const applicationSchema = new mongoose.Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    coverLetter: { type: String, required: true },
    proposedBudget: { type: Number, required: true },
    estimatedTime: { type: String, required: true },
    status: { type: String, default: 'pending', enum: ['pending', 'accepted', 'rejected'] },
    appliedDate: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Job = mongoose.model('Job', jobSchema);
const Application = mongoose.model('Application', applicationSchema);

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;
    
    if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }
    
    try {
        const decoded = jwt.verify(token, secret_key);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ success: false, message: 'Invalid token' });
    }
};

// Dashboard routes
app.get('/app/dashboard/client', (req, res) => {
    const token = req.cookies.token;

    if (!token) return res.status(401).send('Unauthorized');

    try {
        const decoded = jwt.verify(token, secret_key);

        if (decoded.role !== 'client') {
            return res.status(403).send('Forbidden');
        }

        res.sendFile(path.join(__dirname, '/public/dashboard-client.html'));

    } catch (err) {
        res.status(403).send('Invalid token');
    }
});

app.get('/app/dashboard/freelancer',(req,res)=>
{
    const token = req.cookies.token;

    if (!token) return res.status(401).send('Unauthorized');

    try {
        const decoded = jwt.verify(token, secret_key);

        if (decoded.role !== 'freelancer') {
            return res.status(403).send('Forbidden');
        }

        res.sendFile(path.join(__dirname, '/public/dashboard-freelancer.html'));

    } catch (err) {
        res.status(403).send('Invalid token');
    }
})

// Job API endpoints
app.post('/app/jobs', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'client') {
            return res.status(403).json({ success: false, message: 'Only clients can post jobs' });
        }

        const { title, category, description, budget, deadline, skills } = req.body;
        
        const newJob = new Job({
            clientId: req.user.id,
            title,
            category,
            description,
            budget: Number(budget),
            deadline: new Date(deadline),
            skills: skills.split(',').map(s => s.trim()).filter(s => s)
        });

        await newJob.save();
        
        res.json({ success: true, message: 'Job posted successfully', job: newJob });
    } catch (err) {
        console.error('Error posting job:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.get('/app/jobs/client', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'client') {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        const jobs = await Job.find({ clientId: req.user.id }).sort({ postedDate: -1 });
        res.json({ success: true, jobs });
    } catch (err) {
        console.error('Error fetching jobs:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.get('/app/dashboard/stats', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'client') {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        const activeJobs = await Job.countDocuments({ 
            clientId: req.user.id, 
            status: 'active' 
        });
        
        const totalApplications = await Job.aggregate([
            { $match: { clientId: new mongoose.Types.ObjectId(req.user.id) } },
            { $group: { _id: null, total: { $sum: '$applications' } } }
        ]);

        const totalSpent = await Job.aggregate([
            { $match: { 
                clientId: new mongoose.Types.ObjectId(req.user.id), 
                status: { $in: ['completed', 'in-progress'] } 
            }},
            { $group: { _id: null, total: { $sum: '$budget' } } }
        ]);

        res.json({
            success: true,
            stats: {
                activeJobs,
                totalApplications: totalApplications[0]?.total || 0,
                activeContracts: 0, // Will be implemented when contracts are added
                totalSpent: totalSpent[0]?.total || 0
            }
        });
    } catch (err) {
        console.error('Error fetching stats:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

//LOGIN SETUP
app.post('/app/login',async (req,res)=>
{
const {email,password}=req.body;
try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
        return res.json({ success: false, message: "User not found" });
    }
    // User found, now compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
        const name=user.name;
        const role=user.role;
        const id=user._id;
        //generate token 
      const token=jwt.sign({id:id,name:name,role:role},secret_key)
      //Setting the token in a http only cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: false,       // Set to true if using HTTPS
        sameSite: 'lax',     // Adjust if needed for cross-site requests
        maxAge: 2 * 60 * 60 * 1000 // 2 hours
    });
        res.json({ success: true, message: "Login successful",token:token,role:role });
    } else {
        res.json({ success: false, message: "Invalid password" });
    }
} catch (err) {
    console.error(err);
    res.json({ success: false, message: "Server error" });
}})

//SIGNUP SETUP
app.post('/app/signup', async (req, res) => {
    const { name, email, password, role } = req.body;
    const user = await User.findOne({email});
    if(user)
    {
        //user is already present 
        return res.json({success:false,message:"User is already registered"})
    }
    else
    {
    try {
        const hash_password = await bcrypt.hash(password, 3); 
        const newUser = new User({ name, email, password: hash_password, role });
        await newUser.save();
        console.log("🎉 User saved");
        res.status(201).json({ success: true });
    } catch (err) {
        console.error(err);
        res.json({ success: false,message:"Error on server side" });
    }
}
});

app.get('/app',(req,res)=>
{
    res.sendFile('index.html', { root: './public' })
})

// Debug route to check admin credentials
app.get('/app/debug/admin', (req, res) => {
    res.json({
        expectedUsername: process.env.ADMIN_USERNAME || 'Cristiano',
        expectedPassword: process.env.ADMIN_PASSWORD || 'Ronaldo',
        envLoaded: !!process.env.ADMIN_USERNAME,
        message: 'Use these credentials for admin login'
    });
});

// Freelancer API endpoints
app.get('/app/jobs/all', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'freelancer') {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        const jobs = await Job.find({ status: 'active' })
            .populate('clientId', 'name')
            .sort({ postedDate: -1 });

        res.json({ success: true, jobs });
    } catch (err) {
        console.error('Error fetching jobs:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.post('/app/applications', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'freelancer') {
            return res.status(403).json({ success: false, message: 'Only freelancers can apply for jobs' });
        }

        const { jobId, coverLetter, proposedBudget, estimatedTime } = req.body;

        // Check if job exists and is active
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        if (job.status !== 'active') {
            return res.status(400).json({ success: false, message: 'Job is not available for applications' });
        }

        // Check if freelancer already applied
        const existingApplication = await Application.findOne({
            jobId: jobId,
            freelancerId: req.user.id
        });

        if (existingApplication) {
            return res.status(400).json({ success: false, message: 'You have already applied for this job' });
        }

        const newApplication = new Application({
            jobId: jobId,
            freelancerId: req.user.id,
            coverLetter,
            proposedBudget: Number(proposedBudget),
            estimatedTime
        });

        await newApplication.save();

        // Update job application count
        await Job.findByIdAndUpdate(jobId, { $inc: { applications: 1 } });

        res.json({ success: true, message: 'Application submitted successfully', application: newApplication });
    } catch (err) {
        console.error('Error submitting application:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.get('/app/applications/freelancer', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'freelancer') {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        const applications = await Application.find({ freelancerId: req.user.id })
            .populate({
                path: 'jobId',
                populate: { path: 'clientId', select: 'name' }
            })
            .sort({ appliedDate: -1 });

        res.json({ success: true, applications });
    } catch (err) {
        console.error('Error fetching applications:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.get('/app/freelancer/stats', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'freelancer') {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        const totalApplications = await Application.countDocuments({ freelancerId: req.user.id });
        const pendingApplications = await Application.countDocuments({ 
            freelancerId: req.user.id, 
            status: 'pending' 
        });
        const acceptedApplications = await Application.countDocuments({ 
            freelancerId: req.user.id, 
            status: 'accepted' 
        });

        // Calculate total earnings from accepted applications
        const acceptedApps = await Application.find({ 
            freelancerId: req.user.id, 
            status: 'accepted' 
        });
        const totalEarnings = acceptedApps.reduce((sum, app) => sum + app.proposedBudget, 0);

        res.json({
            success: true,
            stats: {
                totalApplications,
                pendingApplications,
                activeProjects: acceptedApplications, // For now, accepted applications = active projects
                totalEarnings
            }
        });
    } catch (err) {
        console.error('Error fetching freelancer stats:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get user information
app.get('/app/user/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, user });
    } catch (err) {
        console.error('Error fetching user profile:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Admin authentication middleware
const authenticateAdmin = (req, res, next) => {
    const { username, password } = req.body;
    
    // Use fallback values if environment variables are not set
    const expectedUsername = process.env.ADMIN_USERNAME || 'Cristiano';
    const expectedPassword = process.env.ADMIN_PASSWORD || 'Ronaldo';
    
    if (username === expectedUsername && password === expectedPassword) {
        req.isAdmin = true;
        next();
    } else {
        res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }
};

// Admin API endpoints
app.post('/app/admin/login', async (req, res) => {
    const { username, password } = req.body;
    
    // Debug: Log what we're comparing
    console.log('Login attempt:', { 
        providedUsername: username, 
        providedPassword: password,
        expectedUsername: process.env.ADMIN_USERNAME || 'Cristiano',
        expectedPassword: process.env.ADMIN_PASSWORD || 'Ronaldo',
        envLoaded: !!process.env.ADMIN_USERNAME
    });
    
    // Use fallback values if environment variables are not set
    const expectedUsername = process.env.ADMIN_USERNAME || 'Cristiano';
    const expectedPassword = process.env.ADMIN_PASSWORD || 'Ronaldo';
    
    if (username === expectedUsername && password === expectedPassword) {
        const adminToken = jwt.sign({ 
            username: expectedUsername, 
            role: 'admin' 
        }, secret_key, { expiresIn: '24h' });
        
        res.cookie('adminToken', adminToken, {
            httpOnly: true,
            secure: process.env.COOKIE_SECURE === 'true',
            sameSite: process.env.COOKIE_SAMESITE || 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });
        
        res.json({ success: true, message: 'Admin login successful' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }
});

// Verify admin token middleware
const verifyAdminToken = (req, res, next) => {
    const token = req.cookies.adminToken;
    
    if (!token) {
        return res.status(401).json({ success: false, message: 'No admin token provided' });
    }
    
    try {
        const decoded = jwt.verify(token, secret_key);
        if (decoded.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Admin access required' });
        }
        req.admin = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ success: false, message: 'Invalid admin token' });
    }
};

// Admin dashboard route
app.get('/app/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/admin-dashboard.html'));
});

// Admin API endpoints
app.get('/app/admin/stats', verifyAdminToken, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalJobs = await Job.countDocuments();
        const totalApplications = await Application.countDocuments();
        const activeJobs = await Job.countDocuments({ status: 'active' });
        const pendingApplications = await Application.countDocuments({ status: 'pending' });
        
        // Get recent users
        const recentUsers = await User.find().sort({ _id: -1 }).limit(5);
        
        // Get recent jobs
        const recentJobs = await Job.find().populate('clientId', 'name').sort({ postedDate: -1 }).limit(5);
        
        res.json({
            success: true,
            stats: {
                totalUsers,
                totalJobs,
                totalApplications,
                activeJobs,
                pendingApplications
            },
            recentUsers,
            recentJobs
        });
    } catch (err) {
        console.error('Error fetching admin stats:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.get('/app/admin/users', verifyAdminToken, async (req, res) => {
    try {
        const users = await User.find().sort({ _id: -1 });
        res.json({ success: true, users });
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.get('/app/admin/jobs', verifyAdminToken, async (req, res) => {
    try {
        const jobs = await Job.find().populate('clientId', 'name').sort({ postedDate: -1 });
        res.json({ success: true, jobs });
    } catch (err) {
        console.error('Error fetching jobs:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.get('/app/admin/applications', verifyAdminToken, async (req, res) => {
    try {
        const applications = await Application.find()
            .populate('jobId', 'title')
            .populate('freelancerId', 'name')
            .sort({ appliedDate: -1 });
        res.json({ success: true, applications });
    } catch (err) {
        console.error('Error fetching applications:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.delete('/app/admin/users/:userId', verifyAdminToken, async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Delete user and all related data
        await User.findByIdAndDelete(userId);
        await Job.deleteMany({ clientId: userId });
        await Application.deleteMany({ freelancerId: userId });
        
        res.json({ success: true, message: 'User deleted successfully' });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.delete('/app/admin/jobs/:jobId', verifyAdminToken, async (req, res) => {
    try {
        const { jobId } = req.params;
        
        // Delete job and all related applications
        await Job.findByIdAndDelete(jobId);
        await Application.deleteMany({ jobId: jobId });
        
        res.json({ success: true, message: 'Job deleted successfully' });
    } catch (err) {
        console.error('Error deleting job:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.patch('/app/admin/users/:userId/status', verifyAdminToken, async (req, res) => {
    try {
        const { userId } = req.params;
        const { status } = req.body; // 'active' or 'suspended'
        
        await User.findByIdAndUpdate(userId, { status });
        res.json({ success: true, message: `User ${status} successfully` });
    } catch (err) {
        console.error('Error updating user status:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.post('/app/admin/logout', verifyAdminToken, (req, res) => {
    res.clearCookie('adminToken');
    res.json({ success: true, message: 'Admin logged out successfully' });
});

// Catch-all middleware for unmatched routes
app.use('/*t', (req, res) => {
    res.status(404).json(`Cannot get the requested resource ${req.url}`);
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})