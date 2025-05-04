import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import nodemailer from 'nodemailer';

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

    // Email alert for "High" severity
    if (severity === 'High') {
      // Create a test account (for development)
      const testAccount = await nodemailer.createTestAccount();

      // Create a transporter
      const transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });

      // Email options
      const mailOptions = {
        from: '"AI Safety Incident Log" <no-reply@example.com>',
        to: 'alert-recipient@example.com', // Change to your email
        subject: 'High Severity Incident Alert',
        text: `A high severity incident was reported:\n\nTitle: ${title}\nDescription: ${description}`,
      };

      // Send the email
      const info = await transporter.sendMail(mailOptions);

      // For development: log the preview URL
      console.log('Alert email sent:', nodemailer.getTestMessageUrl(info));
    }

    res.status(201).json(incident);
  } catch (err) {
    next(err);
  }
});

// GET /incidents/stats
router.get('/stats', async (req: Request, res: Response) => {
  try {
    // 1. Count by severity
    const countBySeverity = await prisma.incident.groupBy({
      by: ['severity'],
      _count: { severity: true },
    });

    // 2. Daily trend (last 30 days)
    const dailyTrend = await prisma.$queryRaw<
      Array<{ date: string; count: number }>
    >(Prisma.sql`
      SELECT 
        DATE(reported_at) as date, 
        COUNT(*) as count
      FROM Incident
      WHERE reported_at >= DATE('now', '-30 days')
      GROUP BY DATE(reported_at)
      ORDER BY date ASC
    `);

    // 3. Percentage of high-risk incidents
    const totalCount = await prisma.incident.count();
    const highCount = await prisma.incident.count({
      where: { severity: 'High' },
    });
    const highRiskPercentage = totalCount === 0 ? 0 : (highCount / totalCount) * 100;

    res.json({
      countBySeverity,
      dailyTrend,
      highRiskPercentage: highRiskPercentage.toFixed(2) + '%',
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats.' });
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
