const timsort = require("timsort");
const classes = require("./classes")


// global variables
let balance = 0;
let totalRatio = 0;
ratioSplitArray = new Array();
splitBreakdownArray = new Array();


TransactionObj = classes.TransactionObj
splitEntityObj = classes.splitEntityObj

// sorts the split info array by type of transaction split
function compareSplitType(a, b) {
    if (a.SplitType < b.SplitType) {
        return -1;
    }
    if (a.SplitType > b.SplitType) {
        return 1;
    }
    return 0;
}


// computes the amount for each transaction split
const computeSplits = function (transaction) {
    balance = transaction.amount;
    timsort.sort(transaction.splitInfo, compareSplitType);

    transaction.splitInfo.forEach(element => {
        if (element.SplitType == "FLAT") {
            balance = ComputeAmountForFlatSplit(element, balance);
        }
        if (element.SplitType == "RATIO") {
            computeTotalRatio(element);
            ratioSplitArray.push(element);
        }
        if (element.SplitType == "PERCENTAGE") {
            balance = ComputeAmountForPercentageSplit(element, balance);
        }
    });

    // ratio is computed separately because its calculated differently
    if (ratioSplitArray.length > 0) {
        ratioSplitArray.forEach(element => {
            ComputeAmountForRatioSplit(element, balance)
        })
    }
}


const ComputeAmountForFlatSplit = function (splitEntityObj, balance) {
    endBalance = balance - splitEntityObj.SplitValue;
    splitBreakdownArray.push(new classes.splitBreakdownObj(splitEntityObj.SplitEntityId, splitEntityObj.SplitValue));
    return endBalance;
}

// ratio splits are calculated like so:
// ( split value / total ratio ) * balance
// this function sums the split values to get a total ratio 
const computeTotalRatio = function (splitEntityObj) {
    totalRatio = totalRatio + splitEntityObj.SplitValue;
}

const ComputeAmountForPercentageSplit = function (splitEntityObj, balance) {
    endBalance = balance - ((splitEntityObj.SplitValue / 100) * balance);
    splitamt = balance - endBalance

    splitBreakdownArray.push(new classes.splitBreakdownObj(splitEntityObj.SplitEntityId, splitamt));
    return endBalance;
}


let ratioBreakdownArray = new Array();
let totalRatioSplitAmount = 0;

const ComputeAmountForRatioSplit = function (element, balance) {
    splitAmount = (element.SplitValue / totalRatio) * balance

    temp = new classes.splitBreakdownObj("", 0);

    temp.Amount += splitAmount
    temp.SplitEntityId = element.SplitEntityId

    totalRatioSplitAmount += splitAmount;

    // this array stores the individual ratio split payments 
    ratioBreakdownArray.push(temp);
}

// creates the json object to be sent as response from the API
const createSplitBreakdown = function (transaction) {
    balance -= totalRatioSplitAmount;

    breakdown = new classes.splitResult(transaction.id, balance, splitBreakdownArray);

    // values are reset to prevent errors in subsequent requests
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
    computeFlat: ComputeAmountForFlatSplit,
    computeRatio: ComputeAmountForRatioSplit,
    computePercentage: ComputeAmountForPercentageSplit,
    createSplitBreakdown
}