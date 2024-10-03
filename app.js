const express = require('express');
const fs = require('fs');
const app = express();
const mongoose=require("mongoose")

const path = require('path');
const multer = require('multer');

const userModel = require('./models/user');
const PostModel = require('./models/post');
const Story = require('./models/story');

// ---------------------------------------------------------------------------------
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const cookieParser = require('cookie-parser')
app.use(cookieParser())

// --------------------------------------------------------------------------------------------------------------------------------
// mongoose.connect('mongodb://127.0.0.1:27017/miniproject');
// mongoose.connect(mongodb+srv://HimanshuGupta:7992423198@cluster0.ioy3c.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0);



// basic boiler plate --------------------------------------------------------------------------------
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// boiler plate ends----------------------------------------------------------------------------------------------

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });



//middlewares for protected routes ------------------------------------------------------------------------------
function isLoggedIn(req, res, next) {
  if (req.cookies.token) {
    const decoded = jwt.verify(req.cookies.token, "PRANJALI");
    req.user = decoded;
    next();
  } else {
    // res.redirect("/login");
    // res.send("Login karle bhadwe")
    res.render("error")
  }
}


// anything that need to be rendered goes here ----------------------------------------------------------------
app.get('/', function (req, res) {
  // res.send('helloooo');
  res.render("register");
  // res.render("homepage");

});

app.get("/login", function(req, res){
  // res.send("logged In");
  res.render("login");
})

app.get("/home", async function(req, res){
  const {username, password} = req.body;
  let user = await userModel.findOne({ username: username });
  let posts= await PostModel.find().populate("user");

  // res.send("logged In");
  res.render("homepage", {posts: posts});
})

app.get("/register", function(req, res){
  // res.send("logged In");
  res.render("register");
})

// app.get("/userposts", function(req, res){
//   // res.send("logged In");
//   res.render("userposts");
// })

app.get('/users/:username', async (req, res) => {
  const username = req.params.username;
  const posts = await PostModel.find({ username });

  // console.log(username);
  // console.log(posts)
  res.render('userposts', { posts : posts });
});


// getting stories----------------------------------------------------------------------------------------------------------------


// app.get('/stories', isLoggedIn, async (req, res) => {
//   try {
//     const stories = await Story.find().populate('user').sort({ createdAt: -1 });
//     res.render('stories', { stories });
//   } catch (err) {
//     console.error(err);
//     res.redirect('/');
//   }
// });

app.get('/stories', isLoggedIn, async (req, res) => {
  const stories = await Story.find().populate('user').sort({ createdAt: -1 });
    
  // Read the image files from the /public/images directory
  const imagesDir = path.join(__dirname, 'public', 'images');
  const images = fs.readdirSync(imagesDir);
    
    // console.log(images);
    // res.send("okay...yaha v reels BC");
    res.render('stories', {images});
    
});




app.get("/profile", isLoggedIn, async function(req, res) {
  const token = req.cookies.token;
  const decoded = jwt.verify(token, "PRANJALI");

  // Populate the posts with full post details
  const user = await userModel.findOne({ username: decoded.username }).populate('posts');
  // const user = await userModel.findOne({ username: decoded.username });
  // const posts = await PostModel.findOne({ user: decoded.username });

  res.render("profile", { user: user});
});

app.get("/logout", function(req, res) {
  res.clearCookie("token");
  res.redirect("/");
  // res.redirect("/register");
})

//creating the new user ------------------------------------------------------------------------------------------------
app.post("/create", async function(req, res) {
  res.cookie("token", "");
  const { username, email, age, password } = req.body;
  let user = await userModel.findOne({ username: username });

  if (user) {
      // If user already exists, redirect to login page
      // return res.render("login");
      res.send("Username or Email already exists, Take me Home")
  }

  // If user does not exist, create a new user
  bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(password, salt, async function(err, hash) {
          let newUser = new userModel({ username, email, age, password: hash });
          await newUser.save();
          res.cookie("token", jwt.sign({ username, email, age }, "PRANJALI"));
          return res.redirect("/profile");
      });
  });
});


// logging in the existing user ------------------------------------------------------------------------------------------------
app.post("/login", async function(req, res) {
  const {username, password} = req.body;
  let user = await userModel.findOne({ username: username });
  let posts= await PostModel.find().populate("user");
  // let postUser = await PostModel.findOne({ username: username });
  // console.log(posts);

  if(!user) {
    // If user does not exist, redirect to register page
    return res.render("register");
  }
  else{
    // If user exists, compare the hashed password with the entered password
    bcrypt.compare(password, user.password, function(err, result) {
      if(result) {
        // If passwords match, generate a new token and set it in the cookies
        res.cookie("token", jwt.sign({ username, password}, "PRANJALI"));
        // return res.redirect("/profile");
        // return res.redirect("/homepage");
        // console.log(posts[0]);
        res.render("homepage", {posts: posts});
        // res.render("homepage", {postUsers: postUsers});
      }
      else {
        // If passwords do not match, redirect to login page
        return res.render("login");
      }
    });
  }
})

// app.post("/create-post", async function (req, res) {
//   let { title, content } = req.body;

//   // Decode the token to get the username
//   const token = req.cookies.token;
//   const decoded = jwt.verify(token, "PRANJALI");

//   console.log({ title, content, username: decoded.username });

//   const post = await PostModel.create({ title, content, username: decoded.username });
//   const user = await userModel.findOne({ username: decoded.username });

//   user.posts.push(post._id);
//   await user.save();

//   // Redirect to the profile page or handle the response
//   res.redirect("/profile");
// });

// creating posts ----------------------------------------------------------------------------------------------------------------
app.post("/create-post", async function (req, res) {
  let { title, content } = req.body;

  // Decode the token to get the username
  const token = req.cookies.token;
  const decoded = jwt.verify(token, "PRANJALI");

  console.log({ title, content, username: decoded.username });

  // Create the post with the username
  const post = await PostModel.create({ title, content, username: decoded.username });

  // Find the user by username
  const user = await userModel.findOne({ username: decoded.username });

  // Add the post to the user's posts array
  user.posts.push(post._id);
  await user.save();

  // Redirect to the profile page or handle the response
  res.redirect("/profile");
});

//creating stories --------------------------------------------------------------------------------------------------------------------
app.post('/story', isLoggedIn, upload.single('content'), async (req, res) => {
  console.log(req.body, req.file);
  res.send(
    `File uploaded successfully! <a href="/images/${req.file.filename}">View Image</a>`
  );
});



// listening app -----------------------------------------------------------------------------------------------

app.listen(3000);
