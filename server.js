const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Настройка CORS
app.use(cors());

// Настройка загрузки файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Данные о сборках (в реальном проекте используйте базу данных)
let builds = [];

// API для загрузки сборки
app.post('/api/builds', upload.single('file'), (req, res) => {
  const { name, version, modsCount, description } = req.body;
  
  const newBuild = {
    id: builds.length + 1,
    name,
    version,
    modsCount: modsCount || 0,
    description,
    uploadDate: new Date().toISOString(),
    file: req.file.filename,
    originalFileName: req.file.originalname
  };
  
  builds.push(newBuild);
  saveBuildsToFile();
  
  res.status(201).json(newBuild);
});

// API для получения сборок
app.get('/api/builds', (req, res) => {
  res.json(builds);
});

// API для скачивания сборки
app.get('/api/builds/:id/download', (req, res) => {
  const build = builds.find(b => b.id === parseInt(req.params.id));
  
  if (!build) {
    return res.status(404).send('Сборка не найдена');
  }
  
  const filePath = path.join(__dirname, 'uploads', build.file);
  res.download(filePath, build.originalFileName);
});

// Сохранение сборок в файл (для простоты)
function saveBuildsToFile() {
  fs.writeFileSync('builds.json', JSON.stringify(builds, null, 2));
}

// Загрузка сборок из файла
if (fs.existsSync('builds.json')) {
  builds = JSON.parse(fs.readFileSync('builds.json'));
}

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});