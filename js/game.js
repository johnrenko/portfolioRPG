// John's Quest - Retro RPG Portfolio Game
class Game {
    constructor() {
        this.currentLevel = 1;
        this.maxLevel = 4;
        this.keys = {};
        this.init();
    }

    init() {
        this.bindEvents();
        this.showLevel(1);
        this.startGameLoop();
    }

    bindEvents() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            this.handleInput(e.key);
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
    }

    handleInput(key) {
        switch(key) {
            case 'Enter':
                if (this.currentLevel === 1) {
                    this.nextLevel();
                }
                break;
            case 'ArrowRight':
                if (this.currentLevel < this.maxLevel) {
                    this.nextLevel();
                }
                break;
            case 'ArrowLeft':
                if (this.currentLevel > 1) {
                    this.previousLevel();
                }
                break;
            case 'Escape':
                this.showLevel(1);
                break;
        }
    }

    nextLevel() {
        if (this.currentLevel < this.maxLevel) {
            this.currentLevel++;
            this.showLevel(this.currentLevel);
            this.playSound('level-change');
        }
    }

    previousLevel() {
        if (this.currentLevel > 1) {
            this.currentLevel--;
            this.showLevel(this.currentLevel);
            this.playSound('level-change');
        }
    }

    showLevel(levelNum) {
        // Hide all levels
        document.querySelectorAll('.level').forEach(level => {
            level.classList.remove('active');
        });

        // Show target level
        const targetLevel = document.getElementById(`level-${levelNum}`);
        if (targetLevel) {
            targetLevel.classList.add('active');
            this.currentLevel = levelNum;
            this.addLevelTransition();
        }
    }

    addLevelTransition() {
        const screen = document.getElementById('screen');
        
        // Add glitch effect during transitions
        screen.style.animation = 'none';
        screen.style.filter = 'hue-rotate(90deg) brightness(1.5)';
        
        setTimeout(() => {
            screen.style.filter = 'hue-rotate(0deg) brightness(1)';
            screen.style.animation = 'screen-shake 0.1s infinite';
        }, 200);
        
        screen.style.opacity = '0';
        setTimeout(() => {
            screen.style.opacity = '1';
        }, 100);
    }

    playSound(type) {
        // Simple 8-bit style sounds using Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        switch(type) {
            case 'level-change':
                oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.1);
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                break;
            case 'select':
                oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
                break;
        }

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    }

    startGameLoop() {
        // Add some ambient animations
        this.addAmbientEffects();
    }

    addAmbientEffects() {
        // Add floating animation to player sprite
        const playerSprite = document.querySelector('.player-sprite');
        if (playerSprite) {
            setInterval(() => {
                if (Math.random() < 0.1) {
                    playerSprite.style.transform = 'translateY(-5px)';
                    setTimeout(() => {
                        playerSprite.style.transform = 'translateY(0)';
                    }, 200);
                }
            }, 3000);
        }

        // Add typing effect to dialog text
        this.addTypingEffect();
    }

    addTypingEffect() {
        const dialogText = document.querySelector('.dialog-text');
        if (dialogText && this.currentLevel === 2) {
            const text = dialogText.innerHTML;
            dialogText.innerHTML = '';
            let i = 0;
            
            const typeWriter = () => {
                if (i < text.length) {
                    dialogText.innerHTML = text.slice(0, i + 1);
                    i++;
                    setTimeout(typeWriter, 30);
                }
            };
            
            // Start typing effect when level 2 is shown
            setTimeout(typeWriter, 500);
        }
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
    
    // Add some retro console messages
    console.log(`
    ╔═══════════════════════════════════════╗
    ║           JOHN'S QUEST v1.0           ║
    ║         A PRODUCT ADVENTURE           ║
    ╚═══════════════════════════════════════╝
    
    > Loading character data...
    > Initializing game systems...
    > Ready to explore!
    `);
});

// Add keyboard shortcuts info
document.addEventListener('keydown', (e) => {
    if (e.key === 'h' || e.key === 'H') {
        alert('CONTROLS:\n\n← → Navigate levels\nEnter: Interact/Start\nEsc: Return to title\nH: Show this help');
    }
});
