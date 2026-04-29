/**
 * @typedef {Object} Transaction
 * @property {string} id - Unique identifier.
 * @property {string} date - ISO date string.
 * @property {number} amount - Transaction amount (positive for income, negative for expense).
 * @property {string} category - Transaction category (e.g., "Food", "Transport").
 * @property {string} description - Full description of the transaction.
 */

let transactions = [
    {
        id: "1",
        date: "2022-01-01T12:00",
        amount: 100,
        category: "Food",
        description: "Lunch at the cafe with friends"
    },
    {
        id: "2",
        date: "2022-01-02T15:30",
        amount: -20,
        category: "Transport",
        description: "Bus ticket to the city center"
    }
];

/**
 * Returns the current list of all transactions.
 * 
 * @returns {Transaction[]} An array of transaction objects.
 */
export function getTransactions() {
    return transactions;
}

/**
 * Adds a new transaction object to the internal data store.
 * 
 * @param {Transaction} transaction - The transaction object to add.
 * @returns {void}
 */
export function addTransactionToArray(transaction) {
    transactions.push(transaction);
}

/**
 * Removes a transaction from the internal data store by its unique ID.
 * 
 * @param {string} id - The unique identifier of the transaction to remove.
 * @returns {void}
 */
export function removeTransactionFromArray(id) {
    transactions = transactions.filter(t => t.id !== id);
}

/**
 * Calculates the total balance by summing up all transaction amounts.
 * 
 * @returns {number} The sum of all transaction amounts.
 */
export function calculateTotal() {
    return transactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
}

/**
 * Finds and returns a specific transaction object by its ID.
 * 
 * @param {string} id - The unique identifier to search for.
 * @returns {Transaction|undefined} The found transaction object or undefined if not found.
 */
export function findTransactionById(id) {
    return transactions.find(t => t.id === id);
}
