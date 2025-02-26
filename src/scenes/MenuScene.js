/**
 * Filename: MenuScene.js
 * Filepath: /src/scenes/MenuScene.js
 * 
 * The main menu scene, where players decide whether to embark on
 * an interstellar adventure or simply go back to bed and pretend
 * the day never happened (much like Arthur wishes he could have done).
 * It's the digital equivalent of standing in front of the local planning office
 * looking at demolition plans for your house.
 */

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
        console.log("MenuScene initialized. Preparing to confuse and bewilder players.");
    }
    
    /**
     * Create method, setting up the main menu.
     * It's all very impressive with buttons and animations,
     * though sadly lacks the comfort of a nice cup of tea.
     */
    create() {
        // Add background image (the guide cover)
        const bg = this.add.image(0, 0, 'menu_bg');
        bg.setOrigin(0, 0);
        bg.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
        
        // Add the logo
        const logo = this.add.image(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 150,
            'logo'
        );
        logo.setScale(0.8);
        
        // Add a subtle animation to the logo
        this.tweens.add({
            targets: logo,
            y: logo.y - 10,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Add a pulsing effect to emphasize the logo
        this.tweens.add({
            targets: logo,
            scale: { from: 0.8, to: 0.85 },
            duration: 1500,
            yoyo: true,
            repeat: -1
        });
        
        // Create menu container
        const menuContainer = this.add.container(
            this.cameras.main.centerX,
            this.cameras.main.centerY + 50
        );
        
        // Add menu background panel
        const menuBg = this.add.rectangle(0, 0, 300, 300, 0x000000, 0.7);
        menuContainer.add(menuBg);
        
        // Create a character selection heading
        const characterTitle = this.add.text(
            0,
            -120,
            'Choose Your Character:',
            {
                fontSize: '24px',
                fontFamily: 'Arial',
                color: '#ffffff',
                align: 'center'
            }
        );
        characterTitle.setOrigin(0.5);
        menuContainer.add(characterTitle);
        
        // Create character selection buttons
        const arthurButton = this.createCharacterButton(
            -70,
            -50,
            'player',
            'Arthur Dent',
            'The bewildered Earthman in a bathrobe'
        );
        menuContainer.add(arthurButton);
        
        const fordButton = this.createCharacterButton(
            70,
            -50,
            'ford',
            'Ford Prefect',
            'A roving researcher for the Guide'
        );
        menuContainer.add(fordButton);
        
        // Create start game button
        const startButton = this.createButton(
            0,
            60,
            'Start Adventure',
            () => {
                // Start the game with the selected character
                this.startGame(this.selectedCharacter || 'arthur');
            }
        );
        menuContainer.add(startButton);
        
        // Create settings button
        const settingsButton = this.createButton(
            0,
            120,
            'Settings',
            () => {
                this.openSettings();
            }
        );
        menuContainer.add(settingsButton);
        
        // Default selection
        this.selectedCharacter = 'arthur';
        this.selectCharacterButton(arthurButton);
        
        // Add the Don't Panic text at the bottom
        const dontPanic = this.add.image(
            this.cameras.main.centerX,
            this.cameras.main.height - 50,
            'dont_panic'
        );
        dontPanic.setScale(0.5);
        
        // Make it blink occasionally
        this.time.addEvent({
            delay: 5000,
            callback: () => {
                this.tweens.add({
                    targets: dontPanic,
                    alpha: 0,
                    duration: 200,
                    yoyo: true,
                    repeat: 3
                });
            },
            loop: true
        });
        
        // Add some stars in the background
        this.createStarfield();
        
        // Play the theme music
        this.sound.play('theme', { loop: true, volume: 0.7 });
        
        console.log("MenuScene created. The stage is set for adventure, confusion, and improbability.");
    }
    
    /**
     * Create a button with text and hover effects.
     * It's not quite as satisfying as pressing a tangible button,
     * but it's cheaper to implement and doesn't break when you spill tea on it.
     */
    createButton(x, y, text, callback) {
        const button = this.add.container(x, y);
        
        // Create button background
        const bg = this.add.rectangle(0, 0, 220, 50, 0x333333);
        bg.setStrokeStyle(2, 0x42f5e3);
        button.add(bg);
        
        // Create button text
        const buttonText = this.add.text(
            0,
            0,
            text,
            {
                fontSize: '20px',
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
     * Create a character selection button with image and description.
     * Because choosing your digital avatar is one of the most
     * important decisions you'll make in life, right after
     * deciding whether to save Earth or go to the pub.
     */
    createCharacterButton(x, y, spriteKey, name, description) {
        const button = this.add.container(x, y);
        
        // Create button background
        const bg = this.add.rectangle(0, 0, 120, 120, 0x333333);
        bg.setStrokeStyle(2, 0xffffff);
        button.add(bg);
        
        // Add character sprite
        const sprite = this.add.image(0, -15, spriteKey);
        sprite.setScale(1.5);
        button.add(sprite);
        
        // Add character name
        const nameText = this.add.text(
            0,
            30,
            name,
            {
                fontSize: '16px',
                fontFamily: 'Arial',
                color: '#ffffff'
            }
        );
        nameText.setOrigin(0.5);
        button.add(nameText);
        
        // Store the character key for later use
        button.characterKey = spriteKey === 'player' ? 'arthur' : 'ford';
        
        // Store the description for tooltip
        button.description = description;
        
        // Make the button interactive
        bg.setInteractive({ useHandCursor: true });
        
        // Add hover effects
        bg.on('pointerover', () => {
            if (this.selectedCharacter !== button.characterKey) {
                bg.fillColor = 0x555555;
            }
            this.showCharacterDescription(button);
        });
        
        bg.on('pointerout', () => {
            if (this.selectedCharacter !== button.characterKey) {
                bg.fillColor = 0x333333;
            }
            this.hideCharacterDescription();
        });
        
        // Add click effect
        bg.on('pointerdown', () => {
            this.selectCharacterButton(button);
        });
        
        return button;
    }
    
    /**
     * Handle character selection.
     * Like choosing between certain doom and probable doom,
     * but with slightly more attractive character sprites.
     */
    selectCharacterButton(button) {
        // Find all character buttons and reset their appearance
        this.children.list.forEach(child => {
            if (child.type === 'Container' && child.characterKey) {
                // This is a character button
                const bg = child.list[0]; // The background rectangle
                bg.fillColor = 0x333333;
                bg.setStrokeStyle(2, 0xffffff);
            }
        });
        
        // Set the selected button appearance
        const bg = button.list[0];
        bg.fillColor = 0x42f5e3;
        bg.setStrokeStyle(3, 0xffff00);
        
        // Update the selected character
        this.selectedCharacter = button.characterKey;
        
        console.log(`Selected character: ${button.characterKey}`);
    }
    
    /**
     * Show a description of the character when hovering over the button.
     * Because everyone deserves a little backstory, even if it's
     * just "bewildered man in a bathrobe."
     */
    showCharacterDescription(button) {
        // Remove any existing tooltip
        this.hideCharacterDescription();
        
        // Create tooltip background
        this.tooltip = this.add.container(
            button.x,
            button.y + 80
        );
        
        const tooltipBg = this.add.rectangle(
            0,
            0,
            200,
            40,
            0x000000,
            0.8
        );
        this.tooltip.add(tooltipBg);
        
        // Add description text
        const tooltipText = this.add.text(
            0,
            0,
            button.description,
            {
                fontSize: '12px',
                fontFamily: 'Arial',
                color: '#ffffff',
                align: 'center',
                wordWrap: { width: 190 }
            }
        );
        tooltipText.setOrigin(0.5);
        this.tooltip.add(tooltipText);
        
        // Adjust height based on text
        tooltipBg.height = tooltipText.height + 20;
        
        // Add to the scene
        this.add.existing(this.tooltip);
    }
    
    /**
     * Hide the character description tooltip.
     * What you don't know probably won't hurt you,
     * which is rarely true in the actual Hitchhiker's universe.
     */
    hideCharacterDescription() {
        if (this.tooltip) {
            this.tooltip.destroy();
            this.tooltip = null;
        }
    }
    
    /**
     * Start the game with the selected character.
     * The beginning of an adventure! Or possibly just
     * the beginning of a series of increasingly unfortunate events.
     */
    startGame(character) {
        console.log(`Starting game with character: ${character}`);
        
        // Fade out the screen
        this.cameras.main.fadeOut(500);
        
        // Wait for the fade, then start the game scene
        this.cameras.main.once('camerafadeoutcomplete', () => {
            // Stop the music
            this.sound.stopAll();
            
            // Start the game scene with the selected character
            this.scene.start('GameScene', { character: character });
        });
    }
    
    /**
     * Open the settings dialog.
     * In a nice twist of irony, this doesn't actually do anything useful,
     * much like the local planning office on the day they decided to demolish Arthur's house.
     */
    openSettings() {
        console.log("Settings button clicked");
        
        // Create a settings panel
        const panel = this.add.container(
            this.cameras.main.centerX,
            this.cameras.main.centerY
        );
        
        // Add a background
        const bg = this.add.rectangle(
            0,
            0,
            400,
            300,
            0x000000,
            0.9
        );
        bg.setStrokeStyle(2, 0x42f5e3);
        panel.add(bg);
        
        // Add title
        const title = this.add.text(
            0,
            -120,
            'Settings',
            {
                fontSize: '28px',
                fontFamily: 'Arial',
                color: '#ffffff'
            }
        );
        title.setOrigin(0.5);
        panel.add(title);
        
        // Add a close button
        const closeButton = this.add.text(
            170,
            -120,
            'X',
            {
                fontSize: '24px',
                fontFamily: 'Arial',
                color: '#ffffff',
                backgroundColor: '#ff0000',
                padding: {
                    left: 10,
                    right: 10,
                    top: 5,
                    bottom: 5
                }
            }
        );
        closeButton.setOrigin(0.5);
        closeButton.setInteractive({ useHandCursor: true });
        panel.add(closeButton);
        
        // Close button event
        closeButton.on('pointerdown', () => {
            panel.destroy();
        });
        
        // Add some dummy settings
        const volumeText = this.add.text(
            -150,
            -50,
            'Music Volume:',
            {
                fontSize: '18px',
                fontFamily: 'Arial',
                color: '#ffffff'
            }
        );
        panel.add(volumeText);
        
        // Volume slider (non-functional but looks nice)
        const sliderTrack = this.add.rectangle(
            50,
            -50,
            200,
            10,
            0x666666
        );
        panel.add(sliderTrack);
        
        const sliderKnob = this.add.circle(
            50,
            -50,
            15,
            0x42f5e3
        );
        panel.add(sliderKnob);
        
        // Add a Douglas Adams quote because why not
        const quote = this.add.text(
            0,
            50,
            "Time is an illusion. Lunchtime doubly so.",
            {
                fontSize: '16px',
                fontFamily: 'Arial',
                color: '#ffff00',
                fontStyle: 'italic'
            }
        );
        quote.setOrigin(0.5);
        panel.add(quote);
        
        // Add a note that settings don't actually work
        const note = this.add.text(
            0,
            100,
            "Note: These settings don't actually do anything.\nMuch like the Nutrimatic Drinks Dispenser,\nthey're all for show.",
            {
                fontSize: '14px',
                fontFamily: 'Arial',
                color: '#ff9999',
                align: 'center'
            }
        );
        note.setOrigin(0.5);
        panel.add(note);
    }
    
    /**
     * Create a starfield background effect.
     * Because space is big. Really big. You just won't believe
     * how vastly, hugely, mind-bogglingly big it is.
     */
    createStarfield() {
        // Create a group for stars
        this.stars = [];
        
        // Add multiple stars with different properties
        for (let i = 0; i < 100; i++) {
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
        
        // Add a few "shooting stars" that occasionally streak across the screen
        this.time.addEvent({
            delay: 5000,
            callback: this.createShootingStar,
            callbackScope: this,
            loop: true
        });
    }
    
    /**
     * Create a shooting star effect.
     * A subtle reminder that the universe is constantly in motion,
     * and, at any moment, could decide to throw something much larger and
     * more dangerous in your general direction.
     */
    createShootingStar() {
        // Only create a shooting star 30% of the time
        if (Math.random() > 0.3) return;
        
        const startX = Phaser.Math.Between(0, this.cameras.main.width);
        const startY = Phaser.Math.Between(0, 100);
        
        const star = this.add.line(
            0, 0,
            startX, startY,
            startX + 10, startY + 10,
            0xffffff
        );
        star.setLineWidth(2);
        star.setOrigin(0);
        
        // Create the animation
        this.tweens.add({
            targets: star,
            x: this.cameras.main.width,
            y: this.cameras.main.height,
            scaleX: 5,
            scaleY: 5,
            alpha: { from: 1, to: 0 },
            duration: 1000,
            onComplete: () => {
                star.destroy();
            }
        });
    }
}