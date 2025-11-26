import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting score backfill...');

    const posts = await prisma.post.findMany({
        include: {
            votes: true,
        },
    });

    for (const post of posts) {
        const score = post.votes.reduce((acc, vote) => acc + vote.value, 0);

        await prisma.post.update({
            where: { id: post.id },
            data: { score },
        });

        console.log(`Updated post ${post.id}: score = ${score}`);
    }

    console.log('Backfill complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
