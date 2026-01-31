// Stats display management
import { state, getPlacedPlayerCount, getEnemyCount } from '../state/appState.js';
import { elements } from './elements.js';

export function updateCounts() {
    const placedCount = getPlacedPlayerCount();
    const totalPlayers = window.members ? window.members.length : 0;
    const enemyTotal = getEnemyCount();
    
    if (elements.playerCount) {
        elements.playerCount.textContent = totalPlayers;
    }
    if (elements.placedCount) {
        elements.placedCount.textContent = placedCount;
    }
    if (elements.enemyCount) {
        elements.enemyCount.textContent = enemyTotal;
    }
}
