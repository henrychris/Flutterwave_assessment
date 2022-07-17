const classes = require("../classes");
const st = require("../splitTransactions");

const compute = (transaction) => {
    st.computeSplits(transaction);
    return splitObject = st.createSplitBreakdown(transaction)
};

module.exports = { compute }