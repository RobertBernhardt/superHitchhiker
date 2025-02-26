/**
 * Filename: main.js
 * Filepath: /main.js
 * 
 * The singular entry point to a game about the most improbable adventure in the galaxy.
 * Like the big bang itself, everything begins here - though with considerably fewer
 * hydrogen atoms and significantly more digital animations of small Englishmen in bathrobes.
 * 
 * SIMPLIFIED VERSION: Uses basic shapes instead of sprite images
 */

import GameScene from './src/scenes/GameScene.js';

// DON'T PANIC - This merely initializes the game
document.addEventListener('DOMContentLoaded', () => {
    // Create the main game configuration
    const config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        backgroundColor: '#000000',
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 980 },
                debug: false
            }
        },
        scene: [GameScene]
    };

    // And so the game begins - much like life, with a series of
    // unexpected events and a general sense of confusion.
    const game = new Phaser.Game(config);

    // Add the game to the window object for debugging
    // (A practice that would make the Vogons proud in its needless bureaucracy)
    window.game = game;

    // Hide loading screen
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.style.display = 'none';
    }

    // Console message that is absolutely certain to be the most useful thing
    // in the Universe when things inevitably go wrong
    console.log('Game initialized. If anything explodes, it\'s probably supposed to.');
});