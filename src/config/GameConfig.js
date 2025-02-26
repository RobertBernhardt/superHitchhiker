/**
 * Filename: GameConfig.js
 * Filepath: /src/config/GameConfig.js
 * 
 * A collection of utterly arbitrary constants that somehow manage to
 * keep the entire universe of the game from collapsing into a singularity
 * of indescribable chaos. The number 42 appears exactly once, and is, 
 * of course, the answer to the ultimate question of life, the universe, 
 * and this particular game's existence.
 */

export const GameConfig = {
    // Game dimensions, carefully calculated to be exactly as arbitrary as
    // the dimensions of an electronic thumb
    GAME_WIDTH: 800,
    GAME_HEIGHT: 600,
    
    // Physics values - gravity set to approximately 9.8 m/s²
    // (Though on some planets in the game, this would be wildly inaccurate)
    GRAVITY: 980,
    
    // Player movement constants
    PLAYER_SPEED: 200,
    PLAYER_JUMP: 400,
    
    // The answer to the ultimate question of life, the universe, and everything
    ANSWER_TO_EVERYTHING: 42,
    
    // A towel is about the most massively useful thing an interstellar hitchhiker can have
    TOWEL_VALUE: 5,
    TOTAL_TOWELS: 10,
    
    // Vogon poetry is the third worst in the universe
    VOGON_DAMAGE: 15,
    VOGON_SPEED: 100,
    POETRY_SPEED: 150,
    
    // Probability values for the Infinite Improbability Drive
    // (Any resemblance to actual probabilities is purely coincidental)
    IMPROBABILITY_CHANCE: 0.05, // 5% chance per update that something improbable happens
    
    // No game is complete without a DEBUG_MODE that almost nobody will ever use
    DEBUG_MODE: false,
    
    // The pan-dimensional beings would be proud of this level design
    LEVELS: [
        'Earth', 
        'VogonShip', 
        'HeartOfGold', 
        'Restaurant'
    ],
    
    // Quotes that appear just frequently enough to be amusing
    // but not so frequently as to violate copyright laws
    QUOTES: [
        "Don't Panic!",
        "So long, and thanks for all the fish",
        "Time is an illusion. Lunchtime doubly so.",
        "The ships hung in the sky in much the same way that bricks don't."
    ]
};