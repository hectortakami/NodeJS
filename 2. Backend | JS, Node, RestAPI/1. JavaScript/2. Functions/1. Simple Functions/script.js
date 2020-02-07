console.log("isEven() produces a boolean result when the argument is even or not");
function isEven(num) {
    if (num % 2 == 0) {
        return true;
    } else {
        return false;
    }
}
console.log("* isEven(4): " + isEven(4));
console.log("* isEven(21): " + isEven(21));
console.log("* isEven(68): " + isEven(68));
console.log("* isEven(333): " + isEven(333));

console.log("factorial() gives the factorial value of the argument");
function factorial(num) {
    if (num === 0) {
        return 1;
    } else {
        var factorialNum = 1;
        for (let i = 1; i <= num; i++) {
            factorialNum = factorialNum * i;
        }
        return factorialNum;
    }
}
console.log("* factorial(5): " + factorial(5));
console.log("* factorial(2): " + factorial(2));
console.log("* factorial(10): " + factorial(10));
console.log("* factorial(0): " + factorial(0));

console.log("kebabToSnake() transform an argument in the kebab form (middle-dashed) to snake convention (under_scored)");
function kebabToSnake(input) {
    return input.replace(/-/g, "_");
}

console.log("* kebabToSnake(\"hello-world\"): " + kebabToSnake("hello-world"));
console.log("* kebabToSnake(\"dogs-are-awesome\"): " + kebabToSnake("dogs-are-awesome"));
console.log("* kebabToSnake(\"blah\"): " + kebabToSnake("blah"));
