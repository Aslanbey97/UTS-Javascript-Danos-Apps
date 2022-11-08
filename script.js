const UNCOMPLETED_LIST_DANO_ID = "danos";
const COMPLETED_LIST_DANO_ID = "completed-danos";
const DANO_ITEMID = "itemId";
const STORAGE_KEY = "DANO_APPS";

let danos = [];

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function saveData() {
  const parsed = JSON.stringify(danos);
  localStorage.setItem(STORAGE_KEY, parsed);
  document.dispatchEvent(new Event("ondatasaved"));
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);

  let data = JSON.parse(serializedData);

  if (data !== null) danos = data;

  document.dispatchEvent(new Event("ondataloaded"));
}

function updateDataToStorage() {
  if (isStorageExist()) saveData();
}

function composeDanoObject(task, timestamp, isCompleted) {
  return {
    id: +new Date(),
    task,
    timestamp,
    isCompleted
  };
}

function findDano(danoId) {
  for (const dano of danoId) {
    if (dano.id === danoId) return dano;
  }

  return null;
}

function findDanoIndex(danoId) {
  let index = 0;
  for (const dano of danos) {
    if (dano.id === danoId) return index;

    index++;
  }

  return -1;
}

function makeDano(
  data ,
  timestamp ,
  isCompleted
) {
  const textTitle = document.createElement("h2");
  textTitle.innerText = data;

  const textTimestamp = document.createElement("p");
  textTimestamp.innerText = timestamp;

  const textContainer = document.createElement("div");
  textContainer.classList.add("inner");
  textContainer.append(textTitle, textTimestamp);

  const container = document.createElement("div");
  container.classList.add("item", "shadow");
  container.append(textContainer);

  if (isCompleted) {
    container.append(createUndoButton(), createTrashButton());
  } else {
    container.append(createCheckButton());
  }

  return container;
}

function createUndoButton() {
  return createButton("undo-button", function (event) {
    undoTaskFromCompleted(event.target.parentElement);
  });
}

function createTrashButton() {
  return createButton("trash-button", function (event) {
    removeTaskFromCompleted(event.target.parentElement);
  });
}

function createCheckButton() {
  return createButton("check-button", function (event) {
    addTaskToCompleted(event.target.parentElement);
  });
}

function createButton(buttonTypeClass, eventListener) {
  const button = document.createElement("button");
  button.classList.add(buttonTypeClass);
  button.addEventListener("click", function (event) {
    eventListener(event);
    event.stopPropagation();
  });
  return button;
}

function addDano() {
  const uncompletedDANOList = document.getElementById(UNCOMPLETED_LIST_DANO_ID);
  const textDano = document.getElementById("title").value;
  const timestamp = document.getElementById("date").value;

  const dano = makeDano(textDano, timestamp, false);
  const danoObject = composeDanoObject(textDano, timestamp, false);

  dano[DANO_ITEMID] = danoObject.id;
  danos.push(danoObject);

  uncompletedDANOList.append(dano);
  updateDataToStorage();
}

function addTaskToCompleted(taskElement) {
  const listCompleted = document.getElementById(COMPLETED_LIST_DANO_ID);
  const taskTitle = taskElement.querySelector(".inner > h2").innerText;
  const taskTimestamp = taskElement.querySelector(".inner > p").innerText;

  const newDano = makeDano(taskTitle, taskTimestamp, true);

  const dano = findDano(taskElement[DANO_ITEMID]);
  dano.isCompleted = true;
  newDano[DANO_ITEMID] = dano.id;

  listCompleted.append(newDano);
  taskElement.remove();

  updateDataToStorage();
}

function removeTaskFromCompleted(taskElement) {
  const danoPosition = findDanoIndex(taskElement[DANO_ITEMID]);
  danos.splice(danoPosition, 1);

  taskElement.remove();
  updateDataToStorage();
}

function undoTaskFromCompleted(taskElement) {
  const listUncompleted = document.getElementById(UNCOMPLETED_LIST_DANO_ID);
  const taskTitle = taskElement.querySelector(".inner > h2").innerText;
  const taskTimestamp = taskElement.querySelector(".inner > p").innerText;

  const newDano = makeDano(taskTitle, taskTimestamp, false);

  const dano = findDano(taskElement[DANO_ITEMID]);
  dano.isCompleted = false;
  newDano[DANO_ITEMID] = dano.id;

  listUncompleted.append(newDano);
  taskElement.remove();

  updateDataToStorage();
}

function refreshDataFromDanos() {
  const listUncompleted = document.getElementById(UNCOMPLETED_LIST_DANO_ID);
  let listCompleted = document.getElementById(COMPLETED_LIST_DANO_ID);

  for (const dano of danos) {
    const newDano = makeDano(dano.task, dano.timestamp, dano.isCompleted);
    newDano[DANO_ITEMID] = dano.id;

    if (dano.isCompleted) {
      listCompleted.append(newDano);
    } else {
      listUncompleted.append(newDano);
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const submitForm  = document.getElementById("form");

  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addDano();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener("ondatasaved", () => {
  console.log("Data berhasil di simpan.");
});

document.addEventListener("ondataloaded", () => {
  refreshDataFromDanos();
});
