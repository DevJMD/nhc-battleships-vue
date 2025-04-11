# NHC Battleships

## Description
A demonstration of a simple battleship game using TypeScript and Vue.

## Spec
- The game is played on a 10x10 grid.

# Development
- Clone the repository
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
