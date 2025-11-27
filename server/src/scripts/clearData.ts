import prisma from '../config/prisma';
import redis from '../config/redis';

const clearData = async () => {
    try {
        console.log('🗑️  Starting Data Cleanup...');

        // 1. Delete dependent data first (Votes, Comments)
        await prisma.vote.deleteMany({});
        console.log('✅ Votes deleted');

        await prisma.comment.deleteMany({});
        console.log('✅ Comments deleted');

        // 2. Delete Posts
        await prisma.post.deleteMany({});
        console.log('✅ Posts deleted');

        // 3. Clear Cache
        const keys = await redis.keys('posts:*');
        if (keys.length > 0) {
            await redis.del(...keys);
            console.log('✅ Cache cleared');
        }

        console.log('✨ Database is now clean (Users preserved).');
    } catch (error) {
        console.error('❌ Error clearing data:', error);
    } finally {
        await prisma.$disconnect();
        process.exit(0);
    }
};

clearData();
