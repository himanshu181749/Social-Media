const express = require('express');
const app = express();
const mongoose=require("mongoose")

const path = require('path');
const userModel = require('./models/user');
const PostModel = require('./models/post');

// ---------------------------------------------------------------------------------
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const cookieParser = require('cookie-parser')
app.use(cookieParser())

// --------------------------------------------------------------------------------------------------------------------------------
mongoose.connect('mongodb://127.0.0.1:27017/miniproject');

// basic boiler plate --------------------------------------------------------------------------------
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// boiler plate ends----------------------------------------------------------------------------------------------

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
});

app.get("/login", function(req, res){
  // res.send("logged In");
  res.render("login");
})

app.get("/register", function(req, res){
  // res.send("logged In");
  res.render("register");
})

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
})

//creating the new user ------------------------------------------------------------------------------------------------
app.post("/create", async function(req, res) {
  res.cookie("token", "");
  const { username, email, age, password } = req.body;
  let user = await userModel.findOne({ username: username });

  if (user) {
      // If user already exists, redirect to login page
      return res.render("/login");
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
        return res.redirect("/profile");
      }
      else {
        // If passwords do not match, redirect to login page
        return res.render("login");
      }
    });
  }
})

app.post("/create-post", async function (req, res) {
  let { title, content } = req.body;

  // Decode the token to get the username
  const token = req.cookies.token;
  const decoded = jwt.verify(token, "PRANJALI");

  const post = await PostModel.create({ title, content, username: decoded.username });
  const user = await userModel.findOne({ username: decoded.username });

  user.posts.push(post._id);
  await user.save();

  // Redirect to the profile page or handle the response
  res.redirect("/profile");
});







app.listen(3000);
