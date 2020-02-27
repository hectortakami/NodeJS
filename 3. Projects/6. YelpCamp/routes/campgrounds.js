var express = require("express");
var router = express.Router();
var Camp = require("../models/campground"),
    User = require("../models/user"),
    Comment = require("../models/comment");
var middleware = require("../middleware")

//CAMPGROUNDS ROUTES
router.get("/campgrounds", function (req, res) {
    Camp.find({}, (err, response) => {
        err ? console.log("SOMETHING WENT WRONG :(") :
            res.render("campgrounds/index", { campgrounds: response });
    });
});

router.post("/campgrounds", middleware.checkAuthentication, function (req, res) {
    // Obtain values captured from the http call
    var campName = req.body.campName,
        campImage = req.body.campImg,
        campDesc = req.body.campDesc,
        campPrice = req.body.campPrice;
    // Store it into the database using mongoose
    Camp.create({
        name: campName,
        price: campPrice,
        image: campImage,
        description: campDesc,
        createdBy: {
            id: req.user._id,
            username: req.user.username,
        }
    }, (err, response) => {
        if (err) {
            console.log("SOMETHING WENT WRONG :(");
        } else {
            // Redirect back to the /campgrounds route
            req.flash("success", "Campground created successfully :)");
            res.redirect("/campgrounds");
        }
    });
});

router.get("/campgrounds/new", middleware.checkAuthentication, function (req, res) {
    res.render("campgrounds/new");
});

router.get("/campgrounds/:id", (req, res) => {
    // By populating the comments we are able to convert the comment ID into the full object and its content
    Camp.findById(req.params.id).populate("comments").exec((err, foundCamp) => {
        if (err) {
            console.log("SOMETHING WENT WRONG :(");
        } else {
            res.render("campgrounds/show", { camp: foundCamp });
        }
    });
});

router.get("/campgrounds/:id/edit", middleware.checkCampOwnership, (req, res) => {
    // By populating the comments we are able to convert the comment ID into the full object and its content
    Camp.findById(req.params.id, (err, foundCamp) => {
        err ? console.log("SOMETHING WENT WRONG :(") :
            res.render("campgrounds/edit", { camp: foundCamp });
    });
});

router.post("/campgrounds/:id/edit", middleware.checkCampOwnership, (req, res) => {
    Camp.findByIdAndUpdate(req.params.id, req.body.camp, (err, updatedCamp) => {
        if (err) {
            console.log("SOMETHING WENT WRONG :(");
        } else {
            User.findOne({ username: req.body.username }, (err, campAuthor) => {
                if (err) {
                    console.log("SOMETHING WENT WRONG :(");
                } else {
                    updatedCamp.createdBy.id = campAuthor.id;
                    updatedCamp.createdBy.username = campAuthor.username;
                    updatedCamp.save();
                    res.redirect(`/campgrounds/${req.params.id}`);
                }
            })
        }
    });
});

router.post("/campgrounds/:id/delete", middleware.checkCampOwnership, (req, res) => {
    Camp.findByIdAndDelete(req.params.id, (err, deletedCamp) => {
        if (err) {
            console.log("SOMETHING WENT WRONG :(");
        } else {
            deletedCamp.comments.forEach(comment => {
                Comment.findByIdAndDelete(comment._id, (err) => {
                    if (err) {
                        console.log("SOMETHING WENT WRONG :(");
                    }
                });
            });
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;