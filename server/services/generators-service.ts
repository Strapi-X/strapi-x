

import { Strapi } from '@strapi/strapi';
import fs from 'fs';
import path from 'path';
import { convert } from "../utils/model.generator";
import { GENERAL_SERVICE } from '../utils/service.generator';


export default ({ strapi }: { strapi: Strapi; }) => ({
    async generateTypescriptModels() {
        let modelsPaths = fs.readdirSync(`${strapi.dirs.app.root}/src/api`);

        console.log(modelsPaths);

        modelsPaths = modelsPaths
            .filter(dirent => fs.lstatSync(`${strapi.dirs.app.root}/src/api/${dirent}`).isDirectory())
            .map(d => `${strapi.dirs.app.root}/src/api/${d}`);

        const models = [];
        for (let mp of modelsPaths) {
            console.log(mp);
            const p = path.join(mp, 'content-types');
            const contents = fs.readdirSync(p)
                // .filter(dirent => dirent.isDirectory());
                .filter(d => fs.lstatSync(`${p}/${d}`).isDirectory())
                .map(d => `${p}/${d}`);
            console.log(`-- ${p}`);
            for (let schema of contents) {
                const p1 = path.join(schema, 'schema.json');
                console.log(`---- ${p1}`);
                const file = fs.readFileSync(p1).toString('utf-8');
                const s = JSON.parse(file);
                models.push(s);
            }
        }
        console.log("Add User model");
        let userModel = fs.readFileSync(`${strapi.dirs.app.root}/src/extensions/users-permissions/content-types/user/schema.json`);
        models.push(JSON.parse(userModel.toString("utf-8")));

        const opts = { output: `${strapi.dirs.app.root}/public/models/strapi` };
        if (!fs.existsSync(opts.output)) {
            fs.mkdirSync(opts.output, { recursive: true });
        }

        convert(models, opts);
        return { generation: 'ok' };
    },
    async generateService() {
        if (!fs.existsSync(`${strapi.dirs.app.root}/public/services/strapi`)) {
            fs.mkdirSync(`${strapi.dirs.app.root}/public/services/strapi`, { recursive: true });
        }
        fs.writeFileSync(`${strapi.dirs.app.root}/public/services/strapi/strapi.service.ts`, GENERAL_SERVICE);
        return { generation: 'ok' };
    },
});