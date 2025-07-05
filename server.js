// server.js
const express = require('express');
const cors    = require('cors');
const fs      = require('fs');
const app     = express();
const DATA    = 'checkedBlocks.json';

app.use(cors());
app.use(express.json());

// load existing state (or start empty)
let checked = new Set();
if (fs.existsSync(DATA)) {
  try {
    checked = new Set(JSON.parse(fs.readFileSync(DATA)));
  } catch {}
}

// GET current state
app.get('/checked', (req, res) => {
  res.json([...checked]);
});

// POST new state
app.post('/checked', (req, res) => {
  if (!Array.isArray(req.body)) {
    return res.status(400).json({error: 'payload must be array'});
  }
  checked = new Set(req.body);
  fs.writeFileSync(DATA, JSON.stringify([...checked]));
  res.json({status: 'ok'});
});

// serve on port 3000 (or process.env.PORT for Replit)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ server listening on port ${PORT}`));
