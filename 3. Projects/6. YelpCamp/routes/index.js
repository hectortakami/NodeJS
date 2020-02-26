var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require("../models/user");


// APP INDEX

router.get("/", function (req, res) {
    res.render("home");
});

// AUTH ROUTES

router.get("/register", (req, res) => {
    res.render("auth/register");
});

router.post("/register", (req, res) => {
    User.register(new User({
        username: req.body.username,
        image: req.body.image
    }),
        req.body.password,
        function (err, hashedUser) {
            if (err) {
                console.log(err);
                return res.render("auth/register");
            }
            passport.authenticate("local")(req, res, function () {
                res.redirect("/campgrounds");
            });
        });
});

router.get("/login", (req, res) => {
    res.render("auth/login");
});

router.post("/login",
    passport.authenticate("local", { failureRedirect: "/register" }),
    (req, res) => {
        User.findOne({ username: req.body.username }, (err, user) => {
            err ? console.log("Something went wrong! :(") :
                res.redirect("/campgrounds");
        });
    });

router.get("/logout", (req, res) => {
    req.logOut();
    res.redirect("/");
});

// AUTHENTICATION MIDDLEWARE
function checkAuthentication(req, res, next) {
    //req.isAuthenticated() will return true if user is logged in
    if (req.isAuthenticated()) {
        return next();
    }
    console.log("User without identification.");
    res.redirect("/login");
}

module.exports = router;