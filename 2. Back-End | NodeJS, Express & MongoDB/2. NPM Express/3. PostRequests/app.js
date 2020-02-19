var express = require("express");
var bodyParser = require("body-parser");
var app = express();

app.set("view engine", "ejs");

// It creates a JS object with the request values
app.use(bodyParser.urlencoded({ extended: true }));

var rebels = ["Leia", "Luke", "Han", "Lando", "Chewie"];

app.get("/", function (req, res) {
    res.render("home");
});

app.get("/rebels", function (req, res) {
    res.render("rebels", { contacts: rebels });
});

// The POST method is used to add/insert/update information once a form is filled
// or the data has been changed into an HTTP Request
app.post("/addRebel", function (req, res) {
    console.log(req.body);// We can output the data because we use the npm library "body-parser"
    // The value "newFriend" is the name we assign the input from the form in rebels.ejs
    var newContact = req.body.newFriend;
    rebels.push(newContact);
    res.redirect("/rebels");
});

app.listen(3000, function () {
    console.log("Serving app at port 3000");
})