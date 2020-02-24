// NPM MODULES IMPORT
var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require('mongoose'),
    mongoDB = 'mongodb://localhost/yelp_camp';

// SEED DATABASE
var seedDB = require("./seeds");

// DATA MODELS IMPORT
var Camp = require("./models/campground");
var Comment = require("./models/comment");

// APP TEMPLATE SETUP
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/assets"));
mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
// seedDB(); // Excecutes the seeds.js file

// APP ROUTING
app.get("/", function (req, res) {
    res.render("home");
});

app.get("/campgrounds", function (req, res) {
    Camp.find({}, (err, response) => {
        err ? console.log("SOMETHING WENT WRONG :(") :
            res.render("campgrounds/index", { campgrounds: response });
    });
});

app.post("/campgrounds", function (req, res) {
    // Obtain values captured from the http call
    var campName = req.body.campName,
        campImage = req.body.campImg,
        campDesc = req.body.campDesc;
    // Store it into the database using mongoose
    Camp.create({
        name: campName,
        image: campImage,
        description: campDesc
    }, (err, response) => {
        if (err) {
            console.log("SOMETHING WENT WRONG :(");
        } else {
            // Redirect back to the /campgrounds route
            res.redirect("/campgrounds");
        }
    });
});

app.get("/campgrounds/new", function (req, res) {
    res.render("campgrounds/new");
});

app.get("/campgrounds/:id", (req, res) => {
    // By populating the comments we are able to convert the comment ID into the full object and its content
    Camp.findById(req.params.id).populate("comments").exec((err, foundCamp) => {
        if (err) {
            console.log("SOMETHING WENT WRONG :(");
        } else {
            res.render("campgrounds/show", { camp: foundCamp });
        }
    });
});

// COMMENTS ROUTES
app.get("/campgrounds/:id/comments/new", (req, res) => {
    Camp.findById(req.params.id, (err, foundCamp) => {
        res.render("comments/new", { camp: foundCamp });
    });
});

app.post("/campgrounds/:id/comments", (req, res) => {
    Comment.create(req.body.comment, (err, comment) => {
        if (err) {
            console.log("SOMETHING WENT WRONG :(");
        } else {
            Camp.findById(req.params.id, (err, foundCamp) => {
                if (err) {
                    console.log("SOMETHING WENT WRONG :(");
                } else {
                    foundCamp.comments.push(comment);
                    foundCamp.save();
                    res.redirect("/campgrounds/" + foundCamp._id);
                }
            });
        }
    })
});

app.listen(3000, function (req, res) {
    console.log("The YelpCamp Server has started at port 3000.");
});