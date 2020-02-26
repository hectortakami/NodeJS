var express = require("express");
var router = express.Router();
var Camp = require("../models/campground");

//CAMPGROUNDS ROUTES
router.get("/campgrounds", function (req, res) {
    Camp.find({}, (err, response) => {
        err ? console.log("SOMETHING WENT WRONG :(") :
            res.render("campgrounds/index", { campgrounds: response });
    });
});

router.post("/campgrounds", checkAuthentication, function (req, res) {
    // Obtain values captured from the http call
    var campName = req.body.campName,
        campImage = req.body.campImg,
        campDesc = req.body.campDesc;
    // Store it into the database using mongoose
    Camp.create({
        name: campName,
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
            res.redirect("/campgrounds");
        }
    });
});

router.get("/campgrounds/new", checkAuthentication, function (req, res) {
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