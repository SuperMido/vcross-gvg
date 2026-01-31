// Storage utilities for saving/loading data
const STORAGE_KEYS = {
    PLAYERS: 'gvg_players',
    POSITIONS: 'gvg_positions'
};

export function savePlayersToStorage(players) {
    try {
        localStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(players));
    } catch (error) {
        console.error('Error saving players to storage:', error);
    }
}

export function loadPlayersFromStorage() {
    try {
        const saved = localStorage.getItem(STORAGE_KEYS.PLAYERS);
        if (saved) {
            const loadedPlayers = JSON.parse(saved);
            // Update global members array
            if (window.members && Array.isArray(loadedPlayers)) {
                window.members.length = 0;
                window.members.push(...loadedPlayers);
                return loadedPlayers;
            }
        }
    } catch (error) {
        console.error('Error loading players from storage:', error);
    }
    return null;
}

export function savePositionsToStorage(positions) {
    try {
        localStorage.setItem(STORAGE_KEYS.POSITIONS, JSON.stringify(positions));
    } catch (error) {
        console.error('Error saving positions to storage:', error);
    }
}

export function loadPositionsFromStorage() {
    try {
        const saved = localStorage.getItem(STORAGE_KEYS.POSITIONS);
        if (saved) {
            return JSON.parse(saved);
        }
    } catch (error) {
        console.error('Error loading positions from storage:', error);
    }
    return null;
}

export function getAllStorageData() {
    return {
        placedMembers: [],
        placedGroups: [],
        placedObjectives: [],
        placedBosses: [],
        placedTowers: [],
        placedTrees: [],
        placedEnemies: []
    };
}

export function setAllStorageData(data) {
    savePositionsToStorage(data);
}
