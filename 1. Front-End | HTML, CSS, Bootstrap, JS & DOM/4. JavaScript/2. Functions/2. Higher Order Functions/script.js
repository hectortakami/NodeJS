// Building a personal forEach implentation

//We define a prototype of the function we want to implement
Array.prototype.myForEach = function (func) {
    for (let i = 0; i < this.length; i++) {
        //Set the local 'this' variable to the element caller using our function
        func(this[i]);
    }
}

//Define the data ('this') to be used by our prototype
var friends = ["Rachel", "Monica", "Chandler", "Ross", "Phoebe", "Joey"];

//Now we can use as plain data the passing of named or anonymous functions to our data
friends.myForEach(name => {
    console.log("I love " + name);
});


// It is the same as we create a defined function and pass it as data to be interpreted by our prototype
/* 
    function loveCharacter(name){
        console.log("I love " + name);
    }

    friends.myForEach(loveCharacter)
*/

// ***************************************************************************************

// Handle async promises 
var intervalId = null;
var varCounter = 0;

//We define a simple function to work with
function mySong() {
    if (varCounter < 3) {
        varCounter++; //Increment the repetition counter
        console.log("\n\nTwinkle, twinkle, little star");
        console.log("How I wonder what you are");
        console.log("Up above the world so high");
        console.log("Like a diamond in the sky");
    } else {
        // The song repeats 3 times, then the intervalID gets cleared
        clearInterval(intervalId); //We clear the process ID in memory
        console.log("Song ended! :)");
    }
}

function playSong() {
    // It sets a promise between 1000ms to call mySong() function
    intervalId = setInterval(() => {
        mySong()
    }, 1000);
}

playSong();



