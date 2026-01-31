// Utility functions
export function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

export function getRoleColor(role) {
    const colors = {
        'DPS': '#ff6b6b',
        'Tank': '#4dabf7',
        'Healer': '#51cf66',
        'Support': '#ffd43b'
    };
    return colors[role] || '#868e96';
}

export function getTeamColor(team) {
    const colors = {
        'FrontLine': '#ff6b6b',
        'Jungle': '#845ef7',
        'Defence 1': '#4dabf7',
        'Defence 2': '#51cf66',
        'Backline 1': '#ffd43b',
        'Backline 2': '#ff922b'
    };
    return colors[team] || '#868e96';
}

export function calculateDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

export const WEAPON_TYPES = [
    'Nameless Sword',
    'Nameless Spear',
    'Stormbreaker Spear',
    'Thundercry Blade',
    'Infernal Twinblades',
    'Mortal Rope Dart',
    'Vernal Umbrella',
    'Inkwell Fan',
    'Panacea Fan',
    'Soulshade Umbrella',
    'Heavenquaker Spear',
    'Strategic Sword'
];
