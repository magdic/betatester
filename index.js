const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const cors = require('cors');
const path = require('node:path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(bodyParser.json());

// Serve static files for UI
app.use(express.static(__dirname));

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Node.js CRUD API! Use /items for CRUD operations.');
});

// Helper to read data
const readData = async () => {
  const exists = await fs.pathExists(DATA_FILE);
  if (!exists) {
    await fs.writeJson(DATA_FILE, []);
    return [];
  }
  return await fs.readJson(DATA_FILE);
};

// Helper to write data
const writeData = async (data) => {
  await fs.writeJson(DATA_FILE, data, { spaces: 2 });
};

// GET all items
app.get('/items', async (req, res) => {
  const data = await readData();
  res.json(data);
});

// GET single item by id
app.get('/items/:id', async (req, res) => {
  const data = await readData();
  const item = data.find(i => i.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Item not found' });
  res.json(item);
});

// CREATE item
app.post('/items', async (req, res) => {
  const data = await readData();
  const newItem = { ...req.body, id: Date.now().toString() };
  data.push(newItem);
  await writeData(data);
  res.status(201).json(newItem);
});

// UPDATE item
app.put('/items/:id', async (req, res) => {
  const data = await readData();
  const idx = data.findIndex(i => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Item not found' });
  data[idx] = { ...data[idx], ...req.body, id: req.params.id };
  await writeData(data);
  res.json(data[idx]);
});

// DELETE item
app.delete('/items/:id', async (req, res) => {
  let data = await readData();
  const idx = data.findIndex(i => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Item not found' });
  const deleted = data[idx];
  data = data.filter(i => i.id !== req.params.id);
  await writeData(data);
  res.json(deleted);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
