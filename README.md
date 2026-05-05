# Textvault

Textvault is a secure web application designed to instantly transfer text, links, and code snippets across devices without relying on slow, chat-history-dependent tools. It is ideal for quick data transfers between personal devices or secure public access on shared computers.

🌐 **Live Deployment**: [https://textvault.arkanafaisal.my.id](https://textvault.arkanafaisal.my.id)

## Key Features

* **Dual Access Modes**: Features a *Private Vault* requiring login for personal data, and a *Public Access* system where specific notes can be unlocked globally using a combination of the creator's username and a designated `publicKey`.
* **Maximum Security & Encryption**: Implements server-side AES-256-GCM encryption. Text content is encrypted into a buffer with a generated initialization vector (IV) and authentication tag before hitting the database, ensuring raw data remains unreadable even in the event of a database breach.
* **Ultra-Lightweight UI & Routing**: Built without heavy libraries. It utilizes the native HTML5 History API for custom routing and vanilla JS CustomEvents for the toast notification system, keeping the frontend bundle size minimal.
* **Resilient API Performance**: Uses a custom Redis-backed rate limiter that executes Lua scripts for atomic increments, entirely eliminating race conditions under high concurrency.

## Tech Stack

### Frontend
* **Framework**: React 19 (Vite) & React Compiler.
* **Styling**: Tailwind CSS v4 with a robust CSS variable-based theming system (light/dark mode).
* **State Management**: Strictly utilizes native React Hooks, abstracting complex business logic into custom hooks to enforce separation of concerns.

### Backend
* **Runtime/Framework**: Node.js v20 & Express.js 5.x.
* **Architecture**: Strict MVC-inspired layered directory structure (*controllers*, *middlewares*, *models*, *schemas*, etc.).
* **Validation**: Joi schemas for strict sanitization of incoming payloads before they reach the controllers.

### Database & Infrastructure
* **Relational Database**: MySQL with connection pooling and version-controlled SQL migrations managed via Flyway.
* **Caching**: Redis handles rate limiting, session tokens, and encrypted data payloads using a 'delayed double delete' invalidation pattern.
* **Deployment**: Fully containerized using Docker Compose (multi-stage builds), with Caddy acting as a reverse proxy for automatic HTTPS.

## System Architecture & Observability

The system is engineered for high reliability in containerized environments. The backend features a 'fail-fast' startup mechanism (crashing immediately if required environment variables are missing), an active `/health` endpoint that pings the DB and Redis, and a graceful teardown process to safely drain connections and quit clients upon receiving SIGTERM/SIGINT signals.

## Local Setup

The application relies entirely on a containerized Docker Compose environment. The built React frontend is served directly through the Node.js/Express backend to ensure a unified deployment pipeline.

```bash
# Build and run all services (Frontend, Backend, MySQL, Redis, Flyway)
docker compose up -d --build