// Application state
let placedMembers = [];
let placedGroups = []; // Store group placements
let placedObjectives = []; // Store objective markers
let placedBosses = []; // Store boss markers
let placedTowers = []; // Store tower markers
let placedEnemies = []; // Store enemy markers
let filteredMembers = [...members];
let currentFilter = 'all';
let currentRoleFilter = 'all';
let currentView = 'grouped'; // 'grouped' or 'list'
let placingMode = null; // 'objective' or 'boss' or 'tower' or null
let drawingMode = false;
let autoDeleteDrawings = false;
let drawingPaths = []; // Store drawing paths with timestamps
let drawingDeleteTimers = []; // Store timers for auto-delete
const MAX_PLAYERS = 30;
const MAX_ENEMIES = 30;
const ENEMIES_PER_CLICK = 5;
const GROUP_MERGE_DISTANCE = 80; // pixels - distance to auto-merge groups (reduced from 100)
const AUTO_DELETE_DELAY = 10000; // 10 seconds

// Team order for display
const TEAM_ORDER = ['FrontLine', 'Jungle', 'Defence 1', 'Defence 2', 'Backline 1', 'Backline 2'];

// DOM elements
const memberList = document.getElementById('memberList');
const mapArea = document.getElementById('mapArea');
const searchInput = document.getElementById('searchInput');
const roleFilterButtons = document.querySelectorAll('.role-filter-btn');
const viewToggleButtons = document.querySelectorAll('.view-toggle-btn');
const clearMapBtn = document.getElementById('clearMapBtn');
const exportBtn = document.getElementById('exportBtn');
const playerCount = document.getElementById('playerCount');
const placedCount = document.getElementById('placedCount');
const addObjectiveBtn = document.getElementById('addObjectiveBtn');
const addBossBtn = document.getElementById('addBossBtn');
const addTowerBtn = document.getElementById('addTowerBtn');
const drawBtn = document.getElementById('drawBtn');
const clearDrawBtn = document.getElementById('clearDrawBtn');
const autoDeleteToggle = document.getElementById('autoDeleteToggle');
const drawingCanvas = document.getElementById('drawingCanvas');
const ctx = drawingCanvas.getContext('2d');
const addEnemiesBtn = document.getElementById('addEnemiesBtn');
const enemyCount = document.getElementById('enemyCount');

// Initialize the application
function init() {
    renderMemberList();
    setupEventListeners();
    loadSavedPositions();
    updateCounts();
    initializeCanvas();
}

// Load map image if exists
function loadMapImage() {
    // Map is already set in CSS using image.png
}

// Render member list
function renderMemberList() {
    memberList.innerHTML = '';
    
    if (currentView === 'grouped') {
        renderGroupedView();
    } else {
        renderListView();
    }
}

// Render grouped view by team
function renderGroupedView() {
    TEAM_ORDER.forEach(teamName => {
        // Get all team members first (not filtered yet)
        const allTeamMembers = members.filter(m => m.team === teamName);
        
        // Then filter out placed members and apply search/role filters
        const teamMembers = allTeamMembers.filter(m => {
            // Check if member is already placed individually
            if (isPlayerPlaced(m.id)) return false;
            
            // Apply search filter
            const searchTerm = searchInput.value.toLowerCase();
            const matchesSearch = !searchTerm || 
                                 m.name.toLowerCase().includes(searchTerm) ||
                                 m.role.toLowerCase().includes(searchTerm) ||
                                 m.team.toLowerCase().includes(searchTerm);
            if (!matchesSearch) return false;
            
            // Apply role filter
            const matchesRole = currentRoleFilter === 'all' || m.role === currentRoleFilter;
            if (!matchesRole) return false;
            
            return true;
        });
        
        if (teamMembers.length > 0) {
            const groupDiv = document.createElement('div');
            groupDiv.className = 'team-group';
            
            const headerDiv = document.createElement('div');
            headerDiv.className = 'team-group-header';
            headerDiv.draggable = true;
            headerDiv.dataset.teamName = teamName;
            headerDiv.innerHTML = `
                <span><span class="toggle-icon">▼</span> ${teamName}</span>
                <span class="team-count">${teamMembers.length}</span>
            `;
            headerDiv.addEventListener('click', (e) => {
                if (e.target === headerDiv || e.target.closest('.toggle-icon')) {
                    toggleTeamGroup(groupDiv);
                }
            });
            headerDiv.addEventListener('dragstart', handleTeamDragStart);
            headerDiv.addEventListener('dragend', handleDragEnd);
            
            const playersDiv = document.createElement('div');
            playersDiv.className = 'team-group-players';
            
            teamMembers.forEach(member => {
                const memberElement = createMemberElement(member);
                playersDiv.appendChild(memberElement);
            });
            
            groupDiv.appendChild(headerDiv);
            groupDiv.appendChild(playersDiv);
            memberList.appendChild(groupDiv);
        }
    });
}

// Render list view (all players)
function renderListView() {
    // Filter members that aren't placed
    const availableMembers = members.filter(m => {
        // Skip if member is already placed
        if (isPlayerPlaced(m.id)) return false;
        
        // Apply search filter
        const searchTerm = searchInput.value.toLowerCase();
        const matchesSearch = !searchTerm || 
                             m.name.toLowerCase().includes(searchTerm) ||
                             m.role.toLowerCase().includes(searchTerm) ||
                             m.team.toLowerCase().includes(searchTerm);
        if (!matchesSearch) return false;
        
        // Apply role filter
        const matchesRole = currentRoleFilter === 'all' || m.role === currentRoleFilter;
        if (!matchesRole) return false;
        
        return true;
    });
    
    availableMembers.forEach(member => {
        const memberElement = createMemberElement(member);
        memberList.appendChild(memberElement);
    });
}

// Toggle team group collapse
function toggleTeamGroup(groupDiv) {
    groupDiv.classList.toggle('collapsed');
}

// Create member element
function createMemberElement(member) {
    const div = document.createElement('div');
    div.className = 'member-item';
    div.draggable = true;
    div.dataset.memberId = member.id;
    
    div.innerHTML = `
        <div class="member-info">
            <div class="member-name">${member.name}</div>
            <div class="member-team">${member.team}</div>
        </div>
        <div class="role-badge">${member.role}</div>
    `;
    
    div.addEventListener('dragstart', handleDragStart);
    div.addEventListener('dragend', handleDragEnd);
    
    return div;
}

// Drag handlers for member list
function handleDragStart(e) {
    e.currentTarget.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('text/plain', e.currentTarget.dataset.memberId);
    e.dataTransfer.setData('type', 'member');
}

// Handle team group drag
function handleTeamDragStart(e) {
    e.stopPropagation();
    e.currentTarget.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('text/plain', e.currentTarget.dataset.teamName);
    e.dataTransfer.setData('type', 'team');
}

function handleDragEnd(e) {
    e.currentTarget.classList.remove('dragging');
}

// Setup event listeners
function setupEventListeners() {
    // Map area drop events
    mapArea.addEventListener('dragover', handleDragOver);
    mapArea.addEventListener('dragleave', handleDragLeave);
    mapArea.addEventListener('drop', handleDrop);
    mapArea.addEventListener('click', handleMapClick);
    
    // Search functionality
    searchInput.addEventListener('input', handleSearch);
    
    // View toggle buttons
    viewToggleButtons.forEach(btn => {
        btn.addEventListener('click', handleViewToggle);
    });
    
    // Role filter buttons
    roleFilterButtons.forEach(btn => {
        btn.addEventListener('click', handleRoleFilter);
    });
    
    // Objective and Boss buttons
    addObjectiveBtn.addEventListener('click', toggleObjectiveMode);
    addBossBtn.addEventListener('click', toggleBossMode);
    addTowerBtn.addEventListener('click', toggleTowerMode);
    
    // Drawing buttons
    drawBtn.addEventListener('click', toggleDrawingMode);
    clearDrawBtn.addEventListener('click', clearAllDrawings);
    autoDeleteToggle.addEventListener('change', handleAutoDeleteToggle);
    
    // Enemy button
    addEnemiesBtn.addEventListener('click', addEnemies);
    
    // Clear map button
    clearMapBtn.addEventListener('click', clearAllPlacements);
    
    // Export button
    exportBtn.addEventListener('click', exportPositions);
    
    // Window resize
    window.addEventListener('resize', resizeCanvas);
}

// Map drag over
function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    mapArea.classList.add('drag-over');
}

// Map drag leave
function handleDragLeave(e) {
    if (e.target === mapArea) {
        mapArea.classList.remove('drag-over');
    }
}

// Handle drop on map
function handleDrop(e) {
    e.preventDefault();
    mapArea.classList.remove('drag-over');
    
    // If in placing mode, ignore drops
    if (placingMode) {
        return;
    }
    
    const type = e.dataTransfer.getData('type');
    const data = e.dataTransfer.getData('text/plain');
    
    const rect = mapArea.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (type === 'team') {
        // Dropping a team group
        const teamName = data;
        placeTeamGroupOnMap(teamName, x, y);
    } else if (type === 'member') {
        // Dropping individual member
        const memberId = parseInt(data);
        const member = members.find(m => m.id === memberId);
        
        if (!member) return;
        
        // Check if already placed
        if (isPlayerPlaced(memberId)) {
            alert(`${member.name} is already placed on the map!`);
            return;
        }
        
        // Check max players limit
        if (getTotalPlacedPlayers() >= MAX_PLAYERS) {
            alert(`Maximum ${MAX_PLAYERS} players allowed on the map!`);
            return;
        }
        
        placeMemberOnMap(member, x, y);
    } else {
        // Legacy support - assume it's a member
        const memberId = parseInt(data);
        const member = members.find(m => m.id === memberId);
        
        if (!member) return;
        
        if (isPlayerPlaced(memberId)) {
            alert(`${member.name} is already placed on the map!`);
            return;
        }
        
        if (getTotalPlacedPlayers() >= MAX_PLAYERS) {
            alert(`Maximum ${MAX_PLAYERS} players allowed on the map!`);
            return;
        }
        
        placeMemberOnMap(member, x, y);
    }
}

// Check if player is already placed (in individual or group)
function isPlayerPlaced(memberId) {
    // Check individual placements
    if (placedMembers.find(p => p.memberId === memberId)) {
        return true;
    }
    
    // Check group placements
    for (const group of placedGroups) {
        if (group.memberIds.includes(memberId)) {
            return true;
        }
    }
    
    return false;
}

// Get total placed players count
function getTotalPlacedPlayers() {
    let total = placedMembers.length;
    placedGroups.forEach(group => {
        total += group.memberIds.length;
    });
    return total;
}

// Place team group on map
function placeTeamGroupOnMap(teamName, x, y) {
    const teamMembers = members.filter(m => m.team === teamName && !isPlayerPlaced(m.id));
    
    if (teamMembers.length === 0) {
        alert(`All players from ${teamName} are already placed on the map!`);
        return;
    }
    
    // Check if any member is already placed (shouldn't happen but double check)
    const alreadyPlaced = teamMembers.filter(m => isPlayerPlaced(m.id));
    if (alreadyPlaced.length > 0) {
        alert(`Some players from ${teamName} are already placed on the map!`);
        return;
    }
    
    // Check max players limit
    if (getTotalPlacedPlayers() + teamMembers.length > MAX_PLAYERS) {
        alert(`Cannot place ${teamName}: would exceed maximum ${MAX_PLAYERS} players!`);
        return;
    }
    
    // Check if this group should merge with nearby groups
    const nearbyGroup = findNearbyGroup(x, y);
    
    if (nearbyGroup) {
        // Merge with nearby group
        mergeGroups(nearbyGroup, teamName, teamMembers);
    } else {
        // Create new group
        createNewGroup(teamName, teamMembers, x, y);
    }
    
    renderMemberList(); // Re-render to hide placed members
}

// Find nearby group within merge distance
function findNearbyGroup(x, y) {
    for (const group of placedGroups) {
        const distance = Math.sqrt(Math.pow(group.x - x, 2) + Math.pow(group.y - y, 2));
        if (distance < GROUP_MERGE_DISTANCE) {
            return group;
        }
    }
    return null;
}

// Create new group marker
function createNewGroup(teamName, teamMembers, x, y) {
    const groupId = `group-${Date.now()}`;
    const memberIds = teamMembers.map(m => m.id);
    
    const group = {
        id: groupId,
        teams: [teamName],
        memberIds: memberIds,
        x: x,
        y: y
    };
    
    placedGroups.push(group);
    renderGroupMarker(group);
    savePositions();
    updateCounts();
    updatePlaceholder();
}

// Merge groups
function mergeGroups(existingGroup, newTeamName, newMembers) {
    // Add new team if not already in list
    if (!existingGroup.teams.includes(newTeamName)) {
        existingGroup.teams.push(newTeamName);
    }
    
    // Add new member IDs
    const newMemberIds = newMembers.map(m => m.id);
    existingGroup.memberIds.push(...newMemberIds);
    
    // Update the marker
    const marker = mapArea.querySelector(`[data-group-id="${existingGroup.id}"]`);
    if (marker) {
        updateGroupMarker(marker, existingGroup);
    }
    
    savePositions();
    updateCounts();
}

// Render group marker on map
function renderGroupMarker(group) {
    const marker = document.createElement('div');
    marker.className = 'group-marker';
    marker.dataset.groupId = group.id;
    marker.style.left = `${group.x}px`;
    marker.style.top = `${group.y}px`;
    marker.draggable = true;
    
    updateGroupMarker(marker, group);
    
    // Make marker draggable
    marker.addEventListener('dragstart', handleGroupMarkerDragStart);
    marker.addEventListener('dragend', handleGroupMarkerDragEnd);
    
    mapArea.appendChild(marker);
}

// Update group marker content
function updateGroupMarker(marker, group) {
    const roleCount = countRoles(group.memberIds);
    
    marker.innerHTML = `
        <div class="group-number">${group.memberIds.length}</div>
        <div class="group-tooltip">
            <div class="tooltip-header">Group: ${group.teams.join(', ')}</div>
            <div class="tooltip-roles">
                ${roleCount.Tank > 0 ? `<div class="role-item"><span class="role-dot role-Tank"></span> ${roleCount.Tank} Tank</div>` : ''}
                ${roleCount.DPS > 0 ? `<div class="role-item"><span class="role-dot role-DPS"></span> ${roleCount.DPS} DPS</div>` : ''}
                ${roleCount.Healer > 0 ? `<div class="role-item"><span class="role-dot role-Healer"></span> ${roleCount.Healer} Healer</div>` : ''}
                ${roleCount.Support > 0 ? `<div class="role-item"><span class="role-dot role-Support"></span> ${roleCount.Support} Support</div>` : ''}
            </div>
            <div class="tooltip-players">
                ${group.memberIds.map(id => {
                    const member = members.find(m => m.id === id);
                    return `<div class="player-name">${member.name}</div>`;
                }).join('')}
            </div>
            ${group.teams.length > 1 ? `
                <div class="tooltip-actions">
                    <button class="split-btn" onclick="splitGroup('${group.id}')">Split into Teams</button>
                </div>
            ` : ''}
        </div>
        <button class="remove-btn" onclick="removeGroupMarker('${group.id}')">×</button>
    `;
}

// Count roles in a group
function countRoles(memberIds) {
    const count = { Tank: 0, DPS: 0, Healer: 0, Support: 0 };
    memberIds.forEach(id => {
        const member = members.find(m => m.id === id);
        if (member && count[member.role] !== undefined) {
            count[member.role]++;
        }
    });
    return count;
}

// Handle group marker drag
function handleGroupMarkerDragStart(e) {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', e.currentTarget.dataset.groupId);
    e.dataTransfer.setData('type', 'group-marker');
    e.currentTarget.style.opacity = '0.5';
}

function handleGroupMarkerDragEnd(e) {
    e.currentTarget.style.opacity = '1';
    
    const groupId = e.currentTarget.dataset.groupId;
    const rect = mapArea.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Update position
    const group = placedGroups.find(g => g.id === groupId);
    if (group) {
        group.x = x;
        group.y = y;
        e.currentTarget.style.left = `${x}px`;
        e.currentTarget.style.top = `${y}px`;
        
        // Check for merging with other groups
        checkAndMergeNearbyGroups(group);
        
        savePositions();
    }
}

// Check and merge nearby groups after moving
function checkAndMergeNearbyGroups(movedGroup) {
    for (const otherGroup of placedGroups) {
        if (otherGroup.id !== movedGroup.id) {
            const distance = Math.sqrt(
                Math.pow(movedGroup.x - otherGroup.x, 2) + 
                Math.pow(movedGroup.y - otherGroup.y, 2)
            );
            
            if (distance < GROUP_MERGE_DISTANCE) {
                // Merge the groups
                otherGroup.teams.push(...movedGroup.teams.filter(t => !otherGroup.teams.includes(t)));
                otherGroup.memberIds.push(...movedGroup.memberIds);
                
                // Remove moved group
                const movedMarker = mapArea.querySelector(`[data-group-id="${movedGroup.id}"]`);
                if (movedMarker) movedMarker.remove();
                
                placedGroups = placedGroups.filter(g => g.id !== movedGroup.id);
                
                // Update the other group marker
                const otherMarker = mapArea.querySelector(`[data-group-id="${otherGroup.id}"]`);
                if (otherMarker) {
                    updateGroupMarker(otherMarker, otherGroup);
                }
                
                savePositions();
                updateCounts();
                break;
            }
        }
    }
}

// Remove group marker
function removeGroupMarker(groupId) {
    const marker = mapArea.querySelector(`[data-group-id="${groupId}"]`);
    if (marker) {
        marker.remove();
    }
    placedGroups = placedGroups.filter(g => g.id !== groupId);
    savePositions();
    updateCounts();
    updatePlaceholder();
    renderMemberList(); // Re-render to show members again
}

// Update groups after individual member placement
function updateGroupsAfterMemberPlacement(memberId) {
    placedGroups.forEach(group => {
        const index = group.memberIds.indexOf(memberId);
        if (index > -1) {
            // Remove member from group
            group.memberIds.splice(index, 1);
            
            // Update the group marker display
            const marker = mapArea.querySelector(`[data-group-id="${group.id}"]`);
            if (marker) {
                if (group.memberIds.length === 0) {
                    // Remove empty group
                    marker.remove();
                    placedGroups = placedGroups.filter(g => g.id !== group.id);
                } else {
                    // Update group number
                    updateGroupMarker(marker, group);
                }
            }
        }
    });
}

// Toggle objective placing mode
function toggleObjectiveMode() {
    if (placingMode === 'objective') {
        // Deactivate
        placingMode = null;
        addObjectiveBtn.classList.remove('active');
        mapArea.classList.remove('placing-mode');
    } else {
        // Activate objective mode
        placingMode = 'objective';
        drawingMode = false;
        addObjectiveBtn.classList.add('active');
        addBossBtn.classList.remove('active');
        addTowerBtn.classList.remove('active');
        drawBtn.classList.remove('active');
        mapArea.classList.remove('placing-mode', 'drawing-mode');
        mapArea.classList.add('placing-mode');
        drawingCanvas.classList.remove('active');
    }
}

// Toggle boss placing mode
function toggleBossMode() {
    if (placingMode === 'boss') {
        // Deactivate
        placingMode = null;
        addBossBtn.classList.remove('active');
        mapArea.classList.remove('placing-mode');
    } else {
        // Activate boss mode
        placingMode = 'boss';
        drawingMode = false;
        addBossBtn.classList.add('active');
        addObjectiveBtn.classList.remove('active');
        addTowerBtn.classList.remove('active');
        drawBtn.classList.remove('active');
        mapArea.classList.remove('placing-mode', 'drawing-mode');
        mapArea.classList.add('placing-mode');
        drawingCanvas.classList.remove('active');
    }
}

// Toggle tower placing mode
function toggleTowerMode() {
    if (placingMode === 'tower') {
        // Deactivate
        placingMode = null;
        addTowerBtn.classList.remove('active');
        mapArea.classList.remove('placing-mode');
    } else {
        // Activate tower mode
        placingMode = 'tower';
        drawingMode = false;
        addTowerBtn.classList.add('active');
        addObjectiveBtn.classList.remove('active');
        addBossBtn.classList.remove('active');
        drawBtn.classList.remove('active');
        mapArea.classList.remove('placing-mode', 'drawing-mode');
        mapArea.classList.add('placing-mode');
        drawingCanvas.classList.remove('active');
    }
}

// Handle map click for placing objectives/bosses
function handleMapClick(e) {
    if (!placingMode) return;
    
    // Don't place if clicking on existing markers or buttons
    if (e.target !== mapArea && !e.target.classList.contains('map-placeholder')) {
        return;
    }
    
    const rect = mapArea.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (placingMode === 'objective') {
        placeObjectiveMarker(x, y);
    } else if (placingMode === 'boss') {
        placeBossMarker(x, y);
    } else if (placingMode === 'tower') {
        placeTowerMarker(x, y);
    }
}

// Place objective marker
function placeObjectiveMarker(x, y) {
    const objectiveId = `objective-${Date.now()}`;
    
    const marker = document.createElement('div');
    marker.className = 'objective-marker';
    marker.dataset.objectiveId = objectiveId;
    marker.style.left = `${x}px`;
    marker.style.top = `${y}px`;
    marker.draggable = true;
    
    marker.innerHTML = `
        <button class="remove-btn" onclick="removeObjectiveMarker('${objectiveId}')">×</button>
    `;
    
    marker.addEventListener('dragstart', handleObjectiveDragStart);
    marker.addEventListener('dragend', handleObjectiveDragEnd);
    
    mapArea.appendChild(marker);
    
    placedObjectives.push({
        id: objectiveId,
        x: x,
        y: y
    });
    
    savePositions();
    updatePlaceholder();
}

// Place boss marker
function placeBossMarker(x, y) {
    const bossId = `boss-${Date.now()}`;
    
    const marker = document.createElement('div');
    marker.className = 'boss-marker';
    marker.dataset.bossId = bossId;
    marker.style.left = `${x - 25}px`; // Center the 50px image
    marker.style.top = `${y - 25}px`;
    marker.draggable = true;
    
    marker.innerHTML = `
        <img src="boss.png" alt="Boss" draggable="false">
        <button class="remove-btn" onclick="removeBossMarker('${bossId}')">×</button>
    `;
    
    marker.addEventListener('dragstart', handleBossDragStart);
    marker.addEventListener('dragend', handleBossDragEnd);
    
    mapArea.appendChild(marker);
    
    placedBosses.push({
        id: bossId,
        x: x,
        y: y
    });
    
    savePositions();
    updatePlaceholder();
}

// Handle objective drag
function handleObjectiveDragStart(e) {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', e.currentTarget.dataset.objectiveId);
    e.dataTransfer.setData('type', 'objective-marker');
    e.currentTarget.style.opacity = '0.5';
}

function handleObjectiveDragEnd(e) {
    e.currentTarget.style.opacity = '1';
    
    const objectiveId = e.currentTarget.dataset.objectiveId;
    const rect = mapArea.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const objective = placedObjectives.find(o => o.id === objectiveId);
    if (objective) {
        objective.x = x;
        objective.y = y;
        e.currentTarget.style.left = `${x}px`;
        e.currentTarget.style.top = `${y}px`;
        savePositions();
    }
}

// Handle boss drag
function handleBossDragStart(e) {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', e.currentTarget.dataset.bossId);
    e.dataTransfer.setData('type', 'boss-marker');
    e.currentTarget.style.opacity = '0.5';
}

function handleBossDragEnd(e) {
    e.currentTarget.style.opacity = '1';
    
    const bossId = e.currentTarget.dataset.bossId;
    const rect = mapArea.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const boss = placedBosses.find(b => b.id === bossId);
    if (boss) {
        boss.x = x;
        boss.y = y;
        e.currentTarget.style.left = `${x - 25}px`; // Center the 50px image
        e.currentTarget.style.top = `${y - 25}px`;
        savePositions();
    }
}

// Remove objective marker
function removeObjectiveMarker(objectiveId) {
    const marker = mapArea.querySelector(`[data-objective-id="${objectiveId}"]`);
    if (marker) {
        marker.remove();
    }
    placedObjectives = placedObjectives.filter(o => o.id !== objectiveId);
    savePositions();
    updatePlaceholder();
}

// Remove boss marker
function removeBossMarker(bossId) {
    const marker = mapArea.querySelector(`[data-boss-id="${bossId}"]`);
    if (marker) {
        marker.remove();
    }
    placedBosses = placedBosses.filter(b => b.id !== bossId);
    savePositions();
    updatePlaceholder();
}

// Place tower marker
function placeTowerMarker(x, y) {
    const towerId = `tower-${Date.now()}`;
    
    const marker = document.createElement('div');
    marker.className = 'tower-marker';
    marker.dataset.towerId = towerId;
    marker.style.left = `${x - 20}px`; // Center the 40px image
    marker.style.top = `${y - 20}px`;
    marker.draggable = true;
    
    marker.innerHTML = `
        <img src="tower.png" alt="Tower" draggable="false">
        <button class="remove-btn" onclick="removeTowerMarker('${towerId}')">×</button>
    `;
    
    marker.addEventListener('dragstart', handleTowerDragStart);
    marker.addEventListener('dragend', handleTowerDragEnd);
    
    mapArea.appendChild(marker);
    
    placedTowers.push({
        id: towerId,
        x: x,
        y: y
    });
    
    savePositions();
    updatePlaceholder();
}

// Handle tower drag
function handleTowerDragStart(e) {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', e.currentTarget.dataset.towerId);
    e.dataTransfer.setData('type', 'tower-marker');
    e.currentTarget.style.opacity = '0.5';
}

function handleTowerDragEnd(e) {
    e.currentTarget.style.opacity = '1';
    
    const towerId = e.currentTarget.dataset.towerId;
    const rect = mapArea.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const tower = placedTowers.find(t => t.id === towerId);
    if (tower) {
        tower.x = x;
        tower.y = y;
        e.currentTarget.style.left = `${x - 20}px`; // Center the 40px image
        e.currentTarget.style.top = `${y - 20}px`;
        savePositions();
    }
}

// Remove tower marker
function removeTowerMarker(towerId) {
    const marker = mapArea.querySelector(`[data-tower-id="${towerId}"]`);
    if (marker) {
        marker.remove();
    }
    placedTowers = placedTowers.filter(t => t.id !== towerId);
    savePositions();
    updatePlaceholder();
}

// Add enemies to the map
function addEnemies() {
    const currentEnemyCount = placedEnemies.length;
    
    if (currentEnemyCount >= MAX_ENEMIES) {
        alert(`Maximum ${MAX_ENEMIES / ENEMIES_PER_CLICK} enemy groups already placed!`);
        return;
    }
    
    const mapRect = mapArea.getBoundingClientRect();
    
    // Place a group in the center
    const centerX = mapRect.width / 2;
    const centerY = mapRect.height / 2;
    
    placeEnemyGroup(centerX, centerY);
    
    updateEnemyCount();
}

// Place enemy group marker on map
function placeEnemyGroup(x, y) {
    const enemyGroupId = `enemy-group-${Date.now()}`;
    
    const marker = document.createElement('div');
    marker.className = 'group-marker enemy-group';
    marker.dataset.enemyGroupId = enemyGroupId;
    marker.style.left = `${x}px`;
    marker.style.top = `${y}px`;
    marker.draggable = true;
    
    marker.innerHTML = `
        <div class="group-number">5</div>
        <div class="group-tooltip">
            <div class="tooltip-header">Enemy Group</div>
            <div class="tooltip-info">5 Enemy Players</div>
        </div>
        <button class="remove-btn" onclick="removeEnemyGroup('${enemyGroupId}')">×</button>
    `;
    
    marker.addEventListener('dragstart', handleEnemyGroupDragStart);
    marker.addEventListener('dragend', handleEnemyGroupDragEnd);
    
    mapArea.appendChild(marker);
    
    placedEnemies.push({
        id: enemyGroupId,
        x: x,
        y: y,
        count: ENEMIES_PER_CLICK
    });
    
    savePositions();
    updatePlaceholder();
}

// Handle enemy group drag
function handleEnemyGroupDragStart(e) {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', e.currentTarget.dataset.enemyGroupId);
    e.dataTransfer.setData('type', 'enemy-group-marker');
    e.currentTarget.style.opacity = '0.5';
}

function handleEnemyGroupDragEnd(e) {
    e.currentTarget.style.opacity = '1';
    
    const enemyGroupId = e.currentTarget.dataset.enemyGroupId;
    const rect = mapArea.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const enemyGroup = placedEnemies.find(eg => eg.id === enemyGroupId);
    if (enemyGroup) {
        enemyGroup.x = x;
        enemyGroup.y = y;
        e.currentTarget.style.left = `${x}px`;
        e.currentTarget.style.top = `${y}px`;
        savePositions();
    }
}

// Remove enemy group
function removeEnemyGroup(enemyGroupId) {
    const marker = mapArea.querySelector(`[data-enemy-group-id="${enemyGroupId}"]`);
    if (marker) {
        marker.remove();
    }
    placedEnemies = placedEnemies.filter(e => e.id !== enemyGroupId);
    savePositions();
    updatePlaceholder();
    updateEnemyCount();
}

// Update enemy count display
function updateEnemyCount() {
    const totalEnemies = placedEnemies.length * ENEMIES_PER_CLICK;
    enemyCount.textContent = totalEnemies;
    
    // Disable button if max reached
    if (placedEnemies.length >= MAX_ENEMIES / ENEMIES_PER_CLICK) {
        addEnemiesBtn.disabled = true;
    } else {
        addEnemiesBtn.disabled = false;
    }
}

// Initialize drawing canvas
function initializeCanvas() {
    resizeCanvas();
    
    let isDrawing = false;
    let currentPath = [];
    
    drawingCanvas.addEventListener('mousedown', (e) => {
        if (!drawingMode) return;
        e.preventDefault();
        
        isDrawing = true;
        const rect = drawingCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        currentPath = [{ x, y }];
        
        // Start drawing immediately
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(x, y);
    });
    
    drawingCanvas.addEventListener('mousemove', (e) => {
        if (!drawingMode || !isDrawing) return;
        e.preventDefault();
        
        const rect = drawingCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        currentPath.push({ x, y });
        
        // Draw line segment
        ctx.lineTo(x, y);
        ctx.stroke();
    });
    
    drawingCanvas.addEventListener('mouseup', (e) => {
        if (!drawingMode || !isDrawing) return;
        e.preventDefault();
        
        isDrawing = false;
        
        if (currentPath.length > 1) {
            const pathData = {
                points: [...currentPath],
                timestamp: Date.now(),
                color: '#ff0000',
                width: 3
            };
            
            drawingPaths.push(pathData);
            
            // Set up auto-delete if enabled
            if (autoDeleteDrawings) {
                schedulePathDeletion(drawingPaths.length - 1);
            }
        }
        
        currentPath = [];
    });
    
    drawingCanvas.addEventListener('mouseleave', () => {
        if (isDrawing) {
            isDrawing = false;
            currentPath = [];
        }
    });
    
    // Touch support for mobile/tablets
    drawingCanvas.addEventListener('touchstart', (e) => {
        if (!drawingMode) return;
        e.preventDefault();
        
        const touch = e.touches[0];
        const rect = drawingCanvas.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        
        isDrawing = true;
        currentPath = [{ x, y }];
        
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(x, y);
    });
    
    drawingCanvas.addEventListener('touchmove', (e) => {
        if (!drawingMode || !isDrawing) return;
        e.preventDefault();
        
        const touch = e.touches[0];
        const rect = drawingCanvas.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        
        currentPath.push({ x, y });
        ctx.lineTo(x, y);
        ctx.stroke();
    });
    
    drawingCanvas.addEventListener('touchend', (e) => {
        if (!drawingMode || !isDrawing) return;
        e.preventDefault();
        
        isDrawing = false;
        
        if (currentPath.length > 1) {
            const pathData = {
                points: [...currentPath],
                timestamp: Date.now(),
                color: '#ff0000',
                width: 3
            };
            
            drawingPaths.push(pathData);
            
            if (autoDeleteDrawings) {
                schedulePathDeletion(drawingPaths.length - 1);
            }
        }
        
        currentPath = [];
    });
}

// Resize canvas to match map area
function resizeCanvas() {
    const rect = mapArea.getBoundingClientRect();
    drawingCanvas.width = rect.width;
    drawingCanvas.height = rect.height;
    redrawAllPaths();
}

// Draw a single path
function drawPath(points, color, width) {
    if (points.length < 2) return;
    
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    
    ctx.stroke();
}

// Redraw all paths
function redrawAllPaths() {
    ctx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
    
    drawingPaths.forEach(pathData => {
        drawPath(pathData.points, pathData.color, pathData.width);
    });
}

// Toggle drawing mode
function toggleDrawingMode() {
    if (drawingMode) {
        // Deactivate
        drawingMode = false;
        drawBtn.classList.remove('active');
        mapArea.classList.remove('drawing-mode');
        drawingCanvas.classList.remove('active');
    } else {
        // Activate drawing mode
        drawingMode = true;
        placingMode = null;
        drawBtn.classList.add('active');
        addObjectiveBtn.classList.remove('active');
        addBossBtn.classList.remove('active');
        mapArea.classList.remove('placing-mode');
        mapArea.classList.add('drawing-mode');
        drawingCanvas.classList.add('active');
    }
}

// Clear all drawings
function clearAllDrawings() {
    if (drawingPaths.length === 0) return;
    
    if (confirm('Are you sure you want to clear all drawings?')) {
        drawingPaths = [];
        drawingDeleteTimers.forEach(timer => clearTimeout(timer));
        drawingDeleteTimers = [];
        redrawAllPaths();
    }
}

// Handle auto-delete toggle
function handleAutoDeleteToggle(e) {
    autoDeleteDrawings = e.target.checked;
    
    if (autoDeleteDrawings) {
        // Schedule deletion for existing paths
        drawingPaths.forEach((path, index) => {
            const elapsed = Date.now() - path.timestamp;
            const remaining = AUTO_DELETE_DELAY - elapsed;
            
            if (remaining > 0) {
                schedulePathDeletion(index, remaining);
            } else {
                // Already expired, delete immediately
                drawingPaths[index] = null;
            }
        });
        
        // Clean up null entries
        drawingPaths = drawingPaths.filter(p => p !== null);
        redrawAllPaths();
    } else {
        // Clear all timers
        drawingDeleteTimers.forEach(timer => clearTimeout(timer));
        drawingDeleteTimers = [];
    }
}

// Schedule path deletion
function schedulePathDeletion(index, delay = AUTO_DELETE_DELAY) {
    const timer = setTimeout(() => {
        if (drawingPaths[index]) {
            drawingPaths.splice(index, 1);
            redrawAllPaths();
            
            // Remove this timer from the list
            const timerIndex = drawingDeleteTimers.indexOf(timer);
            if (timerIndex > -1) {
                drawingDeleteTimers.splice(timerIndex, 1);
            }
        }
    }, delay);
    
    drawingDeleteTimers.push(timer);
}
function splitGroup(groupId) {
    const group = placedGroups.find(g => g.id === groupId);
    if (!group) return;
    
    if (group.teams.length <= 1) {
        alert('This group only contains one team. Nothing to split.');
        return;
    }
    
    // Remove the original group marker
    const marker = mapArea.querySelector(`[data-group-id="${groupId}"]`);
    if (marker) {
        marker.remove();
    }
    
    // Remove from placedGroups array
    placedGroups = placedGroups.filter(g => g.id !== groupId);
    
    // Create separate groups for each team
    const baseX = group.x;
    const baseY = group.y;
    const offset = 45; // pixels to offset each new group (reduced from 60)
    
    group.teams.forEach((teamName, index) => {
        // Get members for this team
        const teamMemberIds = group.memberIds.filter(id => {
            const member = members.find(m => m.id === id);
            return member && member.team === teamName;
        });
        
        if (teamMemberIds.length > 0) {
            // Calculate position with offset in a circular pattern
            const angle = (index / group.teams.length) * 2 * Math.PI;
            const newX = baseX + Math.cos(angle) * offset;
            const newY = baseY + Math.sin(angle) * offset;
            
            // Create new group
            const newGroupId = `group-${Date.now()}-${index}`;
            const newGroup = {
                id: newGroupId,
                teams: [teamName],
                memberIds: teamMemberIds,
                x: newX,
                y: newY
            };
            
            placedGroups.push(newGroup);
            renderGroupMarker(newGroup);
        }
    });
    
    savePositions();
    updateCounts();
}

// Place member marker on map
function placeMemberOnMap(member, x, y) {
    const marker = document.createElement('div');
    marker.className = `member-marker role-${member.role}`;
    marker.dataset.memberId = member.id;
    marker.style.left = `${x}px`;
    marker.style.top = `${y}px`;
    marker.draggable = true;
    
    marker.innerHTML = `
        <div class="marker-tooltip">
            <div class="tooltip-name">${member.name}</div>
            <div class="tooltip-info">${member.role} | ${member.team}</div>
        </div>
        <button class="remove-btn" onclick="removeMemberMarker(${member.id})">×</button>
    `;
    
    // Make marker draggable within map
    marker.addEventListener('dragstart', handleMarkerDragStart);
    marker.addEventListener('dragend', handleMarkerDragEnd);
    
    mapArea.appendChild(marker);
    
    placedMembers.push({
        memberId: member.id,
        x: x,
        y: y
    });
    
    // Check if this member was part of a group and update the group
    updateGroupsAfterMemberPlacement(member.id);
    
    savePositions();
    updateCounts();
    updatePlaceholder();
    renderMemberList(); // Re-render to hide placed member
}

// Handle marker drag
function handleMarkerDragStart(e) {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', e.currentTarget.dataset.memberId);
    e.currentTarget.style.opacity = '0.5';
}

function handleMarkerDragEnd(e) {
    e.currentTarget.style.opacity = '1';
    
    const memberId = parseInt(e.currentTarget.dataset.memberId);
    const rect = mapArea.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Update position
    const placement = placedMembers.find(p => p.memberId === memberId);
    if (placement) {
        placement.x = x;
        placement.y = y;
        e.currentTarget.style.left = `${x}px`;
        e.currentTarget.style.top = `${y}px`;
        savePositions();
    }
}

// Remove member marker
function removeMemberMarker(memberId) {
    const marker = mapArea.querySelector(`[data-member-id="${memberId}"]`);
    if (marker) {
        marker.remove();
    }
    placedMembers = placedMembers.filter(p => p.memberId !== memberId);
    savePositions();
    updateCounts();
    updatePlaceholder();
    renderMemberList(); // Re-render to show member again
}

// Search functionality
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    applyFilters(searchTerm);
}

// View toggle functionality
function handleViewToggle(e) {
    viewToggleButtons.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    currentView = e.target.dataset.view;
    renderMemberList();
}

// Role filter functionality
function handleRoleFilter(e) {
    roleFilterButtons.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    currentRoleFilter = e.target.dataset.role;
    const searchTerm = searchInput.value.toLowerCase();
    applyFilters(searchTerm);
}

// Apply all filters
function applyFilters(searchTerm = '') {
    filteredMembers = members.filter(member => {
        const matchesSearch = member.name.toLowerCase().includes(searchTerm) ||
                            member.role.toLowerCase().includes(searchTerm) ||
                            member.team.toLowerCase().includes(searchTerm);
        
        const matchesRole = currentRoleFilter === 'all' || member.role === currentRoleFilter;
        
        return matchesSearch && matchesRole;
    });
    
    renderMemberList();
}

// Clear all placements
function clearAllPlacements() {
    const totalPlaced = getTotalPlacedPlayers();
    const totalMarkers = placedObjectives.length + placedBosses.length + placedTowers.length + placedEnemies.length;
    if (totalPlaced === 0 && totalMarkers === 0) return;
    
    if (confirm('Are you sure you want to remove all players and markers from the map?')) {
        const markers = mapArea.querySelectorAll('.member-marker, .group-marker, .objective-marker, .boss-marker, .tower-marker');
        markers.forEach(marker => marker.remove());
        placedMembers = [];
        placedGroups = [];
        placedObjectives = [];
        placedBosses = [];
        placedTowers = [];
        placedEnemies = [];
        savePositions();
        updateCounts();
        updatePlaceholder();
        updateEnemyCount();
        renderMemberList(); // Re-render to show all members again
    }
}

// Update player counts
function updateCounts() {
    playerCount.textContent = `(${members.length}/${MAX_PLAYERS})`;
    const totalPlaced = getTotalPlacedPlayers();
    placedCount.textContent = `(${totalPlaced}/${MAX_PLAYERS} Placed)`;
}

// Update placeholder visibility
function updatePlaceholder() {
    const placeholder = document.querySelector('.map-placeholder');
    if (placeholder) {
        const hasContent = placedMembers.length > 0 || placedGroups.length > 0 || 
                          placedObjectives.length > 0 || placedBosses.length > 0 ||
                          placedTowers.length > 0 || placedEnemies.length > 0;
        placeholder.style.display = hasContent ? 'none' : 'block';
    }
}

// Export positions
function exportPositions() {
    const totalPlaced = getTotalPlacedPlayers();
    const totalMarkers = placedObjectives.length + placedBosses.length + placedTowers.length + placedEnemies.length;
    if (totalPlaced === 0 && totalMarkers === 0) {
        alert('No players or markers placed on the map yet!');
        return;
    }
    
    const exportData = {
        individuals: placedMembers.map(placement => {
            const member = members.find(m => m.id === placement.memberId);
            return {
                id: member.id,
                name: member.name,
                role: member.role,
                team: member.team,
                x: Math.round(placement.x),
                y: Math.round(placement.y)
            };
        }),
        groups: placedGroups.map(group => {
            return {
                teams: group.teams,
                members: group.memberIds.map(id => {
                    const member = members.find(m => m.id === id);
                    return {
                        id: member.id,
                        name: member.name,
                        role: member.role,
                        team: member.team
                    };
                }),
                x: Math.round(group.x),
                y: Math.round(group.y)
            };
        }),
        objectives: placedObjectives.map(obj => ({
            id: obj.id,
            x: Math.round(obj.x),
            y: Math.round(obj.y)
        })),
        bosses: placedBosses.map(boss => ({
            id: boss.id,
            x: Math.round(boss.x),
            y: Math.round(boss.y)
        })),
        towers: placedTowers.map(tower => ({
            id: tower.id,
            x: Math.round(tower.x),
            y: Math.round(tower.y)
        })),
        enemies: placedEnemies.map(enemy => ({
            id: enemy.id,
            x: Math.round(enemy.x),
            y: Math.round(enemy.y),
            count: enemy.count
        }))
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'guild-war-strategy.json';
    link.click();
    URL.revokeObjectURL(url);
}

// Save positions to localStorage
function savePositions() {
    const data = {
        members: placedMembers,
        groups: placedGroups,
        objectives: placedObjectives,
        bosses: placedBosses,
        towers: placedTowers,
        enemies: placedEnemies
    };
    localStorage.setItem('vcross-gvg-positions', JSON.stringify(data));
}

// Load saved positions
function loadSavedPositions() {
    const saved = localStorage.getItem('vcross-gvg-positions');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            
            // Support old format (just array of members)
            if (Array.isArray(data)) {
                placedMembers = [];
                data.forEach(placement => {
                    const member = members.find(m => m.id === placement.memberId);
                    if (member && getTotalPlacedPlayers() < MAX_PLAYERS) {
                        placeMemberOnMap(member, placement.x, placement.y);
                    }
                });
            } else {
                // New format with members and groups
                placedMembers = [];
                placedGroups = [];
                placedObjectives = [];
                placedBosses = [];
                placedEnemies = [];
                
                // Load individual members
                if (data.members) {
                    data.members.forEach(placement => {
                        const member = members.find(m => m.id === placement.memberId);
                        if (member && getTotalPlacedPlayers() < MAX_PLAYERS) {
                            placeMemberOnMap(member, placement.x, placement.y);
                        }
                    });
                }
                
                // Load groups
                if (data.groups) {
                    data.groups.forEach(groupData => {
                        if (getTotalPlacedPlayers() + groupData.memberIds.length <= MAX_PLAYERS) {
                            placedGroups.push(groupData);
                            renderGroupMarker(groupData);
                        }
                    });
                }
                
                // Load objectives
                if (data.objectives) {
                    data.objectives.forEach(obj => {
                        placeObjectiveMarker(obj.x, obj.y);
                    });
                }
                
                // Load bosses
                if (data.bosses) {
                    data.bosses.forEach(boss => {
                        placeBossMarker(boss.x, boss.y);
                    });
                }
                
                // Load towers
                if (data.towers) {
                    data.towers.forEach(tower => {
                        placeTowerMarker(tower.x, tower.y);
                    });
                }
                
                // Load enemies
                if (data.enemies) {
                    data.enemies.forEach(enemy => {
                        placeEnemyGroup(enemy.x, enemy.y);
                    });
                }
            }
            
            updateEnemyCount();
        } catch (e) {
            console.error('Error loading saved positions:', e);
        }
    }
}

// Initialize on load
init();
