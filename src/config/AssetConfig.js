/**
 * Filename: AssetConfig.js
 * Filepath: /src/config/AssetConfig.js
 *
 * An exhaustive catalog of the digital bits and bobs required to make 
 * the game look like something other than a blank screen - which, as blank
 * screens go, would still be more entertaining than Vogon poetry.
 */

export const AssetConfig = {
    // Images that will be stacked upon one another in various arrangements
    // to create the illusion that anything interesting is happening
    IMAGES: {
        // Sprites
        PLAYER: { key: 'player', path: 'assets/images/arthur_dent.png' },
        FORD: { key: 'ford', path: 'assets/images/ford_prefect.png' },
        VOGON: { key: 'vogon', path: 'assets/images/vogon.png' },
        POETRY: { key: 'poetry', path: 'assets/images/poetry.png' },
        TOWEL: { key: 'towel', path: 'assets/images/towel.png' },
        
        // Background elements
        EARTH: { key: 'earth_bg', path: 'assets/images/earth_background.png' },
        VOGON_SHIP: { key: 'vogon_ship_bg', path: 'assets/images/vogon_ship_background.png' },
        HEART_OF_GOLD: { key: 'heart_of_gold_bg', path: 'assets/images/heart_of_gold_background.png' },
        RESTAURANT: { key: 'restaurant_bg', path: 'assets/images/restaurant_background.png' },
        
        // UI elements, designed with all the graphical sophistication
        // of a Damogran frond-crested eagle's nest
        MENU_BG: { key: 'menu_bg', path: 'assets/images/guide_cover.png' },
        DONT_PANIC: { key: 'dont_panic', path: 'assets/images/dont_panic.png' },
        LOGO: { key: 'logo', path: 'assets/images/hitchhiker_logo.png' }
    },
    
    // Spritesheets, which are just images with more complicated loading procedures
    SPRITESHEETS: {
        PLAYER_SHEET: { 
            key: 'player_sheet', 
            path: 'assets/spritesheets/arthur_sheet.png',
            frameConfig: { frameWidth: 32, frameHeight: 48 }
        },
        FORD_SHEET: { 
            key: 'ford_sheet', 
            path: 'assets/spritesheets/ford_sheet.png',
            frameConfig: { frameWidth: 32, frameHeight: 48 }
        },
        VOGON_SHEET: { 
            key: 'vogon_sheet', 
            path: 'assets/spritesheets/vogon_sheet.png',
            frameConfig: { frameWidth: 40, frameHeight: 52 }
        },
        EXPLOSION: { 
            key: 'explosion', 
            path: 'assets/spritesheets/explosion.png',
            frameConfig: { frameWidth: 64, frameHeight: 64 }
        },
        BABEL_FISH: { 
            key: 'babel_fish', 
            path: 'assets/spritesheets/babel_fish.png',
            frameConfig: { frameWidth: 16, frameHeight: 16 }
        }
    },
    
    // Sounds, carefully selected to be slightly less awful than Vogon poetry
    AUDIO: {
        THEME: { key: 'theme', path: 'assets/audio/theme.mp3' },
        JUMP: { key: 'jump', path: 'assets/audio/jump.wav' },
        COLLECT: { key: 'collect', path: 'assets/audio/collect.wav' },
        DAMAGE: { key: 'damage', path: 'assets/audio/damage.wav' },
        POETRY: { key: 'poetry', path: 'assets/audio/vogon_poetry.wav' },
        IMPROBABILITY: { key: 'improbability', path: 'assets/audio/improbability.wav' },
        FORTY_TWO: { key: 'forty_two', path: 'assets/audio/forty_two.wav' }
    },
    
    // Fonts, because communication is important, even in a
    // game about the galaxy's most communication-challenged protagonist
    FONTS: {
        MAIN_FONT: { key: 'main_font', path: 'assets/fonts/SpaceGrotesk.ttf' }
    },
    
    // Tilemaps for each level, arranged in precisely the wrong order
    TILEMAPS: {
        EARTH: { key: 'earth_map', path: 'assets/tilemaps/earth.json' },
        VOGON_SHIP: { key: 'vogon_map', path: 'assets/tilemaps/vogon_ship.json' },
        HEART_OF_GOLD: { key: 'heart_map', path: 'assets/tilemaps/heart_of_gold.json' },
        RESTAURANT: { key: 'restaurant_map', path: 'assets/tilemaps/restaurant.json' }
    },
    
    // Tileset images used by the tilemaps
    TILESETS: {
        EARTH_TILES: { key: 'earth_tiles', path: 'assets/tilesets/earth_tiles.png' },
        SHIP_TILES: { key: 'ship_tiles', path: 'assets/tilesets/ship_tiles.png' },
        RESTAURANT_TILES: { key: 'restaurant_tiles', path: 'assets/tilesets/restaurant_tiles.png' }
    }
};