/**
 * Filename: Vogon.js
 * Filepath: /src/entities/Vogon.js
 * 
 * Digital representations of the Vogons: bureaucratic, officious, and 
 * callous galactic civil servants. Not actually evil, but bad-tempered,
 * bureaucratic, officious, and callous. They wouldn't even lift a finger
 * to save their own grandmothers from the Ravenous Bugblatter Beast of Traal
 * without orders signed in triplicate, sent in, sent back, queried, lost,
 * found, subjected to public inquiry, lost again, and finally buried in soft
 * peat for three months and recycled as firelighters.
 */

import Enemy from './Enemy.js';
import Poetry from './Poetry.js';
import { GameConfig } from '../config/GameConfig.js';

export default class Vogon extends Enemy {
    constructor(scene, x, y, config = {}) {
        // Set up default Vogon configurations
        const vogonConfig = {
            health: 150,
            damage: GameConfig.VOGON_DAMAGE,
            speed: GameConfig.VOGON_SPEED,
            scoreValue: 25,
            type: 'vogon',
            hitboxWidth: 35,
            hitboxHeight: 45,
            behavior: config.behavior || 'patrol',
            ...config
        };
        
        // Call parent constructor with the Vogon sprite sheet
        super(scene, x, y, 'vogon_sheet', vogonConfig);
        
        // Vogon-specific properties
        this.poetryAttackCooldown = 3000; // 3 seconds between poetry attacks
        this.lastPoetryAttack = 0;
        this.attackRange = 300; // Range at which the Vogon will recite poetry
        
        // Create animations
        this.createAnimations();
        
        // Start playing the idle animation
        this.anims.play('vogon_idle', true);
        
        console.log(`A Vogon has appeared at (${x}, ${y}). Try not to make eye contact.`);
    }
    
    /**
     * Create Vogon-specific animations.
     * Despite their bureaucratic nature, Vogons do occasionally move.
     * Though rarely with any grace or style.
     */
    createAnimations() {
        if (!this.scene.anims.exists('vogon_idle')) {
            this.scene.anims.create({
                key: 'vogon_idle',
                frames: this.scene.anims.generateFrameNumbers('vogon_sheet', { start: 0, end: 3 }),
                frameRate: 6,
                repeat: -1
            });
            
            this.scene.anims.create({
                key: 'vogon_walk',
                frames: this.scene.anims.generateFrameNumbers('vogon_sheet', { start: 4, end: 11 }),
                frameRate: 8,
                repeat: -1
            });
            
            this.scene.anims.create({
                key: 'vogon_attack',
                frames: this.scene.anims.generateFrameNumbers('vogon_sheet', { start: 12, end: 17 }),
                frameRate: 10,
                repeat: 0
            });
        }
    }
    
    /**
     * Override the update method to add poetry attacks.
     * Because what's worse than a Vogon? A Vogon with poetry.
     */
    update() {
        super.update();
        
        // Update animations based on movement
        this.updateAnimations();
        
        // Check for poetry attacks
        this.checkPoetryAttack();
    }
    
    /**
     * Update animations based on movement state.
     */
    updateAnimations() {
        // If currently playing the attack animation, don't interrupt it
        if (this.anims.currentAnim && this.anims.currentAnim.key === 'vogon_attack' && !this.anims.isComplete) {
            return;
        }
        
        // Otherwise, play walk or idle based on velocity
        if (Math.abs(this.body.velocity.x) > 10) {
            this.anims.play('vogon_walk', true);
        } else {
            this.anims.play('vogon_idle', true);
        }
    }
    
    /**
     * Check if the Vogon should unleash a poetry attack.
     * This is among the most deadly weapons in the galaxy.
     */
    checkPoetryAttack() {
        // Check cooldown
        const now = this.scene.time.now;
        if (now - this.lastPoetryAttack < this.poetryAttackCooldown) {
            return;
        }
        
        // Find the player
        const player = this.scene.player;
        if (!player || player.isDead) {
            return;
        }
        
        // Check if player is in range
        const distanceToPlayer = Phaser.Math.Distance.Between(
            this.x, this.y, player.x, player.y
        );
        
        if (distanceToPlayer <= this.attackRange) {
            this.recitePoetry(player);
        }
    }
    
    /**
     * Recite poetry at the player.
     * This is considered a war crime in 14 star systems.
     */
    recitePoetry(player) {
        // Update the last attack time
        this.lastPoetryAttack = this.scene.time.now;
        
        // Play the attack animation
        this.anims.play('vogon_attack');
        
        // Calculate direction to player
        const directionX = player.x - this.x;
        const directionY = player.y - this.y;
        
        // Normalize the direction vector
        const length = Math.sqrt(directionX * directionX + directionY * directionY);
        const normalizedX = directionX / length;
        const normalizedY = directionY / length;
        
        // The poetry projectile will appear to come from the Vogon's mouth
        const offsetX = 20 * (this.flipX ? -1 : 1);
        const offsetY = -15;
        
        // Create a new poetry projectile
        new Poetry(
            this.scene,
            this.x + offsetX,
            this.y + offsetY,
            normalizedX,
            normalizedY,
            GameConfig.POETRY_SPEED
        );
        
        // Play the poetry sound
        this.scene.sound.play('poetry');
        
        console.log("A Vogon has unleashed poetry. May the gods have mercy.");
    }
    
    /**
     * Override the base enemy's die method to add Vogon-specific death effects.
     * When Vogons die, they do so with all the grace and elegance one would expect.
     * Which is to say, none at all.
     */
    die() {
        // Add a specially colored explosion for Vogons
        this.scene.add.particles(this.x, this.y, 'explosion', {
            speed: { min: 50, max: 150 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.6, end: 0 },
            blendMode: 'ADD',
            tint: 0x00ff00, // Sickly green explosion
            lifespan: 800,
            gravityY: 300
        }).explode(30);
        
        // Add a paperwork explosion as well, because bureaucracy never dies
        this.scene.add.particles(this.x, this.y + 20, 'poetry', {
            speed: { min: 100, max: 200 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.4, end: 0 },
            blendMode: 'NORMAL',
            lifespan: 1200,
            gravityY: 500
        }).explode(15);
        
        // Call the parent method for the rest of the functionality
        super.die();
        
        console.log("A Vogon has been defeated. His poetry shall be missed by absolutely no one.");
    }
}