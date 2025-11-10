import request from 'supertest';
import app from '../src/app.js';

describe('first-koa-project routes', () => {
  const server = app.callback();

  it('returns overview payload for GET /', async () => {
    const res = await request(server).get('/');
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/first-koa-project/);
    expect(res.body.routes).toContain('/health');
  });

  it('exposes health endpoint', async () => {
    const res = await request(server).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('creates a user when POST /users has a name', async () => {
    const res = await request(server)
      .post('/users')
      .send({ name: 'Test User', role: 'tester' })
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ name: 'Test User', role: 'tester' });
  });

  it('rejects invalid user payloads', async () => {
    const res = await request(server).post('/users').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/Missing required field/);
  });
});
