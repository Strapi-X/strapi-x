"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOnlyMeConfig = void 0;
const lodash_1 = __importDefault(require("lodash"));
function getOnlyMeConfig(roles, ctxPath, filtersPath) {
    return {
        roles,
        ctxPath,
        filtersPath,
    };
}
exports.getOnlyMeConfig = getOnlyMeConfig;
exports.default = (config, { strapi }) => {
    return async (ctx, next) => {
        var _a;
        const { user } = ctx.state;
        if (!(config.roles || []).includes((_a = user.role) === null || _a === void 0 ? void 0 : _a.type) || ctx.request.query.onlyMe) {
            const filters = ctx.request.query.filters;
            const value = lodash_1.default.get(ctx, config.ctxPath);
            if (filters) {
                lodash_1.default.set(ctx.request.query.filters, config.filtersPath, value);
            }
            else {
                ctx.request.query.filters = lodash_1.default.set({}, config.filtersPath, value);
            }
        }
        await next();
    };
};
