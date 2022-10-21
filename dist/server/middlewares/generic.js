"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGenericConfig = void 0;
function getGenericConfig(pre, post) {
    return {
        pre,
        post
    };
}
exports.getGenericConfig = getGenericConfig;
exports.default = (config, { strapi }) => {
    return async (ctx, next) => {
        await config.pre(config, strapi, ctx, next);
        await next();
        await config.post(config, strapi, ctx, next);
    };
};
