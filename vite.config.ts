import type { IncomingMessage } from 'node:http';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/*
 * En producción (Vercel) cada archivo de /api es una función serverless.
 * En desarrollo, este plugin hace lo mismo dentro del servidor de Vite:
 *   /api/checkout  →  api/checkout.ts  →  export function POST(request)
 * Así podemos probar el checkout completo con `npm run dev`.
 */
function devApi(): Plugin {
  return {
    name: 'lumina-dev-api',
    configureServer(server) {
      server.middlewares.use('/api', async (req, res, next) => {
        const url = new URL(req.url ?? '/', 'http://localhost');
        const name = url.pathname.replace(/^\/+|\/+$/g, '');
        if (!/^[\w-]+$/.test(name)) return next();

        try {
          const mod = await server.ssrLoadModule(`/api/${name}.ts`);
          const handler = mod[req.method ?? 'GET'] as ((r: Request) => Promise<Response>) | undefined;
          if (!handler) {
            res.statusCode = 405;
            return res.end('Method Not Allowed');
          }
          const body = req.method === 'GET' || req.method === 'HEAD' ? undefined : await readBody(req);
          // Dentro de use('/api') Connect recorta req.url; originalUrl conserva la ruta completa.
          const path = (req as IncomingMessage & { originalUrl?: string }).originalUrl ?? req.url;
          const request = new Request(`http://${req.headers.host}${path}`, {
            method: req.method,
            headers: req.headers as Record<string, string>,
            body,
          });
          const response = await handler(request);
          res.statusCode = response.status;
          response.headers.forEach((value, key) => res.setHeader(key, value));
          res.end(Buffer.from(await response.arrayBuffer()));
        } catch (err) {
          server.ssrFixStacktrace(err as Error);
          next(err);
        }
      });
    },
  };
}

function readBody(req: IncomingMessage): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (c: Buffer) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default defineConfig(({ mode }) => {
  // Carga .env / .env.local también para el código de servidor (process.env).
  // Solo las variables con prefijo VITE_ llegarían al navegador: las de Wompi NO lo tienen.
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''));
  return { plugins: [react(), devApi()] };
});
