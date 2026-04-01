# Test task for OpKit

## 📌 Overview

* **Backend:** NestJS + Prisma
* **Frontend:** React + Vite
* **Database:** PostgreSQL
* **Realtime:** WebSocket (Socket.IO)
* **Infrastructure:** Docker + Docker Compose + Nginx

## 📁 Project Structure

```
.
├── backend
├── frontend
├── nginx
└── docker-compose.yml
```

---

## ⚙️ Environment Variables

Create the following file:

```
backend/.env
```

Example configuration:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=12345
POSTGRES_DB=opkit

DATABASE_URL=postgresql://postgres:12345@postgres:5432/opkit?schema=public

JWT_SECRET=supersecret
NODE_ENV=development
```

---

## 🚀 Getting Started

### 1. Build and run containers

```bash
docker compose up --build
```

---

### 2. Application URLs

| Service  | URL                       |
| -------- | ------------------------- |
| Frontend | http://localhost:3000     |
| Backend  | http://localhost:9000     |

---

