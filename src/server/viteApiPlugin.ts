import type { Plugin, ViteDevServer } from 'vite';
import { analyzeMultimodalDataServer, chatWithCopilotServer, getWeatherForecastServer } from './geminiBackend';

export function viteApiPlugin(): Plugin {
  return {
    name: 'inframind-api-plugin',
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url) return next();

        if (req.method === 'POST' && req.url === '/api/weather') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              const parsed = JSON.parse(body || '{}');
              const result = await getWeatherForecastServer(parsed);
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify(result));
            } catch (err: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message || 'Server error' }));
            }
          });
          return;
        }

        if (req.method === 'POST' && req.url === '/api/analyze-multimodal') {
          let body = '';
          req.on('data', chunk => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              const parsed = JSON.parse(body || '{}');
              const result = await analyzeMultimodalDataServer(parsed);
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify(result));
            } catch (err: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message || 'Server error' }));
            }
          });
          return;
        }

        if (req.method === 'POST' && req.url === '/api/chat-copilot') {
          let body = '';
          req.on('data', chunk => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              const parsed = JSON.parse(body || '{}');
              const result = await chatWithCopilotServer(parsed);
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify(result));
            } catch (err: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message || 'Server error' }));
            }
          });
          return;
        }

        next();
      });
    },
  };
}
