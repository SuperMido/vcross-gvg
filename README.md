# VCross-GVG - Where Winds Meet Guild War Strategy Tool

A comprehensive, interactive drag-and-drop application for planning Guild vs Guild battle strategies in "Where Winds Meet". Plan, visualize, and share your battle formations with your guild!

## 📖 Overview

**Where Winds Meet** is an MMORPG where guilds battle against each other in strategic 30v30 combat. This tool helps guild leaders and strategists plan their battle formations by visually positioning guild members on an interactive battle map.

## ✨ Key Features

### 👥 Player Management
- **Player Database**: Manage up to 30 guild members with full details
- **Player Profiles**: Each player has name, role, team assignment, and dual weapon loadouts
- **Add/Edit/Delete**: Full CRUD operations for managing your guild roster
- **Real-time Updates**: Changes are instantly reflected on the map
- **Persistent Storage**: All player data saved in browser localStorage

### 🎯 Strategic Planning
- **Drag & Drop Interface**: Drag individual players or entire teams onto the map
- **Team Grouping**: Drop entire teams at once - they merge into group markers showing total count
- **Group Management**: 
  - View group composition with role breakdown
  - Split groups back into individual teams
  - Split individual members from groups
  - Merge nearby groups by proximity (< 80px)
- **Enemy Markers**: Add enemy groups (5 players each, up to 6 groups/30 enemies)

### 🗺️ Map Tools
- **Objective Markers (🎯)**: Mark strategic objectives
- **Boss Markers**: Place boss spawn locations
- **Tower Markers**: Mark defensive tower positions
- **Tree Markers (🌳)**: Mark environmental cover/obstacles
- **Drawing Tool**: 
  - Freehand drawing on the map
  - Custom color selection
  - Auto-delete mode (drawings disappear after 10 seconds)
  - Undo/Redo functionality
  - Clear all drawings

### 🔍 Filtering & Search
- **Real-time Search**: Search by player name, role, or team
- **Role Filters**: Filter by Tank, DPS, Healer, or Support
- **View Modes**: 
  - Grouped by Team (collapsible teams)
  - All Players (flat list)
- **Smart Filtering**: Hides already-placed players from the list

### 📊 Visual Feedback
- **Color-Coded Roles**:
  - 🔵 Tank (Blue)
  - 🔴 DPS (Red)
  - 🟢 Healer (Green)
  - 🟡 Support (Yellow)
- **Group Markers**: Show player count and role composition
- **Tooltips**: Hover over markers to see detailed information
- **Player Counter**: Real-time tracking of placed/total players

### 💾 Import/Export
- **Export Strategy**: Save complete battle plans as JSON files including:
  - All player data
  - All marker positions (players, groups, objectives, bosses, towers, trees)
  - All drawings with colors
- **Import Strategy**: Load previously saved strategies
- **Share Plans**: Send JSON files to guild members to review strategies

### 🎨 UI/UX Features
- **Dark/Light Theme**: Toggle between dark and light modes (saved preference)
- **Collapsible Panel**: Hide the player list for better map visibility
- **Responsive Design**: Works on desktop and tablet devices
- **Keyboard Shortcuts**: Quick access to tools (see Hot Keys modal)
- **Drag Anywhere**: All markers can be repositioned on the map
- **Remove Buttons**: Easy removal of any placed element

## 🚀 Getting Started

### Quick Start
1. **Open the application**: Simply open `index.html` in a web browser
2. **Add your guild members**: Click the ⚙️ button next to "Guild Members" to manage players
3. **Plan your strategy**:
   - Drag individual players or entire teams onto the map
   - Add objectives, bosses, and other markers
   - Draw attack routes or strategic plans
   - Position enemies to simulate battle scenarios
4. **Save your work**: Use "Export Strategy" to save your battle plan
5. **Share with guild**: Send the exported JSON file to your guild members

### First Time Setup
1. Click the ⚙️ (Manage Players) button in the left panel
2. Click "+ Add New Player" to add each guild member
3. Fill in their details:
   - **Name**: Player name
   - **Role**: Tank, DPS, Healer, or Support
   - **Team**: FrontLine, Jungle, Defence 1, Defence 2, Backline 1, or Backline 2
   - **Weapon 1 & 2**: Choose from available weapon options
4. Save and repeat for all guild members (up to 30)

## 📋 Player Roles & Teams

### Roles (Color-Coded)
- **Tank** 🔵 - Blue markers - Frontline defenders
- **DPS** 🔴 - Red markers - Damage dealers
- **Healer** 🟢 - Green markers - Support/healing
- **Support** 🟡 - Yellow markers - Utility/buffs

### Team Positions
- **FrontLine** - Main assault force
- **Jungle** - Flanking/roaming units
- **Defence 1** - First defensive line
- **Defence 2** - Second defensive line
- **Backline 1** - Support group 1
- **Backline 2** - Support group 2

### Available Weapons
- Nameless Sword
- Nameless Spear
- Stormbreaker Spear
- Thundercry Blade
- Infernal Twinblades
- Mortal Rope Dart
- Vernal Umbrella
- Inkwell Fan
- Panacea Fan
- Soulshade Umbrella
- Heavenquaker Spear
- Strategic Sword

## 🎮 How to Use

### Placing Players
1. **Individual Players**: 
   - Drag a player from the left panel onto the map
   - Position them where you want
   - Drag to reposition anytime

2. **Team Groups**: 
   - Click the team header (e.g., "FrontLine") to drag the entire team
   - Drop on the map to create a group marker
   - Groups show total player count and role breakdown

3. **Managing Groups**:
   - Hover over a group to see details
   - Click "⚡ Split Members" to selectively remove players
   - Click "📦 Split into Teams" to separate merged groups
   - Drag groups to reposition - they auto-merge if placed near each other (< 80px)

### Adding Map Markers
- **Objectives** 🎯: Click the button or press **O**
- **Bosses**: Click the button or press **B**
- **Towers**: Click the button or press **T**
- **Trees** 🌳: Click the button or press **E**
- Click on the map to place the marker
- Drag markers to reposition them
- Click the × button to remove them

### Drawing on Map
1. Click the ✏️ button or press **D** to enter drawing mode
2. Choose a color with the color picker
3. Click and drag to draw
4. Enable "Auto-delete" to have drawings fade after 10 seconds
5. Use Undo (**Ctrl+Z**) / Redo (**Ctrl+Y**) when auto-delete is off

### Adding Enemies
- Click "⚔️ Add 5 Enemies" button
- Adds a group of 5 enemy players
- Maximum 6 groups (30 enemies total)
- Drag enemy groups to position them

### Keyboard Shortcuts
Press **Shift+?** to see all keyboard shortcuts:
- **O** - Add Objective
- **B** - Add Boss
- **T** - Add Tower
- **E** - Add Tree
- **D** - Toggle Draw Mode
- **Ctrl+Z** - Undo Drawing
- **Ctrl+Y** - Redo Drawing
- **Esc** - Deselect Tool

## 💡 Strategic Planning Tips

### Formation Planning
- **Frontline**: Position Tanks at choke points and entry ways
- **DPS Positioning**: Place behind tanks or on flanks for maximum damage
- **Healer Safety**: Keep healers in protected backline positions
- **Support Flexibility**: Position supports where they can affect the most players

### Using Markers
- **Objectives** 🎯: Mark capture points, key areas to control
- **Bosses**: Mark boss spawn locations your team should contest
- **Towers**: Mark defensive structures to take down
- **Trees** 🌳: Mark cover, hiding spots, or ambush locations

### Drawing Tool Uses
- Draw attack routes with arrows
- Circle high-priority targets
- Mark danger zones
- Illustrate movement patterns
- Use different colors for different phases of battle

### Group Strategy
- Group teams together for coordinated pushes
- Split groups to show individual assignments
- Use auto-merge to quickly reorganize formations
- Export multiple strategies for different scenarios

## 💾 Saving & Sharing

### Export Strategy
1. Click the menu button (☰) in the header
2. Select "📥 Export Strategy"
3. A JSON file will download with all your data:
   - Player list and details
   - All player/group positions
   - All markers (objectives, bosses, towers, trees, enemies)
   - All drawings with colors
4. Name it descriptively (e.g., "guild-war-defense-formation.json")

### Import Strategy
1. Click menu (☰) → "📤 Import Strategy"
2. Select a previously exported JSON file
3. Everything will be restored:
   - Player data
   - All positions
   - All markers
   - All drawings

### Sharing with Guild
- Export your strategy to JSON
- Share the file via Discord, email, or cloud storage
- Guild members import it to view your exact formation
- Collaborate by having multiple people create different strategies

## 🛠️ Technical Details

### Browser Compatibility
Works in all modern browsers:
- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Opera

### Data Storage
- **localStorage**: All data is saved locally in your browser
- **No Server Required**: 100% client-side application
- **Privacy**: Your data never leaves your computer
- **Persistence**: Data survives browser restarts

### File Structure
```
vcross-gvg/
├── index.html          # Main application interface
├── styles.css          # All styling and theming
├── app.js              # Application logic and functionality
├── data.js             # Player data structure
├── images/             # Image assets
│   ├── boss.png        # Boss marker icon
│   └── tower.png       # Tower marker icon
└── README.md           # This documentation
```

### Features Breakdown
- **Player Management**: Full CRUD operations with localStorage persistence
- **Drag & Drop**: Native HTML5 drag-and-drop API with custom logic
- **Canvas Drawing**: HTML5 Canvas for freehand drawing with path history
- **Group System**: Automatic grouping/merging based on proximity
- **Theme System**: CSS variables for easy dark/light theme switching
- **Export/Import**: JSON serialization of entire application state

## 🎨 Customization

### Changing the Battle Map
Replace the map placeholder in CSS or add your own background image:
```css
.map-area {
    background-image: url('your-map-image.png');
    background-size: cover;
}
```

### Adjusting Constants
Edit `app.js` to change limits:
```javascript
const MAX_PLAYERS = 30;           // Maximum players on map
const MAX_ENEMIES = 30;            // Maximum enemy players
const GROUP_MERGE_DISTANCE = 80;   // Pixel distance for auto-merge
const AUTO_DELETE_DELAY = 10000;   // Drawing auto-delete time (ms)
```

### Weapon List
Edit the weapon options in `index.html` (two locations in the form):
```html
<option value="Your Custom Weapon">Your Custom Weapon</option>
```

## 📱 Usage Scenarios

### Pre-Battle Planning
1. Import your guild roster
2. Create multiple formation strategies
3. Export and share with guild leaders
4. Vote on the best formation

### During Strategy Meeting
1. Share screen via Discord/Zoom
2. Collaboratively position players
3. Draw attack routes in real-time
4. Export final plan for everyone

### Post-Battle Analysis
1. Recreate actual battle positions
2. Draw what went wrong/right
3. Plan adjustments for next battle
4. Save as "lessons learned" export

### Training New Members
1. Show them standard formations
2. Explain their role and position
3. Draw expected movement patterns
4. Let them practice positioning

## 🤝 Contributing & Support

### Found a Bug?
- Open an issue with steps to reproduce
- Include browser and OS information
- Screenshots are helpful!

### Feature Requests
- Suggest new features via issues
- Describe the use case
- Explain how it helps strategy planning

### Join the Community
- Discord: [https://discord.gg/vcross](https://discord.gg/vcross)
- Share your strategies and tips with other guilds!

## 📝 Credits

**Created by [VCross](https://discord.gg/vcross)-Mido**

Built with ❤️ for the Where Winds Meet community

## 📄 License

This is a free tool for the Where Winds Meet community. Feel free to use, share, and modify as needed for your guild!

---

## 🎯 Quick Reference Card

### Common Tasks
| Task | How To |
|------|--------|
| Add player | Manage Players (⚙️) → + Add New Player |
| Place player | Drag from list to map |
| Place team | Drag team header to map |
| Add objective | Click 🎯 or press **O** |
| Draw route | Click ✏️ or press **D** |
| Save strategy | Menu (☰) → Export Strategy |
| Toggle theme | Click 🌙/☀️ button |
| See shortcuts | Menu → ⌨️ Hot Keys |

### Important Limits
- **Maximum Players**: 30 on map
- **Maximum Enemies**: 30 (6 groups of 5)
- **Group Merge Distance**: 80 pixels
- **Auto-delete Timer**: 10 seconds

---

**Good luck in your guild wars! ⚔️🛡️🎮**
