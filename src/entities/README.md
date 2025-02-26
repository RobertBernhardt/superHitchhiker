# The Entities Directory

## Digital Lifeforms with Questionable Intelligence

Welcome to the entities directory, home to all the beings that populate our game universe. Like the actual universe, it's filled with creatures that move about with varying degrees of purpose, occasionally bumping into each other and generally causing a fuss.

## What's In Here?

```
entities/
├── Player.js       # The hapless protagonist in a bathrobe
├── Enemy.js        # The base class for things that wish to harm you
├── Vogon.js        # Bureaucratic aliens with a penchant for terrible poetry
├── Poetry.js       # Weaponized verse that causes physical damage
└── Collectible.js  # Things worth picking up, primarily towels
```

These files contain the code that brings our digital creatures to life, giving them behaviors ranging from "run left and right" to "recite poetry so bad it causes actual damage." If the game were a zoo, this would be where all the animals are defined—though most real zoos have fewer entities that fire poetry as a weapon.

## The Cast of Characters

### Player.js

Arthur Dent (or Ford Prefect, if you prefer): A confused Earthman in a bathrobe, perpetually bewildered by the universe around him yet surprisingly adept at jumping over obstacles and collecting towels. His primary abilities include running, jumping, and not dying, though success at the latter is largely dependent on the player's competence.

### Enemy.js

The base class for all antagonistic entities. Like the abstract concept of bureaucracy, it doesn't do much on its own but provides a foundation for more specific implementations of annoyance.

### Vogon.js

Extends the Enemy class with specific abilities like reciting poetry so awful it manifests as damaging projectiles. The Vogons are the galaxy's bureaucrats—not actually evil, but bad-tempered, officious, and callous. Their poetry is widely considered to be the third worst in the universe.

### Poetry.js

A projectile class representing concentrated verse of staggering awfulness. When fired at the player, it causes damage through sheer literary ineptitude. Contains actual snippets of faux-Vogon poetry that would make any English teacher weep.

### Collectible.js

Primarily towels, because as any interstellar hitchhiker knows, a towel is about the most massively useful thing you can have. These entities float enticingly, waiting to be collected for points. Collecting exactly 42 points triggers a special effect, because of course it does.

## How They Work Together

The entities interact in ways that would make a physicist question the laws of nature:

- Players can collect Collectibles
- Enemies can damage Players
- Vogons can fire Poetry at Players
- Poetry can damage Players
- Players can (indirectly) defeat Enemies by jumping on them or through special abilities

It's all very organized in a completely chaotic sort of way, much like the universe itself.

## Extending This System

If you wish to add new entities to the game—perhaps a Ravenous Bugblatter Beast of Traal or a depressed robot—simply create a new file extending the appropriate base class. The universe is vast and can always accommodate more digital beings with questionable AI.

Just remember that with great power comes great responsibility, and with more entities comes greater processor load. Not every computer can handle an infinite improbability of sprites.

Remember: DON'T PANIC, and if your entities start behaving in unexpected ways, it's not a bug—it's a feature of the Infinite Improbability Drive.