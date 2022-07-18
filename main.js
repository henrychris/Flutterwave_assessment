require('newrelic');

var express = require('express');

const bodyParser = require("body-parser");
const computeController = require("./controllers/computeController");
const apicache = require("apicache");
const cache = apicache.middleware;

var app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => { res.send("Hello World!") });
app.post('/split-payments/compute', cache("2 minutes"), computeController.compute)

var server = app.listen(process.env.PORT || 5000, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port);
})
