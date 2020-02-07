console.log("\nprintReverse() takes an array as argument and print the array in the reverse order");
function printReverse(array) {
    return array.reverse();
}
console.log("* printReverse([1,2,3,4]): [" + printReverse([1, 2, 3, 4]) + "]");
console.log("* printReverse([a,b,c,d]): [" + printReverse(['a', 'b', 'c', 'd']) + "]");


console.log("\nisUniform() returns true if elements in array are identical");
function isUniform(array) {
    return array.every(element => element === array[0]);
}
console.log("* isUniform([1,1,1,1]): " + isUniform([1, 1, 1, 1]));
console.log("* isUniform([2,1,1,1]): " + isUniform([2, 1, 1, 1]));
console.log("* isUniform([a,b,p]): " + isUniform(['a', 'b', 'p']));
console.log("* isUniform([b,b,b]): " + isUniform(['b', 'b', 'b']));


console.log("\nsumArray() takes an array of numbers and returns the sum of all of them");
function sumArray(array) {
    return array.reduce((a, b) => { return a + b });
}
console.log("* sumArray([1,2,3]): " + sumArray([1, 2, 3]));
console.log("* sumArray([10,3,10,4]): " + sumArray([10, 3, 10, 4]));
console.log("* sumArray([-5,100]): " + sumArray([-5, 100]));


console.log("\nmaxValue() takes an array of numbers and returns the maximum value in it");
function maxValue(array) {
    return array.sort((a, b) => { return a - b }).reverse()[0];
}
console.log("* maxValue([1,2,3]): " + maxValue([1, 2, 3]));
console.log("* maxValue([10,3,10,4]): " + maxValue([10, 3, 10, 4]));
console.log("* maxValue([-5,100]): " + maxValue([-5, 100]));


