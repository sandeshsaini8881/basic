// ---- Select Elements ----
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const filterButtons = document.querySelectorAll(".filter-btn");

// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// ---- Add Task ----
addBtn.addEventListener("click", () => {
    const text = taskInput.value.trim();
    if (text === "") return;

    const task = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(task);
    saveTasks();
    renderTasks();

    taskInput.value = "";
});

// ---- Save to localStorage ----
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ---- Render Tasks ----
function renderTasks(filter = "all") {
    taskList.innerHTML = "";

    const filtered = tasks.filter(task => {
        if (filter === "active") return !task.completed;
        if (filter === "completed") return task.completed;
        return true;
    });

    filtered.forEach(task => {
        const li = document.createElement("li");
        li.classList.add("task");
        if (task.completed) li.classList.add("completed");

        li.innerHTML = `
            <span onclick="toggleTask(${task.id})">${task.text}</span>
            <div>
                <button class="edit-btn" onclick="editTask(${task.id})">✏</button>
                <button class="delete-btn" onclick="deleteTask(${task.id})">🗑</button>
            </div>
        `;

        taskList.appendChild(li);
    });
}

// ---- Toggle Complete ----
function toggleTask(id) {
    tasks = tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveTasks();
    renderTasks();
}

// ---- Edit Task ----
function editTask(id) {
    const newText = prompt("Edit your task:");
    if (!newText) return;

    tasks = tasks.map(task =>
        task.id === id ? { ...task, text: newText } : task
    );

    saveTasks();
    renderTasks();
}

// ---- Delete Task ----
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

// ---- Filter Buttons ----
filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".filter-btn.active").classList.remove("active");
        btn.classList.add("active");

        const filter = btn.getAttribute("data-filter");
        renderTasks(filter);
    });
});

// Initial render
renderTasks();
