"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const archiver_1 = __importDefault(require("archiver"));
const fs_1 = __importDefault(require("fs"));
exports.default = ({ strapi }) => ({
    async generateModels(ctx) {
        console.log("Get all models");
        await strapi
            .plugin('strapi-x')
            .service('generatorsService')
            .generateTypescriptModels();
        const zip = (0, archiver_1.default)('zip');
        const stream = fs_1.default.createWriteStream(`${strapi.dirs.static.public}/uploads/models.zip`);
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
        const zip = (0, archiver_1.default)('zip');
        const stream = fs_1.default.createWriteStream(`${strapi.dirs.static.public}/uploads/services.zip`);
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
