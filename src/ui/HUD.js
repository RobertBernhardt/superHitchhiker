/**
 * Filename: HUD.js
 * Filepath: /src/ui/HUD.js
 * 
 * The Heads-Up Display: a series of numbers and symbols that float impossibly
 * in the player's field of vision, conveying information with all the subtlety
 * of a Vogon poetry reading. Like the digital watches that impressed Arthur so much,
 * it's a neat idea, even if it is firmly stuck in the 1980s gaming paradigm.
 */

import { GameConfig } from '../config/GameConfig.js';

export default class HUD {
    constructor(scene) {
        this.scene = scene;
        
        // Store references to UI elements
        this.uiElements = {};
        
        // Create the HUD container
        this.createHUD();
        
        console.log("HUD created. Numbers will now appear in the corners of your screen.");
    }
    
    /**
     * Create all HUD elements.
     * Like a bureaucratic form, it contains many fields,
     * most of which you don't understand but somehow matter enormously.
     */
    createHUD() {
        // Create a container for all HUD elements so they don't scroll with the camera
        this.container = this.scene.add.container(0, 0);
        this.container.setScrollFactor(0);
        this.container.setDepth(100); // Ensure HUD is always on top
        
        // Add a semi-transparent background panel
        const width = this.scene.cameras.main.width;
        const height = 60; // Height of the top panel
        
        this.panel = this.scene.add.rectangle(0, 0, width, height, 0x000000, 0.7);
        this.panel.setOrigin(0, 0);
        this.container.add(this.panel);
        
        // Add the score display
        this.uiElements.scoreText = this.scene.add.text(
            20, 
            20, 
            'Score: 0', 
            {
                fontSize: '24px',
                fontFamily: 'Arial',
                color: '#ffffff'
            }
        );
        this.container.add(this.uiElements.scoreText);
        
        // Add towel icon and counter
        this.uiElements.towelIcon = this.scene.add.image(
            width - 120, 
            30, 
            'towel'
        );
        this.uiElements.towelIcon.setScale(0.8);
        this.container.add(this.uiElements.towelIcon);
        
        this.uiElements.towelCount = this.scene.add.text(
            width - 80, 
            20, 
            'x 0', 
            {
                fontSize: '24px',
                fontFamily: 'Arial',
                color: '#ffffff'
            }
        );
        this.container.add(this.uiElements.towelCount);
        
        // Add health bar
        const healthBarBackground = this.scene.add.rectangle(
            width / 2,
            30,
            200,
            20,
            0x666666
        );
        healthBarBackground.setOrigin(0.5, 0.5);
        this.container.add(healthBarBackground);
        
        this.uiElements.healthBar = this.scene.add.rectangle(
            width / 2 - 100 + 1,
            30,
            198,
            18,
            0x00ff00
        );
        this.uiElements.healthBar.setOrigin(0, 0.5);
        this.container.add(this.uiElements.healthBar);
        
        this.uiElements.healthText = this.scene.add.text(
            width / 2,
            30,
            '100%',
            {
                fontSize: '16px',
                fontFamily: 'Arial',
                color: '#ffffff'
            }
        );
        this.uiElements.healthText.setOrigin(0.5, 0.5);
        this.container.add(this.uiElements.healthText);
        
        // Add level indicator
        const currentLevel = GameConfig.LEVELS[this.scene.currentLevel];
        this.uiElements.levelText = this.scene.add.text(
            width / 2,
            height + 10,
            `Level: ${currentLevel}`,
            {
                fontSize: '18px',
                fontFamily: 'Arial',
                color: '#ffffff',
                backgroundColor: '#000000',
                padding: {
                    left: 10,
                    right: 10,
                    top: 5,
                    bottom: 5
                }
            }
        );
        this.uiElements.levelText.setOrigin(0.5, 0);
        this.uiElements.levelText.setAlpha(0.7);
        this.container.add(this.uiElements.levelText);
        
        // Initialize with current values
        this.updateHealth(100);
        this.updateScore(0);
        this.updateTowelCount(0);
    }
    
    /**
     * Update the score display.
     * In a universe of infinite complexity, it's comforting to know
     * that some things are still measured by simple integers.
     */
    updateScore(score) {
        this.uiElements.scoreText.setText(`Score: ${score}`);
        
        // Special animation for when the score equals 42
        if (score === GameConfig.ANSWER_TO_EVERYTHING) {
            this.uiElements.scoreText.setStyle({
                fontSize: '24px',
                fontFamily: 'Arial',
                color: '#ffff00',
                stroke: '#000000',
                strokeThickness: 6
            });
            
            this.scene.tweens.add({
                targets: this.uiElements.scoreText,
                scale: { from: 1, to: 1.5 },
                duration: 500,
                yoyo: true,
                repeat: 3,
                ease: 'Sine.easeInOut'
            });
        }
    }
    
    /**
     * Update the health bar and text.
     * As health decreases, the bar changes color from green to yellow to red,
     * much like Arthur's mood throughout his adventures.
     */
    updateHealth(health) {
        // Clamp health value between 0 and 100
        const clampedHealth = Phaser.Math.Clamp(health, 0, 100);
        
        // Update the health bar width and color
        const barWidth = (clampedHealth / 100) * 198; // 198 is the max width
        this.uiElements.healthBar.width = barWidth;
        
        // Change color based on health percentage
        let color;
        if (clampedHealth > 60) {
            color = 0x00ff00; // Green
        } else if (clampedHealth > 30) {
            color = 0xffff00; // Yellow
        } else {
            color = 0xff0000; // Red
        }
        this.uiElements.healthBar.fillColor = color;
        
        // Update health text
        this.uiElements.healthText.setText(`${clampedHealth}%`);
    }
    
    /**
     * Update the towel count.
     * Because every hitchhiker knows that a towel is about the most
     * massively useful thing an interstellar hitchhiker can have.
     */
    updateTowelCount(count) {
        this.uiElements.towelCount.setText(`x ${count}`);
        
        // Add a small animation to make the icon bounce
        this.scene.tweens.add({
            targets: this.uiElements.towelIcon,
            y: { from: 30, to: 35 },
            duration: 300,
            yoyo: true,
            ease: 'Bounce.easeOut'
        });
    }
    
    /**
     * Show a message in the center of the screen that fades out.
     * Perfect for those moments of existential realization that
     * frequently occur during galactic hitchhiking.
     */
    showMessage(message, duration = 3000) {
        // Create the message text
        const messageText = this.scene.add.text(
            this.scene.cameras.main.centerX,
            this.scene.cameras.main.centerY,
            message,
            {
                fontSize: '32px',
                fontFamily: 'Arial',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 6,
                align: 'center'
            }
        );
        messageText.setOrigin(0.5);
        messageText.setScrollFactor(0);
        messageText.setDepth(200); // Above everything
        
        // Add a fade-in and fade-out animation
        messageText.setAlpha(0);
        this.scene.tweens.add({
            targets: messageText,
            alpha: 1,
            duration: 500,
            ease: 'Linear',
            onComplete: () => {
                this.scene.tweens.add({
                    targets: messageText,
                    alpha: 0,
                    delay: duration - 1000, // Show for the specified duration
                    duration: 500,
                    ease: 'Linear',
                    onComplete: () => {
                        messageText.destroy();
                    }
                });
            }
        });
    }
    
    /**
     * Update the HUD with the player's current stats.
     * Called by the scene's update method.
     */
    update() {
        if (this.scene.player) {
            // Update health
            this.updateHealth(this.scene.player.health);
            
            // Update towel count
            this.updateTowelCount(this.scene.player.towels);
        }
    }
}