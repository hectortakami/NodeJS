var express = require("express");
var app = express();

// ROUTES
app.get("/", function (request, response) {
    response.send("Hi there!");
});

app.get("/bye", function (request, response) {
    response.send("Goodbye!");
});

// Path Parameters
app.get("/r/:mySubroute", function (request, response) {
    var subParam = request.params.mySubroute;
    response.send("This is the " + subParam.toUpperCase() + " subroute");
});

app.get("/speak/:animal", function (request, response) {
    var subParam = request.params.animal.toLowerCase();
    var sounds = {
        pig: "Oink!",
        cow: "Mooo!",
        dog: "Woof Woof!",
        cat: "I hate you human!",
        goldfish: "..."
    }
    sounds[subParam] != undefined ?
        response.send(sounds[subParam]) : response.send("Unknown animal :(");
});

app.get("/repeat/:word/:times", function (request, response) {
    var times = Number(request.params.times);
    var str = "";
    for (let i = 0; i < times; i++) {
        str += request.params.word + " ";
    }
    response.send(str);
})

// Default Route
app.get("*", function (request, response) {
    response.send("Sorry page not found... What are you doing with your life?");
});

// LISTEN REQUESTS (Start Server)
app.listen(3000, () => {
    console.log("Serving at port 3000");
})