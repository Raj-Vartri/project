let tasks = JSON.parse(localStorage.getItem("tasks_v2")) || [];
let currentFilter = "all";
let editingIndex = null;

function saveTasks() {
  localStorage.setItem("tasks_v2", JSON.stringify(tasks));
}
function showWarning(msg="") {
  document.getElementById("warning").innerText = msg;
}
function addTask() {
  const input = document.getElementById("task-input");
  const value = input.value.trim();
  if (!value) {
    input.classList.add('shake');
    showWarning("Task can't be empty.");
    setTimeout(()=>input.classList.remove('shake'),300);
    return;
  }
  tasks.push({ id: Date.now() + Math.random(), text: value, completed: false });
  input.value = "";
  showWarning();
  saveTasks();
  renderTasks();
}
function toggleTask(idx) {
  tasks[idx].completed = !tasks[idx].completed;
  saveTasks();
  renderTasks();
}
function deleteTask(idx) {
  if(editingIndex === idx) editingIndex = null;
  tasks.splice(idx, 1);
  saveTasks();
  renderTasks();
}
function filterTasks(type, event) {
  currentFilter = type;
  document.querySelectorAll('.filters button').forEach(btn => {btn.classList.remove("active"); btn.removeAttribute('aria-current');});
  if(event && event.target) {
    event.target.classList.add("active");
    event.target.setAttribute('aria-current', 'true');
  }
  renderTasks();
}
function editTask(idx) {
  editingIndex = idx;
  renderTasks();
  setTimeout(() => {
    const editInput = document.getElementById('edit-input');
    if(editInput) editInput.focus();
  }, 40);
}
function handleEdit(idx) {
  const input = document.getElementById('edit-input');
  const value = input.value.trim();
  if (value) {
    tasks[idx].text = value;
    editingIndex = null;
    saveTasks();
    renderTasks();
    showWarning();
  } else {
    input.classList.add('shake');
    showWarning("Task can't be empty.");
    setTimeout(()=>input.classList.remove('shake'),300);
  }
}
function renderTasks() {
  const list = document.getElementById("task-list");
  list.innerHTML = "";
  tasks.forEach((task, index) => {
    let show = (
      currentFilter === "all" ||
      (currentFilter === "active" && !task.completed) ||
      (currentFilter === "completed" && task.completed)
    );
    if (!show) return;

    const li = document.createElement("li");
    if(task.completed) li.classList.add("completed");

    // Edit mode
    if (editingIndex === index) {
      const edit = document.createElement("input");
      edit.type = "text";
      edit.className = "task-edit";
      edit.id = "edit-input";
      edit.value = task.text;
      edit.setAttribute('aria-label', 'Edit task');
      edit.setAttribute('maxlength', 60);
      edit.onkeydown = (e) => {
        if (e.key === "Enter") { handleEdit(index);}
        if (e.key === "Escape") { editingIndex = null; renderTasks(); }
      };
      edit.onblur = () => { handleEdit(index); };
      li.appendChild(edit);
    } else {
      const span = document.createElement("span");
      span.className = "task-text";
      span.innerText = task.text;
      span.title = "Double-click to edit";
      span.tabIndex = 0;
      span.setAttribute('role', 'textbox');
      span.onclick = () => toggleTask(index);
      span.ondblclick = () => editTask(index);
      span.onkeydown = (e) => {
        if (['Enter',' '].includes(e.key)) toggleTask(index);
        if (e.key === "F2") editTask(index);
      };
      li.appendChild(span);
    }

    // Actions
    const actions = document.createElement("div");
    actions.className = "actions";

    // Complete/undo
    const doneBtn = document.createElement("button");
    doneBtn.title = task.completed ? "Mark as active" : "Mark as complete";
    doneBtn.innerHTML = task.completed
      ? '<i class="fa-regular fa-circle"></i>'
      : '<i class="fa-solid fa-check-circle"></i>';
    doneBtn.onclick = () => toggleTask(index);
    actions.appendChild(doneBtn);

    // Edit
    const editBtn = document.createElement("button");
    editBtn.title = "Edit Task";
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
    editBtn.onclick = () => editTask(index);
    actions.appendChild(editBtn);

    // Delete
    const delBtn = document.createElement("button");
    delBtn.title = "Delete Task";
    delBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
    delBtn.onclick = () => deleteTask(index);
    actions.appendChild(delBtn);

    li.appendChild(actions);
    list.appendChild(li);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderTasks();
  const input = document.getElementById("task-input");
  input.addEventListener("keydown", function(e) {
    if (e.key === "Enter") addTask();
  });
});
