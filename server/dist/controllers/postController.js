"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyPosts = exports.createPost = exports.votePost = exports.getPosts = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const redis_1 = __importDefault(require("../config/redis"));
const CACHE_TTL = 60 * 5; // 5 minutes
const getPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // @ts-ignore
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const cacheKey = 'posts:all';
        // Note: For a real high-scale app, we would cache the "content" and fetch votes separately/live.
        // For this demo, we will invalidate cache on vote, but we need to handle "myVote" per user.
        // So we will fetch posts from DB to get fresh votes/score.
        const posts = yield prisma_1.default.post.findMany({
            where: { published: true },
            include: {
                author: { select: { username: true } },
                votes: true,
                _count: { select: { comments: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        const postsWithScore = posts.map(post => {
            var _a;
            const score = post.votes.reduce((acc, vote) => acc + vote.value, 0);
            const userVote = userId ? (_a = post.votes.find(v => v.userId === userId)) === null || _a === void 0 ? void 0 : _a.value : undefined;
            const { votes, _count } = post, postData = __rest(post, ["votes", "_count"]); // Remove raw votes array from response
            return Object.assign(Object.assign({}, postData), { score, userVote, commentCount: _count.comments });
        });
        res.json(postsWithScore);
    }
    catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.getPosts = getPosts;
const votePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // @ts-ignore
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const { id } = req.params;
        const { value } = req.body; // 1 or -1
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        if (![1, -1].includes(value)) {
            return res.status(400).json({ error: 'Invalid vote value' });
        }
        yield prisma_1.default.vote.upsert({
            where: {
                userId_postId: {
                    userId,
                    postId: id
                }
            },
            update: { value },
            create: {
                userId,
                postId: id,
                value
            }
        });
        // Invalidate Cache
        yield redis_1.default.del('posts:all');
        res.json({ success: true });
    }
    catch (error) {
        console.error('Error voting:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.votePost = votePost;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // @ts-ignore
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const { title, content } = req.body;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '') + '-' + Date.now();
        const post = yield prisma_1.default.post.create({
            data: {
                title,
                content,
                slug,
                authorId: userId,
                published: true
            }
        });
        // Invalidate Cache
        yield redis_1.default.del('posts:all');
        res.status(201).json(post);
    }
    catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.createPost = createPost;
const getMyPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // @ts-ignore
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const posts = yield prisma_1.default.post.findMany({
            where: { authorId: userId },
            include: { votes: true },
            orderBy: { createdAt: 'desc' }
        });
        const postsWithScore = posts.map(post => {
            const score = post.votes.reduce((acc, vote) => acc + vote.value, 0);
            const { votes } = post, postData = __rest(post, ["votes"]);
            return Object.assign(Object.assign({}, postData), { score });
        });
        res.json(postsWithScore);
    }
    catch (error) {
        console.error('Error fetching my posts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.getMyPosts = getMyPosts;
