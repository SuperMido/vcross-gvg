// Application state management
export const state = {
    // Placed items
    placedMembers: [],
    placedGroups: [],
    placedObjectives: [],
    placedBosses: [],
    placedTowers: [],
    placedTrees: [],
    placedEnemies: [],
    
    // UI state
    filteredMembers: [],
    currentFilter: 'all',
    currentRoleFilter: 'all',
    currentView: 'grouped',
    placingMode: null,
    
    // Drawing state
    drawingMode: false,
    autoDeleteDrawings: false,
    drawingPaths: [],
    drawingDeleteTimers: [],
    drawingHistory: [],
    drawingRedoStack: [],
    
    // Split view state
    activeSplitGroupId: null
};

// Constants
export const CONSTANTS = {
    MAX_PLAYERS: 30,
    MAX_ENEMIES: 30,
    ENEMIES_PER_CLICK: 5,
    GROUP_MERGE_DISTANCE: 80,
    AUTO_DELETE_DELAY: 10000,
    TEAM_ORDER: ['FrontLine', 'Jungle', 'Defence 1', 'Defence 2', 'Backline 1', 'Backline 2']
};

// State helpers
export function isPlayerPlaced(playerId) {
    return state.placedMembers.some(p => p.id === playerId) ||
           state.placedGroups.some(g => g.members && g.members.some(m => m.id === playerId));
}

export function getPlacedPlayerCount() {
    const individualCount = state.placedMembers.length;
    const groupCount = state.placedGroups.reduce((sum, g) => sum + (g.members ? g.members.length : 0), 0);
    return individualCount + groupCount;
}

export function getEnemyCount() {
    return state.placedEnemies.reduce((sum, e) => sum + (e.count || 1), 0);
}
