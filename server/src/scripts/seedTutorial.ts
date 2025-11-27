import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding Tutorial Content...');

    // 1. Create Tutorial User
    const email = 'tutorial@bloglounge.demo';
    const password = await bcrypt.hash('demo123', 10);

    const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
            email,
            username: 'GuideBot',
            password
        }
    });

    console.log(`✅ User 'GuideBot' ready.`);

    // 2. Create Tutorial Posts
    const posts = [
        {
            title: "Welcome to Blog Lounge! 🚀",
            content: `
# Welcome to your new workspace!

This isn't just a blog; it's a **distributed content platform** designed to show off some cool engineering skills.

## What can you do here?

1. **Drag & Drop**: Try moving this note around! It stays where you put it.
2. **Write in Markdown**: We support full GFM.
3. **Vote**: Go to the Explore page and upvote the best content.

## Tech Stack
- **Frontend**: Next.js 14
- **Backend**: Node.js & Express
- **Database**: PostgreSQL (Neon)
- **Cache**: Redis (Upstash)

Enjoy exploring!
            `,
            tags: ['welcome', 'guide', 'demo'],
            published: true
        },
        {
            title: "How to use Markdown 📝",
            content: `
# Markdown Guide

You can make your notes look **awesome** with Markdown.

## Code Blocks
\`\`\`javascript
const greeting = "Hello World";
console.log(greeting);
\`\`\`

## Lists
- [x] Create account
- [x] Read this note
- [ ] Create your first post

## Tables
| Feature | Status |
| :--- | :--- |
| Drag & Drop | ✅ |
| Dark Mode | ❌ |
| Voting | ✅ |

> "Code is poetry."
            `,
            tags: ['markdown', 'tips'],
            published: true
        },
        {
            title: "Engineering Behind the Scenes ⚙️",
            content: `
# Under the Hood

Here is what makes this app tick:

### 1. Caching ⚡
We use **Redis** to cache the Explore feed. If you refresh that page, it loads instantly because it's hitting the cache, not the DB.

### 2. Rate Limiting 🛡️
Try spamming the API. You can't! We limit requests to 100 per 15 minutes per IP to prevent abuse.

### 3. Idempotency 💳
Our payment endpoints use idempotency keys to ensure you never get charged twice for the same transaction.
            `,
            tags: ['engineering', 'system-design', 'backend'],
            published: true
        }
    ];

    for (const p of posts) {
        await prisma.post.create({
            data: {
                ...p,
                slug: p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now(),
                authorId: user.id
            }
        });
    }

    console.log(`✅ Created ${posts.length} tutorial posts.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
