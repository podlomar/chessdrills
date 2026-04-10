# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server

## Architecture

This is a chess training application built with TypeScript, React 19, and the ionbeam framework (Express-based SSR).

### Server Entry Point

[server.tsx](src/server.tsx) creates an Express-like server using ionbeam's `createServer()`. Routes use `req.ionbeam.renderPage()` for full pages and `req.ionbeam.renderElement()` for partial renders (like SVG).

### Routes

- `/` - Homepage displaying a chess board image
- `/board?fen=<placement>` - Returns SVG image of a chess board from FEN placement notation

### Key Modules

**src/chessboard/**
- [fen.ts](src/chessboard/fen.ts) - FEN notation parsing (`fenToChessBoard`) and generation (`chessBoardToFen`). ChessBoard is a 64-element array of pieces or null.
- [generate.ts](src/chessboard/generate.ts) - Random position generators for training scenarios
- [SVGBoard/](src/chessboard/SVGBoard/) - React components that render chess boards as pure SVG with piece definitions in `<defs>`

**src/pages/**
- Each page has `index.tsx` (server component), optional `client.ts` (client-side JS), and `styles.css`

### Conventions

- Use `.js` extension in imports (TypeScript compiles to ESM)
- Piece notation: lowercase = black, uppercase = white (p/P = pawn, r/R = rook, etc.)
