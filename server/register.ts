import { Strapi } from '@strapi/strapi';
import fs from "fs";
import path from "path";

export default ({ strapi }: { strapi: Strapi; }) => {
  const dir = path.resolve(strapi.dirs.app.src, 'extensions/strapi-x/middlewares');
  if (!fs.existsSync(dir)) {
    console.log(dir, 'not exists!');
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(path.resolve(dir, 'configuration.js'))) {
    const filePath = path.resolve(strapi.dirs.app.src, 'extensions/strapi-x/middlewares/configuration.js');
    console.log(filePath, 'not exists!');

    fs.writeFileSync(filePath, 'module.exports = { routes: [], middlewares: [] };', { flag: 'wx' });
  }
};
