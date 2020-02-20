var express = require("express");
var rp = require("request-promise");
var bodyParser = require('body-parser')
var app = express();

app.use(express.static("assets"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.render("search");
});

app.get("/movies", function (req, res) {
    var searchTerm = req.query.searchQuery;
    rp(`http://www.omdbapi.com/?s=${searchTerm}&apikey=thewdb`)
        .then(function (htmlString) {
            // Process html...
            var data = JSON.parse(htmlString);
            res.render("movies", { searchData: data.Search });
        })
        .catch(function (err) {
            // Crawling failed...
        });
});





app.listen(3000, function (req, res) {
    console.log("Serving at port 3000");
})



