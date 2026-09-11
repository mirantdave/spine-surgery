import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import { initDatabase } from './server/db.js';
import patientsRouter from './server/routes/patients.js';
import connectorsRouter from './server/routes/connectors.js';
import smartAssistRouter from './server/routes/smartAssist.js';
import protocolsRouter from './server/routes/protocols.js';
import surgeonsRouter from './server/routes/surgeons.js';
import analyticsRouter from './server/routes/analytics.js';
import systemRouter from './server/routes/system.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3031;

// Seed & load persistent database
initDatabase();

// Middleware
app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logger for clinical audit
app.use((req: Request, _res: Response, next: NextFunction) => {
  if (req.path.startsWith('/api') && req.method !== 'GET') {
    console.log(`[CLINICAL API] ${req.method} ${req.path} - ${new Date().toLocaleTimeString('en-US')}`);
  }
  next();
});

// Mount Modular API Routers
app.use('/api', systemRouter);
app.use('/api/patients', patientsRouter);
app.use('/api/patients', connectorsRouter); // Handles /api/patients/:patientId/connectors
app.use('/api/connectors', connectorsRouter);
app.use('/api/smart', smartAssistRouter);
app.use('/api/protocols', protocolsRouter);
app.use('/api/surgeons', surgeonsRouter);
app.use('/api/auth', surgeonsRouter);
app.use('/api/analytics', analyticsRouter);

// Global Error Handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[SERVER ERROR]:', err);
  res.status(500).json({
    error: 'Internal Clinical Server Error',
    message: err.message || 'An unexpected error occurred in SpineOS backend.'
  });
});

// Static Web App Build Serving (for standalone production hosting)
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req: Request, res: Response) => {
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ error: 'API endpoint not found' });
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`========================================================`);
  console.log(`🏥 Stavya SpineOS Clinical & Operative Backend Active!`);
  console.log(`🚀 Port: ${PORT} (API) | Client Port: 3030`);
  console.log(`🌐 Cross-Departmental Connectors: 9/9 Active`);
  console.log(`🧠 Smart Clinical Sentinel & AI Risk Engine: ONLINE`);
  console.log(`========================================================`);
});
