"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Middleware = exports.MiddlewaresConfigs = exports.Middlewares = void 0;
const generic_1 = __importStar(require("./generic"));
const my_permission_1 = __importStar(require("./my-permission"));
const only_me_1 = __importStar(require("./only-me"));
const upsert_my_1 = __importStar(require("./upsert-my"));
var Middlewares;
(function (Middlewares) {
    Middlewares["InsertMy"] = "plugin::strapi-x.upsert-my";
    Middlewares["UpdateMy"] = "plugin::strapi-x.upsert-my";
    Middlewares["OnlyMe"] = "plugin::strapi-x.only-me";
    Middlewares["MyPermission"] = "plugin::strapi-x.my-permission";
    Middlewares["Generic"] = "plugin::strapi-x.generic";
})(Middlewares = exports.Middlewares || (exports.Middlewares = {}));
class MiddlewaresConfigs {
}
exports.MiddlewaresConfigs = MiddlewaresConfigs;
MiddlewaresConfigs.getOnlyMeConfig = only_me_1.getOnlyMeConfig;
MiddlewaresConfigs.getInsertMyConfig = upsert_my_1.getInsertMyConfig;
MiddlewaresConfigs.getUpdateMyConfig = upsert_my_1.getUpdateMyConfig;
MiddlewaresConfigs.getMyPermissionConfig = my_permission_1.getMyPermissionConfig;
MiddlewaresConfigs.getGenericConfig = generic_1.getGenericConfig;
class Middleware {
    static get(config) {
        switch (config.middleware) {
            case Middlewares.InsertMy:
                return {
                    name: config.middleware,
                    config: MiddlewaresConfigs.getInsertMyConfig(config.roles, config.updateFieldsPaths)
                };
            case Middlewares.UpdateMy:
                const c = config;
                return {
                    name: config.middleware,
                    config: MiddlewaresConfigs.getUpdateMyConfig(c.roles, c.entity, c.ctxPath, c.entityPath, c.updateFieldsPaths)
                };
            case Middlewares.MyPermission:
                return {
                    name: config.middleware,
                    config: MiddlewaresConfigs.getMyPermissionConfig(config.roles, config.param, config.ctxPath, config.entity, config.entityPath)
                };
            case Middlewares.OnlyMe:
                return {
                    name: config.middleware,
                    config: MiddlewaresConfigs.getOnlyMeConfig(config.roles, config.ctxPath, config.filtersPath)
                };
            case Middlewares.Generic:
                return {
                    name: config.middleware,
                    config: MiddlewaresConfigs.getGenericConfig(config.pre, config.post)
                };
        }
        return undefined;
    }
}
exports.Middleware = Middleware;
exports.default = {
    generic: generic_1.default,
    upsertMy: upsert_my_1.default,
    onlyMe: only_me_1.default,
    myPermission: my_permission_1.default
};
