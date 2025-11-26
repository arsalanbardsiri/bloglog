import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting Dev Content Seeding...');

    // 1. Clean the database
    await prisma.comment.deleteMany();
    await prisma.vote.deleteMany();
    await prisma.post.deleteMany();
    await prisma.user.deleteMany();
    console.log('🧹 Database cleaned.');

    // 2. Create Users
    const password = await bcrypt.hash('password123', 10);

    // Helper to create slug
    const slugify = (text: string) => text.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');

    const admin = await prisma.user.create({
        data: {
            username: 'Admin',
            email: 'admin@bloglounge.dev',
            password,
        },
    });

    const devUser = await prisma.user.create({
        data: {
            username: 'CodeWizard',
            email: 'wizard@bloglounge.dev',
            password,
        },
    });

    console.log('👤 Users created.');

    // 3. Create Posts (Sticky Notes)

    // Post 1: Welcome / Tutorial Note
    await prisma.post.create({
        data: {
            title: 'Welcome to Blog Lounge! 🚀',
            slug: slugify('Welcome to Blog Lounge! 🚀'),
            content: `
Welcome to your new developer space! This isn't just a blog; it's a **community chalkboard**.

### What can you do?
- **Write in Markdown**: We support **bold**, *italic*, lists, and more.
- **Share Code**: Syntax highlighting is built-in!
- **Tag Your Posts**: Use tags to organize your ideas.

Try creating your own note by clicking the **Pen** icon on the left!
      `.trim(),
            authorId: admin.id,
            tags: ['welcome', 'tutorial', 'start-here'],
            published: true,
            createdAt: new Date(), // Now
        },
    });

    // Post 2: Code Example (Python)
    await prisma.post.create({
        data: {
            title: 'Python Snippet 🐍',
            slug: slugify('Python Snippet 🐍'),
            content: `
Here is a quick example of how to use code blocks in your notes.

\`\`\`python
def hello_world():
    print("Hello, Blog Lounge!")
    return True

if __name__ == "__main__":
    hello_world()
\`\`\`

Clean and readable, right?
      `.trim(),
            authorId: devUser.id,
            tags: ['python', 'code', 'snippet'],
            published: true,
            createdAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
        },
    });

    // Post 3: React Component (TSX)
    await prisma.post.create({
        data: {
            title: 'React Component Demo ⚛️',
            slug: slugify('React Component Demo ⚛️'),
            content: `
Checking out the syntax highlighting for **React/TypeScript**.

\`\`\`tsx
interface Props {
  name: string;
}

export const Greeting = ({ name }: Props) => {
  return (
    <div className="p-4 bg-stone-100">
      <h1>Hello, {name}!</h1>
    </div>
  );
};
\`\`\`
      `.trim(),
            authorId: admin.id,
            tags: ['react', 'typescript', 'frontend'],
            published: true,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
        },
    });

    // Post 4: Bug Report (Pink)
    await prisma.post.create({
        data: {
            title: 'Bug: Sticky Note Dragging',
            slug: slugify('Bug: Sticky Note Dragging'),
            content: `
> [!IMPORTANT]
> Found a small issue when dragging notes on mobile.

**Steps to reproduce:**
1. Open on iPhone
2. Try to drag the "Welcome" note
3. Note gets stuck halfway

*Looking into a fix now.*
      `.trim(),
            authorId: devUser.id,
            tags: ['bug', 'mobile', 'fix'],
            published: true,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        },
    });

    console.log('📝 Posts created.');
    console.log('✅ Seeding complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
