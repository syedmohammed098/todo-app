
const LS_KEY = 'todo.tasks.v1';

let tasks = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
let currentFilter = 'all';
const taskList = document.getElementById('taskList');
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskCount = document.getElementById('taskCount');
const searchInput = document.getElementById('search');
const clearCompletedBtn = document.getElementById('clearCompleted');
const filterButtons = document.querySelectorAll('.filter-btn');


const save = () => localStorage.setItem(LS_KEY, JSON.stringify(tasks));
const uid = () => Date.now() + Math.floor(Math.random()*1000);


function render() {
  const q = (searchInput?.value || '').toLowerCase().trim();
  const list = tasks.filter(t => {
    if(currentFilter === 'active') return !t.done;
    if(currentFilter === 'completed') return t.done;
    return true;
  }).filter(t => t.text.toLowerCase().includes(q));

  taskList.innerHTML = '';
  if(list.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'small';
    empty.textContent = 'No tasks found';
    taskList.appendChild(empty);
  } else {
    list.forEach(t => {
      const li = document.createElement('li');
      li.className = 'task-item' + (t.done ? ' completed' : '');
      li.dataset.id = t.id;

      const span = document.createElement('div');
      span.className = 'text';
      span.textContent = t.text;
      span.title = 'Double-click to edit, click to toggle complete';
      span.addEventListener('click', () => toggleComplete(t.id));
      span.addEventListener('dblclick', () => editTask(t.id));

      const right = document.createElement('div');
      right.style.display = 'flex';
      right.style.gap = '8px';
      
      const editBtn = document.createElement('button');
      editBtn.className = 'icon-btn';
      editBtn.innerHTML = '✏️';
      editBtn.title = 'Edit';
      editBtn.addEventListener('click', () => editTask(t.id));

      
      const delBtn = document.createElement('button');
      delBtn.className = 'icon-btn';
      delBtn.innerHTML = '🗑️';
      delBtn.title = 'Delete';
      delBtn.addEventListener('click', () => deleteTask(t.id));

      right.appendChild(editBtn);
      right.appendChild(delBtn);

      li.appendChild(span);
      li.appendChild(right);
      taskList.appendChild(li);
    });
  }

  
  const activeCount = tasks.filter(t => !t.done).length;
  const total = tasks.length;
  taskCount.textContent = `${activeCount} active / ${total} total`;
}


function addTask(text) {
  const txt = (text || taskInput.value || '').trim();
  if(!txt) return;
  tasks.unshift({ id: uid(), text: txt, done: false, createdAt: Date.now() });
  save(); render();
  taskInput.value = '';
}

function toggleComplete(id) {
  tasks = tasks.map(t => t.id === id ? {...t, done: !t.done} : t);
  save(); render();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  save(); render();
}

function editTask(id) {
  const t = tasks.find(x => x.id === id);
  if(!t) return;
  const newText = prompt('Edit task', t.text);
  if(newText === null) return; 
  const trimmed = newText.trim();
  if(trimmed === '') return alert('Task cannot be empty');
  t.text = trimmed;
  save(); render();
}

function clearCompleted() {
  tasks = tasks.filter(t => !t.done);
  save(); render();
}


taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  addTask();
});

searchInput?.addEventListener('input', () => render());
clearCompletedBtn?.addEventListener('click', () => {
  if(!confirm('Remove all completed tasks?')) return;
  clearCompleted();
});


filterButtons.forEach(btn => btn.addEventListener('click', () => {
  filterButtons.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentFilter = btn.dataset.filter;
  render();
}));


render();
