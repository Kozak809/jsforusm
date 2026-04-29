/**
 * Generates a unique random identifier for a new transaction.
 * Ensures the ID is not already present in the provided list.
 * 
 * @param {Array} existingItems - The list of current transactions to check against.
 * @returns {string} A unique 7-character alphanumeric ID.
 */
export function generateId(existingItems = []) {
    let newId;
    const existingIds = existingItems.map(item => item.id);
    
    do {
        newId = Math.random().toString(36).substring(2, 9);
    } while (existingIds.includes(newId));
    
    return newId;
}

/**
 * Formats a date string or Date object into a user-friendly string.
 * Example output: "Jan 1, 2022, 12:00 PM"
 * 
 * @param {string|Date} date - The date to format (ISO string or Date object).
 * @returns {string} A localized, human-readable date and time string.
 */
export function formatDate(date) {
    const d = new Date(date);
    return d.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Shortens a string to the first four words and adds an ellipsis if needed.
 * Used for previewing long descriptions in the table view.
 * 
 * @param {string} text - The full description text.
 * @returns {string} The truncated string containing up to 4 words.
 */
export function shortenDescription(text) {
    const words = text.split(/\s+/);
    if (words.length <= 4) return text;
    return words.slice(0, 4).join(' ') + '...';
}
