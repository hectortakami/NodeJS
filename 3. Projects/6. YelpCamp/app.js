// NPM MODULES IMPORT
var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require('mongoose'),
    mongoDB = 'mongodb://localhost/yelp_camp',
    expressSession = require("express-session"),
    passport = require("passport"),
    LocalStrategy = require("passport-local");

// ROUTES IMPORT
var indexRoutes = require("./routes/index"),
    campgroundsRoutes = require("./routes/campgrounds"),
    commentsRoutes = require("./routes/comments");

// DATA MODELS IMPORT
var User = require("./models/user");

// APP TEMPLATE SETUP
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/assets"));

mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
app.use(expressSession({
    secret: "MY SECRET SEED TO ENCODE SESSIONS",
    resave: false,
    saveUninitialized: false
}));

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(passport.initialize());
app.use(passport.session());

// This instruction allow us to send to all the templates the 
// same data to work with! In this case is the current user information
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

// We say to the app what routes is the entire app going to use
app.use(indexRoutes);
app.use(campgroundsRoutes);
app.use(commentsRoutes);

//SEED DATABASE
// var seedDB = require("./seeds");
// seedDB(); // Excecutes the seeds.js file

app.listen(3000, function (req, res) {
    console.log("The YelpCamp Server has started at port 3000.");
});