
var express = require('express');
var app = express();

app.all('*', function (request, response, next) {
    response.send(request.method + ' to path; ' + request.path);
    next();
});


//Route to handle just the path /test
app.get('/test', function (request, response, next) {
    response.send('Got to Get a GET request to path: test');
});





//Handle request for any static file
app.use(express.static('./public'));

app.listen(8080, () => console.log(`listening on port 8080`)); // note the use of an anonymous function here