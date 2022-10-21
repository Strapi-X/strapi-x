import generic, { GenericConfig, getGenericConfig } from './generic';
import myPermission, { getMyPermissionConfig, MyPermissionConfig } from './my-permission';
import onlyMe, { getOnlyMeConfig, OnlyMeConfig } from './only-me';
import upsertMy, { getInsertMyConfig, getUpdateMyConfig, InsertMyConfig, UpdateMyConfig, UpsertMyConfig } from './upsert-my';

export enum Middlewares {
    InsertMy = 'plugin::strapi-x.upsert-my',
    UpdateMy = 'plugin::strapi-x.upsert-my',
    OnlyMe = 'plugin::strapi-x.only-me',
    MyPermission = 'plugin::strapi-x.my-permission',
    Generic = 'plugin::strapi-x.generic'
}

export type MiddlewareConfig = MyPermissionConfig & { middleware: Middlewares.MyPermission; } |
    OnlyMeConfig & { middleware: Middlewares.OnlyMe; } |
    InsertMyConfig & { middleware: Middlewares.InsertMy; } |
    UpdateMyConfig & { middleware: Middlewares.UpdateMy; } |
    GenericConfig & { middleware: Middlewares.Generic; };

export { MyPermissionConfig } from './my-permission';
export { OnlyMeConfig } from './only-me';
export { UpsertMyConfig } from './upsert-my';


export class MiddlewaresConfigs {
    static getOnlyMeConfig = getOnlyMeConfig;
    static getInsertMyConfig = getInsertMyConfig;
    static getUpdateMyConfig = getUpdateMyConfig;
    static getMyPermissionConfig = getMyPermissionConfig;
    static getGenericConfig = getGenericConfig;
}

export class Middleware {
    static get(config: MiddlewareConfig) {
        switch (config.middleware) {
            case Middlewares.InsertMy:
                return {
                    name: config.middleware,
                    config: MiddlewaresConfigs.getInsertMyConfig(config.roles, config.updateFieldsPaths)
                };
            case Middlewares.UpdateMy:
                const c = config as UpdateMyConfig;
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


export default {
    generic,
    upsertMy,
    onlyMe,
    myPermission
}
