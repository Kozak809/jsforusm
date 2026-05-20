export const AudioSystem = {
    ctx: null,
    spinInterval: null,

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    },

    playTone(freq, type, duration, vol = 0.1, slideFreq = null) {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        if (slideFreq) {
            osc.frequency.exponentialRampToValueAtTime(slideFreq, this.ctx.currentTime + duration);
        }
        
        gain.gain.setValueAtTime(vol, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    },

    playChip() {
        this.init();
        // Clack sound (two very short tones)
        this.playTone(2000, 'triangle', 0.05, 0.1);
        setTimeout(() => this.playTone(1500, 'square', 0.05, 0.1), 30);
    },

    playClick() {
        this.init();
        // Short tick for reels spinning
        this.playTone(800, 'square', 0.02, 0.02);
    },

    playReelStop() {
        this.init();
        // Heavy thud when reel stops
        this.playTone(150, 'sine', 0.15, 0.3, 50);
    },

    startSpinningSound() {
        this.init();
        if (this.spinInterval) clearInterval(this.spinInterval);
        this.spinInterval = setInterval(() => this.playClick(), 80);
    },

    stopSpinningSound() {
        if (this.spinInterval) {
            clearInterval(this.spinInterval);
            this.spinInterval = null;
        }
    },

    playWin() {
        this.init();
        // Major arpeggio
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C E G C
        notes.forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, 'sine', 0.6, 0.2), i * 150);
        });
        
        // Add some sparkle
        for(let i=0; i<10; i++) {
            setTimeout(() => this.playTone(Math.random() * 1000 + 1000, 'triangle', 0.1, 0.05), i * 100);
        }
    },

    playLose() {
        this.init();
        // Descending low tones
        this.playTone(300, 'sawtooth', 0.3, 0.1, 200);
        setTimeout(() => this.playTone(200, 'sawtooth', 0.4, 0.1, 100), 300);
    }
};
