# VCross-GVG - Where Winds Meet Guild War Strategy Tool

A drag-and-drop interface for planning Guild vs Guild battle strategies in "Where Winds Meet".

## Game Context

**Where Winds Meet** is a game where guilds battle against each other. This tool helps you plan your battle strategy by visually positioning your guild members on the battle map.

## Features

- **30 Player Limit**: Maximum 30 players can be placed on the map (guild war constraint)
- **6 Team Positions**: 
  - FrontLine
  - Jungle
  - Defence 1
  - Defence 2
  - Backline 1
  - Backline 2
- **4 Player Roles**: 
  - Tank (Blue markers)
  - DPS (Red markers)
  - Healer (Green markers)
  - Support (Yellow markers)
- **Drag & Drop**: Drag players from the list and drop them anywhere on the battle map
- **Dual Filtering**: Filter by both team position and role simultaneously
- **Search**: Real-time search to find players quickly
- **Color-Coded Markers**: Each role has a distinct color on the map
- **Repositioning**: Easily reposition players by dragging them to new locations
- **Remove Players**: Hover over placed players to see a remove button
- **Persistent Storage**: Your strategy is automatically saved in browser
- **Export Strategy**: Export your battle positions to a JSON file
- **Responsive Design**: Works on desktop and tablet devices

## Getting Started

1. **Open the application**: Simply open `index.html` in a web browser
2. **Your map is already loaded**: The `image.png` file you provided is set as the battle map
3. **Plan your strategy**:
   - Use filters to find players by team position (FrontLine, Jungle, etc.)
   - Use role filters to find specific roles (Tank, DPS, Healer, Support)
   - Drag players onto the map where you want them positioned
   - Reposition them anytime by dragging them again
   - Maximum 30 players on the map

## Customizing Player Data

Edit the `data.js` file to add your actual guild members:

```javascript
const members = [
    { id: 1, name: "YourPlayerName", role: "Tank", team: "FrontLine" },
    { id: 2, name: "AnotherPlayer", role: "DPS", team: "Jungle" },
    // Add up to 30 players...
];
```

### Valid Roles:
- `Tank` - Blue color on map
- `DPS` - Red color on map
- `Healer` - Green color on map
- `Support` - Yellow color on map

### Valid Teams:
- `FrontLine`
- `Jungle`
- `Defence 1`
- `Defence 2`
- `Backline 1`
- `Backline 2`

## Battle Map

The battle map (`image.png`) shows the arena where your guild will fight. Position your players strategically based on:
- Their role (Tank, DPS, Healer, Support)
- Their team assignment (FrontLine, Backline, etc.)
- Map features and strategic positions

## Tips for Strategy Planning

- **Tanks** go on the frontline to absorb damage
- **DPS** players should be positioned for maximum damage output
- **Healers** typically stay in backline positions for safety
- **Support** players can be positioned flexibly based on their abilities
- Use the color coding to quickly identify role distribution
- Export your strategy before battles to share with guild members
- Try different formations and save them by exporting

## Browser Compatibility

Works in all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari

## Files

- `index.html` - Main application interface
- `styles.css` - All styling and layout
- `data.js` - Player data (customize this with your guild members!)
- `app.js` - Application logic and drag-drop functionality
- `image.png` - Your battle map
- `README.md` - This file

## Controls

- **Search Box**: Find players by name, role, or team
- **Team Filters**: Show only players from specific teams
- **Role Filters**: Show only specific roles (Tank/DPS/Healer/Support)
- **Clear All Placements**: Remove all players from the map
- **Export Strategy**: Download your battle formation as JSON

Good luck in your guild wars! 🎮⚔️
