import { AppState } from './model.js';
import { AudioSystem } from './audio.js';

/**
 * VIEW: Манипуляции с DOM
 */
export const UI = {
    balanceEl: document.getElementById('balanceDisplay'),
    betEl: document.getElementById('currentBetDisplay'),
    reels: [document.getElementById('reel1'), document.getElementById('reel2'), document.getElementById('reel3')],
    spinBtn: document.getElementById('spinBtn'),
    autoSpinBtn: document.getElementById('autoSpinBtn'),
    autoSpinStatusIcon: document.getElementById('autoSpinStatusIcon'),
    msgEl: document.getElementById('gameMessage'),

    tableBody: document.getElementById('historyTableBody'),
    emptyHistoryMsg: document.getElementById('emptyHistory'),

    placedChipsContainer: document.getElementById('placedChipsContainer'),

    // Настройки высоты символа для расчета анимации барабана
    symbolHeight: 96, // 96px = 6rem

    updateCounters() {
        this.balanceEl.textContent = AppState.balance;
        this.betEl.textContent = AppState.currentBet;
    },

    showMessage(text, type = 'info') {
        this.msgEl.textContent = text;
        this.msgEl.classList.remove('hidden', 'text-red-400', 'border-red-500', 'text-yellow-400', 'border-yellow-500', 'text-green-400', 'border-green-500');

        if (type === 'error') {
            this.msgEl.classList.add('text-red-400', 'border-red-500');
        } else if (type === 'win') {
            this.msgEl.classList.add('text-yellow-400', 'border-yellow-500');
        } else {
            this.msgEl.classList.add('text-green-400', 'border-green-500');
        }
    },

    hideMessage() {
        this.msgEl.classList.add('hidden');
    },

    // ВИЗУАЛИЗАЦИЯ ФИШЕК НА СТОЛЕ
    addChipToTable(value) {
        const chipEl = document.createElement('div');
        chipEl.className = `chip-realistic chip-${value} w-10 h-10 text-sm transform hover:scale-110 transition-transform`;

        const spanEl = document.createElement('span');
        spanEl.textContent = value;
        chipEl.appendChild(spanEl);

        // Рандомный поворот для эффекта "брошенной" фишки
        const randomRot = Math.floor(Math.random() * 60) - 30;
        chipEl.style.transform = `rotate(${randomRot}deg)`;

        this.placedChipsContainer.appendChild(chipEl);
    },

    clearTableChips() {
        this.placedChipsContainer.innerHTML = '';
    },

    // ГЕНЕРАЦИЯ НАСТОЯЩЕГО БАРАБАНА СЛОТОВ
    setupReelsForSpin(targetSymbols) {
        const spinsPerReel = 30; // Больше символов для реалистичной скорости

        this.reels.forEach((reel, index) => {
            // Запоминаем текущий символ на барабане (он будет стартовым)
            const currentSymbol = reel.children.length > 0 ? reel.children[0].innerHTML : '<i class="fa-solid fa-gem text-blue-400"></i>';

            const totalSymbols = spinsPerReel + (index * 15);
            const offset = totalSymbols * this.symbolHeight;

            // Отключаем анимацию для перескока
            reel.style.transition = 'none';
            // Ставим барабан в самое начало (вниз списка), где будет стартовый символ
            reel.style.transform = `translateY(-${offset}px)`;
            reel.style.filter = 'blur(0px)';

            // В реальных слотах барабаны крутятся ВНИЗ (символы падают сверху).
            // Поэтому целевой символ (target) находится на самом ВЕРХУ списка (index 0).
            // Когда барабан докрутится до translateY(0), будет виден именно он.
            let html = `<div class="symbol">${targetSymbols[index]}</div>`;

            // Генерируем пролетающие символы
            for (let i = 0; i < totalSymbols - 1; i++) {
                const randomSym = AppState.symbols[Math.floor(Math.random() * AppState.symbols.length)];
                html += `<div class="symbol">${randomSym}</div>`;
            }

            // В самый низ ставим текущий символ, чтобы не было визуального "скачка" при старте
            html += `<div class="symbol">${currentSymbol}</div>`;

            reel.innerHTML = html;
        });
    },

    animateReels(targetSymbols) {
        return new Promise((resolve) => {
            this.setupReelsForSpin(targetSymbols);
            AudioSystem.startSpinningSound();

            this.reels.forEach(reel => {
                reel.style.transition = 'none';
                reel.style.filter = 'blur(4px)'; // Резкое размытие в начале
            });

            // Принудительный reflow, чтобы браузер применил transform и blur
            this.reels[0].offsetHeight;

            let maxDuration = 0;

            this.reels.forEach((reel, index) => {
                const duration = 2.0 + (index * 0.5); // 2.0s, 2.5s, 3.0s
                maxDuration = Math.max(maxDuration, duration);

                // Включаем CSS транзицию. 
                reel.style.transition = `transform ${duration}s cubic-bezier(0.1, 0.9, 0.2, 1), filter ${duration}s ease-out`;
                reel.style.transform = `translateY(0px)`;
                reel.style.filter = 'blur(0px)';

                // Звук остановки каждого барабана
                setTimeout(() => {
                    AudioSystem.playReelStop();
                }, duration * 1000);
            });

            // Останавливаем тиканье чуть раньше, чем закончит крутиться последний барабан
            setTimeout(() => {
                AudioSystem.stopSpinningSound();
            }, (maxDuration * 1000) - 100);

            // Разрешаем Promise после завершения вращения самого долгого барабана
            setTimeout(resolve, maxDuration * 1000);
        });
    },

    renderHistory(data) {
        this.tableBody.innerHTML = '';

        if (data.length === 0) {
            this.emptyHistoryMsg.classList.remove('hidden');
        } else {
            this.emptyHistoryMsg.classList.add('hidden');
            data.forEach(item => {
                const tr = document.createElement('tr');
                const isWin = item.status === 'win';
                const time = new Date(item.timestamp).toLocaleTimeString();

                tr.innerHTML = `
                    <td class="p-4">${time}</td>
                    <td class="p-4 text-2xl tracking-widest">${item.symbols.join('')}</td>
                    <td class="p-4 text-yellow-500 font-bold">$${item.amount}</td>
                    <td class="p-4 ${isWin ? 'text-green-400' : 'text-gray-500'} font-bold">${isWin ? 'ПОБЕДА' : 'ПРОИГРЫШ'}</td>
                    <td class="p-4 font-black ${isWin ? 'text-yellow-400' : 'text-gray-600'}">${isWin ? '+$' + item.payout : '$0'}</td>
                    <td class="p-4 text-right">
                        <button class="delete-btn border border-red-900/50 text-red-400 rounded-lg px-4 py-2 hover:bg-red-900/20 transition-colors" data-id="${item.id}">X</button>
                    </td>
                `;
                this.tableBody.appendChild(tr);
            });
        }
    }
};
