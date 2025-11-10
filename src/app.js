import Koa from 'koa';
import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import serve from 'koa-static';
import { randomUUID } from 'node:crypto';
import { performance } from 'node:perf_hooks';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PUBLIC_DIR = join(__dirname, '..', 'public');

const app = new Koa();
const router = new Router();

const features = [
  'Custom middleware pipeline (request ID, logging, error handling)',
  'Routing with params, queries, and JSON bodies',
  'Health + diagnostics endpoints',
  'Static file hosting with koa-static',
  'In-memory data store to emulate CRUD'
];

const users = new Map([
  ['1', { id: '1', name: 'Ada Lovelace', role: 'admin' }],
  ['2', { id: '2', name: 'Linus Torvalds', role: 'maintainer' }],
  ['3', { id: '3', name: 'Grace Hopper', role: 'educator' }]
]);

app.use(async (ctx, next) => {
  ctx.state.requestId = randomUUID();
  ctx.set('x-request-id', ctx.state.requestId);
  await next();
});

app.use(async (ctx, next) => {
  const start = performance.now();
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = { error: err.message || 'Unexpected error', requestId: ctx.state.requestId };
  } finally {
    const duration = (performance.now() - start).toFixed(1);
    console.info(`${ctx.method} ${ctx.url} -> ${ctx.status} (${duration}ms) [${ctx.state.requestId}]`);
  }
});

app.use(bodyParser());
app.use(serve(PUBLIC_DIR));

router.get('/', (ctx) => {
  ctx.body = {
    message: 'Welcome to first-koa-project',
    documentation: '/guide.html',
    routes: ['/health', '/features', '/users', '/users/:id', '/echo?name=Koa', '/slow']
  };
});

router.get('/health', (ctx) => {
  ctx.body = { status: 'ok', time: new Date().toISOString() };
});

router.get('/features', (ctx) => {
  ctx.body = features;
});

router.get('/echo', (ctx) => {
  ctx.body = {
    query: ctx.query,
    headers: ctx.headers,
    requestId: ctx.state.requestId
  };
});

router.get('/slow', async (ctx) => {
  await new Promise((resolve) => setTimeout(resolve, 750));
  ctx.body = { status: 'done', message: 'Simulated async work' };
});

router.get('/users', (ctx) => {
  ctx.body = Array.from(users.values());
});

router.get('/users/:id', (ctx) => {
  const user = users.get(ctx.params.id);
  if (!user) {
    ctx.throw(404, 'User not found');
  }
  ctx.body = user;
});

router.post('/users', (ctx) => {
  const { name, role = 'member' } = ctx.request.body || {};
  if (!name) {
    ctx.throw(400, 'Missing required field: name');
  }
  const id = String(Date.now());
  const user = { id, name, role };
  users.set(id, user);
  ctx.status = 201;
  ctx.body = user;
});

router.put('/users/:id/preferences', (ctx) => {
  const user = users.get(ctx.params.id);
  if (!user) {
    ctx.throw(404, 'User not found');
  }
  const prefs = ctx.request.body || {};
  ctx.body = { ...user, preferences: prefs };
});

app.use(router.routes());
app.use(router.allowedMethods());

export default app;
