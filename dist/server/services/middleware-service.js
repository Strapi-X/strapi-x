"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const middlewares_1 = require("../middlewares");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
exports.default = ({ strapi }) => ({
    findAll() {
        const middlewares = [];
        for (let key in middlewares_1.Middlewares) {
            if (isNaN(Number(key))) {
                middlewares.push({
                    key,
                    uid: middlewares_1.Middlewares[key]
                });
            }
        }
        return middlewares;
    },
    findAllSavedMiddlewares(route) {
        const extension = require(path_1.default.resolve(strapi.dirs.app.src, 'extensions/strapi-x/middlewares/configuration.js'));
        return extension.middlewares.filter(m => route ? (extension.routes[route] || []).includes(m.uid) : true);
    },
    regenConfigurationFile(config) {
        const stringifyFunction = function (key, val) {
            return (typeof val === 'function') ? '' + val : val;
        };
        const jsFile = 'module.exports = ' + JSON.stringify(config, stringifyFunction, '\t');
        const filePath = path_1.default.resolve(strapi.dirs.app.src, 'extensions/strapi-x/middlewares/configuration.js');
        fs_1.default.writeFileSync(filePath, jsFile, { encoding: 'utf8', flag: 'w' });
        return jsFile;
    }
});
