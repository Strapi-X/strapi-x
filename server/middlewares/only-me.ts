import _ from "lodash";

export type OnlyMeConfig = {
  roles: string[];
  ctxPath: string;
  filtersPath: string;
};

export function getOnlyMeConfig(roles: string[], ctxPath: string, filtersPath: string): OnlyMeConfig {
  return {
    roles,
    ctxPath,
    filtersPath,
  };
}

export default (config: OnlyMeConfig, { strapi }) => {
  return async (ctx, next) => {
    const { user } = ctx.state;
    if (!(config.roles || []).includes(user.role?.type) || ctx.request.query.onlyMe) {
      const filters = ctx.request.query.filters;
      const value = _.get(ctx, config.ctxPath);
      if (filters) {
        _.set(ctx.request.query.filters, config.filtersPath, value);
      } else {
        ctx.request.query.filters = _.set({}, config.filtersPath, value);
      }
    }
    await next();
  };
};
