/**
 * Filename: Player.js
 * Filepath: /src/entities/Player.js
 * 
 * The digital embodiment of Arthur Dent, a man who started his Thursday
 * by having his house demolished and his planet destroyed, and somehow
 * managed to have the day get progressively worse from there. This class
 * handles all the running, jumping, and generally confused flailing that
 * one might expect from a man perpetually in his bathrobe.
 */

import { GameConfig } from '../config/GameConfig.js';

export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, character = 'arthur') {
        // Call the parent constructor, which is just as confused about its purpose
        // as Arthur is about the destruction of Earth
        super(scene, x, y, character === 'arthur' ? 'player_sheet' : 'ford_sheet');
        
        // Add this object to the scene
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Player properties
        this.health = 100;
        this.towels = 0;
        this.isDead = false;
        this.isInvulnerable = false;
        this.invulnerabilityTime = 1000; // 1 second of invulnerability after taking damage
        this.characterType = character;
        
        // Configure physics body
        this.setCollideWorldBounds(true);
        this.setBounce(0.1);
        this.setSize(24, 40);  // Smaller hitbox than the sprite
        this.setOffset(4, 8);  // Center the hitbox
        
        // Create animations
        this.createAnimations();
        
        // Initialize controls
        this.cursors = scene.input.keyboard.createCursorKeys();
        
        // DON'T PANIC - This just sets up the event listeners
        this.setupEventListeners();
        
        // Start in idle animation
        this.anims.play(`${this.characterType}_idle`, true);
        
        console.log(`Player (${character}) created at (${x}, ${y}) - though he'd probably rather be at home with a nice cup of tea.`);
    }
    
    /**
     * Create all the animations for the player.
     * Much like the bureaucracy of the Vogons, there are far too many of these.
     */
    createAnimations() {
        const characterKey = this.characterType === 'arthur' ? 'player_sheet' : 'ford_sheet';
        
        this.scene.anims.create({
            key: `${this.characterType}_idle`,
            frames: this.scene.anims.generateFrameNumbers(characterKey, { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
        });
        
        this.scene.anims.create({
            key: `${this.characterType}_run`,
            frames: this.scene.anims.generateFrameNumbers(characterKey, { start: 4, end: 11 }),
            frameRate: 12,
            repeat: -1
        });
        
        this.scene.anims.create({
            key: `${this.characterType}_jump`,
            frames: this.scene.anims.generateFrameNumbers(characterKey, { start: 12, end: 15 }),
            frameRate: 10,
            repeat: 0
        });
        
        this.scene.anims.create({
            key: `${this.characterType}_fall`,
            frames: this.scene.anims.generateFrameNumbers(characterKey, { start: 16, end: 19 }),
            frameRate: 10,
            repeat: 0
        });
        
        this.scene.anims.create({
            key: `${this.characterType}_damage`,
            frames: this.scene.anims.generateFrameNumbers(characterKey, { start: 20, end: 23 }),
            frameRate: 12,
            repeat: 0
        });
        
        this.scene.anims.create({
            key: `${this.characterType}_dead`,
            frames: this.scene.anims.generateFrameNumbers(characterKey, { start: 24, end: 29 }),
            frameRate: 8,
            repeat: 0
        });
    }
    
    /**
     * Sets up event listeners.
     * This is the code equivalent of Arthur agreeing to go to the pub with Ford.
     * Seemed harmless at the time, but led to all sorts of complications.
     */
    setupEventListeners() {
        this.scene.events.on('update', this.update, this);
        
        // Add a listener for the special 42 event
        this.scene.events.on('fortyTwoAchieved', this.onFortyTwoAchieved, this);
        
        // When the scene is shut down, remove the update listener to prevent memory leaks
        // (A concept the Vogon Constructor Fleet rarely concerns itself with)
        this.scene.events.once('shutdown', () => {
            this.scene.events.off('update', this.update, this);
            this.scene.events.off('fortyTwoAchieved', this.onFortyTwoAchieved, this);
        });
    }
    
    /**
     * Update method called every frame.
     * Handles movement, jumping, and animation states.
     * Much like life, it's complicated for no good reason.
     */
    update() {
        if (this.isDead) {
            return; // The dead make notoriously poor platformer characters
        }
        
        this.handleMovement();
        this.handleAnimations();
    }
    
    /**
     * Handles player movement based on input.
     * Left and right to move, up to jump.
     * No "down" because Arthur's life is already spiraling downward enough as it is.
     */
    handleMovement() {
        // Handle left/right movement
        if (this.cursors.left.isDown) {
            this.setVelocityX(-GameConfig.PLAYER_SPEED);
            this.setFlipX(true);
        } else if (this.cursors.right.isDown) {
            this.setVelocityX(GameConfig.PLAYER_SPEED);
            this.setFlipX(false);
        } else {
            // Slow down when no direction is pressed, like Arthur's enthusiasm for adventure
            this.setVelocityX(0);
        }
        
        // Handle jumping, but only if on the ground
        if (this.cursors.up.isDown && this.body.onFloor()) {
            this.setVelocityY(-GameConfig.PLAYER_JUMP);
            this.scene.sound.play('jump');
        }
    }
    
    /**
     * Updates the animation based on the player's movement state.
     * Which is to say, it figures out which way Arthur is flailing at any given moment.
     */
    handleAnimations() {
        const { x: velocityX, y: velocityY } = this.body.velocity;
        
        if (this.body.onFloor()) {
            if (velocityX === 0) {
                this.anims.play(`${this.characterType}_idle`, true);
            } else {
                this.anims.play(`${this.characterType}_run`, true);
            }
        } else {
            if (velocityY < 0) {
                this.anims.play(`${this.characterType}_jump`, true);
            } else {
                this.anims.play(`${this.characterType}_fall`, true);
            }
        }
    }
    
    /**
     * Handle taking damage from enemies or their poetry.
     * Much like listening to Vogon poetry, this is not a pleasant experience.
     */
    takeDamage(amount) {
        // If invulnerable, don't take damage
        if (this.isInvulnerable) {
            return;
        }
        
        this.health -= amount;
        this.scene.sound.play('damage');
        
        // Visual feedback
        this.anims.play(`${this.characterType}_damage`);
        this.setTint(0xff0000);  // Red tint
        
        // Make the player briefly invulnerable
        this.isInvulnerable = true;
        this.alpha = 0.7; // Semi-transparent while invulnerable
        
        // Create a timer to reset invulnerability
        this.scene.time.delayedCall(this.invulnerabilityTime, () => {
            this.isInvulnerable = false;
            this.clearTint();
            this.alpha = 1;
        });
        
        // Check if player has died
        if (this.health <= 0) {
            this.die();
        }
    }
    
    /**
     * Handle player death.
     * Don't worry, it's merely a setback in a universe full of infinite possibilities.
     * And terrible poetry.
     */
    die() {
        this.isDead = true;
        this.body.setVelocity(0);
        this.anims.play(`${this.characterType}_dead`);
        
        // Emit an event that the player has died
        this.scene.events.emit('playerDied');
        
        console.log("Player has died. So it goes for carbon-based life forms.");
    }
    
    /**
     * Collect a towel. As any interstellar hitchhiker knows,
     * a towel is about the most massively useful thing you can have.
     */
    collectTowel() {
        this.towels++;
        this.scene.sound.play('collect');
        
        // Check if we've reached the Answer to the Ultimate Question
        if (this.towels * GameConfig.TOWEL_VALUE === GameConfig.ANSWER_TO_EVERYTHING) {
            this.scene.events.emit('fortyTwoAchieved');
        }
        
        // Return the new towel count for scorekeeping
        return this.towels;
    }
    
    /**
     * The special 42 event.
     * The answer to the ultimate question of life, the universe, and everything.
     * (Though the question itself remains unknown)
     */
    onFortyTwoAchieved() {
        console.log("42 points achieved! The ultimate answer has been discovered!");
        
        // Play the special sound
        this.scene.sound.play('forty_two');
        
        // Special effects - make the player temporarily invincible and glowing
        this.isInvulnerable = true;
        
        // Create a dramatic pulsing effect
        this.scene.tweens.add({
            targets: this,
            alpha: { from: 0.5, to: 1 },
            tint: { from: 0xffffff, to: 0x42f4f1 },  // Special "42" teal color
            duration: 2000,
            repeat: 5,
            yoyo: true,
            onComplete: () => {
                this.isInvulnerable = false;
                this.clearTint();
                this.alpha = 1;
            }
        });
    }
    
    /**
     * Get the current score based on towels collected.
     * Because what is life without arbitrary point systems?
     */
    getScore() {
        return this.towels * GameConfig.TOWEL_VALUE;
    }
}