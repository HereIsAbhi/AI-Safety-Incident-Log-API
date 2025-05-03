const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bodyParser = require('body-parser');

const prisma = new PrismaClient();
const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Get all incidents
app.get('/incidents', async (req, res) => {
  const incidents = await prisma.incident.findMany();
  res.json(incidents);
});

// Get a single incident by ID
app.get('/incidents/:id', async (req, res) => {
  const { id } = req.params;
  const incident = await prisma.incident.findUnique({ where: { id: Number(id) } });
  if (!incident) return res.status(404).json({ error: 'Incident not found' });
  res.json(incident);
});

// Create a new incident
app.post('/incidents', async (req, res) => {
  const { title, description, severity } = req.body;
  try {
    const incident = await prisma.incident.create({
      data: { title, description, severity },
    });
    res.status(201).json(incident);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update an incident
app.put('/incidents/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, severity } = req.body;
  try {
    const incident = await prisma.incident.update({
      where: { id: Number(id) },
      data: { title, description, severity },
    });
    res.json(incident);
  } catch (error) {
    res.status(404).json({ error: 'Incident not found' });
  }
});

// Delete an incident
app.delete('/incidents/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.incident.delete({ where: { id: Number(id) } });
    res.json({ message: 'Incident deleted' });
  } catch (error) {
    res.status(404).json({ error: 'Incident not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 