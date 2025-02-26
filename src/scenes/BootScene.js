/**
 * Filename: BootScene.js
 * Filepath: /src/scenes/BootScene.js
 * 
 * The first scene to load, responsible for preloading all game assets.
 * Much like the beginning of the universe (only considerably less explosive
 * and marginally more organized), this is where everything starts.
 * The digital primordial soup, if you will.
 */

import { AssetConfig } from '../config/AssetConfig.js';

export default class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
        console.log("BootScene initialized. Preparing to load an improbable number of assets.");
    }
    
    /**
     * Preload method, where we load the bare minimum needed to show a loading screen.
     * Because staring at a blank screen while waiting for assets to load
     * is only marginally more entertaining than Vogon poetry.
     */
    preload() {
        // Create a loading bar
        this.createLoadingBar();
        
        // Load the assets needed for the loading screen
        this.load.image('logo', AssetConfig.IMAGES.LOGO.path);
        this.load.image('dont_panic', AssetConfig.IMAGES.DONT_PANIC.path);
    }
    
    /**
     * Create method, where we start loading all the actual game assets.
     * This is where the real heavy lifting happens, much like trying
     * to pick up an infinite improbability drive with your bare hands.
     */
    create() {
        console.log("Creating loading screen and beginning asset load");
        
        // Display the logo
        const logo = this.add.image(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 100,
            'logo'
        );
        logo.setScale(0.6);
        
        // Add the "DON'T PANIC" text below
        const dontPanic = this.add.image(
            this.cameras.main.centerX,
            this.cameras.main.centerY + 150,
            'dont_panic'
        );
        dontPanic.setScale(0.8);
        
        // Add some animation to the logo
        this.tweens.add({
            targets: logo,
            y: logo.y - 20,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Make the "DON'T PANIC" text flash
        this.tweens.add({
            targets: dontPanic,
            alpha: { from: 0.6, to: 1 },
            duration: 1000,
            yoyo: true,
            repeat: -1
        });
        
        // Start loading all game assets
        this.loadAllAssets();
        
        // Once loading is complete, move to the menu scene
        this.load.on('complete', () => {
            console.log("All assets loaded. Proceeding to MenuScene.");
            
            // Add a small delay so players can appreciate your lovely loading screen
            this.time.delayedCall(1000, () => {
                this.scene.start('MenuScene');
            });
        });
    }
    
    /**
     * Create a fancy loading bar.
     * Because progress bars are the digital equivalent of watching
     * paint dry, but somehow more satisfying.
     */
    createLoadingBar() {
        // Create a loading bar container
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Loading bar background
        const barBg = this.add.rectangle(
            width / 2,
            height / 2 + 250,
            width - 100,
            30,
            0x000000
        );
        barBg.setStrokeStyle(4, 0xffffff);
        
        // The actual progress bar
        const progressBar = this.add.rectangle(
            width / 2 - ((width - 108) / 2),
            height / 2 + 250,
            0,
            22,
            0x42f5e3 // A nice "hitchhiker blue-green"
        );
        progressBar.setOrigin(0, 0.5);
        
        // Loading text
        const loadingText = this.add.text(
            width / 2,
            height / 2 + 200,
            'Loading Game Assets...',
            {
                fontSize: '24px',
                fontFamily: 'Arial',
                color: '#ffffff'
            }
        );
        loadingText.setOrigin(0.5);
        
        // Percentage text
        const percentText = this.add.text(
            width / 2,
            height / 2 + 250,
            '0%',
            {
                fontSize: '18px',
                fontFamily: 'Arial',
                color: '#ffffff'
            }
        );
        percentText.setOrigin(0.5);
        
        // Asset count text
        const assetText = this.add.text(
            width / 2,
            height / 2 + 300,
            'Loading asset: none',
            {
                fontSize: '14px',
                fontFamily: 'Arial',
                color: '#ffffff'
            }
        );
        assetText.setOrigin(0.5);
        
        // Update the loading bar as assets are loaded
        this.load.on('progress', (value) => {
            // Update the progress bar width
            progressBar.width = (width - 108) * value;
            
            // Update the percentage text
            percentText.setText(`${Math.floor(value * 100)}%`);
        });
        
        // Update the asset text when a new file starts loading
        this.load.on('fileprogress', (file) => {
            assetText.setText(`Loading asset: ${file.key}`);
        });
    }
    
    /**
     * Load all the game assets.
     * This is where we load every sprite, sound, map, and font
     * that the game might conceivably need at any point.
     * It's like packing for a trip across the galaxy, but with
     * fewer actual towels.
     */
    loadAllAssets() {
        // Load all images
        Object.values(AssetConfig.IMAGES).forEach(img => {
            this.load.image(img.key, img.path);
        });
        
        // Load all spritesheets
        Object.values(AssetConfig.SPRITESHEETS).forEach(sheet => {
            this.load.spritesheet(
                sheet.key,
                sheet.path,
                sheet.frameConfig
            );
        });
        
        // Load all audio
        Object.values(AssetConfig.AUDIO).forEach(audio => {
            this.load.audio(audio.key, audio.path);
        });
        
        // Load all fonts
        Object.values(AssetConfig.FONTS).forEach(font => {
            this.load.binary(font.key, font.path);
        });
        
        // Load all tilemaps
        Object.values(AssetConfig.TILEMAPS).forEach(map => {
            this.load.tilemapTiledJSON(map.key, map.path);
        });
        
        // Load all tilesets
        Object.values(AssetConfig.TILESETS).forEach(tileset => {
            this.load.image(tileset.key, tileset.path);
        });
        
        // Start the load
        this.load.start();
        
        console.log("Asset loading has begun. DON'T PANIC!");
    }
}