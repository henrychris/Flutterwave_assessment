var express = require('express');
const bodyParser = require("body-parser");
const computeController = require("./controllers/computeController");

var app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => { res.send("Hello World!") });
app.post('/split-payments/compute', computeController.compute)

var server = app.listen(process.env.PORT || 5000, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port);
})