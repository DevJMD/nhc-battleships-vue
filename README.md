# NHC Battleships

## Description
A demonstration of a simple battleship game using TypeScript and Vue.

## Spec
- The game is played on a 10x10 grid (A1-J10).
- It's single-sided, meaning only you play against the computer.
- There are 3 ships:
  - Battleship (5 squares)
  - Destroyer (4 squares)
  - Destroyer (4 squares)
- Ships can be placed either horizontally or vertically.
- Ships cannot overlap.
- Ships cannot be placed outside the grid.
- Ships cannot be placed in the same row or column as another ship.
- There is feedback for the player when they attack a square:
  - Hit
  - Miss
  - Sunk
  - Game Over
  - Invalid move
- The game ends when all ships are sunk or the player runs out of moves.
- The game can be reset at any time.

# Development
- Clone the repository
- Create a `.env.local` file in the root directory
```bash
cp .env.local.example .env.local
```
It must contain:
```bash
VITE_BS_ROW_COUNT=10
VITE_BS_COLUMN_COUNT=10
```
- Install dependencies
```bash
npm install
```
- Run the development app
```bash
npm run dev
```
- Open the app in your browser at `http://localhost:5173/`

## Build
- To build the app for production, use the following:
```bash
npm run build
```
- Build files will be generated in the `dist` directory.

### Testing
- To run the tests, use the following:
```bash
npm run test
```

Test structure:
- States are tested using Vitest:
  - `src/stores/__tests__*.spec.ts`
- Unit tests are written using Vitest:
  - `src/__tests__*.spec.ts`
