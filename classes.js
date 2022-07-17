class TransactionObj {
    constructor(id, amount, currency, customerEmail, splitInfo) {
        this.id = id,
            this.amount = amount,
            this.currency = currency,
            this.customerEmail = customerEmail,
            this.splitInfo = splitInfo
        // splitInfo is an array of splitEntity objects
    }
}

class splitEntityObj {
    constructor(splitType, splitValue, splitEntityId) {
        this.splitType = splitType,
            // may be FLAT, RATIO OR PERCENTAGE
            this.splitValue = splitValue,
            this.splitEntityId = splitEntityId
        // splitEntityId is a string
    }
}

class splitResult {
    constructor(ID, Balance, SplitBreakdown) {
        this.ID = ID,
            this.Balance = Balance,
            this.SplitBreakdown = SplitBreakdown
        // an array of splitBreakdownObj
    }
}

class splitBreakdownObj {
    constructor(SplitEntityId, Amount) {
        this.SplitEntityId = SplitEntityId,
            this.Amount = Amount
    }
}

module.exports =
{
    TransactionObj,
    splitEntityObj,
    splitResult,
    splitBreakdownObj
}