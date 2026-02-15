"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const articles_routes_1 = __importDefault(require("./routes/articles.routes"));
const categories_routes_1 = __importDefault(require("./routes/categories.routes"));
const upload_routes_1 = __importDefault(require("./routes/upload.routes"));
const tags_routes_1 = __importDefault(require("./routes/tags.routes"));
const dashboard_routes_1 = __importDefault(require("./routes/dashboard.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5001;
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express_1.default.json());
app.use('/api/auth', auth_routes_1.default);
app.use('/api/articles', articles_routes_1.default);
app.use('/api/categories', categories_routes_1.default);
app.use('/api/upload', upload_routes_1.default);
app.use('/api/tags', tags_routes_1.default);
app.use('/api/dashboard', dashboard_routes_1.default);
app.get('/', (req, res) => {
    res.send('Telugu News API is running');
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
