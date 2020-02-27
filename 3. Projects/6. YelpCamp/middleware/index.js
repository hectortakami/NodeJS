var Camp = require("../models/campground"),
    Comment = require("../models/comment");
var middlewareObject = {};

// AUTHENTICATION MIDDLEWARE
middlewareObject.checkAuthentication = (req, res, next) => {
    //req.isAuthenticated() will return true if user is logged in
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("warning", "You need to be loggued in to do that!");
    res.redirect("/login");
}

middlewareObject.checkCampOwnership = (req, res, next) => {
    if (req.isAuthenticated()) {
        Camp.findById(req.params.id, (err, foundCamp) => {
            if (err) {
                req.flash("error", "Campground not found!");
                res.redirect("back");
            } else {
                if (foundCamp.createdBy.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You dont't have permission do that!");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("warning", "You need to be loggued in to do that!");
        res.redirect("back");
    }
}

middlewareObject.checkCommentOwnership = (req, res, next) => {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.commentId, (err, foundComment) => {
            if (err) {
                req.flash("error", "Campground not found!");
                res.redirect("back");
            } else {
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("warning", "You need to be loggued in to do that!");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("warning", "You need to be loggued in to do that!");
        res.redirect("back");
    }
}

module.exports = middlewareObject;