"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const PORT = process.env.PORT || 3001;
const server = app_1.default.listen(PORT, () => {
    console.log(`[Server] Airline API is running on port ${PORT}`);
    console.log(`[Server] Health check: http://localhost:${PORT}/health`);
});
process.on('unhandledRejection', (err) => {
    console.error(`[Unhandled Rejection] ${err.name}: ${err.message}`);
    server.close(() => {
        process.exit(1);
    });
});
