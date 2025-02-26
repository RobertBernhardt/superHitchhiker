/**
 * Filename: QuoteManager.js
 * Filepath: /src/utils/QuoteManager.js
 * 
 * A utility for displaying random Douglas Adams quotes throughout the game.
 * Because sometimes, in the midst of being pursued by bureaucratic aliens
 * and collecting towels, a player just needs a dash of existential wisdom
 * to put it all in perspective.
 */

import { GameConfig } from '../config/GameConfig.js';

export default class QuoteManager {
    constructor(scene) {
        this.scene = scene;
        
        // Initialize timing variables
        this.lastQuoteTime = 0;
        this.quoteCooldown = 30000; // 30 seconds between quotes
        this.quoteChance = 0.3; // 30% chance of showing a quote when cooldown expires
        
        // The list of quotes, carefully selected to be amusing without
        // infringing upon the sacred copyright laws of the galaxy
        this.quotes = GameConfig.QUOTES.concat([
            "In the beginning, the universe was created. This has made a lot of people very angry and been widely regarded as a bad move.",
            "Don't Panic!",
            "A towel is about the most massively useful thing an interstellar hitchhiker can have.",
            "Time is an illusion. Lunchtime doubly so.",
            "I'd far rather be happy than right any day.",
            "For a moment, nothing happened. Then, after a second or so, nothing continued to happen.",
            "Life... is like a grapefruit. It's orange and squishy, and has a few pips in it, and some folks have half a one for breakfast.",
            "It is a mistake to think you can solve any major problems just with potatoes.",
            "This must be Thursday. I never could get the hang of Thursdays.",
            "The ships hung in the sky in much the same way that bricks don't.",
            "The Answer to the Ultimate Question of Life, The Universe, and Everything is...42."
        ]);
        
        console.log("QuoteManager initialized. Prepare for wit and wisdom.");
    }
    
    /**
     * Update method, called by the scene's update method.
     * Randomly decides when to show quotes based on timing and probability.
     */
    update(time, delta) {
        // Only consider showing a quote if enough time has passed
        if (time - this.lastQuoteTime < this.quoteCooldown) {
            return;
        }
        
        // Roll the dice to see if we should show a quote
        if (Math.random() < this.quoteChance) {
            this.showRandomQuote();
            this.lastQuoteTime = time;
        } else {
            // Reset the timer anyway, but with a shorter cooldown
            // to try again sooner
            this.lastQuoteTime = time - (this.quoteCooldown / 2);
        }
    }
    
    /**
     * Display a random quote on the screen.
     * The quote will appear, linger for a moment to be read,
     * and then fade away like so many of life's great truths.
     */
    showRandomQuote() {
        // Pick a random quote
        const quote = this.quotes[Math.floor(Math.random() * this.quotes.length)];
        
        console.log(`Displaying quote: "${quote}"`);
        
        // Create a text object for the quote
        const quoteText = this.scene.add.text(
            this.scene.cameras.main.centerX,
            this.scene.cameras.main.height - 100,
            quote,
            {
                fontSize: '18px',
                fontFamily: 'Arial',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 4,
                align: 'center',
                wordWrap: { width: this.scene.cameras.main.width - 100 }
            }
        );
        quoteText.setOrigin(0.5);
        quoteText.setScrollFactor(0);
        quoteText.setDepth(90); // Above most elements but below UI
        quoteText.setAlpha(0);
        
        // Add the Guide logo next to the quote
        const guideIcon = this.scene.add.image(
            quoteText.x - (quoteText.width / 2) - 30,
            quoteText.y,
            'logo'
        );
        guideIcon.setScrollFactor(0);
        guideIcon.setDepth(90);
        guideIcon.setScale(0.3);
        guideIcon.setAlpha(0);
        
        // Create a background panel
        const textBounds = quoteText.getBounds();
        const padding = 20;
        const panel = this.scene.add.rectangle(
            textBounds.centerX,
            textBounds.centerY,
            textBounds.width + padding * 2 + guideIcon.width + 10,
            textBounds.height + padding * 2,
            0x000000,
            0.7
        );
        panel.setScrollFactor(0);
        panel.setDepth(89); // Just below the text
        panel.setAlpha(0);
        
        // Add fade-in animation
        this.scene.tweens.add({
            targets: [quoteText, guideIcon, panel],
            alpha: 1,
            duration: 1000,
            ease: 'Linear',
            onComplete: () => {
                // Wait for a while, then fade out
                this.scene.time.delayedCall(5000, () => {
                    this.scene.tweens.add({
                        targets: [quoteText, guideIcon, panel],
                        alpha: 0,
                        duration: 1000,
                        ease: 'Linear',
                        onComplete: () => {
                            quoteText.destroy();
                            guideIcon.destroy();
                            panel.destroy();
                        }
                    });
                });
            }
        });
        
        // If this is a special quote (like the 42 one), add some extra effects
        if (quote.includes("42")) {
            // Add a pulsing effect
            this.scene.tweens.add({
                targets: [quoteText, guideIcon],
                scale: { from: 1, to: 1.1 },
                duration: 500,
                yoyo: true,
                repeat: 9 // 5 seconds total
            });
            
            // Add a special color cycling effect
            const colors = [0xffffff, 0xffff00, 0x00ffff, 0xff00ff];
            let colorIndex = 0;
            
            const colorInterval = setInterval(() => {
                quoteText.setTint(colors[colorIndex]);
                colorIndex = (colorIndex + 1) % colors.length;
            }, 500);
            
            // Clear the interval when the quote is destroyed
            this.scene.time.delayedCall(6000, () => {
                clearInterval(colorInterval);
            });
        }
    }
    
    /**
     * Show a specific quote.
     * For those times when randomness just won't do,
     * and you need a particular bit of wisdom.
     */
    showQuote(quoteText) {
        // Find the quote in our list if it exists
        const quote = this.quotes.find(q => q.includes(quoteText)) || quoteText;
        
        // Create and display the quote (same as showRandomQuote but with a specific quote)
        console.log(`Displaying specific quote: "${quote}"`);
        
        // Implementation similar to showRandomQuote, but with the specific quote
        const text = this.scene.add.text(
            this.scene.cameras.main.centerX,
            this.scene.cameras.main.height - 100,
            quote,
            {
                fontSize: '18px',
                fontFamily: 'Arial',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 4,
                align: 'center',
                wordWrap: { width: this.scene.cameras.main.width - 100 }
            }
        );
        text.setOrigin(0.5);
        text.setScrollFactor(0);
        text.setDepth(90);
        text.setAlpha(0);
        
        // Add the Guide logo
        const guideIcon = this.scene.add.image(
            text.x - (text.width / 2) - 30,
            text.y,
            'logo'
        );
        guideIcon.setScrollFactor(0);
        guideIcon.setDepth(90);
        guideIcon.setScale(0.3);
        guideIcon.setAlpha(0);
        
        // Background panel
        const textBounds = text.getBounds();
        const padding = 20;
        const panel = this.scene.add.rectangle(
            textBounds.centerX,
            textBounds.centerY,
            textBounds.width + padding * 2 + guideIcon.width + 10,
            textBounds.height + padding * 2,
            0x000000,
            0.7
        );
        panel.setScrollFactor(0);
        panel.setDepth(89);
        panel.setAlpha(0);
        
        // Fade in and out animations
        this.scene.tweens.add({
            targets: [text, guideIcon, panel],
            alpha: 1,
            duration: 1000,
            ease: 'Linear',
            onComplete: () => {
                this.scene.time.delayedCall(5000, () => {
                    this.scene.tweens.add({
                        targets: [text, guideIcon, panel],
                        alpha: 0,
                        duration: 1000,
                        ease: 'Linear',
                        onComplete: () => {
                            text.destroy();
                            guideIcon.destroy();
                            panel.destroy();
                        }
                    });
                });
            }
        });
    }
}