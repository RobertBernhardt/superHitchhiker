/**
 * Filename: EndScene.js
 * Filepath: /src/scenes/EndScene.js
 * 
 * The final scene of the game, displayed when the player has either
 * completed all levels or managed to get themselves killed in a particularly
 * spectacular fashion. Much like the Restaurant at the End of the Universe,
 * it's a place to reflect on the journey while waiting for the next big bang.
 */

export default class EndScene extends Phaser.Scene {
    constructor() {
        super({ key: 'EndScene' });
        console.log("EndScene initialized. Preparing for the ultimate revelation.");
    }
    
    /**
     * Initialize the scene with data passed from the GameScene.
     * This includes the player's final score and selected character.
     */
    init(data) {
        this.finalScore = data.score || 0;
        this.characterType = data.character || 'arthur';
        this.gameCompleted = data.completed || false;
        
        console.log(`EndScene initialized with score: ${this.finalScore}, character: ${this.characterType}`);
    }
    
    /**
     * Create method, setting up the end scene.
     * It's all very conclusive, with appropriate gravitas and a hint of
     * existential despair, as befits any proper Douglas Adams ending.
     */
    create() {
        // Play appropriate music
        this.sound.play('theme', { loop: true, volume: 0.5 });
        
        // Determine the background based on whether the game was completed or not
        let bgKey = this.gameCompleted ? 'restaurant_bg' : 'earth_bg';
        
        // Add background
        const bg = this.add.image(0, 0, bgKey);
        bg.setOrigin(0, 0);
        bg.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
        
        // Add a starfield effect
        this.createStarfield();
        
        // Add a semi-transparent panel for text
        const panel = this.add.rectangle(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            500,
            400,
            0x000000,
            0.7
        );
        
        // Create the appropriate title
        let titleText = this.gameCompleted ? 
            "Congratulations, Hitchhiker!" : 
            "End of the Line, Hitchhiker!";
        
        const title = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 150,
            titleText,
            {
                fontSize: '32px',
                fontFamily: 'Arial',
                color: '#ffffff',
                align: 'center'
            }
        );
        title.setOrigin(0.5);
        
        // Add an appropriate subtitle
        let subtitleText = this.gameCompleted ?
            "You've successfully navigated the improbabilities of the galaxy!" :
            "Your journey has ended, but the galaxy continues without you.";
        
        const subtitle = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 100,
            subtitleText,
            {
                fontSize: '18px',
                fontFamily: 'Arial',
                color: '#ffff00',
                align: 'center'
            }
        );
        subtitle.setOrigin(0.5);
        
        // Add score display
        const score = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 40,
            `Final Score: ${this.finalScore}`,
            {
                fontSize: '24px',
                fontFamily: 'Arial',
                color: '#ffffff',
                align: 'center'
            }
        );
        score.setOrigin(0.5);
        
        // Special text for score of 42
        if (this.finalScore === 42) {
            const meaningText = this.add.text(
                this.cameras.main.centerX,
                this.cameras.main.centerY,
                "You've discovered the Answer to the Ultimate Question\nof Life, the Universe, and Everything!",
                {
                    fontSize: '16px',
                    fontFamily: 'Arial',
                    color: '#42f5e3',
                    align: 'center'
                }
            );
            meaningText.setOrigin(0.5);
            
            // Add a pulsing effect
            this.tweens.add({
                targets: meaningText,
                alpha: { from: 0.5, to: 1 },
                duration: 1000,
                yoyo: true,
                repeat: -1
            });
        }
        
        // Add a Douglas Adams quote
        const quotes = [
            "So long, and thanks for all the fish!",
            "Don't Panic!",
            "In the beginning the Universe was created. This has made a lot of people very angry and been widely regarded as a bad move.",
            "Time is an illusion. Lunchtime doubly so.",
            "We apologize for the inconvenience.",
            "The ships hung in the sky in much the same way that bricks don't.",
            "For a moment, nothing happened. Then, after a second or so, nothing continued to happen."
        ];
        
        // Choose a quote based on whether the game was completed or not
        let quoteIndex = this.gameCompleted ? 0 : 1;
        
        // Override with a specific quote if the score is 42
        if (this.finalScore === 42) {
            quoteIndex = 6; // "For a moment, nothing happened..." quote
        }
        
        const quote = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY + 50,
            quotes[quoteIndex],
            {
                fontSize: '18px',
                fontFamily: 'Arial',
                color: '#ffffff',
                fontStyle: 'italic',
                align: 'center'
            }
        );
        quote.setOrigin(0.5);
        
        // Add character image
        const character = this.add.image(
            this.cameras.main.centerX - 150,
            this.cameras.main.centerY + 120,
            this.characterType === 'arthur' ? 'player' : 'ford'
        );
        character.setScale(2);
        
        // Add a towel image
        const towel = this.add.image(
            this.cameras.main.centerX + 150,
            this.cameras.main.centerY + 120,
            'towel'
        );
        towel.setScale(1.5);
        
        // Add play again button
        const playAgainButton = this.createButton(
            this.cameras.main.centerX,
            this.cameras.main.centerY + 150,
            'Play Again',
            () => {
                this.playAgain();
            }
        );
        
        // Add main menu button
        const menuButton = this.createButton(
            this.cameras.main.centerX,
            this.cameras.main.centerY + 200,
            'Main Menu',
            () => {
                this.returnToMenu();
            }
        );
        
        // Easter egg: If the player has a score of 42, add a special invisible button
        // that takes them to a secret scene or shows a special message
        if (this.finalScore === 42) {
            // Create an invisible hotspot
            const secretHotspot = this.add.zone(
                towel.x,
                towel.y,
                towel.width,
                towel.height
            );
            secretHotspot.setInteractive({ useHandCursor: true });
            
            secretHotspot.on('pointerdown', () => {
                this.showSecretMessage();
            });
        }
    }
    
    /**
     * Create a button with text and hover effects.
     * A now familiar pattern, because consistency is the hobgoblin
     * of small minds and game interfaces.
     */
    createButton(x, y, text, callback) {
        const button = this.add.container(x, y);
        
        // Create button background
        const bg = this.add.rectangle(0, 0, 200, 40, 0x333333);
        bg.setStrokeStyle(2, 0x42f5e3);
        button.add(bg);
        
        // Create button text
        const buttonText = this.add.text(
            0,
            0,
            text,
            {
                fontSize: '18px',
                fontFamily: 'Arial',
                color: '#ffffff'
            }
        );
        buttonText.setOrigin(0.5);
        button.add(buttonText);
        
        // Make the button interactive
        bg.setInteractive({ useHandCursor: true });
        
        // Add hover effects
        bg.on('pointerover', () => {
            bg.fillColor = 0x42f5e3;
            buttonText.setColor('#000000');
            this.tweens.add({
                targets: button,
                scale: 1.05,
                duration: 100
            });
        });
        
        bg.on('pointerout', () => {
            bg.fillColor = 0x333333;
            buttonText.setColor('#ffffff');
            this.tweens.add({
                targets: button,
                scale: 1,
                duration: 100
            });
        });
        
        // Add click effect
        bg.on('pointerdown', () => {
            bg.fillColor = 0x2a9e91;
            this.tweens.add({
                targets: button,
                scale: 0.95,
                duration: 100
            });
        });
        
        bg.on('pointerup', () => {
            bg.fillColor = 0x42f5e3;
            this.tweens.add({
                targets: button,
                scale: 1.05,
                duration: 100,
                onComplete: callback
            });
        });
        
        return button;
    }
    
    /**
     * Restart the game.
     * Because sometimes, just sometimes, you want to do it all over again.
     * Masochism? Perhaps. Or just the human condition.
     */
    playAgain() {
        console.log("Playing again");
        
        // Fade out
        this.cameras.main.fadeOut(500);
        
        this.cameras.main.once('camerafadeoutcomplete', () => {
            // Stop all sounds
            this.sound.stopAll();
            
            // Restart the game scene
            this.scene.start('GameScene', { character: this.characterType });
        });
    }
    
    /**
     * Return to the main menu.
     * A classic "rage quit" or "I've had enough" option,
     * though somewhat less dramatic when you've already finished the game.
     */
    returnToMenu() {
        console.log("Returning to main menu");
        
        // Fade out
        this.cameras.main.fadeOut(500);
        
        this.cameras.main.once('camerafadeoutcomplete', () => {
            // Stop all sounds
            this.sound.stopAll();
            
            // Return to the menu scene
            this.scene.start('MenuScene');
        });
    }
    
    /**
     * Show a secret message when clicking on the towel with a score of 42.
     * Because easter eggs are the digital equivalent of finding
     * a five-pound note in your pocket that you'd forgotten about.
     */
    showSecretMessage() {
        console.log("Secret message activated!");
        
        // Play a special sound
        this.sound.play('forty_two');
        
        // Create a panel for the secret message
        const panel = this.add.container(
            this.cameras.main.centerX,
            this.cameras.main.centerY
        );
        
        // Add a background with a special color
        const bg = this.add.rectangle(
            0,
            0,
            550,
            400,
            0x000000,
            0.9
        );
        bg.setStrokeStyle(3, 0x42f5e3);
        panel.add(bg);
        
        // Add the Hitchhiker's Guide logo
        const logo = this.add.image(
            0,
            -150,
            'logo'
        );
        logo.setScale(0.5);
        panel.add(logo);
        
        // Add the secret message title
        const title = this.add.text(
            0,
            -80,
            "A Message from the Guide",
            {
                fontSize: '24px',
                fontFamily: 'Arial',
                color: '#ffff00',
                align: 'center'
            }
        );
        title.setOrigin(0.5);
        panel.add(title);
        
        // Add the actual secret message
        const message = this.add.text(
            0,
            0,
            "We'd like to extend our gratitude to you, intrepid hitchhiker,\nfor discovering the true meaning of life, the universe, and everything.\n\nUnfortunately, we're still working on what exactly the question is.\n\nYour towel-collecting skills are unparalleled,\nand your ability to avoid Vogon poetry is commendable.\n\nRemember: DON'T PANIC, and always know where your towel is.",
            {
                fontSize: '16px',
                fontFamily: 'Arial',
                color: '#ffffff',
                align: 'center',
                lineSpacing: 10
            }
        );
        message.setOrigin(0.5);
        panel.add(message);
        
        // Add a close button
        const closeButton = this.add.text(
            0,
            120,
            "[ Close ]",
            {
                fontSize: '18px',
                fontFamily: 'Arial',
                color: '#42f5e3',
                align: 'center'
            }
        );
        closeButton.setOrigin(0.5);
        closeButton.setInteractive({ useHandCursor: true });
        panel.add(closeButton);
        
        // Animate the panel appearance
        panel.setScale(0);
        this.tweens.add({
            targets: panel,
            scale: 1,
            duration: 500,
            ease: 'Back.out'
        });
        
        // Handle close button
        closeButton.on('pointerover', () => {
            closeButton.setColor('#ffffff');
        });
        
        closeButton.on('pointerout', () => {
            closeButton.setColor('#42f5e3');
        });
        
        closeButton.on('pointerdown', () => {
            this.tweens.add({
                targets: panel,
                scale: 0,
                duration: 500,
                ease: 'Back.in',
                onComplete: () => {
                    panel.destroy();
                }
            });
        });
    }
    
    /**
     * Create a starfield background effect.
     * Because what's an ending without stars to gaze at philosophically?
     */
    createStarfield() {
        // Create a group for stars
        this.stars = [];
        
        // Add multiple stars with different properties
        for (let i = 0; i < 150; i++) {
            const x = Phaser.Math.Between(0, this.cameras.main.width);
            const y = Phaser.Math.Between(0, this.cameras.main.height);
            const size = Phaser.Math.Between(1, 3);
            const brightness = Phaser.Math.Between(5, 10) / 10;
            
            const star = this.add.circle(x, y, size, 0xffffff);
            star.setAlpha(brightness);
            
            // Add a twinkling animation
            this.tweens.add({
                targets: star,
                alpha: { from: brightness, to: 0.1 },
                duration: Phaser.Math.Between(1000, 5000),
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut',
                delay: Phaser.Math.Between(0, 3000)
            });
            
            this.stars.push(star);
        }
    }
}