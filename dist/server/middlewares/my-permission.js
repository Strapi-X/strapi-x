"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyPermissionConfig = void 0;
const lodash_1 = __importDefault(require("lodash"));
function getMyPermissionConfig(roles, param, ctxPath, entity, entityPath) {
    return {
        roles,
        param,
        ctxPath,
        entity,
        entityPath
    };
}
exports.getMyPermissionConfig = getMyPermissionConfig;
exports.default = (config, { strapi }) => {
    return async (ctx, next) => {
        var _a;
        const { user } = ctx.state;
        if (!(config.roles || []).includes((_a = user.role) === null || _a === void 0 ? void 0 : _a.type)) {
            const value = lodash_1.default.get(ctx, config.param);
            const entity = await strapi.entityService.findOne(config.entity, value, { populate: '*' });
            if (lodash_1.default.get(entity, config.entityPath) != lodash_1.default.get(ctx, config.ctxPath)) {
                return ctx.badRequest("You cannot operate on this entity", {
                    entity,
                });
            }
        }
        await next();
    };
};
