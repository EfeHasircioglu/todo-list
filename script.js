const listOfItems = document.getElementById("listOfItems");
const addMenu = document.getElementById("addMenu");
const addButton = document.getElementById("addButton");
const addEventButton = document.getElementById("addEventButton");
const taskTitle = document.getElementById("taskTitle");
const taskDesc = document.getElementById("taskDesc");
const taskDeadline = document.getElementById("taskDeadline");
const checkboxes = document.getElementsByClassName("visual-checkbox");
const filterSelect = document.getElementById("filterSelect");
const deleteButtons = document.getElementsByClassName("delete-buttons");
const editButtons = document.getElementsByClassName("edit-buttons");
const taskUrgency = document.getElementById("taskUrgency");
const searchInput = document.getElementById("searchInput");
const taskCategory = document.getElementById("taskCategory");
const editCloseButton = document.getElementById("editCloseButton");
const editPanel = document.getElementById("editPanel");
const overlay = document.getElementById("overlay");
const deleteModal = document.getElementById("deleteModal");
const deleteCloseButton = document.getElementById("deleteCloseButton");
const dmCancelButton = document.getElementById("dmCancelButton");
const dmConfirmButton = document.getElementById("dmConfirmButton");
const settingsButton = document.getElementById("settingsButton");
const settingsCloseButton = document.getElementById("settingsCloseButton");
const darkModeToggle = document.getElementById("darkModeToggle");
const settingsModal = document.getElementById("settingsModal"); // bu butona basınca bi modal açılcak ve dark mode geçiş zımbırtısı yer alacak toggle şeklinde olursa hoş olur
//edit menüsündeki inputları falan seçiyoruz!
const editTitle = document.getElementById("editTaskTitle");
const editDesc = document.getElementById("editTaskDesc");
const editDeadline = document.getElementById("editTaskDeadline");
const editCategory = document.getElementById("editTaskCategory");
const editUrgency = document.getElementById("editTaskUrgency");
const editEventButton = document.getElementById("editEventButton");
const deviceDarkMode = window.matchMedia(
  "(prefers-color-scheme: dark)"
).matches;
let taskBeingEdited = null;
let taskBeingDeleted = null;
// TODO: aslında şey yapılabilir, eğer additional content'e koyadacak bir şey yok ise additional-content display: none olsun.
// TODO: details diye bi kısım olsun title ve description dışındaki her şeyi oraya koyalım, bide delete şeyini hoverle olan bişe yerine direk tikin altına koyabiliriz
if (Notification.permission === "default") {
  Notification.requestPermission();
}

function formatTurkishDateForInput(turkishDate) {
  const [day, month, year] = turkishDate.split(".");
  return `${year}-${month}-${day}`;
}
//başta üzerine gelinmesin
addMenu.style.pointerEvents = "none";

const urgencyMap = {
  extreme: 5,
  high: 4,
  medium: 3,
  normal: 2,
  none: 1,
};
let tasks = [
  {
    text: "Welcome to my to-do list app!",
    description: "Go around to explore the app.",
    deadline: new Date().toLocaleDateString("tr"),
    urgency: "high",
    completed: false,
    category: "personal",
    notified: true,
  },
];
let clickCount = 0;

//edit menüsündeki close butonunun işlevi
editCloseButton.addEventListener("click", () => {
  editPanel.style.display = "none";
  overlay.style.display = "none";
});
deleteCloseButton.addEventListener("click", () => {
  deleteModal.style.display = "none";
  overlay.style.display = "none";
});
dmCancelButton.addEventListener("click", () => {
  deleteModal.style.display = "none";
  overlay.style.display = "none";
});

const checkDueTasks = () => {
  const now = new Date();
  tasks.forEach((task) => {
    if (!task.notified && !task.completed && new Date(task.deadline) < now) {
      new Notification("Task Due", {
        body: `${task.text} is due!`,
        icon: "🛎️",
      });
      task.notified = true;
    }
  });
};

const searchFunc = (query) => {
  if (query === "") {
    listOfItems.innerHTML = "";
    showTasks(tasks);
  } else {
    const searchedTasks = tasks.filter((task) =>
      task.text.toLowerCase().includes(query)
    );
    listOfItems.innerHTML = "";
    showTasks(searchedTasks);
  }
};

//burada arama fonksiyonu var, yarın tamamlanacak, hatta yarın direk bütün uygulamayı tamamlayayım
searchInput.addEventListener("input", () => {
  debounce(searchFunc(searchInput.value.toLowerCase()), 300);
});
//ararken performansı arttırmak için yazmayı bitirdiğimize bakıyoruz ve sonra sonucu biraz geç veriyoruz
function debounce(func, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}
//filtreleme olayı için olan şeyler
filterSelect.addEventListener("change", (event) => {
  if (event.target.value === "all") {
    listOfItems.innerHTML = "";
    showTasks(tasks);
  } else if (event.target.value === "due") {
    dueTasks = tasks.filter(
      (task) => new Date(task.deadline) < new Date() && task.completed === false
    );
    listOfItems.innerHTML = "";
    showTasks(dueTasks);
  } else if (event.target.value === "active") {
    activeTasks = tasks.filter((task) => task.completed === false);
    listOfItems.innerHTML = "";
    showTasks(activeTasks);
  } else if (event.target.value === "completed") {
    completedTasks = tasks.filter((task) => task.completed === true);
    listOfItems.innerHTML = "";
    showTasks(completedTasks);
  }
});

//ekleme menüsünü açan fonksiyon
addButton.addEventListener("click", () => {
  clickCount++;
  addMenu.classList.toggle("hidden");
  if (clickCount % 2 === 0) {
    addMenu.classList.remove("open");
    addMenu.classList.add("close");
    addMenu.style.pointerEvents = "none";
  } else {
    addMenu.classList.remove("close");
    addMenu.classList.add("open");
    addMenu.style.pointerEvents = "auto";
  }
});

addEventButton.addEventListener("click", () => {
  let taskText = taskTitle.value;
  let taskDescription = taskDesc.value;
  let taskDeadlineDate = taskDeadline.value;
  let taskUrgencyValue = taskUrgency.value;
  let taskCategoryValue = taskCategory.value;

  if (taskText != "") {
    if (taskCategoryValue === "addnew") {
    }
    let newTask = {
      // bu bir obje, yeni bi görevin objesi
      text: taskText,
      description: taskDescription,
      deadline: new Date(taskDeadlineDate).toLocaleDateString("tr"),
      urgency: taskUrgencyValue,
      category: taskCategoryValue,
      completed: false,
    };
    tasks.push(newTask);
    listOfItems.innerHTML = "";
    localStorage.setItem("efesTasks", JSON.stringify(tasks));
    showTasks(tasks);
    taskTitle.value = "";
  } else {
    alert("The task text must not be empty.");
    showTasks(tasks);
  }
});
// görevleri yapıldı işaretleme mantığı
listOfItems.addEventListener("click", (event) => {
  const visualCheckbox = event.target.closest(".visual-checkbox");
  if (visualCheckbox) {
    const clickedContainer = visualCheckbox.closest(".element-container");
    const checkbox = clickedContainer.querySelector('input[type="checkbox"]');
    checkbox.checked = !checkbox.checked;
    visualCheckbox.classList.toggle("visual-checkbox-clicked");
    //şimdi indexini bulup objedeki completed şeyini true yapacağız, bu sayede filtreleme düzgün çalışacak
    const index = clickedContainer.getAttribute("data-index");
    let taskObject = tasks[index];
    taskObject.completed = checkbox.checked;
  }
});

const showTasks = (taskList) => {
  if (taskList.length === 0) {
    listOfItems.innerHTML = "There are no items to display.";
    listOfItems.style.paddingLeft = "1rem";
    listOfItems.style.fontSize = "1.5rem";
  } else {
    listOfItems.style.fontSize = "initial";
    listOfItems.style.paddingLeft = "initial";
  }
  taskList.sort((a, b) => {
    return urgencyMap[b.urgency] - urgencyMap[a.urgency];
  });
  taskList.forEach((task) => {
    let elementContainer = document.createElement("div");
    let realIndex = tasks.indexOf(task); // orijinal tasks array'indeki index
    elementContainer.setAttribute("data-index", realIndex); // her elementin objesindeki index değerini görünüşsel olarak da ekliyoruz
    let element = document.createElement("li");
    let description = document.createElement("span");
    let additionalContainer = document.createElement("div");
    //yandaki edit ve delete butonlarının containeri
    let manButContainer = document.createElement("div");
    let duedate = document.createElement("span");
    let urgency = document.createElement("span");
    let category = document.createElement("span");
    let checkbox = document.createElement("input");
    let visualCheckbox = document.createElement("span");
    let visualCheckboxContainer = document.createElement("span");
    let title = document.createElement("span");
    let deleteButton = document.createElement("a");
    let editButton = document.createElement("a");
    elementContainer.classList.add("element-container");
    deleteButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="16" width="24" viewBox="0 0 448 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>`;
    deleteButton.classList.add("delete-buttons");
    editButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="16" viewBox="0 0 576 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 125.7-86.8 86.8c-10.3 10.3-17.5 23.1-21 37.2l-18.7 74.9c-2.3 9.2-1.8 18.8 1.3 27.5L64 512c-35.3 0-64-28.7-64-64L0 64zm384 64l-128 0L256 0 384 128zM549.8 235.7l14.4 14.4c15.6 15.6 15.6 40.9 0 56.6l-29.4 29.4-71-71 29.4-29.4c15.6-15.6 40.9-15.6 56.6 0zM311.9 417L441.1 287.8l71 71L382.9 487.9c-4.1 4.1-9.2 7-14.9 8.4l-60.1 15c-5.5 1.4-11.2-.2-15.2-4.2s-5.6-9.7-4.2-15.2l15-60.1c1.4-5.6 4.3-10.8 8.4-14.9z"/></svg>`;
    editButton.classList.add("edit-buttons");
    deleteButton.href = "javascript:void(0);";
    editButton.href = "javascript:void(0);";
    checkbox.type = "checkbox";
    manButContainer.classList.add('manupilative-buttons-container');
    element.classList.add("todo-items");
    description.classList.add("task-description");
    duedate.classList.add("task-duedate");
    urgency.classList.add("task-urgency");
    category.classList.add("task-urgency");
    category.classList.add("task-category");
    title.style.display = 'flex-inline'; // title texti overflow olduğu zaman çirkin görünüyor, bu sorun çözülecek
    additionalContainer.classList.add("additional-container");
    title.textContent = task.text;
    title.style.overflowWrap = "break-word";
    title.style.wordBreak = "break-word";
    description.textContent = task.description;
    duedate.textContent = task.deadline;
    checkbox.style.opacity = 0;
    checkbox.style.position = "absolute";
    checkbox.style.width = "1.7rem";
    checkbox.style.height = "1.7rem";
    visualCheckbox.classList.add("visual-checkbox");
    if (task.deadline === '' && task.category == '' && task.urgency ==''){
      additionalContainer.style.display = 'none';
    }
    // visualCheckboxContainer.classList.add('vcb');
    // todo: daha sonradan şu wrapping text muhabbetini çözmek için bu sınıfa ihtiyaç duyulabilir
    // bu elementleri şimdi ekrana ekliyoruz
    listOfItems.appendChild(elementContainer);
    elementContainer.appendChild(element);
    elementContainer.appendChild(manButContainer);
    manButContainer.appendChild(deleteButton);
        manButContainer.appendChild(editButton);
    element.appendChild(checkbox);
    element.appendChild(visualCheckboxContainer)
    visualCheckboxContainer.appendChild(visualCheckbox);
    element.appendChild(title);
    element.appendChild(description);
    element.appendChild(additionalContainer);
    additionalContainer.appendChild(duedate);
    additionalContainer.appendChild(urgency);
    additionalContainer.appendChild(category);

    

    if (task.urgency === "high") {
      urgency.textContent = "High ‼️";
    } else if (task.urgency === "medium") {
      urgency.textContent = "Medium ❗";
    } else if (task.urgency === "normal") {
      urgency.textContent = "Normal ❕";
    } else if (task.urgency === "extreme") {
      urgency.textContent = "Extreme ⚠️";
    } else if (task.urgency === "none") {
      urgency.style.display = "none";
    }
    if (task.category === "personal") {
      category.textContent = "Personal";
      category.style.backgroundColor = "lightgreen";
      if (document.body.classList.contains("dark-mode")) {
        category.style.backgroundColor = "green";
      }
    } else if (task.category === "work") {
      category.textContent = "Work";
      category.style.backgroundColor = "lightsalmon";
      if (document.body.classList.contains("dark-mode")) {
        category.style.backgroundColor = "salmon";
      }
    } else if (task.category === "home") {
      category.textContent = "Home";
      category.style.backgroundColor = "orchid";
      if (document.body.classList.contains("dark-mode")) {
        category.style.backgroundColor = "#72206f";
      }
    } else if (task.category === "none") {
      category.classList.add("hidden");
    }

    if (task.completed) {
      visualCheckbox.classList.toggle("visual-checkbox-clicked");
      checkbox.checked = true;
    }
    if (task.deadline === "Invalid Date") {
      duedate.style.display = "none";
    }
    deleteButtons[realIndex].addEventListener("click", () => {
      deleteModal.style.display = "flex";
      overlay.style.display = "flex";
      taskBeingDeleted = realIndex;
    });
    editButtons[realIndex].addEventListener("click", (event) => {
      editPanel.style.display = "flex";
      overlay.style.display = "flex";
      const container = event.target.closest(".element-container");
      const index = container.getAttribute("data-index");
      const task = tasks[index];
      editTitle.value = task.text;
      editDesc.value = task.description;
      editDeadline.value = formatTurkishDateForInput(task.deadline);
      editUrgency.value = task.urgency;
      editCategory.value = task.category;

      taskBeingEdited = index;
    });
  });
};

editEventButton.addEventListener("click", () => {
  if (taskBeingEdited !== null) {
    const editedTask = tasks[taskBeingEdited];
    editedTask.text = editTitle.value;
    editedTask.description = editDesc.value;
    editedTask.deadline = new Date(editDeadline.value).toLocaleDateString("tr");
    editedTask.urgency = editUrgency.value;
    editedTask.category = editCategory.value;

    editPanel.style.display = "none";
    overlay.style.display = "none";

    listOfItems.innerHTML = "";
    localStorage.setItem("efesTasks", JSON.stringify(tasks));
    showTasks(tasks);

    taskBeingEdited = null;
  }
});
darkModeToggle.addEventListener("change", () => {
  if (darkModeToggle.checked) {
    document.body.classList.add("dark-mode");
    localStorage.setItem("darkMode", "enabled");
  } else {
    document.body.classList.remove("dark-mode");
    localStorage.setItem("darkMode", "disabled");
  }
});

dmConfirmButton.addEventListener("click", () => {
  deleteTask(taskBeingDeleted);
  deleteModal.style.display = "none";
  overlay.style.display = "none";
});

const deleteTask = (index) => {
  tasks.splice(index, 1);
  localStorage.setItem("efesTasks", JSON.stringify(tasks));

  listOfItems.innerHTML = "";
  showTasks(tasks);
};

settingsButton.addEventListener("click", () => {
  settingsModal.style.display = "block";
  overlay.style.display = "block";
});
settingsCloseButton.addEventListener("click", () => {
  settingsModal.style.display = "none";
  overlay.style.display = "none";
});

if (localStorage.getItem("darkMode") === "enabled") {
  document.body.classList.add("dark-mode");
  darkModeToggle.checked = true;
} else if (localStorage.getItem("darkMode") !== "enabled") {
  // zaten light mode'da başlıyoruz
} else if (deviceDarkMode === true) {
  document.body.classList.add("dark-mode");
  darkModeToggle.checked = true;
}
const savedTasks = localStorage.getItem("efesTasks");
if (savedTasks) {
  tasks = JSON.parse(savedTasks);
  showTasks(tasks);
} else {
  showTasks(tasks);
}

checkDueTasks();
