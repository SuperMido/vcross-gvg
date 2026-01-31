// Member list rendering
import { state, CONSTANTS, isPlayerPlaced } from '../state/appState.js';
import { elements } from './elements.js';

export function renderMemberList() {
    elements.memberList.innerHTML = '';
    
    if (state.currentView === 'grouped') {
        renderGroupedView();
    } else {
        renderListView();
    }
}

function renderGroupedView() {
    CONSTANTS.TEAM_ORDER.forEach(teamName => {
        const allTeamMembers = window.members.filter(m => m.team === teamName);
        
        const teamMembers = allTeamMembers.filter(m => {
            if (isPlayerPlaced(m.id)) return false;
            
            const searchTerm = elements.searchInput.value.toLowerCase();
            const matchesSearch = !searchTerm || 
                                 m.name.toLowerCase().includes(searchTerm) ||
                                 m.role.toLowerCase().includes(searchTerm) ||
                                 m.team.toLowerCase().includes(searchTerm);
            if (!matchesSearch) return false;
            
            const matchesRole = state.currentRoleFilter === 'all' || m.role === state.currentRoleFilter;
            if (!matchesRole) return false;
            
            return true;
        });
        
        if (teamMembers.length > 0) {
            const groupDiv = createTeamGroupElement(teamName, teamMembers);
            elements.memberList.appendChild(groupDiv);
        }
    });
}

function renderListView() {
    const availableMembers = window.members.filter(m => {
        if (isPlayerPlaced(m.id)) return false;
        
        const searchTerm = elements.searchInput.value.toLowerCase();
        const matchesSearch = !searchTerm || 
                             m.name.toLowerCase().includes(searchTerm) ||
                             m.role.toLowerCase().includes(searchTerm) ||
                             m.team.toLowerCase().includes(searchTerm);
        if (!matchesSearch) return false;
        
        const matchesRole = state.currentRoleFilter === 'all' || m.role === state.currentRoleFilter;
        if (!matchesRole) return false;
        
        return true;
    });
    
    availableMembers.forEach(member => {
        const memberElement = createMemberElement(member);
        elements.memberList.appendChild(memberElement);
    });
}

function createTeamGroupElement(teamName, teamMembers) {
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
    
    const playersDiv = document.createElement('div');
    playersDiv.className = 'team-group-players';
    
    teamMembers.forEach(member => {
        const memberElement = createMemberElement(member);
        playersDiv.appendChild(memberElement);
    });
    
    groupDiv.appendChild(headerDiv);
    groupDiv.appendChild(playersDiv);
    return groupDiv;
}

export function createMemberElement(member) {
    const div = document.createElement('div');
    div.className = 'member-item';
    div.draggable = true;
    div.dataset.memberId = member.id;
    
    div.innerHTML = `
        <div class="member-info">
            <div class="member-name">${member.name}</div>
            <div class="member-team">${member.team}</div>
            <div class="member-weapons">
                <div class="weapon-item">W1: ${member.weapon1 || 'None'}</div>
                <div class="weapon-item">W2: ${member.weapon2 || 'None'}</div>
            </div>
        </div>
        <div class="role-badge">${member.role}</div>
    `;
    
    return div;
}

function toggleTeamGroup(groupDiv) {
    groupDiv.classList.toggle('collapsed');
}
