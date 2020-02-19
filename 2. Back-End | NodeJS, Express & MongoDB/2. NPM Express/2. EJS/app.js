var express = require("express");
var app = express();

// Sets "assets" as the reference directory to look for resources
// It eliminates the necessity to write assets/style.css in the template.ejs file
app.use(express.static("assets"));

// Set all the templates with the extension *.ejs
app.set("view engine", "ejs");


app.get("/", function (req, res) {
    res.send("Move to /insert_your_name route");
})

app.get("/:name", function (req, res) {
    // With the app.set("view engine", "ejs") we don't need to use template.ejs
    res.render("template", { user: req.params.name });
})

app.listen(3000, function (req, res) {
    console.log("Serving at port 3000");
})