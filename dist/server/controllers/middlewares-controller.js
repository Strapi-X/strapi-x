"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
exports.default = ({ strapi }) => ({
    findAll(ctx) {
        console.log("Get all middlewares");
        ctx.body = strapi
            .plugin('strapi-x')
            .service('middlewaresService')
            .findAll();
    },
    getRoutes(ctx) {
        console.log("Get routes");
        const routes = {};
        for (let key in strapi.api) {
            routes[key] = {
                routes: strapi.api[key].routes[key].routes,
                type: strapi.api[key].routes[key].type,
                contentType: strapi.api[key].contentTypes[key]
            };
        }
        ctx.body = routes || {};
    },
    getSchemas(ctx) {
        console.log("Get schemas");
        ctx.body = strapi.contentTypes || {};
    },
    saveMiddlewaresConfigurations(ctx) {
        const body = ctx.request.body;
        const extension = require(path_1.default.resolve(strapi.dirs.app.src, 'extensions/strapi-x/middlewares/configuration.js'));
        for (let c of body) {
            if (!extension.routes[c.route]) {
                extension.routes[c.route] = [];
            }
            extension.routes[c.route].push(c.middleware.uid);
            extension.routes[c.route] = Array.from(new Set(extension.routes[c.route]));
            const m = extension.middlewares.find(m1 => m1.uid == c.middleware.uid);
            if (m) {
                for (let k in m) {
                    delete m[k];
                }
                Object.assign(m, c.middleware);
            }
            else {
                extension.middlewares.push(c.middleware);
            }
        }
        strapi
            .plugin('strapi-x')
            .service('middlewaresService')
            .regenConfigurationFile(extension);
        ctx.body = 'è cosa buona e giusta';
    },
    deleteMiddlewaresConfigurations(ctx) {
        const body = ctx.request.body;
        const extension = require(path_1.default.resolve(strapi.dirs.app.src, 'extensions/strapi-x/middlewares/configuration.js'));
        const ids = body.map(b => b.uid);
        extension.middlewares = extension.middlewares.filter(m => !ids.includes(m.uid));
        for (let k in extension.routes) {
            extension.routes[k] = extension.routes[k].filter(r => !ids.includes(r));
        }
        strapi
            .plugin('strapi-x')
            .service('middlewaresService')
            .regenConfigurationFile(extension);
        ctx.body = 'è cosa buona e giusta';
    },
    getRouteMiddlewares(ctx) {
        console.log("Get all route middlewares");
        const route = ctx.request.query.route;
        ctx.body = strapi
            .plugin('strapi-x')
            .service('middlewaresService')
            .findAllSavedMiddlewares(route) || [];
    }
});
