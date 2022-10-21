import _ from "lodash";

export type InsertMyConfig = {
  type: 'insert',
  roles: string[],
  updateFieldsPaths: { ctxPath: string; fieldPath: string; }[]
};
export type UpdateMyConfig = {
  type: 'update',
  roles: string[],
  entity: string,
  ctxPath: string,
  entityPath: string,
  updateFieldsPaths: { ctxPath: string; fieldPath: string; }[]
};

export type UpsertMyConfig = InsertMyConfig | UpdateMyConfig;

export function getInsertMyConfig(roles: string[], updateFieldsPaths: { ctxPath: string; fieldPath: string; }[]): InsertMyConfig {
  return {
    type: 'insert',
    roles,
    updateFieldsPaths
  }
}

export function getUpdateMyConfig(
  roles: string[],
  entity: string,
  ctxPath: string,
  entityPath: string,
  updateFieldsPaths: { ctxPath: string; fieldPath: string; }[]
): UpdateMyConfig {
  return {
    type: 'update',
    roles,
    entity,
    ctxPath,
    entityPath,
    updateFieldsPaths
  }
}

export default (config: UpsertMyConfig, { strapi }) => {
  return async (ctx, next) => {
    const { user } = ctx.state;

    if (!(config.roles || []).includes(user.role?.type)) {

      if (ctx.request.body.data.id && config.type === 'update') {
        const value = _.get(ctx, config.ctxPath);
        const entity = await strapi.entityService.findOne(
          config.entity,
          ctx.request.body.data.id,
          { populate: '*' }
        );
        const v = _.get(entity, config.entityPath);

        let v1 = typeof v === 'object'? v.id : v;
        if (v1 != value) {
          return ctx.badRequest("You cannot operate on this entity", {
            entity,
          });
        }
      }
      for(let d of config.updateFieldsPaths) {
        const v1 = _.get(ctx, d.ctxPath);
        _.set(ctx.request.body, d.fieldPath, v1);
      }
    }
    await next();
  };
};
