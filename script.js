document.addEventListener("DOMContentLoaded", function () {
  const taskInput = document.getElementById("task-input");
  const addBtn = document.getElementById("add-btn");
  const taskContainer = document.getElementById("tasks-container");
  const totalTasksSpan = document.getElementById("total-tasks");
  const completedTasksSpan = document.getElementById("completed-tasks");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  // Initializr the app
  renderTasks();
  updateStats();

  // Add task when clicking the button
  addBtn.addEventListener("click", addTask);

  // Add task when pressing Enter
  taskInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      addTask();
    }
  });

  function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === "") {
      showError("Task cannot be empty!");
      return;
    }

    const newTask = {
      id: Date.now(),
      text: taskText,
      completed: false,
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();
    updateStats();

    // Clear input and focus
    taskInput.value = "";
    taskInput.focus();
  }

  function deleteTask(id) {
    tasks = tasks.filter((task) => task.id !== id);
    saveTasks();
    renderTasks();
    updateStats();
  }

  function toggleTask(id) {
    tasks = tasks.map((task) => {
      if (task.id === id) {
        return { ...task, completed: !task.completed };
      }

      return task;
    });

    saveTasks();
    renderTasks();
    updateStats();
  }

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function renderTasks() {
    if (tasks.length === 0) {
      taskContainer.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-clipboard-list"></i>
          <p>No tasks yet. Add your first task!</p>
        </div>
      `;
      return;
    }

    taskContainer.innerHTML = ``;

    tasks.forEach((task) => {
      const taskElement = document.createElement("div");
      taskElement.className = "task-item";

      taskElement.innerHTML = `
        <input type="checkbox" class="task-checkbox" ${
          task.completed ? "checked" : ""
        }>
        <div class="task-text ${task.completed ? "completed" : ""}">${
        task.text
      }</div>
        <button class="delete-btn"><i class="fas fa-trash"></i></button>
      `;

      const checkbox = taskElement.querySelector(".task-checkbox");
      const deleteBtn = taskElement.querySelector(".delete-btn");

      checkbox.addEventListener("change", () => toggleTask(task.id));
      deleteBtn.addEventListener("click", () => deleteTask(task.id));

      taskContainer.appendChild(taskElement);
    });
  }

  function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.completed).length;

    totalTasksSpan.textContent = `Total: ${total}`;
    completedTasksSpan.textContent = `Completed: ${completed}`;
  }

  function showError(message) {
    // Create error element
    const errorElement = document.createElement("div");
    errorElement.textContent = message;
    errorElement.style.position = "fixed";
    errorElement.style.bottom = "20px";
    errorElement.style.left = "50%";
    errorElement.style.transform = "translateX(-50%)";
    errorElement.style.backgroundColor = "#ff4757";
    errorElement.style.color = "white";
    errorElement.style.padding = "12px 24px";
    errorElement.style.borderRadius = "8px";
    errorElement.style.zIndex = "1000";
    errorElement.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
    errorElement.style.fontWeight = "500";

    document.body.appendChild(errorElement);

    // Remove after 2 seconds
    setTimeout(() => {
      errorElement.style.opacity = "0";
      errorElement.style.transition = "opacity 0.5s";
      setTimeout(() => {
        document.body.removeChild(errorElement);
      }, 500);
    }, 2000);
  }
});
