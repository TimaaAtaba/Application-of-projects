const express = require("express");
const cors = require("cors");
const path = require("path");
const open = require("open").default;
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const frontendPath = path.join(__dirname, "frontend");
app.use(express.static(frontendPath));

let projects = [
  { id: 1, name: "Subway Game Project", description: "משחק ריצה מהנה ברכבת התחתית. השחקן שולט בדמות שרצה במהירות בתוך מנהרות הרכבת התחתית", image: "images/Subway.png", rating: 0 },
  { id: 2, name: "Application Projects", description: " עוזר למשתמשים לארגן בקלות את הפרויקטים שלהם ולעקוב אחר ההתקדמות. זה מאפשר לך להוסיף פרויקטים חדשים", image: "images/AppProjects.png", rating: 0 },
  { id: 3, name: "TO-DO List Project", description: "יישום לארגון משימות יומיומיות בקלות וביעילות עבור משתמשים. הם יכולים להוסיף משימות חדשות", image: "images/notes.jpg", rating: 0 },
  { id: 4, name: "Memory Game Project", description: "משחק נועד לעורר ולחזק את הזיכרון על ידי התאמת קלפים דומים, השחקנים הופכים שני קלפים  למצוא זוגות תואמים", image: "images/memory.png", rating: 0 },
  { id: 5, name: "Simon Game Project", description: "משחק ריכוז וזיכרון פופולרי המבוסס על חזרה על דפוסי צלילים וצבעים בסדר הנכון.", image: "images/sumon.png", rating: 0 },
];

app.get("/projects", (req, res) => {
  res.json(projects);
});

app.get("/projects/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const project = projects.find(p => p.id === id);
  if (!project) return res.status(404).json({ error: "Project not found" });
  res.json(project);
});

app.post("/projects", (req, res) => {
  const { name, description, image } = req.body;
  if (!name || !description) return res.status(400).json({ error: "Name and description are required" });
  
  const newProject = {
    id: projects.length ? Math.max(...projects.map(p => p.id)) + 1 : 1,
    name,
    description,
    image: image || "",
    rating: 0
  };
  projects.push(newProject);
  res.json(newProject);
});

app.put("/projects/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { name, description, image } = req.body;
  const project = projects.find(p => p.id === id);
  if (!project) return res.status(404).json({ error: "Project not found" });
  if (!name || !description) return res.status(400).json({ error: "Name and description are required" });
  
  project.name = name;
  project.description = description;
  project.image = image || "";
  res.json(project);
});

app.delete("/projects/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = projects.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ error: "Project not found" });
  projects.splice(index, 1);
  res.json({ success: true });
});

app.patch("/projects/:id/rate", (req, res) => {
  const id = parseInt(req.params.id);
  const { rating } = req.body;
  const project = projects.find(p => p.id === id);
  if (!project) return res.status(404).json({ error: "Project not found" });
  if (typeof rating !== "number") return res.status(400).json({ error: "Rating must be a number" });

  project.rating = rating;
  res.json(project);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  open(`http://localhost:${PORT}/index.html`); 
});
