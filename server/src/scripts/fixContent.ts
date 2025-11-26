import prisma from '../config/prisma';
import redis from '../config/redis';

const fixContent = async () => {
    try {
        console.log('🔄 Starting Content Fix...');

        // 1. Publish all posts
        const updateResult = await prisma.post.updateMany({
            data: { published: true }
        });
        console.log(`✅ Published ${updateResult.count} posts.`);

        // 2. Clear Redis Cache
        const keys = await redis.keys('posts:*');
        if (keys.length > 0) {
            await redis.del(...keys);
            console.log(`🗑️  Cleared ${keys.length} cache keys:`, keys);
        } else {
            console.log('✨ Cache was already empty.');
        }

        console.log('🚀 Content fixed! Refresh your Explore page.');
    } catch (error) {
        console.error('❌ Error fixing content:', error);
    } finally {
        await prisma.$disconnect();
        // Allow redis to close connection if needed, or just exit
        process.exit(0);
    }
};

fixContent();
