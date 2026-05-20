import { AppState } from './model.js';
import { UI } from './view.js';
import { AudioSystem } from './audio.js';

/**
 * CONTROLLER: Связка логики и интерфейса
 */
export const Controller = {
    init() {
        this.bindTabs();
        this.bindDragDrop();
        this.bindGame();
        this.bindHistory();
        this.bindModal();
        this.fetchAPI();
    },

    // ЗАПРОСЫ К API (ПОЛУЧЕНИЕ СОВЕТА)
    async fetchAPI() {
        try {
            const res = await fetch('https://api.adviceslip.com/advice');
            const data = await res.json();
            document.getElementById('quoteBox').textContent = `СОВЕТ ДНЯ: ${data.slip.advice.toUpperCase()}`;
        } catch {
            document.getElementById('quoteBox').textContent = "СОВЕТ ДНЯ: ИДИ ДО КОНЦА.";
        }
    },

    // ВКЛАДКИ (ПЕРЕКЛЮЧЕНИЕ ЭКРАНОВ)
    bindTabs() {
        const tabs = document.querySelectorAll('.tab-btn');
        const views = document.querySelectorAll('.view-section');

        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                tabs.forEach(t => {
                    t.classList.remove('tab-active', 'neo-border', 'border-b-0');
                    t.classList.add('tab-inactive', 'neo-border', 'border-b-0');
                });
                e.target.classList.add('tab-active');
                e.target.classList.remove('tab-inactive');

                views.forEach(v => v.classList.add('hidden'));
                document.getElementById(e.target.dataset.target).classList.remove('hidden');
            });
        });
    },

    // ПЕРЕТАСКИВАНИЕ (DRAG & DROP ФИШЕК)
    bindDragDrop() {
        const chips = document.querySelectorAll('.chip');
        const dropZone = document.getElementById('dropZone');
        const clearBtn = document.getElementById('clearBetBtn');

        chips.forEach(chip => {
            chip.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('val', chip.dataset.value);
            });
        });

        dropZone.addEventListener('dragover', e => {
            e.preventDefault();
            dropZone.classList.add('dropzone-active');
        });

        dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dropzone-active'));

        dropZone.addEventListener('drop', e => {
            e.preventDefault();
            dropZone.classList.remove('dropzone-active');

            const val = parseInt(e.dataTransfer.getData('val'));
            if (val) {
                if (AppState.currentBet + val > AppState.balance) {
                    UI.showMessage('НЕДОСТАТОЧНО СРЕДСТВ ДЛЯ УВЕЛИЧЕНИЯ СТАВКИ!', 'error');
                    return;
                }
                AppState.currentBet += val;
                UI.updateCounters();
                UI.addChipToTable(val); // Добавляем фишку на стол визуально
                AudioSystem.playChip(); // Звук фишки
                UI.hideMessage();
            }
        });

        clearBtn.addEventListener('click', () => {
            AppState.currentBet = 0;
            UI.updateCounters();
            UI.clearTableChips(); // Убираем фишки со стола
            UI.hideMessage();
        });
    },

    // ИГРОВАЯ ЛОГИКА (ВРАЩЕНИЕ И АВТОИГРА)
    isSpinning: false,
    isAutoSpinning: false,

    bindGame() {
        UI.spinBtn.addEventListener('click', () => {
            if (!this.isSpinning) this.performSpin();
        });

        UI.autoSpinBtn.addEventListener('click', () => {
            this.isAutoSpinning = !this.isAutoSpinning;
            
            if (this.isAutoSpinning) {
                UI.autoSpinStatusIcon.classList.add('fa-spin', 'text-green-400', 'text-glow');
            } else {
                UI.autoSpinStatusIcon.classList.remove('fa-spin', 'text-green-400', 'text-glow');
            }
            
            if (this.isAutoSpinning && !this.isSpinning) {
                this.performSpin();
            }
        });
    },

    async performSpin() {
        this.isSpinning = true;
        UI.hideMessage();

        // Валидация ставки перед запуском
        if (AppState.currentBet === 0) {
            UI.showMessage('СНАЧАЛА ЗАБРОСЬ ФИШКИ В ЗОНУ СТАВКИ!', 'error');
            this.stopAutoSpin();
            this.isSpinning = false;
            return;
        }
        if (AppState.currentBet > AppState.balance) {
            UI.showMessage('БАЛАНС НИЖЕ ТВОЕЙ СТАВКИ! УМЕНЬШИ ЕЁ.', 'error');
            this.stopAutoSpin();
            this.isSpinning = false;
            return;
        }

        // Списываем деньги, блокируем кнопку
        AppState.balance -= AppState.currentBet;
        UI.updateCounters();
        UI.spinBtn.disabled = true;
        UI.spinBtn.textContent = 'КРУТИМ...';

        // Генерируем результаты заранее
        const resultSymbols = [
            AppState.symbols[Math.floor(Math.random() * AppState.symbols.length)],
            AppState.symbols[Math.floor(Math.random() * AppState.symbols.length)],
            AppState.symbols[Math.floor(Math.random() * AppState.symbols.length)]
        ];

        // Ждем окончания анимации
        await UI.animateReels(resultSymbols);

        // Оцениваем результат
        this.evaluateResult(resultSymbols);

        UI.spinBtn.disabled = false;
        UI.spinBtn.textContent = 'КРУТИТЬ';
        this.isSpinning = false;

        if (this.isAutoSpinning) {
            setTimeout(() => {
                if (this.isAutoSpinning && !this.isSpinning) {
                    this.performSpin();
                }
            }, 1500); // Пауза полторы секунды между спинами
        }
    },

    stopAutoSpin() {
        this.isAutoSpinning = false;
        UI.autoSpinStatusIcon.classList.remove('fa-spin', 'text-green-400', 'text-glow');
    },

    evaluateResult(symbols) {
        let multiplier = 0;

        // Проверка на джекпот (3 одинаковых) или малый выигрыш (2 одинаковых)
        if (symbols[0] === symbols[1] && symbols[1] === symbols[2]) {
            multiplier = 10;
        } else if (symbols[0] === symbols[1] || symbols[1] === symbols[2] || symbols[0] === symbols[2]) {
            multiplier = 2;
        }

        const payout = AppState.currentBet * multiplier;
        const isWin = payout > 0;

        if (isWin) {
            AudioSystem.playWin();
            AppState.balance += payout;
            UI.showMessage(`ДЖЕКПОТ! +$${payout}`, 'win');
            
            // МЕГА АНИМАЦИЯ ПОБЕДЫ (каскад взрывов конфетти)
            const goldColors = ['#D4AF37', '#FFDF73', '#FFFFFF', '#8C6216'];
            
            // Центральный взрыв
            confetti({ particleCount: 200, spread: 100, origin: { y: 0.5 }, colors: goldColors, startVelocity: 45, scalar: 1.2 });
            
            // Залпы из боковых пушек через небольшую паузу
            setTimeout(() => {
                confetti({ particleCount: 150, angle: 60, spread: 80, origin: { x: 0, y: 0.8 }, colors: goldColors, startVelocity: 60 });
                confetti({ particleCount: 150, angle: 120, spread: 80, origin: { x: 1, y: 0.8 }, colors: goldColors, startVelocity: 60 });
            }, 300);

            // Финальный взрыв
            setTimeout(() => {
                confetti({ particleCount: 300, spread: 160, origin: { y: 0.4 }, colors: goldColors, startVelocity: 70, decay: 0.9, scalar: 1.5 });
            }, 800);
        } else {
            AudioSystem.playLose();
            UI.showMessage(`ПРОИГРЫШ.`, 'info');
        }

        // ВАЖНО: Мы не сбрасываем AppState.currentBet = 0. Ставка сохраняется!
        UI.updateCounters();

        // Запись в историю
        AppState.addHistoryItem({
            id: Date.now().toString(),
            timestamp: Date.now(),
            amount: AppState.currentBet,
            symbols: symbols,
            status: isWin ? 'win' : 'lose',
            payout: payout
        });

        // Обновляем таблицу истории в фоне
        this.updateHistoryTable();
    },

    // ИСТОРИЯ И ФИЛЬТРАЦИЯ
    bindHistory() {
        const search = document.getElementById('searchInput');
        const filter = document.getElementById('filterSelect');
        const sort = document.getElementById('sortSelect');

        const onChange = () => this.updateHistoryTable();
        search.addEventListener('input', onChange);
        filter.addEventListener('change', onChange);
        sort.addEventListener('change', onChange);

        UI.tableBody.addEventListener('click', e => {
            if (e.target.classList.contains('delete-btn')) {
                AppState.removeHistoryItem(e.target.dataset.id);
                this.updateHistoryTable();
            }
        });
    },

    updateHistoryTable() {
        const s = document.getElementById('searchInput').value;
        const f = document.getElementById('filterSelect').value;
        const o = document.getElementById('sortSelect').value;

        UI.renderHistory(AppState.getProcessedHistory(s, f, o));
    },

    // МОДАЛЬНОЕ ОКНО И ВАЛИДАЦИЯ ДЕПОЗИТА
    bindModal() {
        const modal = document.getElementById('depositModal');
        const form = document.getElementById('depositForm');
        const input = document.getElementById('depositInput');
        const err = document.getElementById('depositError');

        document.getElementById('depositBtn').addEventListener('click', () => {
            modal.classList.remove('hidden');
            input.focus();
        });

        document.getElementById('closeModalBtn').addEventListener('click', () => {
            modal.classList.add('hidden');
            form.reset();
            err.classList.add('hidden');
        });

        form.addEventListener('submit', e => {
            e.preventDefault();
            err.classList.add('hidden');

            const val = parseFloat(input.value);

            // Строгая валидация (проверка на NaN и отрицательные числа)
            if (isNaN(val) || val <= 0) {
                err.classList.remove('hidden');
                return;
            }

            AppState.balance += val;
            UI.updateCounters();
            modal.classList.add('hidden');
            form.reset();
            UI.showMessage(`СЧЕТ ПОПОЛНЕН НА $${val}`, 'win');
        });
    }
};
