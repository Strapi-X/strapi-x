"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
exports.default = ({ strapi }) => {
    const dir = path_1.default.resolve(strapi.dirs.app.src, 'extensions/strapi-x/middlewares');
    if (!fs_1.default.existsSync(dir)) {
        console.log(dir, 'not exists!');
        fs_1.default.mkdirSync(dir, { recursive: true });
    }
    if (!fs_1.default.existsSync(path_1.default.resolve(dir, 'configuration.js'))) {
        const filePath = path_1.default.resolve(strapi.dirs.app.src, 'extensions/strapi-x/middlewares/configuration.js');
        console.log(filePath, 'not exists!');
        fs_1.default.writeFileSync(filePath, 'module.exports = { routes: [], middlewares: [] };', { flag: 'wx' });
    }
};
