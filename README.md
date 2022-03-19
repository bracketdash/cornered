# Cornered!

This is a game that can be played with ordinary checkers on a checkerboard, but here's a digital version.

```bash
npm install
npm start
```

## Rules

### Game Setup

1. Each player starts with 33 checkers of their color, different from their opponent.
2. Each player places a stack of 3 of their checkers in opposing corners of the inner 4x4 square.
3. Flip a coin to determine who goes first, then alternate turns until there is a winner.

### During Your Turn

1. Count the number of squares with 1 or 2 (not 3) of your checkers. If this number is less than the number of checkers you have outside the board, add one checker to the top of each qualifying pile.
2. Take as many actions as you wish/can, in any order:

   - Move a checker that has not yet moved during this turn to an adjacent...
     - empty space, or
     - another of your stacks with fewer than 3 checkers.
   - Attack an opponent’s stack from an adjacent stack of yours: Flip a coin...
     - If heads, remove a checker from your opponent’s stack.
     - If tails, remove a checker from your own stack.

### Winning The Game

The last player to maintain at least one of their checkers on their starting space wins.
