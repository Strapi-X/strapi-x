import _ from "lodash";

export type GenericConfig = {
  pre: (config: GenericConfig, strapi: Strapi.Strapi, ctx: any, next: () => Promise<void>) => Promise<void>,
  post: (config: GenericConfig, strapi: Strapi.Strapi, ctx: any, next: () => Promise<void>) => Promise<void>;
};

export function getGenericConfig(
  pre: (config: GenericConfig, strapi: Strapi.Strapi, ctx: any, next: () => Promise<void>) => Promise<void>,
  post: (config: GenericConfig, strapi: Strapi.Strapi, ctx: any, next: () => Promise<void>) => Promise<void>
): GenericConfig {
  return {
    pre,
    post
  };
}

export default (config: GenericConfig, { strapi }: { strapi: Strapi.Strapi; }) => {
  return async (ctx: any, next: () => Promise<void>) => {
    await config.pre(config, strapi, ctx, next);
    await next();
    await config.post(config, strapi, ctx, next);
  };
};
