/**
 * Filename: Enemy.js
 * Filepath: /src/entities/Enemy.js
 * 
 * A base class for all the unpleasant entities one might encounter
 * while hitchhiking across the galaxy. Much like actual interstellar travel,
 * the universe is full of things that want to destroy you in increasingly 
 * creative ways, though rarely with the bureaucratic efficiency of a Vogon.
 */

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, config = {}) {
        // It starts innocently enough with a sprite
        super(scene, x, y, texture);
        
        // Add this object to the scene
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Set the enemy properties with defaults
        this.health = config.health || 100;
        this.damage = config.damage || 10;
        this.speed = config.speed || 100;
        this.scoreValue = config.scoreValue || 10;
        this.enemyType = config.type || 'generic';
        
        // Direction: 1 = right, -1 = left
        this.direction = config.direction || 1;
        
        // Configure physics body
        this.setCollideWorldBounds(true);
        this.setBounce(0.2);
        
        // Default hitbox size
        const hitboxWidth = config.hitboxWidth || 30;
        const hitboxHeight = config.hitboxHeight || 40;
        this.setSize(hitboxWidth, hitboxHeight);
        this.setOffset((this.width - hitboxWidth) / 2, (this.height - hitboxHeight) / 2);
        
        // Setup the initial behavior
        this.setupBehavior(config.behavior || 'patrol');
        
        console.log(`Enemy (${this.enemyType}) created at (${x}, ${y}). It looks rather unhappy about it.`);
    }
    
    /**
     * Set up the enemy's behavior pattern.
     * 'patrol' makes it move back and forth.
     * 'follow' makes it follow the player.
     * 'stationary' makes it stay in place (but may still attack).
     */
    setupBehavior(behavior) {
        this.behavior = behavior;
        
        switch (behavior) {
            case 'patrol':
                // Setup movement distance limits
                this.startX = this.x;
                this.patrolDistance = 200; // Default patrol distance
                this.minX = this.startX - this.patrolDistance;
                this.maxX = this.startX + this.patrolDistance;
                break;
                
            case 'follow':
                // Will follow player when in range
                this.followRange = 300; // Default follow range
                break;
                
            case 'stationary':
                // Doesn't move, but may perform actions
                this.setImmovable(true);
                break;
                
            default:
                console.warn(`Unknown enemy behavior: ${behavior}. Defaulting to 'stationary'.`);
                this.behavior = 'stationary';
                this.setImmovable(true);
                break;
        }
        
        // Add the enemy to the scene's update list
        this.scene.events.on('update', this.update, this);
        
        // Remove listener when the scene shuts down
        this.scene.events.once('shutdown', () => {
            this.scene.events.off('update', this.update, this);
        });
    }
    
    /**
     * Update method called every frame.
     * Manages the enemy's behavior.
     */
    update() {
        if (this.health <= 0) {
            return; // The dead make even worse enemies than they do platformer characters
        }
        
        switch (this.behavior) {
            case 'patrol':
                this.updatePatrol();
                break;
                
            case 'follow':
                this.updateFollow();
                break;
                
            case 'stationary':
                // Stationary enemies don't move, but they might need to perform actions
                this.updateStationary();
                break;
        }
    }
    
    /**
     * Update logic for patrolling enemies.
     * They wander back and forth with all the purpose and conviction
     * of a hungover civil servant on a Monday morning.
     */
    updatePatrol() {
        // Move in the current direction
        this.setVelocityX(this.speed * this.direction);
        
        // Check if we need to turn around
        if ((this.direction === 1 && this.x >= this.maxX) || 
            (this.direction === -1 && this.x <= this.minX)) {
            this.direction *= -1; // Reverse direction
            this.setFlipX(this.direction === -1); // Flip the sprite accordingly
        }
    }
    
    /**
     * Update logic for enemies that follow the player.
     * They're clingy, but in a malevolent sort of way.
     */
    updateFollow() {
        // Find the player
        const player = this.scene.player;
        
        if (!player || player.isDead) {
            // No player to follow, or player is dead
            this.setVelocity(0);
            return;
        }
        
        // Calculate distance to player
        const distanceToPlayer = Phaser.Math.Distance.Between(
            this.x, this.y, player.x, player.y
        );
        
        // Only follow if within range
        if (distanceToPlayer <= this.followRange) {
            // Calculate direction to player
            const directionX = player.x - this.x;
            const directionY = player.y - this.y;
            
            // Normalize the direction vector
            const length = Math.sqrt(directionX * directionX + directionY * directionY);
            const normalizedX = directionX / length;
            const normalizedY = directionY / length;
            
            // Move towards player
            this.setVelocityX(normalizedX * this.speed);
            
            // Only apply Y velocity if the enemy can fly or jump
            if (this.canFly) {
                this.setVelocityY(normalizedY * this.speed);
            }
            
            // Flip the sprite based on movement direction
            this.setFlipX(directionX < 0);
        } else {
            // Player out of range, stop moving
            this.setVelocity(0);
        }
    }
    
    /**
     * Update logic for stationary enemies.
     * They just stand there, menacingly.
     */
    updateStationary() {
        // Stationary enemies may perform actions (like shooting poetry),
        // but they don't move. The implementation will depend on the subclass.
    }
    
    /**
     * Handle taking damage from the player.
     * Unlike Vogons, most enemies don't enjoy pain.
     */
    takeDamage(amount) {
        this.health -= amount;
        
        // Visual feedback
        this.setTint(0xff0000);  // Red tint
        
        // Create a timer to reset the tint
        this.scene.time.delayedCall(200, () => {
            this.clearTint();
        });
        
        // Check if enemy has died
        if (this.health <= 0) {
            this.die();
        }
    }
    
    /**
     * Handles what happens when an enemy dies.
     * Generally involves dramatic particle effects and
     * marginally less dramatic point scoring.
     */
    die() {
        // Create a death animation/explosion at the enemy's position
        this.scene.add.particles(this.x, this.y, 'explosion', {
            speed: { min: 50, max: 150 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.5, end: 0 },
            blendMode: 'ADD',
            lifespan: 800,
            gravityY: 300
        }).explode(20);
        
        // Add points to the score
        if (this.scene.addScore) {
            this.scene.addScore(this.scoreValue);
        }
        
        // Remove the enemy
        this.destroy();
    }
    
    /**
     * Handles collisions with the player.
     * This is typically unpleasant for all parties involved.
     */
    onPlayerCollision(player) {
        // Default implementation damages the player
        player.takeDamage(this.damage);
        
        // Apply knockback to the player
        const knockbackDirection = (player.x < this.x) ? -1 : 1;
        player.setVelocity(knockbackDirection * 200, -200);
    }
}