class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Create temporary placeholder images for testing
        this.createPlaceholderImages();
    }

    create() {
        this.scene.start('PreloadScene');
    }
    
    createPlaceholderImages() {
        // Create a canvas for player sprite
        this.createColoredSpritesheet('player', 0x3498db, 32, 32, 12);
        
        // Create a canvas for artifacts
        this.createColoredSpritesheet('artifacts', 0xf1c40f, 32, 32, 8);
        
        // Create a canvas for obstacles
        this.createColoredSpritesheet('obstacles', 0xe74c3c, 32, 32, 4);
        
        // Create a tileset
        this.createTileset();
        
        // Create UI elements
        this.createUIElements();
    }
    
    createColoredSpritesheet(key, color, width, height, frames) {
        // Create a canvas for the spritesheet
        const canvas = document.createElement('canvas');
        canvas.width = width * frames;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        // Draw each frame with slight variations
        for (let i = 0; i < frames; i++) {
            const frameX = i * width;
            
            // Fill with main color
            ctx.fillStyle = this.hexToRGBA(color, 1);
            ctx.fillRect(frameX, 0, width, height);
            
            // Add some details
            ctx.fillStyle = this.hexToRGBA(0xffffff, 0.5);
            ctx.fillRect(frameX + width * 0.25, height * 0.25, width * 0.5, height * 0.5);
            
            // Add animation effect
            const offset = Math.sin(i / frames * Math.PI * 2) * 5;
            ctx.fillStyle = this.hexToRGBA(0xffffff, 0.8);
            ctx.fillRect(frameX + width * 0.4, height * 0.4 + offset, width * 0.2, height * 0.2);
        }
        
        // Convert to base64 and add to cache
        const base64 = canvas.toDataURL('image/png');
        this.textures.addBase64(key, base64);
    }
    
    createTileset() {
        // Create a canvas for the tileset
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        
        // Draw grass tile
        ctx.fillStyle = '#7ccc5e';
        ctx.fillRect(0, 0, 32, 32);
        
        // Add texture to grass
        ctx.fillStyle = '#8fdb6f';
        for (let i = 0; i < 10; i++) {
            const x = Math.random() * 32;
            const y = Math.random() * 32;
            const size = 2 + Math.random() * 4;
            ctx.fillRect(x, y, size, size);
        }
        
        // Draw bush tile
        ctx.fillStyle = '#5eaa44';
        ctx.fillRect(32, 0, 32, 32);
        ctx.fillStyle = '#6ebe52';
        ctx.fillRect(32 + 8, 8, 16, 16);
        
        // Draw rock tile
        ctx.fillStyle = '#8e8e8e';
        ctx.fillRect(64, 0, 32, 32);
        ctx.fillStyle = '#a5a5a5';
        ctx.fillRect(64 + 6, 6, 20, 20);
        
        // Draw water tile
        ctx.fillStyle = '#3498db';
        ctx.fillRect(96, 0, 32, 32);
        ctx.fillStyle = '#5dade2';
        ctx.fillRect(96 + 4, 4, 24, 24);
        
        // Convert to base64 and add to cache
        const base64 = canvas.toDataURL('image/png');
        this.textures.addBase64('tiles', base64);
    }
    
    createUIElements() {
        // Create a canvas for UI elements
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 200;
        const ctx = canvas.getContext('2d');
        
        // Draw title background
        ctx.fillStyle = '#2c3e50';
        ctx.fillRect(0, 0, 400, 100);
        
        // Draw title text
        ctx.fillStyle = '#ecf0f1';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('RETRO AFRICAN SAFARI DASH', 200, 60);
        
        // Draw game over background
        ctx.fillStyle = '#c0392b';
        ctx.fillRect(0, 100, 400, 100);
        
        // Draw game over text
        ctx.fillStyle = '#ecf0f1';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', 200, 160);
        
        // Convert to base64 and add to cache
        const base64 = canvas.toDataURL('image/png');
        this.textures.addBase64('ui', base64);
    }
    
    hexToRGBA(hex, alpha) {
        const r = (hex >> 16) & 0xFF;
        const g = (hex >> 8) & 0xFF;
        const b = hex & 0xFF;
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
}
