/**
 * Filename: GameScene.js
 * Filepath: /src/scenes/GameScene.js
 * 
 * The main gameplay scene, where the vast majority of the action, excitement,
 * and existential dread takes place. Not unlike life itself, it starts with
 * a bang, involves a lot of running and jumping, collecting seemingly arbitrary
 * items, and avoiding entities that wish you harm.
 * 
 * SIMPLIFIED VERSION: Uses basic shapes instead of sprite images
 */

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        
        // Game constants
        this.PLAYER_SPEED = 200;
        this.PLAYER_JUMP = 400;
        this.GRAVITY = 980;
        this.ANSWER_TO_EVERYTHING = 42;
        this.TOWEL_VALUE = 5;
        
        // Track game state
        this.score = 0;
        this.health = 100;
        this.towels = 0;
        
        console.log("GameScene initialized. Prepare for improbability.");
    }
    
    create() {
        // Create a starry background
        this.createStarfield();
        
        // Create ground platform
        this.ground = this.add.rectangle(400, 580, 800, 40, 0x42f5e3);
        this.physics.add.existing(this.ground, true); // true = static body
        
        // Add some floating platforms
        this.platforms = this.physics.add.staticGroup();
        this.createPlatforms();
        
        // Create the player
        this.createPlayer();
        
        // Create enemies
        this.createEnemies();
        
        // Create collectibles (towels)
        this.createCollectibles();
        
        // Create the score text
        this.scoreText = this.add.text(20, 20, 'Score: 0', { 
            fontSize: '24px', 
            fill: '#ffffff' 
        });
        
        // Create health bar
        this.createHealthBar();
        
        // Create towel counter
        this.towelText = this.add.text(600, 20, 'Towels: 0', { 
            fontSize: '24px', 
            fill: '#ffffff' 
        });
        
        // Setup collisions
        this.physics.add.collider(this.player, this.ground);
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.enemies, this.ground);
        this.physics.add.collider(this.enemies, this.platforms);
        
        // Setup overlaps
        this.physics.add.overlap(this.player, this.towels, this.collectTowel, null, this);
        this.physics.add.overlap(this.player, this.enemies, this.hitEnemy, null, this);
        
        // Setup controls
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // Don't Panic text
        this.dontPanicText = this.add.text(400, 300, 'DON\'T PANIC', { 
            fontSize: '64px', 
            fill: '#ff0000',
            fontStyle: 'bold'
        });
        this.dontPanicText.setOrigin(0.5);
        this.dontPanicText.setAlpha(0);
        
        console.log("GameScene created. Don't Panic!");
    }
    
    createStarfield() {
        // Add a black background
        this.add.rectangle(400, 300, 800, 600, 0x000000);
        
        // Add stars
        for (let i = 0; i < 100; i++) {
            const x = Phaser.Math.Between(0, 800);
            const y = Phaser.Math.Between(0, 600);
            const size = Phaser.Math.Between(1, 3);
            const star = this.add.circle(x, y, size, 0xffffff);
            
            // Add a twinkling animation
            this.tweens.add({
                targets: star,
                alpha: { from: 1, to: 0.2 },
                duration: Phaser.Math.Between(1000, 5000),
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
    }
    
    createPlatforms() {
        // Create several floating platforms
        const platformPositions = [
            { x: 150, y: 500, width: 200, height: 20 },
            { x: 650, y: 500, width: 200, height: 20 },
            { x: 400, y: 450, width: 100, height: 20 },
            { x: 200, y: 350, width: 150, height: 20 },
            { x: 600, y: 350, width: 150, height: 20 },
            { x: 400, y: 250, width: 120, height: 20 }
        ];
        
        platformPositions.forEach(platform => {
            const p = this.add.rectangle(platform.x, platform.y, platform.width, platform.height, 0x3a86ff);
            this.physics.add.existing(p, true);
            this.platforms.add(p);
        });
    }
    
    createPlayer() {
        // Create the player (Arthur Dent) - a simple rectangle with a bathrobe
        this.player = this.add.rectangle(100, 450, 30, 50, 0xff6b6b);
        this.physics.add.existing(this.player);
        
        // Add a bathrobe (a smaller rectangle)
        const bathrobe = this.add.rectangle(0, 0, 36, 56, 0xffffff);
        bathrobe.setAlpha(0.3);
        
        // Group the player and bathrobe
        this.playerContainer = this.add.container(100, 450, [this.player, bathrobe]);
        
        // Set up physics
        this.player.body.setBounce(0.2);
        this.player.body.setCollideWorldBounds(true);
        
        // Track if the player is invulnerable (after taking damage)
        this.playerInvulnerable = false;
    }
    
    createEnemies() {
        // Create a group for enemies
        this.enemies = this.physics.add.group();
        
        // Create Vogons (green rectangles)
        const vogonPositions = [
            { x: 300, y: 300 },
            { x: 500, y: 300 },
            { x: 200, y: 100 },
            { x: 600, y: 100 }
        ];
        
        vogonPositions.forEach(pos => {
            const vogon = this.add.rectangle(pos.x, pos.y, 40, 60, 0x4daa57);
            this.physics.add.existing(vogon);
            vogon.body.setBounce(0.2);
            vogon.body.setCollideWorldBounds(true);
            
            // Random movement
            vogon.direction = Math.random() > 0.5 ? 1 : -1;
            vogon.speed = Phaser.Math.Between(50, 100);
            
            this.enemies.add(vogon);
        });
    }
    
    createCollectibles() {
        // Create towels (blue squares)
        this.towels = this.physics.add.group();
        
        for (let i = 0; i < 10; i++) {
            const x = Phaser.Math.Between(50, 750);
            const y = Phaser.Math.Between(50, 500);
            
            const towel = this.add.rectangle(x, y, 20, 20, 0x4cc9f0);
            this.physics.add.existing(towel, true); // Static body
            
            // Add a floating animation
            this.tweens.add({
                targets: towel,
                y: towel.y - 10,
                duration: 1500,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
            
            this.towels.add(towel);
        }
    }
    
    createHealthBar() {
        // Health bar background
        this.add.rectangle(400, 20, 150, 20, 0x000000).setOrigin(0.5, 0);
        
        // Health bar
        this.healthBar = this.add.rectangle(400, 20, 150, 20, 0xff0000).setOrigin(0.5, 0);
    }
    
    update() {
        // Handle player movement
        this.handlePlayerMovement();
        
        // Update enemy movement
        this.updateEnemies();
        
        // Check if all towels collected
        if (this.towels.countActive() === 0) {
            this.showVictoryMessage();
        }
    }
    
    handlePlayerMovement() {
        if (this.cursors.left.isDown) {
            this.player.body.setVelocityX(-this.PLAYER_SPEED);
            this.playerContainer.x = this.player.x;
            this.playerContainer.y = this.player.y;
        } else if (this.cursors.right.isDown) {
            this.player.body.setVelocityX(this.PLAYER_SPEED);
            this.playerContainer.x = this.player.x;
            this.playerContainer.y = this.player.y;
        } else {
            this.player.body.setVelocityX(0);
            this.playerContainer.x = this.player.x;
            this.playerContainer.y = this.player.y;
        }
        
        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.body.setVelocityY(-this.PLAYER_JUMP);
        }
    }
    
    updateEnemies() {
        this.enemies.getChildren().forEach(enemy => {
            // Basic patrolling AI
            enemy.body.setVelocityX(enemy.speed * enemy.direction);
            
            // Change direction occasionally or when hitting a boundary
            if (enemy.body.blocked.left || enemy.body.blocked.right || Phaser.Math.Between(0, 100) < 1) {
                enemy.direction *= -1;
            }
            
            // Occasionally shoot poetry
            if (Phaser.Math.Between(0, 200) < 1) {
                this.shootPoetry(enemy);
            }
        });
    }
    
    shootPoetry(enemy) {
        // Create poetry projectile (purple circle)
        const poetry = this.add.circle(enemy.x, enemy.y, 10, 0x9b5de5);
        this.physics.add.existing(poetry);
        
        // Calculate direction to player
        const dirX = this.player.x - enemy.x;
        const dirY = this.player.y - enemy.y;
        
        // Normalize and set velocity
        const length = Math.sqrt(dirX * dirX + dirY * dirY);
        poetry.body.setVelocity(
            (dirX / length) * 150,
            (dirY / length) * 150
        );
        
        // Add collision with player
        this.physics.add.overlap(this.player, poetry, () => {
            poetry.destroy();
            this.damagePlayer(10);
        });
        
        // Destroy after 3 seconds
        this.time.delayedCall(3000, () => {
            if (poetry.active) {
                poetry.destroy();
            }
        });
    }
    
    collectTowel(player, towel) {
        towel.destroy();
        
        this.towels++;
        this.score += this.TOWEL_VALUE;
        
        // Update UI
        this.scoreText.setText('Score: ' + this.score);
        this.towelText.setText('Towels: ' + this.towels);
        
        // Check for 42 points
        if (this.score === this.ANSWER_TO_EVERYTHING) {
            this.trigger42Event();
        }
    }
    
    hitEnemy(player, enemy) {
        if (this.playerInvulnerable) return;
        
        // Damage the player
        this.damagePlayer(20);
        
        // Knock the player back
        const knockbackDirection = player.x < enemy.x ? -1 : 1;
        player.body.setVelocity(knockbackDirection * 200, -200);
    }
    
    damagePlayer(amount) {
        if (this.playerInvulnerable) return;
        
        this.health -= amount;
        this.health = Math.max(0, this.health);
        
        // Update health bar
        this.healthBar.width = (this.health / 100) * 150;
        
        // Flash the player red
        this.player.fillColor = 0xff0000;
        this.playerInvulnerable = true;
        
        // Reset after a short time
        this.time.delayedCall(1000, () => {
            this.player.fillColor = 0xff6b6b;
            this.playerInvulnerable = false;
        });
        
        // Check if player is dead
        if (this.health <= 0) {
            this.gameOver();
        }
    }
    
    trigger42Event() {
        console.log("42 points reached! The Answer to Life, the Universe, and Everything!");
        
        // Show DON'T PANIC text
        this.tweens.add({
            targets: this.dontPanicText,
            alpha: 1,
            scale: { from: 0, to: 1 },
            duration: 1000,
            ease: 'Bounce.Out',
            onComplete: () => {
                // Make it flash
                this.tweens.add({
                    targets: this.dontPanicText,
                    alpha: { from: 1, to: 0.5 },
                    duration: 500,
                    yoyo: true,
                    repeat: 5,
                    onComplete: () => {
                        this.tweens.add({
                            targets: this.dontPanicText,
                            alpha: 0,
                            duration: 1000
                        });
                    }
                });
            }
        });
        
        // Make player temporarily invincible
        this.playerInvulnerable = true;
        this.player.fillColor = 0xffff00;
        
        // Add some particles
        const particles = this.add.particles(0, 0, {
            speed: { min: 100, max: 200 },
            angle: { min: 0, max: 360 },
            scale: { start: 1, end: 0 },
            blendMode: 'ADD',
            lifespan: 2000,
            tint: [0xff0000, 0x00ff00, 0x0000ff, 0xffff00]
        });
        
        particles.startFollow(this.player);
        
        // End the effect after 5 seconds
        this.time.delayedCall(5000, () => {
            this.player.fillColor = 0xff6b6b;
            this.playerInvulnerable = false;
            particles.destroy();
        });
    }
    
    gameOver() {
        // Display Game Over text
        const gameOverText = this.add.text(400, 300, 'GAME OVER', { 
            fontSize: '64px', 
            fill: '#ff0000',
            fontStyle: 'bold'
        });
        gameOverText.setOrigin(0.5);
        
        // Douglas Adams quote
        const quoteText = this.add.text(400, 380, 'So long, and thanks for all the towels!', { 
            fontSize: '24px', 
            fill: '#ffffff'
        });
        quoteText.setOrigin(0.5);
        
        // Restart button
        const restartButton = this.add.rectangle(400, 450, 200, 50, 0x42f5e3);
        const restartText = this.add.text(400, 450, 'Restart', { 
            fontSize: '24px', 
            fill: '#000000'
        });
        restartText.setOrigin(0.5);
        
        restartButton.setInteractive();
        restartButton.on('pointerdown', () => {
            this.scene.restart();
        });
        
        // Stop all movement
        this.player.body.setVelocity(0, 0);
        this.physics.pause();
    }
    
    showVictoryMessage() {
        if (this.victoryShown) return;
        this.victoryShown = true;
        
        // Victory text
        const victoryText = this.add.text(400, 200, 'CONGRATULATIONS!', { 
            fontSize: '48px', 
            fill: '#ffff00',
            fontStyle: 'bold'
        });
        victoryText.setOrigin(0.5);
        
        // Subtitle
        const subtitle = this.add.text(400, 260, 'You collected all the towels in the galaxy!', { 
            fontSize: '24px', 
            fill: '#ffffff'
        });
        subtitle.setOrigin(0.5);
        
        // Score
        const finalScore = this.add.text(400, 320, `Final Score: ${this.score}`, { 
            fontSize: '32px', 
            fill: '#42f5e3'
        });
        finalScore.setOrigin(0.5);
        
        // Douglas Adams quote
        const quoteText = this.add.text(400, 380, 'In the beginning the Universe was created.\nThis has made a lot of people very angry\nand been widely regarded as a bad move.', { 
            fontSize: '18px', 
            fill: '#ffffff',
            align: 'center'
        });
        quoteText.setOrigin(0.5);
        
        // Restart button
        const restartButton = this.add.rectangle(400, 480, 200, 50, 0x42f5e3);
        const restartText = this.add.text(400, 480, 'Play Again', { 
            fontSize: '24px', 
            fill: '#000000'
        });
        restartText.setOrigin(0.5);
        
        restartButton.setInteractive();
        restartButton.on('pointerdown', () => {
            this.scene.restart();
        });
    }
}

export default GameScene;