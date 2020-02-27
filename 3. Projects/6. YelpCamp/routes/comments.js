var express = require("express");
var router = express.Router();
var Camp = require("../models/campground"),
    Comment = require("../models/comment");
var middleware = require("../middleware");



// COMMENTS ROUTES

router.get("/campgrounds/:id/comments/new", middleware.checkAuthentication, (req, res) => {
    Camp.findById(req.params.id, (err, foundCamp) => {
        res.render("comments/new", { camp: foundCamp });
    });
});

router.post("/campgrounds/:id/comments", middleware.checkAuthentication, (req, res) => {
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

router.get("/campgrounds/:id/comments/:commentId/edit", middleware.checkCommentOwnership, (req, res) => {
    Camp.findById(req.params.id).populate("comments").exec((err, foundCamp) => {
        foundCamp.comments.forEach(comment => {
            if (comment._id.equals(req.params.commentId)) {
                res.render("comments/edit", { camp: foundCamp, comment: comment });
            }
        });
    });
});

router.post("/campgrounds/:id/comments/:commentId", middleware.checkCommentOwnership, (req, res) => {
    Camp.findById(req.params.id).populate("comments").exec((err, foundCamp) => {
        if (err) {
            res.send("Cant edit the post :(");
        } else {
            foundCamp.comments.forEach(comment => {
                if (comment._id.equals(req.params.commentId)) {
                    comment.text = req.body.comment.text;
                    comment.save();
                    foundCamp.save();
                    res.redirect(`/campgrounds/${req.params.id}`);
                }
            });
        }
    });
});

router.post("/campgrounds/:id/comments/:commentId/delete", middleware.checkCommentOwnership, (req, res) => {
    Camp.findById(req.params.id).populate("comments").exec((err, foundCamp) => {
        if (err) {
            res.send("Couldn't delete the post :(");
        } else {
            foundCamp.comments.forEach((comment, i) => {
                if (comment._id.equals(req.params.commentId)) {
                    foundCamp.comments.splice(i, 1);
                    Comment.findByIdAndDelete(comment._id, (err, deletedComment) => {
                        if (err) {
                            res.send("Couldn't delete the post :(");
                        } else {
                            foundCamp.save();
                            res.redirect(`/campgrounds/${req.params.id}`);
                        }
                    });
                }
            });
        }
    });
});


module.exports = router;