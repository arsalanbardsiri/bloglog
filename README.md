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

### 3. Query Optimization (N+1 Problem)
Solved a critical performance bottleneck in the "Explore" feed.
- **Problem**: Fetching 1000s of votes for every post just to check if the current user liked it.
- **Solution**: Optimized the Prisma query to filter included votes by `userId`.
- **Result**: Reduced payload size by 99% and query time from ~800ms to ~50ms.

## 🚀 Features

-   **Authentication**: Secure JWT-based auth with **Forgot Password** flow.
-   **Modern UI**: "Paper & Ink" aesthetic with sticky notes, index cards, and smooth animations.
-   **Rich Text**: Markdown support with code syntax highlighting.
-   **Interaction**: Upvote/Downvote system (Reddit-style) and threaded comments.
-   **Performance**: Redis caching and optimized database queries.
-   **Email**: Transactional emails (Welcome, Password Reset) powered by **Resend**.
-   **Support**: Integrated **Stripe** for one-time "Developer Support" contributions ($1).
-   **Responsive**: Fully optimized for mobile and desktop.

## 🛠️ Tech Stack

-   **Frontend**: Next.js 15 (App Router), TailwindCSS, Framer Motion, Lucide Icons.
-   **Backend**: Node.js, Express, TypeScript.
-   **Database**: PostgreSQL (Neon.tech), Prisma ORM.
-   **Caching**: Redis (Upstash).
-   **Email**: Resend API.
-   **Deployment**: Vercel (Frontend), Render (Backend).

## 📦 Installation

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
    Create `.env` files in both `client` and `server` directories.

    **Server (`server/.env`)**
    ```env
    PORT=5000
    DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
    JWT_SECRET="your_super_secret_key"
    CLIENT_URL="http://localhost:3000"
    
    # Redis (Upstash)
    REDIS_URL="redis://default:pass@host:port"

    # Email (Resend)
    RESEND_API_KEY="re_123456789"
    EMAIL_FROM="Blog Lounge <hello@yourdomain.com>"
    ```

    **Client (`client/.env.local`)**
    ```env
    NEXT_PUBLIC_API_URL="http://localhost:5000"
    ```

4.  **Run Locally**
    ```bash
    # Terminal 1 (Server)
    cd server
    npx prisma generate
    npx prisma db push
    npm run dev

    # Terminal 2 (Client)
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
