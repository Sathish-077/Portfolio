(() => {
  "use strict";

  const STORAGE_KEY = "portfolio-todos";

  const form = document.querySelector("#todo-form");
  const input = document.querySelector("#todo-input");
  const errorBox = document.querySelector("#todo-error");
  const list = document.querySelector("#todo-list");
  const emptyBox = document.querySelector("#todo-empty");
  const countBox = document.querySelector("#todo-count");
  const clearBtn = document.querySelector("#clear-completed");
  const filterButtons = document.querySelectorAll(".filter-btn");

  if (!form || !list) return;

  // ---------- State ----------
  let todos = loadTodos();
  let filter = "all";
  let editingId = null;

  function loadTodos() {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return Array.isArray(data) ? data : [];
    } catch (error) {
      return [];
    }
  }

  function saveTodos() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
      showError("Could not save tasks in this browser.");
    }
  }

  function showError(message) {
    errorBox.textContent = message;
  }

  // ---------- CRUD ----------
  function createTodo(text) {
    todos.unshift({ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), text, completed: false });
    saveTodos();
    render();
  }

  function updateTodo(id, changes) {
    todos = todos.map(todo => (todo.id === id ? { ...todo, ...changes } : todo));
    saveTodos();
    render();
  }

  function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    render();
  }

  function clearCompleted() {
    todos = todos.filter(todo => !todo.completed);
    saveTodos();
    render();
  }

  // ---------- Dynamic DOM creation ----------
  function makeButton(label, action, text, extraClass = "") {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "icon-btn " + extraClass;
    button.dataset.action = action;
    button.setAttribute("aria-label", label);
    button.title = label;
    button.textContent = text;
    return button;
  }

  function createItem(todo) {
    const item = document.createElement("li");
    item.className = "todo-item" + (todo.completed ? " is-done" : "");
    item.dataset.id = todo.id;

    if (todo.id === editingId) {
      const editInput = document.createElement("input");
      editInput.type = "text";
      editInput.className = "edit-input";
      editInput.value = todo.text;
      editInput.maxLength = 120;
      editInput.setAttribute("aria-label", "Edit task");

      item.append(
        editInput,
        makeButton("Save task", "save", "✓", "save"),
        makeButton("Cancel editing", "cancel", "✕")
      );
      return item;
    }

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "todo-check";
    checkbox.checked = todo.completed;
    checkbox.dataset.action = "toggle";
    checkbox.setAttribute("aria-label", "Mark \"" + todo.text + "\" as completed");

    const label = document.createElement("span");
    label.className = "todo-text";
    label.textContent = todo.text; // textContent keeps user input safe from HTML injection

    item.append(
      checkbox,
      label,
      makeButton("Edit task", "edit", "✎"),
      makeButton("Delete task", "delete", "🗑", "danger")
    );
    return item;
  }

  function visibleTodos() {
    if (filter === "active") return todos.filter(todo => !todo.completed);
    if (filter === "completed") return todos.filter(todo => todo.completed);
    return todos;
  }

  function render() {
    list.replaceChildren(...visibleTodos().map(createItem));

    const remaining = todos.filter(todo => !todo.completed).length;
    const done = todos.length - remaining;
    countBox.textContent = remaining + (remaining === 1 ? " task" : " tasks") + " left · " + done + " completed";
    clearBtn.disabled = done === 0;

    const messages = {
      all: "No tasks yet. Add your first task above.",
      active: "No active tasks. Great job!",
      completed: "No completed tasks yet."
    };
    emptyBox.hidden = list.children.length > 0;
    emptyBox.textContent = messages[filter];

    filterButtons.forEach(button => {
      const selected = button.dataset.filter === filter;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });

    const editField = list.querySelector(".edit-input");
    if (editField) {
      editField.focus();
      editField.setSelectionRange(editField.value.length, editField.value.length);
    }
  }

  // ---------- Event listeners ----------
  form.addEventListener("submit", event => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) {
      showError("Please enter a task before adding.");
      input.focus();
      return;
    }
    showError("");
    createTodo(text);
    input.value = "";
    input.focus();
  });

  input.addEventListener("input", () => showError(""));

  // Delegated listener: one handler for every task in the list, including ones added later
  list.addEventListener("click", event => {
    const target = event.target.closest("[data-action]");
    const item = event.target.closest(".todo-item");
    if (!target || !item) return;
    const id = item.dataset.id;

    switch (target.dataset.action) {
      case "delete":
        deleteTodo(id);
        break;
      case "edit":
        editingId = id;
        render();
        break;
      case "cancel":
        editingId = null;
        render();
        break;
      case "save":
        saveEdit(item, id);
        break;
    }
  });

  list.addEventListener("change", event => {
    if (event.target.dataset.action !== "toggle") return;
    const item = event.target.closest(".todo-item");
    updateTodo(item.dataset.id, { completed: event.target.checked });
  });

  list.addEventListener("keydown", event => {
    if (!event.target.classList.contains("edit-input")) return;
    const item = event.target.closest(".todo-item");
    if (event.key === "Enter") saveEdit(item, item.dataset.id);
    if (event.key === "Escape") {
      editingId = null;
      render();
    }
  });

  function saveEdit(item, id) {
    const text = item.querySelector(".edit-input").value.trim();
    if (!text) {
      showError("A task cannot be empty. Cancel editing or delete the task instead.");
      return;
    }
    showError("");
    editingId = null;
    updateTodo(id, { text });
  }

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      filter = button.dataset.filter;
      editingId = null;
      render();
    });
  });

  clearBtn.addEventListener("click", clearCompleted);

  render();
})();
