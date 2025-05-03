import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

const allowedSeverities = ['Low', 'Medium', 'High'];

// GET /incidents
router.get('/', async (req: Request, res: Response) => {
  const incidents = await prisma.incident.findMany();
  res.json(incidents);
});

// POST /incidents
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, severity } = req.body;
    if (!title || !description || !severity) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }
    if (!allowedSeverities.includes(severity)) {
      return res.status(400).json({ error: 'Invalid severity value.' });
    }
    const incident = await prisma.incident.create({
      data: { title, description, severity },
    });
    res.status(201).json(incident);
  } catch (err) {
    next(err);
  }
});

// GET /incidents/:id
router.get('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const incident = await prisma.incident.findUnique({ where: { id } });
  if (!incident) return res.status(404).json({ error: 'Incident not found.' });
  res.json(incident);
});

// DELETE /incidents/:id
router.delete('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    await prisma.incident.delete({ where: { id } });
    res.status(204).send();
  } catch {
    res.status(404).json({ error: 'Incident not found.' });
  }
});

// PATCH /incidents/:id (Partial update)
router.patch('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { title, description, severity } = req.body;
  const updateData: any = {};
  if (title !== undefined) updateData.title = title;
  if (description !== undefined) updateData.description = description;
  if (severity !== undefined) {
    if (!allowedSeverities.includes(severity)) {
      return res.status(400).json({ error: 'Invalid severity value.' });
    }
    updateData.severity = severity;
  }
  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ error: 'No valid fields provided for update.' });
  }
  try {
    const incident = await prisma.incident.update({
      where: { id },
      data: updateData,
    });
    res.json(incident);
  } catch (error) {
    res.status(404).json({ error: 'Incident not found.' });
  }
});

// PUT /incidents/:id (Full update)
router.put('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { title, description, severity } = req.body;

  if (!title || !description || !severity) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }
  if (!allowedSeverities.includes(severity)) {
    return res.status(400).json({ error: 'Invalid severity value.' });
  }

  try {
    const incident = await prisma.incident.update({
      where: { id },
      data: { title, description, severity },
    });
    res.json(incident);
  } catch (error) {
    res.status(404).json({ error: 'Incident not found.' });
  }
});

export default router;
