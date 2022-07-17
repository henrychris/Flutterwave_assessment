var express = require('express');
const bodyParser = require("body-parser");
const computeController = require("./controllers/computeController");

var app = express();
app.use(bodyParser.json());

app.post('/split-payments/compute', computeController.compute)

var server = app.listen(8080, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port);
})