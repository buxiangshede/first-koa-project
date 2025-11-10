# first-koa-project

Learn the core building blocks of [Koa](https://koajs.com/) with a tiny yet feature-rich API. The app focuses on middleware composition, routing patterns, JSON handling, and static files so you can experiment quickly.

## Stack
- Node.js 18+
- Koa 2
- @koa/router for routing
- koa-bodyparser for JSON payloads
- koa-static for static assets

## Getting started
```bash
npm install
npm run dev
# or npm start for a production-style run
```
The server listens on http://localhost:3000 by default. Override the port with the `PORT` env variable.

## Available routes
Route | Description
--- | ---
`GET /` | Overview response containing popular routes
`GET /health` | Fast health check for probes
`GET /features` | Lists Koa concepts highlighted in this project
`GET /echo?foo=bar` | Returns your query and request headers
`GET /slow` | Simulates async work so you can observe middleware timing
`GET /users` | Returns demo users from an in-memory store
`GET /users/:id` | Looks up a user with path params
`POST /users` | Creates a new user (JSON body with `name` and optional `role`)
`PUT /users/:id/preferences` | Demonstrates updating nested data

Static docs are exposed from `/public`, so opening `/guide.html` in the browser gives you a quick cheat sheet.

## Middleware pipeline
1. **Request ID** – generates a UUID for every request and adds it to the response header
2. **Error + logging** – wraps downstream handlers, returning JSON errors and timing information
3. **Body parsing** – automatically parses JSON payloads
4. **Static serving** – exposes the `public/` folder for quick docs or assets

Feel free to extend the router, hook up a database, or convert it to TypeScript once you are comfortable with the fundamentals.
