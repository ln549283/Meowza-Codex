# Meowza Asset Pack

Production-oriented pack extracted from the approved visual direction.

## Folders
- branding/: logo
- cats/: board sprites and compact variants
- board/: illustrated board frames + optional tile states
- rules/: SAME / DIFFERENT markers
- decor/: yarn, pillows, plants, rug, cat tree
- backgrounds/: cozy home artwork
- fx/: celebration particles reference
- ui/: optional badges / feedback panels
- references/: approved concept and technical boards

## Implementation rule
The UI remains real HTML/CSS/JS. Do not use screenshots as full-screen backgrounds. The board grid is CSS Grid generated from `--grid-size` (4, 5 or 6), positioned over `board-frame-blue.png`. Keep the board square with `aspect-ratio: 1/1`.

## Recommended CSS-owned elements
Buttons, toggles, text panels, cell geometry, shadows, selected/error/hint glows, progress layouts and responsive spacing should be CSS. This preserves accessibility and responsiveness.

## Core files for Code
1. `branding/meowza-logo.png`
2. `board/board-frame-blue.png`
3. `cats/grey-board.png`
4. `cats/orange-board.png`
5. `cats/grey-small.png` / `cats/orange-small.png`
6. `rules/same-circle.png`
7. `rules/different-circle.png`
8. `backgrounds/home-cozy.png`
9. optional decor files

See `manifest.json` for all file names and intended use.
