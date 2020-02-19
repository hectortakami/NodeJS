var rp = require('request-promise');
for (let i = 1; i <= 10; i++) {
    rp(`https://jsonplaceholder.typicode.com/users/${i}`)
        .then(function (body) {
            // Process html...
            var parsedData = JSON.parse(body);
            console.log(parsedData.name + "\tlives in\t" + parsedData.address.city);
        })
        .catch(function (err) {
            // Crawling failed...
            console.log("ERROR!: " + err);
        });
}
