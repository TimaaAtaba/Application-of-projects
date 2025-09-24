const container = document.getElementById("projectsContainer");
let editId = null;


const defaultProjects = [
  { id: 1, name: "Subway Game Project", description: "משחק ריצה מהנה ברכבת התחתית. השחקן שולט בדמות שרצה במהירות בתוך מנהרות הרכבת התחתית", image: "images/Subway.png", rating: 0 },
  { id: 2, name: "Application Projects", description: " עוזר למשתמשים לארגן בקלות את הפרויקטים שלהם ולעקוב אחר ההתקדמות. זה מאפשר לך להוסיף פרויקטים חדשים", image: "images/AppProjects.png", rating: 0 },
  { id: 3, name: "TO-DO List Project", description: "יישום לארגון משימות יומיומיות בקלות וביעילות עבור משתמשים. הם יכולים להוסיף משימות חדשות", image: "images/notes.jpg", rating: 0 },
  { id: 4, name: "Memory Game Project", description: "משחק נועד לעורר ולחזק את הזיכרון על ידי התאמת קלפים דומים, השחקנים הופכים שני קלפים  למצוא זוגות תואמים", image: "images/memory.png", rating: 0 },
  { id: 5, name: "Simon Game Project", description: "משחק ריכוז וזיכרון פופולרי המבוסס על חזרה על דפוסי צלילים וצבעים בסדר הנכון.", image: "images/sumon.png", rating: 0 },
];

function getProjects() {
  return JSON.parse(localStorage.getItem("projectsData")) || defaultProjects;
}

function saveProjects(projects) {
  localStorage.setItem("projectsData", JSON.stringify(projects));
}

function displayProjects() {
  const projects = getProjects();
  container.innerHTML = "";
  projects.forEach(p => {
    const div = document.createElement("div");
    div.className = "project-card";
    div.innerHTML = `
      <a href="project.html?id=${p.id}">
        <img src="${p.image || 'https://via.placeholder.com/200'}" alt="${p.name}">
        <h3>${p.name}</h3>
      </a>
      <p>${p.description}</p>
      <div id="stars-${p.id}">
        ${[1,2,3,4,5].map(i => `<span class="stars ${i <= (p.rating || 0) ? 'selected':''}" data-id="${p.id}" data-value="${i}">&#9733;</span>`).join('')}
      </div>
      <div class="actions">
        <button class="editBtn" data-id="${p.id}">✏️ </button>
        <button class="deleteBtn" data-id="${p.id}">🗑️ </button>
      </div>
    `;
    container.appendChild(div);
  });

  document.querySelectorAll(".stars").forEach(star => {
    star.addEventListener("click", () => {
      const id = parseInt(star.dataset.id);
      const value = parseInt(star.dataset.value);
      const projects = getProjects();
      const project = projects.find(p => p.id === id);
      if (!project) return;
      project.rating = value;
      saveProjects(projects);
      displayProjects();
    });
  });

  document.querySelectorAll(".deleteBtn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      let projects = getProjects();
      projects = projects.filter(p => p.id !== id);
      saveProjects(projects);
      displayProjects();
    });
  });

  document.querySelectorAll(".editBtn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      const projects = getProjects();
      const project = projects.find(p => p.id === id);
      if (!project) return;
      editId = id;
      document.getElementById("projectName").value = project.name;
      document.getElementById("projectDesc").value = project.description;
      document.getElementById("projectImg").value = project.image;
      document.getElementById("formTitle").textContent = "✏️ Edit Project";
      document.getElementById("addProjectBtn").textContent = "💾 Save Changes";
      document.getElementById("cancelEditBtn").style.display = "inline";
    });
  });
}

document.getElementById("addProjectBtn").addEventListener("click", () => {
  const name = document.getElementById("projectName").value.trim();
  const desc = document.getElementById("projectDesc").value.trim();
  const img = document.getElementById("projectImg").value.trim();
if (!name || !desc) { alert("Name and description are required!"); return; }
  const projects = getProjects();
  if (editId) {
    const project = projects.find(p => p.id === editId);
    project.name = name;
    project.description = desc;
    project.image = img;
    editId = null;
    document.getElementById("formTitle").textContent = "📁 Add new project";
    document.getElementById("addProjectBtn").textContent = "➕ Add project";
    document.getElementById("cancelEditBtn").style.display = "none";
  } else {
    const newProject = {
      id: projects.length ? Math.max(...projects.map(p=>p.id))+1 : 1,
      name, description: desc, image: img, rating: 0
    };
    projects.push(newProject);
  }
  saveProjects(projects);
  document.getElementById("projectName").value = "";
  document.getElementById("projectDesc").value = "";
  document.getElementById("projectImg").value = "";
  displayProjects();
});

document.getElementById("cancelEditBtn").addEventListener("click", () => {
  editId = null;
  document.getElementById("projectName").value = "";
  document.getElementById("projectDesc").value = "";
  document.getElementById("projectImg").value = "";
 document.getElementById("formTitle").textContent = "📁 Add new project";
 document.getElementById("addProjectBtn").textContent = "➕ Add project";
  document.getElementById("cancelEditBtn").style.display = "none";
});

displayProjects();
