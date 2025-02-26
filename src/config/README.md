# The Configuration Directory

## A Repository of Entirely Arbitrary Values

Welcome to the configuration directory, a collection of constants and settings that govern the behavior of the game in much the same way that the laws of physics govern our universe—which is to say, they seem important and unchangeable until someone comes along and changes them on a whim.

## What's In Here?

```
config/
├── GameConfig.js    # Constants for game mechanics, physics, and scoring (including the number 42)
└── AssetConfig.js   # File paths and metadata for all game assets (digital bits that make the game look pretty)
```

These two files contain the sacred numbers and mystical strings that determine everything from how high Arthur Dent can jump to how deadly Vogon poetry is (very). They are the digital equivalent of the laws of thermodynamics, only considerably easier to change and with far less paperwork involved.

## GameConfig.js

This file contains constants like:

- `GAME_WIDTH` and `GAME_HEIGHT`: The dimensions of your virtual universe
- `GRAVITY`: How strongly the game pulls things downward (unlike real gravity, this one only works in one direction)
- `PLAYER_SPEED` and `PLAYER_JUMP`: How quickly Arthur can flee from danger
- `ANSWER_TO_EVERYTHING`: Set to 42, naturally
- `VOGON_DAMAGE`: How painful their poetry is, measured in arbitrary health units
- And many more values that seemed important at the time

If you ever wonder why the player jumps too high, the enemies move too fast, or why collecting exactly 42 points causes the screen to flash with "DON'T PANIC," the answers lie herein.

## AssetConfig.js

A meticulous catalog of every image, sound, font, and tilemap used in the game. It's rather like a librarian's index of books, except none of the books actually exist until the game loads them, and sometimes they refuse to appear altogether, causing mysterious "404" errors that no one can explain.

This file exists primarily because typing "../assets/images/vogon.png" dozens of times throughout the code seemed tedious, and programmers, like the Ravenous Bugblatter Beast of Traal, are incredibly lazy creatures.

## Should I Change These Values?

Of course! That's what they're there for. Just be aware that changing one innocent-looking constant might have effects as far-reaching as the Infinite Improbability Drive. For instance:

- Setting `GRAVITY` to a negative value will make everything float upward, which is technically accurate in space but makes for a confusing platformer
- Changing `VOGON_DAMAGE` to 0 will make their poetry harmless, which is wildly unrealistic
- Setting `ANSWER_TO_EVERYTHING` to anything other than 42 might tear a hole in the space-time continuum (or just break the special event trigger—we haven't tested it)

If you do make changes, remember to test them. And if the game suddenly starts behaving as though it's been affected by the Infinite Improbability Drive, simply restore the original values and pretend it never happened. That strategy works for most of life's problems.

Remember: DON'T PANIC, and always back up your configuration files before experimenting with the fundamental constants of your digital universe.