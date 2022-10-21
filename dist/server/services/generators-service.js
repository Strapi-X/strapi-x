"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const model_generator_1 = require("../utils/model.generator");
const service_generator_1 = require("../utils/service.generator");
exports.default = ({ strapi }) => ({
    async generateTypescriptModels() {
        let modelsPaths = fs_1.default.readdirSync(`${strapi.dirs.app.root}/src/api`);
        console.log(modelsPaths);
        modelsPaths = modelsPaths
            .filter(dirent => fs_1.default.lstatSync(`${strapi.dirs.app.root}/src/api/${dirent}`).isDirectory())
            .map(d => `${strapi.dirs.app.root}/src/api/${d}`);
        const models = [];
        for (let mp of modelsPaths) {
            console.log(mp);
            const p = path_1.default.join(mp, 'content-types');
            const contents = fs_1.default.readdirSync(p)
                // .filter(dirent => dirent.isDirectory());
                .filter(d => fs_1.default.lstatSync(`${p}/${d}`).isDirectory())
                .map(d => `${p}/${d}`);
            console.log(`-- ${p}`);
            for (let schema of contents) {
                const p1 = path_1.default.join(schema, 'schema.json');
                console.log(`---- ${p1}`);
                const file = fs_1.default.readFileSync(p1).toString('utf-8');
                const s = JSON.parse(file);
                models.push(s);
            }
        }
        console.log("Add User model");
        let userModel = fs_1.default.readFileSync(`${strapi.dirs.app.root}/src/extensions/users-permissions/content-types/user/schema.json`);
        models.push(JSON.parse(userModel.toString("utf-8")));
        const opts = { output: `${strapi.dirs.app.root}/public/models/strapi` };
        if (!fs_1.default.existsSync(opts.output)) {
            fs_1.default.mkdirSync(opts.output, { recursive: true });
        }
        (0, model_generator_1.convert)(models, opts);
        return { generation: 'ok' };
    },
    async generateService() {
        if (!fs_1.default.existsSync(`${strapi.dirs.app.root}/public/services/strapi`)) {
            fs_1.default.mkdirSync(`${strapi.dirs.app.root}/public/services/strapi`, { recursive: true });
        }
        fs_1.default.writeFileSync(`${strapi.dirs.app.root}/public/services/strapi/strapi.service.ts`, service_generator_1.GENERAL_SERVICE);
        return { generation: 'ok' };
    },
});
