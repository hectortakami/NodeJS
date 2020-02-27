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
                req.flash("error", "Couldn't register user");
                return res.render("auth/register");
            }
            passport.authenticate("local")(req, res, function () {
                req.flash("success", "Welcome to Yelp Camp! " + hashedUser.username);
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
            if (err) {
                req.flash("error", "Couldn't retrieve user. Error: " + err);
            } else {
                req.flash("success", "Welcome back! " + user.username);
                res.redirect("/campgrounds");
            }
        });
    });

router.get("/logout", (req, res) => {
    req.logOut();
    req.flash("success", "Successfully log you out! See you soon :)")
    res.redirect("/");
});

module.exports = router;