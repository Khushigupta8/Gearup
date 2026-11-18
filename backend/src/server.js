import { createServer } from 'node:http';

const PORT = Number(process.env.PORT) || 4000;

const routes = {
  'GET /api/health': () => ({ status: 200, body: { ok: true, service: 'gearup-backend' } }),
};

const server = createServer((req, res) => {
  const path = new URL(req.url, 'http://localhost').pathname;
  const handler = routes[`${req.method} ${path}`];
  const { status, body } = handler ? handler(req) : { status: 404, body: { error: 'Not found' } };
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
});

server.listen(PORT, () => console.log(`GearUp backend on http://localhost:${PORT}`));
