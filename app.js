//This is the entry point for the server.The backend server is being hosted from here
const express=require('express')
const jwt=require('jsonwebtoken')
const mongoose=require('mongoose')
const bcrypt=require('bcrypt')
const app=express()
const secret_key="Utkarsh_12345"
const cookieParser = require('cookie-parser');
const path=require('path')
//Middlewares
app.use(cookieParser());
app.use(express.static('./public'))
app.use(express.json())

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

//Database connection
mongoose.connect('mongodb+srv://utkarsh22sharma1:KBKpSyF5hfjAA1I9@cluster.qngupsq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster',{
    useNewUrlParser: true,
    useUnifiedTopology: true
 })
 const userSchema = new mongoose.Schema({
    name: String,
    email:String,
    password:String,
    role:String
    
  });

const User = mongoose.model('User', userSchema);

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
    try {
        const hash_password = await bcrypt.hash(password, 3); // 10 is a good saltRounds value
        const newUser = new User({ name, email, password: hash_password, role });
        await newUser.save();
        console.log("🎉 User saved");
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.json({ success: false });
    }
});

app.get('/app',(req,res)=>
{
    res.sendFile('index.html', { root: './public' })
})

app.listen('8000',()=>
{
    console.log('Server is running on port 8000')
})