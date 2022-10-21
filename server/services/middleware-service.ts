import { Strapi } from '@strapi/strapi';
import { Middlewares } from "../middlewares";
import { MiddlewaresConfiguration } from '../models/middlewares-configuration';
import fs from 'fs';
import path from 'path';

export default ({ strapi }: { strapi: Strapi; }) => ({
  findAll() {
    const middlewares = [];
    for (let key in Middlewares) {
      if (isNaN(Number(key))) {
        middlewares.push({
          key,
          uid: Middlewares[key]
        });
      }
    }
    return middlewares;
  },
  findAllSavedMiddlewares(route?: string) {
    const extension: MiddlewaresConfiguration = require(path.resolve(strapi.dirs.app.src, 'extensions/strapi-x/middlewares/configuration.js'));
    return extension.middlewares.filter(m => route ? (extension.routes[route] || []).includes(m.uid) : true);
  },
  regenConfigurationFile(config: MiddlewaresConfiguration) {
    const stringifyFunction = function (key, val) {
      return (typeof val === 'function') ? '' + val : val;
    };
    const jsFile = 'module.exports = ' + JSON.stringify(config, stringifyFunction, '\t');
    const filePath = path.resolve(strapi.dirs.app.src, 'extensions/strapi-x/middlewares/configuration.js');
    fs.writeFileSync(filePath, jsFile, { encoding: 'utf8', flag: 'w' });
    return jsFile;
  }
});
