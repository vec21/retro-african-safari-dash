class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }

    preload() {
        // Display loading progress
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Loading bar
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);
        
        // Loading text
        const loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading...',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);
        
        // Percent text
        const percentText = this.make.text({
            x: width / 2,
            y: height / 2,
            text: '0%',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        });
        percentText.setOrigin(0.5, 0.5);
        
        // Update progress bar as assets are loaded
        this.load.on('progress', function (value) {
            percentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
        });
        
        // Clean up when loading complete
        this.load.on('complete', function () {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
        });
        
        // We're using placeholder images created in BootScene
        // No need to load additional assets for testing
    }

    create() {
        // Create animations
        this.createAnimations();
        
        // Start the title scene
        this.scene.start('TitleScene');
    }

    createAnimations() {
        // Player animations
        this.anims.create({
            key: 'player-idle',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
        });
        
        this.anims.create({
            key: 'player-run',
            frames: this.anims.generateFrameNumbers('player', { start: 4, end: 11 }),
            frameRate: 12,
            repeat: -1
        });
        
        // Artifact animations
        this.anims.create({
            key: 'artifact-idle',
            frames: this.anims.generateFrameNumbers('artifacts', { start: 0, end: 7 }),
            frameRate: 8,
            repeat: -1
        });
        
        // Obstacle animations
        this.anims.create({
            key: 'obstacle-idle',
            frames: this.anims.generateFrameNumbers('obstacles', { start: 0, end: 3 }),
            frameRate: 6,
            repeat: -1
        });
    }
}
