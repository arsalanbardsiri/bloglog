# Blog Lounge 🚀

> **A High-Scale Distributed Content Platform** designed to demonstrate Senior Engineering principles: Caching, Rate Limiting, Idempotency, and Microservices Architecture, wrapped in a unique "Origami Notebook" aesthetic.

![System Design](https://img.shields.io/badge/System%20Design-Distributed-blue)
![Tech Stack](https://img.shields.io/badge/Tech-Next.js%20%7C%20Node.js%20%7C%20Redis%20%7C%20Postgres-black)
![Status](https://img.shields.io/badge/Status-Production%20Ready-green)

## 🌟 Key Features

### 1. Interactive Desk (Dashboard)
- **Drag & Drop**: Organize your thoughts by dragging sticky notes around your desk.
- **Persistence**: Your layout is saved automatically, so everything is exactly where you left it.
- **Smart Interaction**: Dragging moves the note; clicking opens it. No more accidental opens!
- **Management**: Delete notes you no longer need with a single click (Trash Icon).

### 2. Developer-First Features 👩‍💻
- **Markdown Support**: Write with full GFM support (tables, task lists, bold/italic).
- **Code Highlighting**: Syntax highlighting for Python, JS, TS, and more directly on your sticky notes.
- **Tagging System**: Organize your snippets with tags (e.g., `#react`, `#bug`).
- **Chalkboard UI**: A beautiful, immersive "Chalkboard on Paper" aesthetic.

### 3. Community Feed (Explore)
- **Public Board**: View thoughts from the entire community.
- **Voting**: Upvote or downvote posts to surface the best content.
- **Search**: Instantly filter posts by title, content, or author.
- **Performance**: Powered by Redis caching for blazing fast load times.

### 4. Engineering Excellence
- **Microservices Ready**: Architecture designed for scale.
- **CI/CD**: Automated build pipeline with GitHub Actions.
- **Testing**: End-to-End testing infrastructure with Playwright.
- **Code Quality**: Fully linted and type-checked codebase.

## 🏗️ System Architecture

This project is not just a blog; it's a simulation of a production-grade distributed system.

```mermaid
graph TD
    User[User Browser] -->|HTTPS| Client["Next.js Frontend (Vercel)"]
    Client -->|REST API| Server["Express Backend (Render)"]
    
    subgraph "Data Layer"
        Server -->|Read/Write| DB[(PostgreSQL - Neon)]
        Server -->|Cache-Aside| Redis["Redis Cache (Upstash)"]
    end
    
    subgraph "External Services"
        Server -->|Payments| Stripe[Stripe API]
    end
```

## 🧠 Engineering Decisions

### 1. Distributed Caching (Redis)
Implemented the **Cache-Aside Pattern** to minimize database load and reduce latency.
- **Read**: Checks Redis first (`GET posts:all`). If miss, queries DB and sets cache (TTL: 60s).
- **Write**: Invalidates cache on new post creation (`DEL posts:all`) to ensure consistency.

### 2. Rate Limiting (DDoS Protection)
Custom middleware using Redis to track request counts per IP.
- **Algorithm**: Fixed Window Counter.
- **Limit**: 100 requests / 15 minutes.
- **Why**: Protects the API from abuse and ensures fair usage in a distributed environment.

### 3. Idempotency (Safe Payments)
Middleware to prevent "Double Charge" issues in payment processing.
- **Mechanism**: Clients send a unique `Idempotency-Key` header.
- **Logic**: Server caches the response of successful requests in Redis. If the same key is received, the cached response is returned immediately without re-processing the payment.

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), Tailwind CSS, Framer Motion.
- **Backend**: Node.js, Express, TypeScript.
- **Database**: PostgreSQL (Neon.tech) via Prisma ORM.
- **Cache**: Redis (Upstash).
- **Infrastructure**: Vercel (Frontend), Render (Backend).
- **Testing**: Playwright (E2E).

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- Docker (optional, for local DB/Redis)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/arsalanbardsiri/bloglog.git
    cd bloglog
    ```

2.  **Install Dependencies**
    ```bash
    # Client
    cd client
    npm install

    # Server
    cd ../server
    npm install
    ```

3.  **Environment Setup**
    - Copy `.env.example` to `.env` in both `client` and `server` directories.
    - Fill in your PostgreSQL and Redis credentials.
    - **Note**: For production, use `NEXT_PUBLIC_API_URL` in client to point to your live backend.

4.  **Run Locally**
    ```bash
    # Start Backend
    cd server
    npm run dev

    # Start Frontend
    cd client
    npm run dev
    ```

## 🧪 Testing

Run the end-to-end test suite:

```bash
cd client
npx playwright test
```

---
*Built as a Portfolio Project for Senior Software Engineering roles.*
