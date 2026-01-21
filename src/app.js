const STORAGE_KEY = "todo-list-items-v1";

function loadItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveItems(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function render(items) {
  const list = document.getElementById("taskList");
  const stats = document.getElementById("stats");

  list.innerHTML = "";
  for (const item of items) {
    const li = document.createElement("li");
    li.className = "item" + (item.done ? " done" : "");

    const left = document.createElement("div");
    left.className = "left";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.done;
    checkbox.addEventListener("change", () => {
      item.done = checkbox.checked;
      saveItems(items);
      render(items);
    });

    const label = document.createElement("div");
    label.className = "label";
    label.textContent = item.text;

    left.appendChild(checkbox);
    left.appendChild(label);

    const delBtn = document.createElement("button");
    delBtn.className = "iconBtn";
    delBtn.textContent = "Delete";
    delBtn.addEventListener("click", () => {
      const idx = items.findIndex((x) => x.id === item.id);
      if (idx >= 0) items.splice(idx, 1);
      saveItems(items);
      render(items);
    });

    li.appendChild(left);
    li.appendChild(delBtn);
    list.appendChild(li);
  }

  const total = items.length;
  const done = items.filter((x) => x.done).length;
  stats.textContent = `${total} task(s) • ${done} completed`;
}

function addItem(items, text) {
  items.unshift({ id: uid(), text, done: false, createdAt: Date.now() });
}

function main() {
  const items = loadItems();

  const input = document.getElementById("taskInput");
  const addBtn = document.getElementById("addBtn");
  const clearBtn = document.getElementById("clearBtn");

  function handleAdd() {
    const text = input.value.trim();
    if (!text) return;
    addItem(items, text);
    input.value = "";
    saveItems(items);
    render(items);
    input.focus();
  }

  addBtn.addEventListener("click", handleAdd);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleAdd();
  });

  clearBtn.addEventListener("click", () => {
    const remaining = items.filter((x) => !x.done);
    items.length = 0;
    items.push(...remaining);
    saveItems(items);
    render(items);
  });

  render(items);
  input.focus();
}

main();
