/**
 * Filename: Collectible.js
 * Filepath: /src/entities/Collectible.js
 * 
 * A representation of that most essential item for interstellar hitchhiking:
 * the towel. Of course, digital towels are much less useful for drying oneself
 * after a shower, but they do have the advantage of being significantly easier
 * to animate and won't ever develop that peculiar musty smell.
 */

export default class Collectible extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, type = 'towel') {
        // The sprite key is determined by the type - currently only towels are supported,
        // but this allows for future expansion to other essential items, like peanuts or beer
        super(scene, x, y, type);
        
        // Add this object to the scene
        scene.add.existing(this);
        scene.physics.add.existing(this, true); // true = static body (doesn't move)
        
        // Store the type
        this.collectibleType = type;
        
        // Set up the physics body
        this.body.setSize(20, 20);
        this.body.setOffset(6, 6);
        
        // Set up floating animation
        this.setupFloatingAnimation();
        
        // Set up the collection effect (to be played when collected)
        this.setupCollectionEffect();
        
        console.log(`A wild ${type} appears at (${x}, ${y}). Possibly the most useful item in the galaxy.`);
    }
    
    /**
     * Sets up a pleasant floating animation.
     * Towels, as we all know, should not be trusted to stay still.
     */
    setupFloatingAnimation() {
        this.scene.tweens.add({
            targets: this,
            y: this.y - 10,
            duration: 1000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });
        
        // Also add a slight rotation for that extra "I'm worth collecting" vibe
        this.scene.tweens.add({
            targets: this,
            angle: { from: -5, to: 5 },
            duration: 1500,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });
    }
    
    /**
     * Sets up the collection effect.
     * When a towel is collected, it should make a fuss about it.
     * After all, it's not every day a towel gets to fulfill its destiny.
     */
    setupCollectionEffect() {
        // This will be used when the player collects this item
        this.collectionAnimation = this.scene.add.particles(0, 0, this.collectibleType, {
            speed: { min: 50, max: 150 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.6, end: 0 },
            blendMode: 'ADD',
            active: false,
            lifespan: 600,
            gravityY: 300
        });
        
        // Stop the particles from rendering until needed
        this.collectionAnimation.stop();
    }
    
    /**
     * Called when a player collects this item.
     * Plays a fancy particle effect and removes the sprite.
     */
    collect() {
        // Position the particle effect where the collectible is
        this.collectionAnimation.setPosition(this.x, this.y);
        
        // Activate the particles
        this.collectionAnimation.explode(20); // 20 particles
        
        // Play the collection sound
        this.scene.sound.play('collect');
        
        // Remove the sprite (but not the particles, which need to finish their animation)
        this.destroy();
        
        // The collection effect will clean itself up automatically after the particles expire
    }
    
    /**
     * Static factory method to create multiple collectibles.
     * Because creating towels one at a time would be far too inefficient
     * for a galaxy in which time is precious (except for lunchtime, which is doubly so).
     */
    static createMultiple(scene, count, locations) {
        const collectibles = [];
        
        // If specific locations are provided, use those
        if (locations && locations.length > 0) {
            for (let i = 0; i < Math.min(count, locations.length); i++) {
                collectibles.push(new Collectible(scene, locations[i].x, locations[i].y));
            }
        } 
        // Otherwise, distribute them randomly
        else {
            for (let i = 0; i < count; i++) {
                const x = Phaser.Math.Between(100, scene.physics.world.bounds.width - 100);
                const y = Phaser.Math.Between(100, scene.physics.world.bounds.height - 100);
                collectibles.push(new Collectible(scene, x, y));
            }
        }
        
        return collectibles;
    }
}