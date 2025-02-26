/**
 * Filename: ImprobabilityDrive.js
 * Filepath: /src/utils/ImprobabilityDrive.js
 * 
 * The Infinite Improbability Drive: a wonderful new method of crossing
 * vast interstellar distances without all that tedious mucking about in
 * hyperspace. In this case, it's used to generate random, improbable events
 * in the game, because nothing says "Douglas Adams" quite like a whale suddenly
 * appearing out of nowhere and thinking "Oh no, not again."
 */

import { GameConfig } from '../config/GameConfig.js';

export default class ImprobabilityDrive {
    constructor(scene) {
        this.scene = scene;
        
        // Keep track of time for probability calculations
        this.lastEventTime = 0;
        this.eventCooldown = 5000; // Minimum 5 seconds between random events
        
        // Event probability (chance per update)
        this.eventProbability = GameConfig.IMPROBABILITY_CHANCE;
        
        console.log("Infinite Improbability Drive initialized. Reality stability no longer guaranteed.");
    }
    
    /**
     * Update method, called every frame.
     * Randomly decides when to trigger improbable events.
     */
    update(time, delta) {
        // Only trigger events if enough time has passed since the last one
        if (time - this.lastEventTime < this.eventCooldown) {
            return;
        }
        
        // Randomly decide if an event should trigger this frame
        if (Math.random() < this.eventProbability) {
            this.triggerImprobableEvent();
            this.lastEventTime = time;
        }
    }
    
    /**
     * Trigger a random improbable event.
     * The possibilities are as endless as the universe itself,
     * only considerably more ridiculous.
     */
    triggerImprobableEvent() {
        console.log("The Infinite Improbability Drive activates!");
        
        // Play the improbability sound
        this.scene.sound.play('improbability');
        
        // List of possible improbable events
        const events = [
            'reverseGravity',
            'spawnTowels',
            'spawnWhale',
            'flowerPots',
            'temporaryInvincibility',
            'slowMotion',
            'enemyTransformation',
            'colorInversion',
            'fishTransformation'
        ];
        
        // Pick a random event from the list
        const eventName = events[Math.floor(Math.random() * events.length)];
        
        // Trigger the selected event
        this[eventName]();
        
        // Show a message about the event
        this.showImprobableMessage(eventName);
    }
    
    /**
     * Display a message when an improbable event occurs.
     * Because if you're going to warp reality, you might as well
     * have the courtesy to inform everyone about it.
     */
    showImprobableMessage(eventName) {
        // Messages for each event type
        const messages = {
            reverseGravity: "Gravity decided to take a brief vacation!",
            spawnTowels: "By an extraordinary coincidence, extra towels have materialized!",
            spawnWhale: "Oh no, not again.",
            flowerPots: "Watch out for falling flower pots!",
            temporaryInvincibility: "You've become improbably invulnerable!",
            slowMotion: "Time is slowing down... well, more than usual.",
            enemyTransformation: "The Vogons are experiencing an identity crisis!",
            colorInversion: "Reality has temporarily decided to try a new look.",
            fishTransformation: "Don't forget your babel fish!"
        };
        
        // Get the message for the triggered event
        const message = messages[eventName] || "Something improbable has happened!";
        
        // If the scene has a HUD, use it to show the message
        if (this.scene.hud && this.scene.hud.showMessage) {
            this.scene.hud.showMessage(message);
        } else {
            // Otherwise, create a temporary text object
            const messageText = this.scene.add.text(
                this.scene.cameras.main.centerX,
                this.scene.cameras.main.centerY - 100,
                message,
                {
                    fontSize: '24px',
                    fontFamily: 'Arial',
                    color: '#ffffff',
                    stroke: '#000000',
                    strokeThickness: 4,
                    align: 'center'
                }
            );
            messageText.setOrigin(0.5);
            messageText.setScrollFactor(0);
            messageText.setDepth(200); // Above everything
            
            // Fade out after 3 seconds
            this.scene.tweens.add({
                targets: messageText,
                alpha: 0,
                delay: 3000,
                duration: 500,
                onComplete: () => {
                    messageText.destroy();
                }
            });
        }
    }
    
    /**
     * Trigger a massive improbability event for the special 42 sequence.
     * This is what happens when reality itself has an existential crisis.
     */
    triggerMassiveImprobability() {
        console.log("The Heart of Gold's Infinite Improbability Drive goes into overdrive!");
        
        // Play the improbability sound (but louder)
        this.scene.sound.play('improbability', { volume: 1.5 });
        
        // Create a big flash effect
        const flash = this.scene.add.rectangle(
            0, 0, 
            this.scene.cameras.main.width, 
            this.scene.cameras.main.height, 
            0xffffff
        );
        flash.setScrollFactor(0);
        flash.setDepth(1000);
        flash.setAlpha(0);
        
        // Flash the screen
        this.scene.tweens.add({
            targets: flash,
            alpha: 1,
            duration: 200,
            yoyo: true,
            repeat: 3,
            onComplete: () => {
                flash.destroy();
                
                // Now trigger multiple effects in sequence
                this.scene.time.delayedCall(500, () => this.reverseGravity());
                this.scene.time.delayedCall(1500, () => this.spawnTowels());
                this.scene.time.delayedCall(2500, () => this.enemyTransformation());
                this.scene.time.delayedCall(3500, () => this.temporaryInvincibility());
                
                // Show a big message
                if (this.scene.hud && this.scene.hud.showMessage) {
                    this.scene.hud.showMessage("The Answer to the Ultimate Question of Life,\nthe Universe, and Everything is... 42!");
                }
            }
        });
    }
    
    /**
     * Reverse gravity for a short time.
     * What goes up must come down, but what was already down
     * is a bit confused about the whole situation.
     */
    reverseGravity() {
        console.log("Gravity reversal!");
        
        // Store the original gravity
        const originalGravity = this.scene.physics.world.gravity.y;
        
        // Reverse gravity
        this.scene.physics.world.gravity.y = -originalGravity;
        
        // Return to normal after a few seconds
        this.scene.time.delayedCall(4000, () => {
            this.scene.physics.world.gravity.y = originalGravity;
        });
    }
    
    /**
     * Spawn some extra towels around the player.
     * Because you can never have too many towels.
     */
    spawnTowels() {
        console.log("Extra towels materializing!");
        
        // Number of towels to spawn
        const towelCount = Phaser.Math.Between(3, 6);
        
        // Spawn towels in a circle around the player
        const radius = 100;
        const angleStep = (Math.PI * 2) / towelCount;
        
        for (let i = 0; i < towelCount; i++) {
            const angle = i * angleStep;
            const x = this.scene.player.x + Math.cos(angle) * radius;
            const y = this.scene.player.y + Math.sin(angle) * radius;
            
            const towel = this.scene.add.image(x, y, 'towel');
            this.scene.physics.add.existing(towel);
            this.scene.collectibles.add(towel);
            
            // Add a collect method to make it compatible with the collection system
            towel.collect = function() {
                this.destroy();
            };
            
            // Add a floating animation
            this.scene.tweens.add({
                targets: towel,
                y: y - 20,
                duration: 1000,
                yoyo: true,
                repeat: -1
            });
        }
    }
    
    /**
     * Spawn a whale and a bowl of petunias.
     * The whale will be very confused about its sudden existence,
     * while the bowl of petunias will merely think "Oh no, not again."
     */
    spawnWhale() {
        console.log("Whale materialization event!");
        
        // Create a whale above the player
        const whale = this.scene.add.image(
            this.scene.player.x,
            this.scene.player.y - 300,
            'explosion' // Placeholder - should really be a whale sprite
        );
        whale.setScale(2);
        this.scene.physics.add.existing(whale);
        
        // Make the whale fall
        whale.body.setGravityY(500);
        
        // Make the whale harmless (passes through everything)
        whale.body.setCollideWorldBounds(false);
        
        // Add a bowl of petunias next to the whale
        const petunias = this.scene.add.image(
            whale.x + 50,
            whale.y - 20,
            'poetry' // Placeholder - should be a petunia sprite
        );
        petunias.setScale(0.5);
        this.scene.physics.add.existing(petunias);
        petunias.body.setGravityY(500);
        petunias.body.setCollideWorldBounds(false);
        
        // Speech bubble for the whale
        const whaleThoughts = this.scene.add.text(
            whale.x,
            whale.y - 50,
            "Wow! What's happening? Who am I?\nWhy am I here? What's my purpose in life?",
            {
                fontSize: '12px',
                fontFamily: 'Arial',
                color: '#000000',
                backgroundColor: '#ffffff',
                padding: 10,
                align: 'center',
                wordWrap: { width: 150 }
            }
        );
        whaleThoughts.setOrigin(0.5);
        
        // Speech bubble for the petunias
        const petuniasThoughts = this.scene.add.text(
            petunias.x,
            petunias.y - 30,
            "Oh no, not again.",
            {
                fontSize: '10px',
                fontFamily: 'Arial',
                color: '#000000',
                backgroundColor: '#ffffff',
                padding: 5
            }
        );
        petuniasThoughts.setOrigin(0.5);
        
        // Update the positions of the speech bubbles
        this.scene.events.on('update', () => {
            whaleThoughts.x = whale.x;
            whaleThoughts.y = whale.y - 50;
            petuniasThoughts.x = petunias.x;
            petuniasThoughts.y = petunias.y - 30;
        });
        
        // Clean up after 10 seconds or when they fall off the screen
        this.scene.time.delayedCall(10000, () => {
            whale.destroy();
            petunias.destroy();
            whaleThoughts.destroy();
            petuniasThoughts.destroy();
            this.scene.events.off('update'); // Remove the update listener
        });
    }
    
    /**
     * Spawn falling flower pots.
     * Falling flower pots are a common hazard in a universe governed
     * by the laws of improbability.
     */
    flowerPots() {
        console.log("Flower pot storm incoming!");
        
        // Number of flower pots
        const potCount = Phaser.Math.Between(5, 12);
        
        // Create flower pots at random positions above the screen
        for (let i = 0; i < potCount; i++) {
            const x = Phaser.Math.Between(0, this.scene.physics.world.bounds.width);
            const y = Phaser.Math.Between(-300, -50);
            
            // Create a flower pot (using poetry sprite as placeholder)
            const pot = this.scene.add.image(x, y, 'poetry');
            pot.setTint(0xa52a2a); // Brown tint for flower pot
            this.scene.physics.add.existing(pot);
            
            // Make the pot fall
            pot.body.setGravityY(300);
            pot.body.setVelocityX(Phaser.Math.Between(-50, 50));
            
            // Add rotation
            pot.body.setAngularVelocity(Phaser.Math.Between(-100, 100));
            
            // Add collision with player
            this.scene.physics.add.collider(pot, this.scene.player, (pot, player) => {
                // Create a breaking effect
                this.scene.add.particles(pot.x, pot.y, 'explosion', {
                    speed: { min: 50, max: 150 },
                    angle: { min: 0, max: 360 },
                    scale: { start: 0.4, end: 0 },
                    tint: 0xa52a2a,
                    lifespan: 600,
                    gravityY: 300
                }).explode(15);
                
                // Deal damage to the player if not invulnerable
                if (!player.isInvulnerable) {
                    player.takeDamage(10);
                }
                
                // Destroy the pot
                pot.destroy();
            });
            
            // Add collision with platforms
            this.scene.physics.add.collider(pot, this.scene.platformLayer, (pot) => {
                // Create a breaking effect
                this.scene.add.particles(pot.x, pot.y, 'explosion', {
                    speed: { min: 50, max: 150 },
                    angle: { min: 0, max: 360 },
                    scale: { start: 0.4, end: 0 },
                    tint: 0xa52a2a,
                    lifespan: 600,
                    gravityY: 300
                }).explode(15);
                
                // Destroy the pot
                pot.destroy();
            });
            
            // Clean up after 10 seconds if pot hasn't been destroyed
            this.scene.time.delayedCall(10000, () => {
                if (pot.active) {
                    pot.destroy();
                }
            });
        }
    }
    
    /**
     * Make the player temporarily invincible.
     * In a universe of infinite improbability, occasionally
     * the laws of consequence take a coffee break.
     */
    temporaryInvincibility() {
        console.log("Player temporarily invincible!");
        
        // Make the player invulnerable
        this.scene.player.isInvulnerable = true;
        
        // Add a visual indicator (a golden aura)
        const aura = this.scene.add.particles(0, 0, 'explosion', {
            follow: this.scene.player,
            scale: { start: 0.5, end: 0 },
            speed: 20,
            lifespan: 500,
            frequency: 50,
            quantity: 2,
            tint: 0xffff00
        });
        
        // Return to normal after 10 seconds
        this.scene.time.delayedCall(10000, () => {
            this.scene.player.isInvulnerable = false;
            aura.destroy();
        });
    }
    
    /**
     * Apply slow motion effect to the game.
     * Time itself is merely a suggestion when the Infinite Improbability Drive is involved.
     */
    slowMotion() {
        console.log("Slow motion activated!");
        
        // Store the original time scale
        const originalTimeScale = this.scene.physics.world.timeScale;
        
        // Slow down physics
        this.scene.physics.world.timeScale = 0.3;
        
        // Add a visual filter effect
        const camera = this.scene.cameras.main;
        const originalTint = camera.tint;
        camera.setTint(0x0000ff); // Blue tint
        
        // Return to normal after 5 seconds
        this.scene.time.delayedCall(5000, () => {
            this.scene.physics.world.timeScale = originalTimeScale;
            camera.setTint(originalTint);
        });
    }
    
    /**
     * Transform all enemies into something else temporarily.
     * Identity crises are a common side effect of improbability.
     */
    enemyTransformation() {
        console.log("Enemy transformation!");
        
        // Get all enemies
        const enemies = this.scene.enemies.getChildren();
        
        enemies.forEach(enemy => {
            // Store the enemy's original texture
            enemy.originalTexture = enemy.texture.key;
            
            // Transform the enemy into something else
            enemy.setTexture('babel_fish');
            enemy.setScale(2);
            
            // Temporarily disable enemy attacks
            if (enemy.recitePoetry) {
                enemy.originalRecitePoetry = enemy.recitePoetry;
                enemy.recitePoetry = () => {}; // Do nothing
            }
            
            // Add a confused animation
            this.scene.tweens.add({
                targets: enemy,
                angle: 360,
                duration: 2000,
                repeat: 3
            });
        });
        
        // Return to normal after 8 seconds
        this.scene.time.delayedCall(8000, () => {
            enemies.forEach(enemy => {
                if (enemy.active) {
                    enemy.setTexture(enemy.originalTexture);
                    enemy.setScale(1);
                    
                    // Restore original attack function
                    if (enemy.originalRecitePoetry) {
                        enemy.recitePoetry = enemy.originalRecitePoetry;
                    }
                }
            });
        });
    }
    
    /**
     * Invert all the colors in the game.
     * Reality is merely a matter of perspective, after all.
     */
    colorInversion() {
        console.log("Color inversion!");
        
        // Create a full-screen rectangle with a blend mode to invert colors
        const invertRect = this.scene.add.rectangle(
            this.scene.cameras.main.centerX,
            this.scene.cameras.main.centerY,
            this.scene.cameras.main.width,
            this.scene.cameras.main.height,
            0xffffff
        );
        invertRect.setScrollFactor(0);
        invertRect.setBlendMode(Phaser.BlendModes.DIFFERENCE);
        invertRect.setDepth(1000);
        
        // Return to normal after 6 seconds
        this.scene.time.delayedCall(6000, () => {
            invertRect.destroy();
        });
    }
    
    /**
     * Transform the player into a babel fish temporarily.
     * This allows them to understand Vogon poetry, which is both
     * a blessing and a curse.
     */
    fishTransformation() {
        console.log("Babel fish transformation!");
        
        // Store the player's original properties
        const originalTexture = this.scene.player.texture.key;
        const originalScale = this.scene.player.scale;
        const originalOffsetX = this.scene.player.body.offset.x;
        const originalOffsetY = this.scene.player.body.offset.y;
        const originalWidth = this.scene.player.body.width;
        const originalHeight = this.scene.player.body.height;
        
        // Transform the player into a babel fish
        this.scene.player.setTexture('babel_fish');
        this.scene.player.setScale(3);
        
        // Adjust the hitbox
        this.scene.player.body.setSize(16, 8);
        this.scene.player.body.setOffset(8, 8);
        
        // Temporarily change the player's movement behavior
        this.scene.player.originalHandleMovement = this.scene.player.handleMovement;
        this.scene.player.handleMovement = function() {
            if (this.cursors.left.isDown) {
                this.setVelocityX(-GameConfig.PLAYER_SPEED * 0.7); // Slower movement
                this.setFlipX(true);
            } else if (this.cursors.right.isDown) {
                this.setVelocityX(GameConfig.PLAYER_SPEED * 0.7);
                this.setFlipX(false);
            } else {
                this.setVelocityX(0);
            }
            
            // Babel fish can swim up
            if (this.cursors.up.isDown) {
                this.setVelocityY(-GameConfig.PLAYER_SPEED * 0.7);
            } else if (this.cursors.down.isDown) {
                this.setVelocityY(GameConfig.PLAYER_SPEED * 0.7);
            } else if (!this.body.onFloor()) {
                // Slowly float down when not on floor and not pressing up/down
                this.setVelocityY(50);
            }
        };
        
        // Add a swimming animation
        this.scene.tweens.add({
            targets: this.scene.player,
            angle: { from: -10, to: 10 },
            duration: 500,
            yoyo: true,
            repeat: 19 // 10 seconds total
        });
        
        // Return to normal after 10 seconds
        this.scene.time.delayedCall(10000, () => {
            this.scene.player.setTexture(originalTexture);
            this.scene.player.setScale(originalScale);
            this.scene.player.body.setSize(originalWidth, originalHeight);
            this.scene.player.body.setOffset(originalOffsetX, originalOffsetY);
            this.scene.player.handleMovement = this.scene.player.originalHandleMovement;
            this.scene.player.angle = 0; // Reset angle
        });
    }
}