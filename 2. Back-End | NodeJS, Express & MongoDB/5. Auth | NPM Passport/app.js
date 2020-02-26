// NPM MODULES IMPORT
var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require('mongoose'),
    mongoDB = 'mongodb://localhost/auth_passport',
    expressSession = require("express-session"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose");


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
// AUTHENTICATION SETUP\
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


app.get("/", (req, res) => {
    res.redirect("/register");
});

// SECRET ROUTE only accesed by login or register
// We use the middleware "checkAuthentication" that we built
// to authenticate the user and authorize the access to this route
app.get("/secret/:id", checkAuthentication, (req, res) => {
    User.findById(req.params.id, (err, user) => {
        res.render("secret", { user: user });
    });
});

// REGISTER ROUTE
app.get("/register", (req, res) => {
    res.render("home");
});

app.post("/register", (req, res) => {
    // We receive the data as plain text
    // then the function .register added to the user schema with the passport-mongoose plugin
    // hashes for us the password 
    User.register(new User({
        username: req.body.username,
        image: req.body.userImage
    }),
        req.body.password,
        function (err, hashedUser) {
            if (err) {
                console.log(err);
                return res.render('home');
            }
            passport.authenticate("local")(req, res, function () {
                res.redirect(`/secret/${hashedUser._id}`);
            });
        });
});

// LOGIN ROUTE
app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login",
    // We use the authenticate method and the "local" strategy
    // to retreive from passport a response to access user's data
    passport.authenticate("local", { failureRedirect: "/" }),
    (req, res) => {
        User.findOne({ username: req.body.username }, (err, user) => {
            err ? console.log("Something went wrong! :(") :
                res.redirect("/secret/" + user._id);
        });
    });

// LOGOUT ROUTE
app.get("/logout", (req, res) => {
    // We end the user's sessions and then redirect them
    // to the login page
    req.logOut();
    res.redirect("/login");
});

// MIDDLEWARE
// This help us to verify if the user is authenticated 
// so they can only access the secret resource by loggin in
function checkAuthentication(req, res, next) {
    //req.isAuthenticated() will return true if user is logged in
    console.log(req.isAuthenticated());
    if (req.isAuthenticated()) {
        return next();
    }
    console.log("User without identification.");
    res.redirect("/login");
}

app.listen(3000, () => {
    console.log("The Passport Auth Server has started at port 3000.");
});