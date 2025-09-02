let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function renderTasks() {
  const taskList = document.getElementById("taskList");
  const taskCount = document.getElementById("taskCount");
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${task.text} 
      <span class="category ${task.category}">${task.category}</span>
      <button class="delete-btn" onclick="deleteTask(${index})">X</button>
    `;
    taskList.appendChild(li);
  });

  taskCount.textContent = `Total Tasks: ${tasks.length}`;
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const category = document.getElementById("category").value;

  if (taskInput.value.trim() !== "") {
    tasks.push({ text: taskInput.value, category: category });
    taskInput.value = "";
    renderTasks();
  }
}

function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks();
}

function searchTask() {
  const searchValue = document.getElementById("searchInput").value.toLowerCase();
  const taskList = document.getElementById("taskList");
  taskList.querySelectorAll("li").forEach(item => {
    item.style.display = item.textContent.toLowerCase().includes(searchValue) ? "flex" : "none";
  });
}

// Initial render
renderTasks();

