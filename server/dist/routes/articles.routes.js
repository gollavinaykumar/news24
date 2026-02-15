"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const articles_controller_1 = require("../controllers/articles.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.get('/', articles_controller_1.getArticles);
router.get('/:slug', articles_controller_1.getArticle);
router.post('/', auth_middleware_1.authenticate, articles_controller_1.createArticle);
router.put('/:id', auth_middleware_1.authenticate, articles_controller_1.updateArticle);
router.delete('/:id', auth_middleware_1.authenticate, articles_controller_1.deleteArticle);
exports.default = router;
