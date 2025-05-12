// Initialize the Phaser game
document.addEventListener('DOMContentLoaded', function() {
    // Define game configuration after all scenes are loaded
    config = {
        type: Phaser.AUTO,
        parent: 'game',
        width: 800,
        height: 600,
        pixelArt: true,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 0 },
                debug: false
            }
        },
        scene: [
            BootScene,
            PreloadScene,
            TitleScene,
            GameScene,
            GameOverScene
        ]
    };
    
    // Initialize the game
    const game = new Phaser.Game(config);
    
    // Global game variables
    window.gameConfig = {
        apiUrl: '', // Will be set after deployment
        debug: true
    };
    
    // For testing, we'll use localStorage
    if (!localStorage.getItem('leaderboard')) {
        // Initialize with some default scores
        const defaultScores = [
            { playerName: 'Player1', score: 100 },
            { playerName: 'Player2', score: 80 },
            { playerName: 'Player3', score: 60 },
            { playerName: 'Player4', score: 40 },
            { playerName: 'Player5', score: 20 }
        ];
        localStorage.setItem('leaderboard', JSON.stringify(defaultScores));
    }
    
    console.log('Game initialized!');
});
