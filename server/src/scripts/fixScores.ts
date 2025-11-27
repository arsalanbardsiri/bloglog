import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🔄 Starting score recalculation...');

    const posts = await prisma.post.findMany({
        include: {
            votes: true
        }
    });

    console.log(`Found ${posts.length} posts.`);

    for (const post of posts) {
        // Calculate actual score from votes
        const actualScore = post.votes.reduce((acc, vote) => acc + vote.value, 0);

        if (post.score !== actualScore) {
            console.log(`⚠️  Fixing Post "${post.title}" (ID: ${post.id})`);
            console.log(`    Current Score: ${post.score} -> New Score: ${actualScore}`);

            await prisma.post.update({
                where: { id: post.id },
                data: { score: actualScore }
            });
        }
    }

    console.log('✅ Score recalculation complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
