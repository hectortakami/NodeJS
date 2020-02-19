var faker = require("faker");
console.log("***** My Shop *****");
for (let i = 0; i < 10; i++) {
    console.log("* " + faker.commerce.product() + "\t-\t" + faker.commerce.price());
}