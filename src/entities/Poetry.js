/**
 * Filename: Poetry.js
 * Filepath: /src/entities/Poetry.js
 * 
 * A projectile of pure Vogon poetry, the third worst in the universe.
 * These concentrated forms of literary abomination can cause physical pain,
 * existential dread, and in extreme cases, a compulsion to throw oneself
 * out of the nearest airlock. Thankfully, in digital form, the effects are
 * somewhat attenuated.
 */

import { GameConfig } from '../config/GameConfig.js';

export default class Poetry extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, directionX, directionY, speed) {
        super(scene, x, y, 'poetry');
        
        // Add this object to the scene
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Poetry properties
        this.damage = GameConfig.VOGON_DAMAGE;
        this.lifespan = 3000; // Poetry exists for 3 seconds before disappearing
        this.speed = speed || GameConfig.POETRY_SPEED;
        
        // Set velocity based on direction and speed
        this.setVelocity(directionX * this.speed, directionY * this.speed);
        
        // Rotate the poetry to face its movement direction
        this.rotation = Math.atan2(directionY, directionX);
        
        // Make the poetry a bit smaller than its default size
        this.setScale(0.7);
        
        // Set up physics body
        this.body.setSize(20, 20);
        this.body.setOffset(6, 6);
        
        // Set the poetry to rotate slowly as it flies
        this.scene.tweens.add({
            targets: this,
            angle: '+=360',
            duration: 2000,
            repeat: -1,
            ease: 'Linear'
        });
        
        // Add pulsing effect for extra menace
        this.scene.tweens.add({
            targets: this,
            alpha: { from: 0.6, to: 1 },
            scale: { from: 0.6, to: 0.8 },
            duration: 500,
            yoyo: true,
            repeat: -1
        });
        
        // Add the poetry to the scene's update list
        this.setupUpdateEvent();
        
        // Schedule the poetry's destruction after its lifespan ends
        this.scene.time.delayedCall(this.lifespan, () => {
            this.destroy();
        });
        
        console.log(`Poetry projectile created at (${x}, ${y}). The universe weeps.`);
    }
    
    /**
     * Set up the update event for this poetry projectile.
     * Poetry, like bureaucracy, must be constantly maintained.
     */
    setupUpdateEvent() {
        // Create a reference to the bound update method
        this.updateCallback = this.update.bind(this);
        
        // Add the poetry to the scene's update list
        this.scene.events.on('update', this.updateCallback);
        
        // When the poetry is destroyed, remove it from the update list
        this.once('destroy', () => {
            this.scene.events.off('update', this.updateCallback);
        });
    }
    
    /**
     * Update method called every frame.
     * Checks for collision with player and world bounds.
     */
    update() {
        // Check if poetry has exited the world bounds
        if (!this.scene || !this.body) {
            return; // Scene or body may be null if already destroyed
        }
        
        if (this.x < 0 || this.x > this.scene.physics.world.bounds.width ||
            this.y < 0 || this.y > this.scene.physics.world.bounds.height) {
            this.destroy();
            return;
        }
        
        // Check for collision with player (if not already handled by the physics system)
        // This is a backup for cases where the collision callback might not be set up
        const player = this.scene.player;
        if (player && !player.isDead && !player.isInvulnerable) {
            if (Phaser.Geom.Intersects.RectangleToRectangle(
                this.getBounds(), player.getBounds())) {
                this.hitPlayer(player);
            }
        }
    }
    
    /**
     * Handle collision with the player.
     * This usually results in pain, suffering, and a temporary flash of red.
     */
    hitPlayer(player) {
        // Deal damage to the player
        player.takeDamage(this.damage);
        
        // Create a visual effect at the point of impact
        this.scene.add.particles(this.x, this.y, 'poetry', {
            speed: { min: 50, max: 150 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.4, end: 0 },
            blendMode: 'ADD',
            lifespan: 400,
            gravityY: 300
        }).explode(10);
        
        // Display a random awful poetry line
        this.displayPoetryLine();
        
        // Destroy the poetry projectile
        this.destroy();
    }
    
    /**
     * Displays a random line of Vogon poetry when the projectile hits.
     * These are all original and bear no resemblance to actual Douglas Adams lines,
     * because copyright lawyers are even scarier than Vogon poetry.
     */
    displayPoetryLine() {
        const poetryLines = [
            "Oh fetid grobblings of a putrid sun!",
            "Moist is the moonlight on decaying blurgs",
            "My love is like a festering bureaucratic form",
            "Ode to a small lump of green putty I found in my armpit one midsummer morning",
            "The plurdled gabbleblotchits on a lurgid bee",
            "As the Ravenous Bugblatter Beast of Traal once said to me...",
            "Oh the rancid pustules of my seething bowels"
        ];
        
        // Pick a random line
        const line = poetryLines[Math.floor(Math.random() * poetryLines.length)];
        
        // Create a text object at the player's position
        const text = this.scene.add.text(
            this.scene.player.x,
            this.scene.player.y - 50,
            line,
            {
                fontSize: '16px',
                fontFamily: 'Arial',
                color: '#ff00ff',
                stroke: '#000000',
                strokeThickness: 4,
                align: 'center'
            }
        );
        text.setOrigin(0.5);
        
        // Add animation to make the text float up and fade out
        this.scene.tweens.add({
            targets: text,
            y: text.y - 100,
            alpha: 0,
            duration: 2000,
            ease: 'Power2',
            onComplete: () => {
                text.destroy();
            }
        });
    }
    
    /**
     * Static method to create a burst of poetry in multiple directions.
     * For when a single line of poetry just isn't torturous enough.
     */
    static createBurst(scene, x, y, count = 8) {
        const poetry = [];
        const angleStep = (Math.PI * 2) / count;
        
        for (let i = 0; i < count; i++) {
            const angle = i * angleStep;
            const directionX = Math.cos(angle);
            const directionY = Math.sin(angle);
            
            poetry.push(new Poetry(
                scene,
                x,
                y,
                directionX,
                directionY,
                GameConfig.POETRY_SPEED * 0.8 // Slightly slower for bursts
            ));
        }
        
        return poetry;
    }
}