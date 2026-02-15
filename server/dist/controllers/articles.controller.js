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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteArticle = exports.updateArticle = exports.getArticle = exports.getArticles = exports.createArticle = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const client_1 = require("@prisma/client");
const createArticle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { title, content, image, categoryId, status, seoTitle, seoDescription, tags, isBreaking } = req.body;
        let { slug } = req.body;
        // Generate or sanitize slug
        if (slug && slug.trim()) {
            slug = slug.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        }
        else {
            slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        }
        let uniqueSlug = slug;
        let counter = 1;
        while (yield prisma_1.default.article.findUnique({ where: { slug: uniqueSlug } })) {
            uniqueSlug = `${slug}-${counter}`;
            counter++;
        }
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized: User ID missing' });
        }
        const article = yield prisma_1.default.article.create({
            data: {
                title,
                slug: uniqueSlug,
                content,
                image,
                categoryId,
                authorId: userId,
                status: status || client_1.ArticleStatus.DRAFT,
                seoTitle,
                seoDescription,
                isBreaking: isBreaking || false,
                publishedAt: status === client_1.ArticleStatus.PUBLISHED ? new Date() : null,
                tags: tags ? { connect: tags.map((id) => ({ id })) } : undefined,
            },
        });
        res.json(article);
    }
    catch (error) {
        console.error('Create article error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
exports.createArticle = createArticle;
const getArticles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { category, tag, search, isBreaking, trending, page = 1, limit = 10 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const where = {};
        if (category) {
            where.category = { slug: String(category) };
        }
        if (tag) {
            where.tags = { some: { slug: String(tag) } };
        }
        if (search) {
            where.OR = [
                { title: { contains: String(search), mode: 'insensitive' } },
                { content: { contains: String(search), mode: 'insensitive' } },
            ];
        }
        if (isBreaking === 'true') {
            where.isBreaking = true;
        }
        const orderBy = {};
        orderBy.createdAt = 'desc';
        // Prioritize published date for normal listing
        // Fallback sort if publishedAt is null (though should be filtered usually?)
        // Actually default createdAt if no query? strict logic:
        // If getting ALL for admin, we want createdAt.
        // If public, we usually filter by status=PUBLISHED. 
        // Let's add status filter if not admin (but we don't know if admin here easily without checking auth again or route separation).
        // For now, simple logic.
        const [articles, total] = yield Promise.all([
            prisma_1.default.article.findMany({
                where,
                include: {
                    category: true,
                    author: { select: { name: true, image: true } },
                    tags: true
                },
                orderBy: Object.keys(orderBy).length ? orderBy : { createdAt: 'desc' },
                skip,
                take: Number(limit),
            }),
            prisma_1.default.article.count({ where }),
        ]);
        res.json({ articles, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
    }
    catch (error) {
        console.error('Get articles error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
exports.getArticles = getArticles;
const getArticle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const slug = req.params.slug;
        const isUuid = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/.test(slug);
        const where = isUuid ? { id: slug } : { slug };
        const article = yield prisma_1.default.article.findUnique({
            where,
            include: {
                category: true,
                author: { select: { name: true, bio: true, image: true } },
                tags: true
            },
        });
        if (!article) {
            return res.status(404).json({ error: 'Article not found' });
        }
        // Views feature removed
        // if (!isUuid) {
        //   await prisma.article.update({
        //     where: { id: article.id },
        //     data: { views: { increment: 1 } },
        //   });
        // }
        res.json(article);
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
exports.getArticle = getArticle;
const updateArticle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const { title, content, image, categoryId, status, seoTitle, seoDescription, tags, isBreaking } = req.body;
        const article = yield prisma_1.default.article.update({
            where: { id },
            data: {
                title,
                content,
                image,
                categoryId,
                status,
                seoTitle,
                seoDescription,
                isBreaking: isBreaking,
                updatedAt: new Date(),
                tags: tags ? { set: tags.map((id) => ({ id })) } : undefined,
            },
        });
        res.json(article);
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
exports.updateArticle = updateArticle;
const deleteArticle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        yield prisma_1.default.article.delete({ where: { id } });
        res.json({ message: 'Article deleted' });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
exports.deleteArticle = deleteArticle;
