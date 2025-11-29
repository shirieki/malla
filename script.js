// script.js — Lógica de la malla interactiva (1 columna por semestre)
});


container.appendChild(card);
});


applyStyles();
}


function applyStyles(){
courses.forEach(c =>{
const el = document.getElementById(`course-${c.id}`);
if(!el) return;
const btn = el.querySelector('button');
const state = estados[c.id] || 'locked';
el.classList.remove('locked','available','passed');
el.classList.add(state);
if(state === 'locked'){
btn.disabled = true;
btn.textContent = 'Bloqueado';
btn.className = 'btn ghost';
} else if(state === 'available'){
btn.disabled = false;
btn.textContent = 'Aprobar';
btn.className = 'btn primary';
} else if(state === 'passed'){
btn.disabled = false;
btn.textContent = 'Aprobado ✓';
btn.className = 'btn outline';
}
});
}


function onClickCourse(ev){
const id = ev.currentTarget.dataset.id;
const cur = estados[id];
if(cur === 'available'){
estados[id] = 'passed';
// desbloquear dependientes si cumplen
courses.forEach(c => {
if(c.prereqs.includes(id)){
const ok = c.prereqs.every(p => estados[p] === 'passed');
if(ok && estados[c.id] !== 'passed') estados[c.id] = 'available';
}
});
} else if(cur === 'passed'){
// toggle: quitar aprobacion -> bloquear dependientes recursivamente
estados[id] = 'available';
const visited = new Set();
function dfs(nodeId){
courses.forEach(c =>{
if(c.prereqs.includes(nodeId)){
if(visited.has(c.id)) return; visited.add(c.id);
const ok = c.prereqs.every(p => estados[p] === 'passed');
if(!ok) estados[c.id] = 'locked';
dfs(c.id);
}
});
}
dfs(id);
}
saveState(); applyStyles();
}


// Controls: reset, export, import
function addControls(){
document.getElementById('resetBtn').addEvent
