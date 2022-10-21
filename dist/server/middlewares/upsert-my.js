"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUpdateMyConfig = exports.getInsertMyConfig = void 0;
const lodash_1 = __importDefault(require("lodash"));
function getInsertMyConfig(roles, updateFieldsPaths) {
    return {
        type: 'insert',
        roles,
        updateFieldsPaths
    };
}
exports.getInsertMyConfig = getInsertMyConfig;
function getUpdateMyConfig(roles, entity, ctxPath, entityPath, updateFieldsPaths) {
    return {
        type: 'update',
        roles,
        entity,
        ctxPath,
        entityPath,
        updateFieldsPaths
    };
}
exports.getUpdateMyConfig = getUpdateMyConfig;
exports.default = (config, { strapi }) => {
    return async (ctx, next) => {
        var _a;
        const { user } = ctx.state;
        if (!(config.roles || []).includes((_a = user.role) === null || _a === void 0 ? void 0 : _a.type)) {
            if (ctx.request.body.data.id && config.type === 'update') {
                const value = lodash_1.default.get(ctx, config.ctxPath);
                const entity = await strapi.entityService.findOne(config.entity, ctx.request.body.data.id, { populate: '*' });
                const v = lodash_1.default.get(entity, config.entityPath);
                let v1 = typeof v === 'object' ? v.id : v;
                if (v1 != value) {
                    return ctx.badRequest("You cannot operate on this entity", {
                        entity,
                    });
                }
            }
            for (let d of config.updateFieldsPaths) {
                const v1 = lodash_1.default.get(ctx, d.ctxPath);
                lodash_1.default.set(ctx.request.body, d.fieldPath, v1);
            }
        }
        await next();
    };
};
