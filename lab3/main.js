/**
 * Transaction object definition
 * @typedef {Object} Transaction
 * @property {string} transaction_id - Unique identifier of the transaction.
 * @property {string} transaction_date - Date of the transaction (YYYY-MM-DD).
 * @property {number} transaction_amount - Amount of the transaction.
 * @property {string} transaction_type - Type of the transaction (debit or credit).
 * @property {string} transaction_description - Description of the transaction.
 * @property {string} merchant_name - Name of the merchant.
 * @property {string} card_type - Type of the card used (e.g., Visa, MasterCard).
 */

import { transactions } from './transactions.js';

/**
 * Returns an array of unique transaction types.
 * @param {Transaction[]} transactions - Array of transactions.
 * @returns {string[]} Unique transaction types.
 */
function getUniqueTransactionTypes(transactions) {
  return [...new Set(transactions.map(t => t.transaction_type))];
}

/**
 * Calculates the total amount of all transactions.
 * @param {Transaction[]} transactions - Array of transactions.
 * @returns {number} Total amount.
 */
function calculateTotalAmount(transactions) {
  return transactions.reduce((total, t) => total + t.transaction_amount, 0);
}

/**
 * Calculates the total amount of transactions by date (optional year, month, day).
 * @param {Transaction[]} transactions - Array of transactions.
 * @param {number} [year] - Year of the transaction.
 * @param {number} [month] - Month of the transaction (1-12).
 * @param {number} [day] - Day of the transaction.
 * @returns {number} Total amount for the specified date parts.
 */
function calculateTotalAmountByDate(transactions, year, month, day) {
  return transactions.filter(t => {
    const date = new Date(t.transaction_date);
    const matchesYear = year === undefined || date.getFullYear() === year;
    const matchesMonth = month === undefined || (date.getMonth() + 1) === month;
    const matchesDay = day === undefined || date.getDate() === day;
    return matchesYear && matchesMonth && matchesDay;
  }).reduce((total, t) => total + t.transaction_amount, 0);
}

/**
 * Returns transactions of the specified type.
 * @param {Transaction[]} transactions - Array of transactions.
 * @param {string} type - Transaction type (debit or credit).
 * @returns {Transaction[]} Filtered transactions.
 */
function getTransactionByType(transactions, type) {
  return transactions.filter(t => t.transaction_type === type);
}

/**
 * Returns transactions within a date range.
 * @param {Transaction[]} transactions - Array of transactions.
 * @param {string} startDate - Start date (YYYY-MM-DD).
 * @param {string} endDate - End date (YYYY-MM-DD).
 * @returns {Transaction[]} Filtered transactions.
 */
function getTransactionsInDateRange(transactions, startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return transactions.filter(t => {
    const date = new Date(t.transaction_date);
    return date >= start && date <= end;
  });
}

/**
 * Returns transactions by merchant name.
 * @param {Transaction[]} transactions - Array of transactions.
 * @param {string} merchantName - Name of the merchant.
 * @returns {Transaction[]} Filtered transactions.
 */
function getTransactionsByMerchant(transactions, merchantName) {
  return transactions.filter(t => t.merchant_name === merchantName);
}

/**
 * Calculates the average transaction amount.
 * @param {Transaction[]} transactions - Array of transactions.
 * @returns {number} Average amount.
 */
function calculateAverageTransactionAmount(transactions) {
  if (transactions.length === 0) return 0;
  return calculateTotalAmount(transactions) / transactions.length;
}

/**
 * Returns transactions within an amount range.
 * @param {Transaction[]} transactions - Array of transactions.
 * @param {number} minAmount - Minimum amount.
 * @param {number} maxAmount - Maximum amount.
 * @returns {Transaction[]} Filtered transactions.
 */
function getTransactionsByAmountRange(transactions, minAmount, maxAmount) {
  return transactions.filter(t => t.transaction_amount >= minAmount && t.transaction_amount <= maxAmount);
}

/**
 * Calculates the total amount of debit transactions.
 * @param {Transaction[]} transactions - Array of transactions.
 * @returns {number} Total debit amount.
 */
function calculateTotalDebitAmount(transactions) {
  return transactions
    .filter(t => t.transaction_type === 'debit')
    .reduce((total, t) => total + t.transaction_amount, 0);
}

/**
 * Finds the month with the most transactions.
 * @param {Transaction[]} transactions - Array of transactions.
 * @returns {string} Month name (or month number as string).
 */
function findMostTransactionsMonth(transactions) {
  if (transactions.length === 0) return null;
  const monthCounts = transactions.reduce((counts, t) => {
    const month = new Date(t.transaction_date).getMonth();
    counts[month] = (counts[month] || 0) + 1;
    return counts;
  }, {});
  const mostTransactionsMonth = Object.keys(monthCounts).reduce((a, b) => monthCounts[a] > monthCounts[b] ? a : b);
  return (parseInt(mostTransactionsMonth) + 1).toString(); // Returning month number as string (1-indexed)
}

/**
 * Finds the month with the most debit transactions.
 * @param {Transaction[]} transactions - Array of transactions.
 * @returns {string} Month name (or month number as string).
 */
function findMostDebitTransactionMonth(transactions) {
  const debitTransactions = transactions.filter(t => t.transaction_type === 'debit');
  return findMostTransactionsMonth(debitTransactions);
}

/**
 * Determines which transaction type is more frequent.
 * @param {Transaction[]} transactions - Array of transactions.
 * @returns {string} 'debit', 'credit', or 'equal'.
 */
function mostTransactionTypes(transactions) {
  const debitCount = getTransactionByType(transactions, 'debit').length;
  const creditCount = getTransactionByType(transactions, 'credit').length;
  if (debitCount > creditCount) return 'debit';
  if (creditCount > debitCount) return 'credit';
  return 'equal';
}

/**
 * Returns transactions before a specified date.
 * @param {Transaction[]} transactions - Array of transactions.
 * @param {string} date - Reference date (YYYY-MM-DD).
 * @returns {Transaction[]} Filtered transactions.
 */
function getTransactionsBeforeDate(transactions, date) {
  const refDate = new Date(date);
  return transactions.filter(t => new Date(t.transaction_date) < refDate);
}

/**
 * Finds a transaction by its ID.
 * @param {Transaction[]} transactions - Array of transactions.
 * @param {string} id - Transaction ID.
 * @returns {Transaction|undefined} Found transaction or undefined.
 */
function findTransactionById(transactions, id) {
  return transactions.find(t => t.transaction_id === id);
}

/**
 * Returns an array of transaction descriptions.
 * @param {Transaction[]} transactions - Array of transactions.
 * @returns {string[]} Array of descriptions.
 */
function mapTransactionDescriptions(transactions) {
  return transactions.map(t => t.transaction_description);
}

// --- Testing Section ---

function runTests(testData, label) {
  console.log(`\n--- Testing ${label} ---`);
  console.log(`Transactions Count: ${testData.length}`);

  console.log("Unique Transaction Types:", getUniqueTransactionTypes(testData));
  console.log("Total Amount:", calculateTotalAmount(testData));
  console.log("Total Amount by Date (2019-01):", calculateTotalAmountByDate(testData, 2019, 1));
  console.log("Debit Transactions count:", getTransactionByType(testData, 'debit').length);
  console.log("Transactions in Date Range (2019-01-01 to 2019-01-10):", getTransactionsInDateRange(testData, '2019-01-01', '2019-01-10').length);
  console.log("Transactions by Merchant (SuperMart):", getTransactionsByMerchant(testData, 'SuperMart').length);
  console.log("Average Transaction Amount:", calculateAverageTransactionAmount(testData));
  console.log("Transactions by Amount Range (50-100):", getTransactionsByAmountRange(testData, 50, 100).length);
  console.log("Total Debit Amount:", calculateTotalDebitAmount(testData));
  console.log("Most Transactions Month:", findMostTransactionsMonth(testData));
  console.log("Most Debit Transaction Month:", findMostDebitTransactionMonth(testData));
  console.log("Most Transaction Types:", mostTransactionTypes(testData));
  console.log("Transactions Before Date (2019-02-01):", getTransactionsBeforeDate(testData, '2019-02-01').length);
  console.log("Find Transaction by ID (1):", findTransactionById(testData, "1") ? "Found" : "Not Found");
  console.log("First 3 Descriptions:", mapTransactionDescriptions(testData).slice(0, 3));
}

// 1. Full dataset
runTests(transactions, "Full Dataset");

// 2. Empty array
runTests([], "Empty Array");

// 3. Single transaction
runTests([transactions[0]], "Single Transaction");
