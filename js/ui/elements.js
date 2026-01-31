// DOM element references
export const elements = {
    // Lists and containers
    memberList: document.getElementById('memberList'),
    mapArea: document.getElementById('mapArea'),
    
    // Search and filters
    searchInput: document.getElementById('searchInput'),
    roleFilterButtons: document.querySelectorAll('.role-filter-btn'),
    viewToggleButtons: document.querySelectorAll('.view-toggle-btn'),
    
    // Action buttons
    clearMapBtn: document.getElementById('clearMapBtn'),
    exportBtn: document.getElementById('exportBtn'),
    addObjectiveBtn: document.getElementById('addObjectiveBtn'),
    addBossBtn: document.getElementById('addBossBtn'),
    addTowerBtn: document.getElementById('addTowerBtn'),
    addTreeBtn: document.getElementById('addTreeBtn'),
    addEnemiesBtn: document.getElementById('addEnemiesBtn'),
    
    // Drawing controls
    drawBtn: document.getElementById('drawBtn'),
    clearDrawBtn: document.getElementById('clearDrawBtn'),
    undoDrawBtn: document.getElementById('undoDrawBtn'),
    redoDrawBtn: document.getElementById('redoDrawBtn'),
    autoDeleteToggle: document.getElementById('autoDeleteToggle'),
    drawingCanvas: document.getElementById('drawingCanvas'),
    
    // Stats displays
    playerCount: document.getElementById('playerCount'),
    placedCount: document.getElementById('placedCount'),
    enemyCount: document.getElementById('enemyCount'),
    
    // Player management modal
    managePlayersBtn: document.getElementById('managePlayersBtn'),
    playerManagementModal: document.getElementById('playerManagementModal'),
    playerEditModal: document.getElementById('playerEditModal'),
    closeModalBtn: document.getElementById('closeModalBtn'),
    closeEditModalBtn: document.getElementById('closeEditModalBtn'),
    addNewPlayerBtn: document.getElementById('addNewPlayerBtn'),
    playerManagementList: document.getElementById('playerManagementList'),
    playerEditForm: document.getElementById('playerEditForm'),
    cancelEditBtn: document.getElementById('cancelEditBtn')
};

// Canvas context
export const ctx = elements.drawingCanvas ? elements.drawingCanvas.getContext('2d') : null;
