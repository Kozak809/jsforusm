/**
 * MODEL: Управление состоянием
 */
export const AppState = {
    balance: 1000,
    currentBet: 0,
    history: [],
    symbols: [
        '<i class="fa-solid fa-gem text-blue-400"></i>',
        '<i class="fa-solid fa-crown text-yellow-500"></i>',
        '<i class="fa-solid fa-lemon text-yellow-400"></i>',
        '<i class="fa-solid fa-skull text-slate-300"></i>',
        '<i class="fa-solid fa-clover text-green-500"></i>',
        '<i class="fa-solid fa-7 text-red-500"></i>'
    ],

    addHistoryItem(item) {
        this.history.push(item);
    },

    removeHistoryItem(id) {
        this.history = this.history.filter(item => item.id !== id);
    },

    getProcessedHistory(search, filter, sort) {
        let data = [...this.history];

        if (search) {
            const q = search.toLowerCase();
            data = data.filter(item =>
                item.symbols.join('').includes(q) ||
                item.status.toLowerCase().includes(q)
            );
        }

        if (filter !== 'all') {
            data = data.filter(item => item.status === filter);
        }

        data.sort((a, b) => {
            if (sort === 'dateDesc') return b.timestamp - a.timestamp;
            if (sort === 'dateAsc') return a.timestamp - b.timestamp;
            if (sort === 'amountDesc') return b.amount - a.amount;
            return 0;
        });

        return data;
    }
};
