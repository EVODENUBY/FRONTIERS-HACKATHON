import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { analyzeMultimodalDataServer, chatWithCopilotServer } from './src/server/geminiBackend.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '25mb' }));

// API endpoints
app.post('/api/analyze-multimodal', async (req, res) => {
  try {
    const result = await analyzeMultimodalDataServer(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Analysis failed' });
  }
});

app.post('/api/chat-copilot', async (req, res) => {
  try {
    const result = await chatWithCopilotServer(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Copilot failed' });
  }
});

// Serve static assets from dist
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`InfraMind AI server listening on port ${PORT}`);
});
