var express = require("express");
var router = express.Router();
var Camp = require("../models/campground"),
    Comment = require("../models/comment"),
    User = require("../models/user");



// COMMENTS ROUTES

router.get("/campgrounds/:id/comments/new", checkAuthentication, (req, res) => {
    Camp.findById(req.params.id, (err, foundCamp) => {
        res.render("comments/new", { camp: foundCamp });
    });
});

router.post("/campgrounds/:id/comments", checkAuthentication, (req, res) => {
    Comment.create(req.body.comment, (err, comment) => {
        if (err) {
            console.log("SOMETHING WENT WRONG :(");
        } else {
            Camp.findById(req.params.id, (err, foundCamp) => {
                if (err) {
                    console.log("SOMETHING WENT WRONG :(");
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.author.image = req.user.image;
                    comment.save();
                    foundCamp.comments.push(comment);
                    foundCamp.save();
                    res.redirect("/campgrounds/" + foundCamp._id);
                }
            });
        }
    })
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