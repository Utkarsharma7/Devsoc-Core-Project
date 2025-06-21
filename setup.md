# Quick Setup Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Clone and Install
```bash
git clone <your-repo-url>
cd Devsoc-Core-Project
npm install
```

### Step 2: Create Environment File
Create a file named `.env` in the project root with this content:

```env
PORT=8000
NODE_ENV=development
JWT_SECRET=my_super_secret_key_123
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/your_database
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
COOKIE_SECURE=false
COOKIE_SAMESITE=lax
```

### Step 3: Set Up Database
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Replace the `MONGODB_URI` in your `.env` file

### Step 4: Run the App
```bash
npm start
```

### Step 5: Access Your App
- **Main App**: http://localhost:8000/app
- **Admin Panel**: http://localhost:8000/app/admin
  - Username: `admin` (or what you set in .env)
  - Password: `admin123` (or what you set in .env)



## 🆘 Common Issues

**"Module not found" errors?**
```bash
npm install
```

**"MongoDB connection failed"?**
- Check your connection string in `.env`
- Make sure your IP is whitelisted in MongoDB Atlas

**"Port already in use"?**
- Change the PORT in your `.env` file
- Or kill the process using port 8000

## 📞 Need Help?

1. Check the main README.md for detailed documentation
2. Ensure all environment variables are set correctly
3. Verify your MongoDB connection string
4. Check the console for error messages 