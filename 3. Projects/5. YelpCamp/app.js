var express = require("express");
var bodyParser = require("body-parser");
var app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

var campgrounds = [
    { name: "Salmon Creek", image: "https://pixabay.com/get/50e9d4474856b108f5d084609620367d1c3ed9e04e507441772e72d3964cc0_340.jpg" },
    { name: "Granite Hill", image: "https://pixabay.com/get/57e8d0424a5bae14f6da8c7dda793f7f1636dfe2564c704c7d2d7add904cc45d_340.jpg" },
    { name: "Mountain Rest", image: "https://pixabay.com/get/52e8d4444255ae14f6da8c7dda793f7f1636dfe2564c704c7d2d7add904cc45d_340.jpg" },
    { name: "Salmon Creek", image: "https://pixabay.com/get/50e9d4474856b108f5d084609620367d1c3ed9e04e507441772e72d3964cc0_340.jpg" },
    { name: "Granite Hill", image: "https://pixabay.com/get/57e8d0424a5bae14f6da8c7dda793f7f1636dfe2564c704c7d2d7add904cc45d_340.jpg" },
    { name: "Mountain Rest", image: "https://pixabay.com/get/52e8d4444255ae14f6da8c7dda793f7f1636dfe2564c704c7d2d7add904cc45d_340.jpg" },
    { name: "Salmon Creek", image: "https://pixabay.com/get/50e9d4474856b108f5d084609620367d1c3ed9e04e507441772e72d3964cc0_340.jpg" },
    { name: "Granite Hill", image: "https://pixabay.com/get/57e8d0424a5bae14f6da8c7dda793f7f1636dfe2564c704c7d2d7add904cc45d_340.jpg" },
    { name: "Mountain Rest", image: "https://pixabay.com/get/52e8d4444255ae14f6da8c7dda793f7f1636dfe2564c704c7d2d7add904cc45d_340.jpg" }
];

app.get("/", function (req, res) {
    res.render("home");
});

app.get("/campgrounds", function (req, res) {
    res.render("campgrounds", { campgrounds: campgrounds });
});

app.post("/campgrounds", function (req, res) {
    // Get data from form and add them to the array
    var newCampground = { name: req.body.campName, image: req.body.campImg };
    campgrounds.push(newCampground);
    // Redirect back to the /campgrounds route
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function (req, res) {
    res.render("new");
});

app.listen(3000, function (req, res) {
    console.log("The YelpCamp Server has started at port 3000.");
});