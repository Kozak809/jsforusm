/**
 * @typedef {Object} Transaction
 * @property {string} transaction_id - Unique identifier of the transaction.
 * @property {string} transaction_date - Date of the transaction (YYYY-MM-DD).
 * @property {number} transaction_amount - Amount of the transaction.
 * @property {string} transaction_type - Type of the transaction ('debit' or 'credit').
 * @property {string} transaction_description - Description of the transaction.
 * @property {string} merchant_name - Name of the merchant or service.
 * @property {string} card_type - Type of the card ('credit' or 'debit').
 */

/**
 * Array of transaction objects for analysis.
 * @type {Transaction[]}
 */
const transactions = [
    {
        transaction_id: "1",
        transaction_date: "2019-01-01",
        transaction_amount: 100.0,
        transaction_type: "debit",
        transaction_description: "Payment for groceries",
        merchant_name: "SuperMart",
        card_type: "debit"
    },
    {
        transaction_id: "2",
        transaction_date: "2019-01-05",
        transaction_amount: 150.0,
        transaction_type: "credit",
        transaction_description: "Refund for returned item",
        merchant_name: "SuperMart",
        card_type: "credit"
    },
    {
        transaction_id: "3",
        transaction_date: "2019-02-10",
        transaction_amount: 50.0,
        transaction_type: "debit",
        transaction_description: "Dinner with friends",
        merchant_name: "RestaurantABC",
        card_type: "debit"
    },
    {
        transaction_id: "4",
        transaction_date: "2019-02-15",
        transaction_amount: 200.0,
        transaction_type: "debit",
        transaction_description: "Electronics purchase",
        merchant_name: "TechStore",
        card_type: "credit"
    },
    {
        transaction_id: "5",
        transaction_date: "2019-03-20",
        transaction_amount: 80.0,
        transaction_type: "debit",
        transaction_description: "Clothing shopping",
        merchant_name: "FashionOutlet",
        card_type: "credit"
    }
];

/**
 * Returns an array of unique transaction types.
 * @param {Transaction[]} transactions - The array of transactions.
 * @returns {string[]} Array of unique transaction types.
 */
function getUniqueTransactionTypes(transactions) {
    const types = new Set(transactions.map(t => t.transaction_type));
    return Array.from(types);
}

/**
 * Calculates the sum of all transactions.
 * @param {Transaction[]} transactions - The array of transactions.
 * @returns {number} The total amount.
 */
function calculateTotalAmount(transactions) {
    return transactions.reduce((sum, t) => sum + t.transaction_amount, 0);
}

/**
 * Calculates the total amount of transactions by date parts.
 * Missing parameters are ignored in the filter.
 * @param {Transaction[]} transactions - The array of transactions.
 * @param {number} [year] - The year to filter by.
 * @param {number} [month] - The month to filter by (1-12).
 * @param {number} [day] - The day to filter by.
 * @returns {number} The total amount for the matching date criteria.
 */
function calculateTotalAmountByDate(transactions, year, month, day) {
    return transactions
        .filter(t => {
            const date = new Date(t.transaction_date);
            const matchesYear = year === undefined || date.getFullYear() === year;
            // date.getMonth() returns 0-11, so we add 1 to match 1-12 expectation
            const matchesMonth = month === undefined || (date.getMonth() + 1) === month;
            const matchesDay = day === undefined || date.getDate() === day;
            return matchesYear && matchesMonth && matchesDay;
        })
        .reduce((sum, t) => sum + t.transaction_amount, 0);
}

/**
 * Returns transactions of a specific type.
 * @param {Transaction[]} transactions - The array of transactions.
 * @param {string} type - The transaction type ('debit' or 'credit').
 * @returns {Transaction[]} Array of matching transactions.
 */
function getTransactionByType(transactions, type) {
    return transactions.filter(t => t.transaction_type === type);
}

/**
 * Returns transactions within a date range.
 * @param {Transaction[]} transactions - The array of transactions.
 * @param {string} startDate - Start date (YYYY-MM-DD).
 * @param {string} endDate - End date (YYYY-MM-DD).
 * @returns {Transaction[]} Array of transactions in the range.
 */
function getTransactionsInDateRange(transactions, startDate, endDate) {
    return transactions.filter(t => 
        t.transaction_date >= startDate && t.transaction_date <= endDate
    );
}

/**
 * Returns transactions by a specific merchant.
 * @param {Transaction[]} transactions - The array of transactions.
 * @param {string} merchantName - The name of the merchant.
 * @returns {Transaction[]} Array of matching transactions.
 */
function getTransactionsByMerchant(transactions, merchantName) {
    return transactions.filter(t => t.merchant_name === merchantName);
}

/**
 * Calculates the average transaction amount.
 * @param {Transaction[]} transactions - The array of transactions.
 * @returns {number} The average amount.
 */
function calculateAverageTransactionAmount(transactions) {
    if (transactions.length === 0) return 0;
    return calculateTotalAmount(transactions) / transactions.length;
}

/**
 * Returns transactions with amounts in a specified range.
 * @param {Transaction[]} transactions - The array of transactions.
 * @param {number} minAmount - Minimum amount.
 * @param {number} maxAmount - Maximum amount.
 * @returns {Transaction[]} Array of matching transactions.
 */
function getTransactionsByAmountRange(transactions, minAmount, maxAmount) {
    return transactions.filter(t => 
        t.transaction_amount >= minAmount && t.transaction_amount <= maxAmount
    );
}

/**
 * Calculates the total amount of debit transactions.
 * @param {Transaction[]} transactions - The array of transactions.
 * @returns {number} The total debit amount.
 */
function calculateTotalDebitAmount(transactions) {
    return transactions
        .filter(t => t.transaction_type === 'debit')
        .reduce((sum, t) => sum + t.transaction_amount, 0);
}

/**
 * Returns the month with the most transactions.
 * @param {Transaction[]} transactions - The array of transactions.
 * @returns {number} The month number (1-12) or null if empty.
 */
function findMostTransactionsMonth(transactions) {
    if (transactions.length === 0) return null;
    const counts = {};
    transactions.forEach(t => {
        const month = new Date(t.transaction_date).getMonth() + 1;
        counts[month] = (counts[month] || 0) + 1;
    });
    
    // Find key with max value
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
}

/**
 * Returns the month with the most debit transactions.
 * @param {Transaction[]} transactions - The array of transactions.
 * @returns {number} The month number (1-12) or null if empty.
 */
function findMostDebitTransactionMonth(transactions) {
    const debitTransactions = transactions.filter(t => t.transaction_type === 'debit');
    return findMostTransactionsMonth(debitTransactions);
}

/**
 * Determines which transaction type is most frequent.
 * @param {Transaction[]} transactions - The array of transactions.
 * @returns {'debit'|'credit'|'equal'} The result string.
 */
function mostTransactionTypes(transactions) {
    const debitCount = transactions.filter(t => t.transaction_type === 'debit').length;
    const creditCount = transactions.filter(t => t.transaction_type === 'credit').length;
    
    if (debitCount > creditCount) return 'debit';
    if (creditCount > debitCount) return 'credit';
    return 'equal';
}

/**
 * Returns transactions occurring before a specific date.
 * @param {Transaction[]} transactions - The array of transactions.
 * @param {string} date - The cutoff date (YYYY-MM-DD).
 * @returns {Transaction[]} Array of matching transactions.
 */
function getTransactionsBeforeDate(transactions, date) {
    return transactions.filter(t => t.transaction_date < date);
}

/**
 * Finds a transaction by its ID.
 * @param {Transaction[]} transactions - The array of transactions.
 * @param {string} id - The transaction ID.
 * @returns {Transaction|undefined} The found transaction or undefined.
 */
function findTransactionById(transactions, id) {
    return transactions.find(t => t.transaction_id === id);
}

/**
 * Maps transactions to their descriptions.
 * @param {Transaction[]} transactions - The array of transactions.
 * @returns {string[]} Array of descriptions.
 */
function mapTransactionDescriptions(transactions) {
    return transactions.map(t => t.transaction_description);
}


// --- Testing ---

console.log("=== Transaction Analysis ===");

console.log("1. Unique Types:", getUniqueTransactionTypes(transactions));
console.log("2. Total Amount:", calculateTotalAmount(transactions));
console.log("3. Total by Date (2019):", calculateTotalAmountByDate(transactions, 2019));
console.log("3. Total by Date (2019, 01):", calculateTotalAmountByDate(transactions, 2019, 1));
console.log("3. Total by Date (2019, 01, 01):", calculateTotalAmountByDate(transactions, 2019, 1, 1));
console.log("4. Debit Transactions:", getTransactionByType(transactions, "debit"));
console.log("5. In Date Range (2019-01-01 to 2019-01-31):", getTransactionsInDateRange(transactions, "2019-01-01", "2019-01-31"));
console.log("6. By Merchant (SuperMart):", getTransactionsByMerchant(transactions, "SuperMart"));
console.log("7. Average Amount:", calculateAverageTransactionAmount(transactions));
console.log("8. Amount Range (50-100):", getTransactionsByAmountRange(transactions, 50, 100));
console.log("9. Total Debit Amount:", calculateTotalDebitAmount(transactions));
console.log("10. Month with Most Transactions:", findMostTransactionsMonth(transactions));
console.log("11. Month with Most Debit Transactions:", findMostDebitTransactionMonth(transactions));
console.log("12. Most Transaction Type:", mostTransactionTypes(transactions));
console.log("13. Before Date (2019-02-01):", getTransactionsBeforeDate(transactions, "2019-02-01"));
console.log("14. Find ID '3':", findTransactionById(transactions, "3"));
console.log("15. Descriptions:", mapTransactionDescriptions(transactions));
