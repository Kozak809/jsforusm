import { formatDate, shortenDescription } from './utils.js';

const tableBody = document.getElementById('transactions-body');
const totalDisplay = document.getElementById('total-amount');
const detailsSection = document.getElementById('transaction-details');
const detailsContent = document.getElementById('details-content');

/**
 * Clears the table and re-renders all provided transactions into the DOM.
 * Applies color coding based on amount (positive/negative) and truncates descriptions.
 * 
 * @param {import('./transactions.js').Transaction[]} transactions - Array of transaction objects to display.
 * @returns {void}
 */
export function renderTable(transactions) {
    tableBody.innerHTML = '';
    transactions.forEach(transaction => {
        const row = document.createElement('tr');
        row.dataset.id = transaction.id;
        
        const amountClass = transaction.amount >= 0 ? 'row-positive' : 'row-negative';
        
        row.innerHTML = `
            <td>${formatDate(transaction.date)}</td>
            <td>${transaction.category}</td>
            <td class="${amountClass}">${shortenDescription(transaction.description)}</td>
            <td>
                <button class="btn-delete" data-id="${transaction.id}">Delete</button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

/**
 * Updates the total balance element in the UI with formatted currency.
 * Changes the color of the balance based on whether it is positive or negative.
 * 
 * @param {number} total - The total balance amount to display.
 * @returns {void}
 */
export function updateTotalUI(total) {
    totalDisplay.textContent = `$${total.toFixed(2)}`;
    totalDisplay.className = 'total-amount ' + (total >= 0 ? 'row-positive' : 'row-negative');
}

/**
 * Populates and displays the transaction details section.
 * Scrolls the view to the details section for better visibility.
 * 
 * @param {import('./transactions.js').Transaction} transaction - The transaction object to show.
 * @returns {void}
 */
export function showTransactionDetails(transaction) {
    if (!transaction) return;
    
    detailsSection.style.display = 'block';
    detailsContent.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
                <strong>ID:</strong> ${transaction.id}<br>
                <strong>Date:</strong> ${formatDate(transaction.date)}<br>
                <strong>Category:</strong> ${transaction.category}<br>
                <strong>Amount:</strong> <span class="${transaction.amount >= 0 ? 'row-positive' : 'row-negative'}">$${transaction.amount}</span><br>
                <strong>Description:</strong> ${transaction.description}
            </div>
            <button id="btn-close-details" class="btn-delete">Close</button>
        </div>
    `;
    
    detailsSection.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Hides the transaction details section from the UI.
 * 
 * @returns {void}
 */
export function hideTransactionDetails() {
    detailsSection.style.display = 'none';
}

/**
 * Extracts and returns the data currently entered into the transaction form.
 * 
 * @returns {{amount: string, category: string, description: string}} An object containing form field values.
 */
export function getFormData() {
    const amount = document.getElementById('amount').value;
    const category = document.getElementById('category').value;
    const description = document.getElementById('description').value;
    
    return { amount, category, description };
}

/**
 * Resets all fields in the transaction form to their default states.
 * 
 * @returns {void}
 */
export function clearForm() {
    document.getElementById('transaction-form').reset();
}
