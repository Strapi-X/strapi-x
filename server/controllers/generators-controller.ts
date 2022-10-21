import { Strapi } from '@strapi/strapi';
import archiver from "archiver";
import fs from 'fs';

export default ({ strapi }: { strapi: Strapi; }) => ({
  async generateModels(ctx) {
    console.log("Get all models");

    await strapi
      .plugin('strapi-x')
      .service('generatorsService')
      .generateTypescriptModels();

    const zip = archiver('zip');
    const stream = fs.createWriteStream(`${strapi.dirs.static.public}/uploads/models.zip`);
    await new Promise((resolve, reject) => {
      zip
        .directory(`${strapi.dirs.static.public}/models`, false)
        .on('error', err => reject(err))
        .pipe(stream);

      stream.on('close', () => resolve(undefined));
      zip.finalize();
    });

    ctx.body = {
      downloadUrl: `/uploads/models.zip`
    };
  },
  async generateServices(ctx) {
    console.log("Get all services");

    await strapi
      .plugin('strapi-x')
      .service('generatorsService')
      .generateService();

    const zip = archiver('zip');
    const stream = fs.createWriteStream(`${strapi.dirs.static.public}/uploads/services.zip`);
    await new Promise((resolve, reject) => {
      zip
        .directory(`${strapi.dirs.static.public}/services`, false)
        .on('error', err => reject(err))
        .pipe(stream);

      stream.on('close', () => resolve(undefined));
      zip.finalize();
    });
    
    ctx.body = {
      downloadUrl: `/uploads/services.zip`
    };
  },
});
