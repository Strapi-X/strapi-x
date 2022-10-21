import _ from "lodash";

export type MyPermissionConfig = {
  roles: string[];
  param: string;
  ctxPath: string;
  entity: string;
  entityPath: string;
};

export function getMyPermissionConfig(
  roles: string[],
  param: string,
  ctxPath: string,
  entity: string,
  entityPath: string
): MyPermissionConfig {
  return {
    roles,
    param,
    ctxPath,
    entity,
    entityPath
  };
}

export default (config: MyPermissionConfig, { strapi }) => {
  return async (ctx, next) => {
    const { user } = ctx.state;
    if (!(config.roles || []).includes(user.role?.type)) {
      const value = _.get(ctx, config.param);
      const entity = await strapi.entityService.findOne(config.entity, value, { populate: '*' });
      if (_.get(entity, config.entityPath) != _.get(ctx, config.ctxPath)) {
        return ctx.badRequest("You cannot operate on this entity", {
          entity,
        });
      }
    }
    await next();
  };
};
