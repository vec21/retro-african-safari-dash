class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    init(data) {
        this.score = data.score || 0;
    }

    create() {
        // Background
        this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000).setOrigin(0).setAlpha(0.8);
        
        // Game over text
        this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 3,
            'GAME OVER',
            {
                fontFamily: 'monospace',
                fontSize: '64px',
                fontStyle: 'bold',
                color: '#ff0000',
                align: 'center',
                stroke: '#000000',
                strokeThickness: 6
            }
        ).setOrigin(0.5);
        
        // Score text
        this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            'YOUR SCORE: ' + this.score,
            {
                fontFamily: 'monospace',
                fontSize: '32px',
                color: '#ffffff',
                align: 'center'
            }
        ).setOrigin(0.5);
        
        // Create input for player name
        this.createNameInput();
        
        // Restart button
        const restartButton = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 + 200,
            'PLAY AGAIN',
            {
                fontFamily: 'monospace',
                fontSize: '24px',
                color: '#ffffff',
                backgroundColor: '#8BC34A',
                padding: {
                    left: 15,
                    right: 15,
                    top: 10,
                    bottom: 10
                }
            }
        ).setOrigin(0.5);
        
        // Make the button interactive
        restartButton.setInteractive({ useHandCursor: true });
        
        // Button hover effect
        restartButton.on('pointerover', () => {
            restartButton.setBackgroundColor('#9CCC65');
        });
        
        restartButton.on('pointerout', () => {
            restartButton.setBackgroundColor('#8BC34A');
        });
        
        // Restart the game when button is clicked
        restartButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
        
        // Add keyboard input to restart game
        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('GameScene');
        });
        
        // Add keyboard input to restart game with Enter key
        this.input.keyboard.once('keydown-ENTER', () => {
            this.submitScore();
        });
    }

    createNameInput() {
        // Instructions
        this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 + 60,
            'Enter your name:',
            {
                fontFamily: 'monospace',
                fontSize: '18px',
                color: '#ffffff'
            }
        ).setOrigin(0.5);
        
        // For testing, we'll use a text object instead of DOM element
        this.playerName = 'Player' + Math.floor(Math.random() * 1000);
        
        this.nameText = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 + 90,
            this.playerName,
            {
                fontFamily: 'monospace',
                fontSize: '20px',
                color: '#ffffff',
                backgroundColor: '#333333',
                padding: {
                    left: 10,
                    right: 10,
                    top: 5,
                    bottom: 5
                }
            }
        ).setOrigin(0.5);
        
        // Submit button
        const submitButton = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 + 140,
            'SUBMIT SCORE',
            {
                fontFamily: 'monospace',
                fontSize: '20px',
                color: '#ffffff',
                backgroundColor: '#2196F3',
                padding: {
                    left: 15,
                    right: 15,
                    top: 10,
                    bottom: 10
                }
            }
        ).setOrigin(0.5);
        
        // Make the button interactive
        submitButton.setInteractive({ useHandCursor: true });
        
        // Button hover effect
        submitButton.on('pointerover', () => {
            submitButton.setBackgroundColor('#42A5F5');
        });
        
        submitButton.on('pointerout', () => {
            submitButton.setBackgroundColor('#2196F3');
        });
        
        // Submit score when button is clicked
        submitButton.on('pointerdown', () => {
            this.submitScore();
        });
    }

    submitScore() {
        // Get the player name
        const playerName = this.playerName;
        
        // Submit score to leaderboard
        this.submitScoreToLeaderboard(playerName, this.score);
        
        // Show leaderboard
        this.showLeaderboard();
    }
    
    submitScoreToLeaderboard(playerName, score) {
        console.log(`Submitting score: ${playerName} - ${score}`);
        
        // Store in local storage for persistence
        const leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
        leaderboard.push({ playerName, score });
        
        // Sort by score (highest first)
        leaderboard.sort((a, b) => b.score - a.score);
        
        // Keep only top 10
        const topScores = leaderboard.slice(0, 10);
        localStorage.setItem('leaderboard', JSON.stringify(topScores));
        
        return true;
    }
    
    showLeaderboard() {
        // Get leaderboard data
        const leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
        
        // If empty, add some default scores
        if (leaderboard.length === 0) {
            leaderboard.push(
                { playerName: 'Player1', score: 100 },
                { playerName: 'Player2', score: 80 },
                { playerName: 'Player3', score: 60 },
                { playerName: 'Player4', score: 40 },
                { playerName: 'Player5', score: 20 }
            );
        }
        
        // Clear existing elements
        this.children.each(child => {
            child.destroy();
        });
        
        // Background
        this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000).setOrigin(0).setAlpha(0.9);
        
        // Leaderboard title
        this.add.text(
            this.cameras.main.width / 2,
            50,
            'LEADERBOARD',
            {
                fontFamily: 'monospace',
                fontSize: '48px',
                color: '#ffffff',
                align: 'center',
                stroke: '#000000',
                strokeThickness: 4
            }
        ).setOrigin(0.5);
        
        // Create leaderboard entries
        const startY = 150;
        const spacing = 40;
        
        // Header
        this.add.text(
            this.cameras.main.width / 2 - 200,
            startY,
            'RANK',
            {
                fontFamily: 'monospace',
                fontSize: '24px',
                color: '#ffff00'
            }
        );
        
        this.add.text(
            this.cameras.main.width / 2 - 100,
            startY,
            'PLAYER',
            {
                fontFamily: 'monospace',
                fontSize: '24px',
                color: '#ffff00'
            }
        );
        
        this.add.text(
            this.cameras.main.width / 2 + 100,
            startY,
            'SCORE',
            {
                fontFamily: 'monospace',
                fontSize: '24px',
                color: '#ffff00'
            }
        );
        
        // Entries
        leaderboard.forEach((entry, index) => {
            // Highlight the current player's score
            const isCurrentPlayer = entry.playerName === this.playerName && entry.score === this.score;
            const color = isCurrentPlayer ? '#00ff00' : '#ffffff';
            
            this.add.text(
                this.cameras.main.width / 2 - 200,
                startY + (index + 1) * spacing,
                `${index + 1}`,
                {
                    fontFamily: 'monospace',
                    fontSize: '20px',
                    color: color
                }
            );
            
            this.add.text(
                this.cameras.main.width / 2 - 100,
                startY + (index + 1) * spacing,
                entry.playerName,
                {
                    fontFamily: 'monospace',
                    fontSize: '20px',
                    color: color
                }
            );
            
            this.add.text(
                this.cameras.main.width / 2 + 100,
                startY + (index + 1) * spacing,
                entry.score.toString(),
                {
                    fontFamily: 'monospace',
                    fontSize: '20px',
                    color: color
                }
            );
        });
        
        // Play again button
        const playAgainButton = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height - 100,
            'PLAY AGAIN',
            {
                fontFamily: 'monospace',
                fontSize: '24px',
                color: '#ffffff',
                backgroundColor: '#8BC34A',
                padding: {
                    left: 15,
                    right: 15,
                    top: 10,
                    bottom: 10
                }
            }
        ).setOrigin(0.5);
        
        // Make the button interactive
        playAgainButton.setInteractive({ useHandCursor: true });
        
        // Button hover effect
        playAgainButton.on('pointerover', () => {
            playAgainButton.setBackgroundColor('#9CCC65');
        });
        
        playAgainButton.on('pointerout', () => {
            playAgainButton.setBackgroundColor('#8BC34A');
        });
        
        // Restart the game when button is clicked
        playAgainButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
        
        // Add keyboard input to restart game
        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('GameScene');
        });
        
        // Add keyboard input to restart game with Enter key
        this.input.keyboard.once('keydown-ENTER', () => {
            this.scene.start('GameScene');
        });
    }
}
