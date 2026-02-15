"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tags_controller_1 = require("../controllers/tags.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.get('/', tags_controller_1.getTags);
router.post('/', auth_middleware_1.authenticate, tags_controller_1.createTag);
router.delete('/:id', auth_middleware_1.authenticate, tags_controller_1.deleteTag);
exports.default = router;
