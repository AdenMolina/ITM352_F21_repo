var express = require('express');
var app = express();

app.all('*', function (request, response, next) {
    console.log(request.method + ' to path; ' + request.path);
    next();
});

app.all('/test', function (request, response, next) {
    response.send(`Got to Get a GET request`);
});






app.use(express.static('./public'));

app.listen(8080, () => console.log(`listening on port 8080`)); // note the use of an anonymous function here