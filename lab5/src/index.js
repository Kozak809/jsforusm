import {
    getTransactions,
    addTransactionToArray,
    removeTransactionFromArray,
    calculateTotal,
    findTransactionById
} from './transactions.js';
import { generateId } from './utils.js';

import * as ui from './ui.js';

const form = document.getElementById('transaction-form');
const table = document.getElementById('transactions-table');

/**
 * Initializes the application state and UI.
 * Fetches initial transactions, renders the table, updates the total,
 * and attaches necessary event listeners.
 * 
 * @returns {void}
 */
function init() {
    const transactions = getTransactions();
    ui.renderTable(transactions);
    ui.updateTotalUI(calculateTotal());
    setupEventListeners();
}

/**
 * Sets up global event listeners for the transaction form and the transactions table.
 * Uses event delegation for the table to handle delete buttons and row clicks.
 * 
 * @returns {void}
 */
function setupEventListeners() {
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const { amount, category, description } = ui.getFormData();

        // Simple validation
        if (!amount || !category || !description) {
            alert('Please fill in all fields');
            return;
        }

        const newTransaction = {
            id: generateId(getTransactions()),
            date: new Date().toISOString(),
            amount: isNaN(parseFloat(amount)) ? 0 : parseFloat(amount),
            category: category,
            description: description
        };

        addTransactionToArray(newTransaction);
        ui.renderTable(getTransactions());
        ui.updateTotalUI(calculateTotal());
        ui.clearForm();
    });

    table.addEventListener('click', (e) => {
        const target = e.target;

        // Handle Delete Button
        if (target.classList.contains('btn-delete')) {
            e.stopPropagation(); // Prevent triggering row click
            const id = target.dataset.id;
            if (confirm('Are you sure you want to delete this transaction?')) {
                removeTransactionFromArray(id);
                ui.renderTable(getTransactions());
                ui.updateTotalUI(calculateTotal());
                ui.hideTransactionDetails();
            }
            return;
        }

        const row = target.closest('tr');
        if (row && row.dataset.id) {
            const transaction = findTransactionById(row.dataset.id);
            ui.showTransactionDetails(transaction);
        }
    });

    // Handle Close Details Button
    document.getElementById('transaction-details').addEventListener('click', (e) => {
        if (e.target.id === 'btn-close-details') {
            ui.hideTransactionDetails();
        }
    });
}

// Start the app
init();