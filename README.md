# Cornered!

This is a game that can be played with ordinary checkers on a checkerboard, but here's a digital version.

```bash
npm install
npm run dev
```

## Rules

### Game Setup

1. Each player starts with 24 checkers, so in this verson that's 24 blue and 24 orange checkers.
2. Each player places a stack of 4 of their checkers in opposing corners, and should have 20 left outside the board.
3. Flip a coin to determine who goes first, then alternate turns until there is a winner.

### During Your Turn

1. If you have checkers outside the board, add one checker of your color to each of your stacks with fewer than 4 checkers that are contiguous with your starting space.

   - If you have more applicable stacks than checkers outside the board, you may select which of your stacks get checkers added.

2. Take as many actions as you wish, in any order:

   - Move a checker that has not yet moved during this turn to an adjacent empty space or another of your stacks with fewer than 4 checkers.
   - Attack an opponent’s stack from an adjacent stack of yours. Flip a coin:
     - If heads, remove a checker from your opponent’s stack.
     - If tails, remove a checker from your own stack.

### Winning The Game

The last player to maintain at least one of their checkers on their starting space wins.
