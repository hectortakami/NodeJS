//Import the mongoose module
var mongoose = require('mongoose');

//Set up default mongoose connection to localhost
var mongoDB = 'mongodb://localhost/mongooseDogs';

mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// We define a pattern to work with data and insert them into the database
const dogSchema = new mongoose.Schema({
    name: String,
    breed: String,
    gender: String
});
// We store the entire schema into the database so we can use it more easily
var Dog = mongoose.model("Dog", dogSchema);

// Create new value and insert it into the database using a predefined Schema
function add(params) {
    Dog.create({
        name: "Snoopy",
        breed: "Beagle",
        gender: "male"
    }, (err, response) => {
        err ? console.log("SOMETHING WENT WRONG :(") : console.log("\nDOG SAVED!\n" + response);
    });
}

// We retreive all the values from the Dogs schema stored
function find() {
    Dog.find({}, (err, res) => {
        err ? console.log("SOMETHING WENT WRONG :(") :
            console.log("\nLIST ALL DOGS!\n" + res);
        closeConnection();
    });
}

// After set everything we close the connection with the database
function closeConnection() {
    mongoose.connection.close();
}

//add();
find();
