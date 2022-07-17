var timsort = require("timsort");

// global variables
let balance = 0;
let totalRatio = 0;
ratioSplitArray = new Array();
splitBreakdownArray = new Array();


const classes = require("./classes")

TransactionObj = classes.TransactionObj
splitEntityObj = classes.splitEntityObj

function compareSplitType(a, b) {
    if (a.SplitType < b.SplitType) {
        return -1;
    }
    if (a.SplitType > b.SplitType) {
        return 1;
    }
    return 0;
}

const computeSplits = function (transaction) {
    balance = transaction.amount;
    timsort.sort(transaction.splitInfo, compareSplitType);

    transaction.splitInfo.forEach(element => {
        if (element.SplitType == "FLAT") {
            balance = computeFlat(element, balance);
        }
        if (element.SplitType == "RATIO") {
            computeTotalRatio(element);
            ratioSplitArray.push(element);
        }
        if (element.SplitType == "PERCENTAGE") {
            balance = computePercentage(element, balance);
        }
    });

    if (ratioSplitArray.length > 0) {
        ratioSplitArray.forEach(element => {
            computeRatio(element, balance)
        })
    }
}

const computeFlat = function (splitEntityObj, balance) {
    endBalance = balance - splitEntityObj.SplitValue;
    splitBreakdownArray.push(new classes.splitBreakdownObj(splitEntityObj.SplitEntityId, splitEntityObj.SplitValue));
    return endBalance;
}

const computeTotalRatio = function (splitEntityObj) {
    totalRatio = totalRatio + splitEntityObj.SplitValue;
}

const computePercentage = function (splitEntityObj, balance) {
    endBalance = balance - ((splitEntityObj.SplitValue / 100) * balance);
    splitamt = balance - endBalance

    splitBreakdownArray.push(new classes.splitBreakdownObj(splitEntityObj.SplitEntityId, splitamt));
    return endBalance;
}


let ratioBreakdownArray = new Array();
ratioBreakdownArray.splice(0);

let totalRatioSplitAmount = 0;

const computeRatio = function (element, balance) {
    splitAmount = (element.SplitValue / totalRatio) * balance

    temp = new classes.splitBreakdownObj("", 0);

    temp.Amount += splitAmount
    temp.SplitEntityId = element.SplitEntityId

    totalRatioSplitAmount += splitAmount;
    ratioBreakdownArray.push(temp);
}

const createSplitBreakdown = function (transaction) {
    balance -= totalRatioSplitAmount;

    breakdown = new classes.splitResult(transaction.id, balance, splitBreakdownArray);

    splitBreakdownArray = [];
    ratioSplitArray = [];
    balance = 0;
    totalRatio = 0;
    totalRatioSplitAmount = 0;

    ratioBreakdownArray.forEach(element => {
        breakdown.SplitBreakdown.push(element);
    })

    ratioBreakdownArray = [];
    return breakdown;
}

module.exports = {
    computeSplits,
    computeFlat,
    computeRatio,
    computePercentage,
    createSplitBreakdown
}