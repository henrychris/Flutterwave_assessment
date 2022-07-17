const computeService = require("../services/computeService")
const classes = require("../classes")

function compute (req, res) {
    const { body } = req;

    transactionData = new classes.TransactionObj(body.ID, body.Amount, body.Currency, body.CustomerEmail, body.SplitInfo);
    splitObject = computeService.compute(transactionData);
    res.status(200).send(splitObject);
};

module.exports = { compute }