import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding posts...');

    // Create a test user if not exists
    let user = await prisma.user.findUnique({ where: { email: 'test@test.com' } });
    if (!user) {
        user = await prisma.user.create({
            data: {
                email: 'test@test.com',
                username: 'test',
                password: 'password123', // In real app, hash this
            },
        });
    }

    // Create 20 posts
    for (let i = 1; i <= 20; i++) {
        await prisma.post.create({
            data: {
                title: `Test Post ${i}`,
                content: `This is the content for test post ${i}. It is long enough to look like a real note.`,
                slug: `test-post-${i}-${Date.now()}`,
                authorId: user.id,
                published: true,
                score: Math.floor(Math.random() * 100), // Random score for sorting test
                createdAt: new Date(Date.now() - i * 1000 * 60 * 60), // Staggered times
            },
        });
    }

    console.log('Seeding complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
