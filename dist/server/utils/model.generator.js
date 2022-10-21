"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convert = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const change_case_1 = require("change-case");
const util = {
    // InterfaceName
    defaultToInterfaceName: (name) => name ? `I${name.replace(/^./, (str) => str.toUpperCase()).replace(/[ ]+./g, (str) => str.trimLeft().toUpperCase()).replace(/\//g, '')}` : 'any',
    overrideToInterfaceName: undefined,
    toInterfaceName(name, filename) {
        return util.overrideToInterfaceName ? util.overrideToInterfaceName(name, filename) || util.defaultToInterfaceName(name) : this.defaultToInterfaceName(name);
    },
    // EnumName
    defaultToEnumName: (name, interfaceName) => name ? `${interfaceName}${name.replace(/^./, (str) => str.toUpperCase())}` : 'any',
    overrideToEnumName: undefined,
    toEnumName(name, interfaceName) {
        return this.overrideToEnumName ? this.overrideToEnumName(name, interfaceName) || this.defaultToEnumName(name, interfaceName) : this.defaultToEnumName(name, interfaceName);
    },
    // OutputFileName
    defaultOutputFileName: (modelName, isComponent = undefined, configNested = undefined) => isComponent ?
        modelName.replace('.', path_1.default.sep) :
        configNested ? modelName.toLowerCase() + path_1.default.sep + modelName.toLowerCase() : modelName.toLowerCase(),
    overrideOutputFileName: undefined,
    toOutputFileName(modelName, isComponent, configNested, interfaceName, filename) {
        return this.overrideOutputFileName ? this.overrideOutputFileName(interfaceName, filename) || this.defaultOutputFileName(modelName, isComponent, configNested) : this.defaultOutputFileName(modelName, isComponent, configNested);
    },
    /**
     * Convert a Strapi type to a TypeScript type.
     *
     * @param interfaceName name of current interface
     * @param fieldName name of the field
     * @param model Strapi type
     * @param enumm Use Enum type (or string literal types)
     */
    defaultToPropertyType: (interfaceName, fieldName, model, enumm) => {
        const pt = model.type ? model.type.toLowerCase() : 'any';
        switch (pt) {
            case 'text':
            case 'richtext':
            case 'email':
            case 'password':
            case 'uid':
            case 'time':
                return 'string';
            case 'enumeration':
                if (enumm) {
                    return model.enum ? util.toEnumName(fieldName, interfaceName) : 'string';
                }
                else {
                    return model.enum ? `"${model.enum.join(`" | "`)}"` : 'string';
                }
            case 'date':
            case 'datetime':
            case 'timestamp':
                return 'Date';
            case 'media':
                return 'any';
            case 'json':
                return '{ [key: string]: any }';
            case 'dynamiczone':
                return 'any[]';
            case 'decimal':
            case 'float':
            case 'biginteger':
            case 'integer':
                return 'number';
            case 'relation':
                let type = 'any';
                switch (model.relation) {
                    case 'manyToMany':
                    case 'oneToMany':
                        type += '[]';
                        break;
                    default:
                        break;
                }
                return type;
            case 'string':
            case 'number':
            case 'boolean':
            default:
                return pt;
        }
    },
    overrideToPropertyType: undefined,
    toPropertyType(interfaceName, fieldName, model, enumm) {
        return this.overrideToPropertyType ? this.overrideToPropertyType(`${model.type}`, fieldName, interfaceName) || this.defaultToPropertyType(interfaceName, fieldName, model, enumm) : this.defaultToPropertyType(interfaceName, fieldName, model, enumm);
    },
    // PropertyName
    defaultToPropertyName: (fieldName) => fieldName,
    overrideToPropertyName: undefined,
    toPropertyName(fieldName, interfaceName) {
        return this.overrideToPropertyName ? this.overrideToPropertyName(fieldName, interfaceName) || this.defaultToPropertyName(fieldName) : this.defaultToPropertyName(fieldName);
    },
    excludeField: undefined,
    addField: undefined,
};
const findModel = (structure, name) => {
    return structure.filter((s) => s.modelName === name.toLowerCase()).shift();
};
class Converter {
    constructor(strapiModelsParse, config) {
        this.strapiModels = [];
        this.config = config;
        if (!fs_1.default.existsSync(config.output))
            fs_1.default.mkdirSync(config.output);
        if (config.enumName && typeof config.enumName === 'function')
            util.overrideToEnumName = config.enumName;
        if (config.interfaceName && typeof config.interfaceName === 'function')
            util.overrideToInterfaceName = config.interfaceName;
        if (config.fieldType && typeof config.fieldType === 'function')
            util.overrideToPropertyType = config.fieldType;
        else if (config.type && typeof config.type === 'function') {
            console.warn("option 'type' is depreated. use 'fieldType'");
            util.overrideToPropertyType = config.type;
        }
        if (config.excludeField && typeof config.excludeField === 'function')
            util.excludeField = config.excludeField;
        if (config.addField && typeof config.addField === 'function')
            util.addField = config.addField;
        if (config.fieldName && typeof config.fieldName === 'function')
            util.overrideToPropertyName = config.fieldName;
        if (config.outputFileName && typeof config.outputFileName === 'function')
            util.overrideOutputFileName = config.outputFileName;
        this.strapiModels = strapiModelsParse.map((m) => {
            const modelName = m.info.singularName;
            const interfaceName = (0, change_case_1.pascalCase)(m.info.singularName);
            const ouputFile = `${(0, change_case_1.paramCase)(m.info.singularName)}.model`;
            return {
                ...m,
                interfaceName,
                modelName: modelName.toLowerCase(),
                ouputFile
            };
        });
    }
    async run() {
        return new Promise((resolve, reject) => {
            // Write index.ts
            // const outputFile = path.resolve(this.config.output, 'index.ts');
            // const modelsWrapper = this.strapiModels
            //     .map(s => `export * from './${s.ouputFile.replace('\\', '/')}';`)
            //     .sort()
            //     .join('\n');
            // fs.writeFileSync(outputFile, modelsWrapper + '\n');
            console.log('');
            // Write each interfaces
            let count = this.strapiModels.length;
            this.strapiModels.forEach(g => {
                const folder = path_1.default.resolve(this.config.output, g.ouputFile);
                if (!fs_1.default.existsSync(path_1.default.dirname(folder)))
                    fs_1.default.mkdirSync(path_1.default.dirname(folder));
                fs_1.default.writeFile(`${folder}.ts`, this.strapiModelToInterface(g), { encoding: 'utf8' }, (err) => {
                    console.log(`Wrote ${folder}.ts`);
                    count--;
                    if (err)
                        reject(err);
                    if (count === 0)
                        resolve(this.strapiModels.length);
                });
                const modelFolder = path_1.default.resolve(this.config.output, '../', g.ouputFile);
                if (!fs_1.default.existsSync(`${modelFolder}.ts`)) {
                    fs_1.default.writeFile(`${modelFolder}.ts`, this.modelToInterface(g), { encoding: 'utf8' }, (err) => {
                        console.log(`Wrote ${modelFolder}.ts`);
                        count--;
                        if (err)
                            reject(err);
                        if (count === 0)
                            resolve(this.strapiModels.length);
                    });
                }
                else {
                    count--;
                    if (count === 0)
                        resolve(this.strapiModels.length);
                }
            });
        });
    }
    strapiModelToInterface(m) {
        const result = [];
        result.push(...this.strapiModelExtractImports(m));
        if (result.length > 0)
            result.push('');
        result.push('export namespace Strapi {');
        result.push('   /**');
        result.push(`   * Strapi Model definition for ${m.info.displayName}`);
        result.push('   */');
        result.push(`   export class ${(0, change_case_1.pascalCase)(m.interfaceName)} {`);
        result.push(`       public ${this.strapiModelAttributeToProperty(m.interfaceName, 'id', {
            type: 'string',
            required: true
        })}`);
        if (m.attributes)
            for (const aName in m.attributes) {
                if ((util.excludeField && util.excludeField(m.interfaceName, aName)) || !m.attributes.hasOwnProperty(aName))
                    continue;
                result.push(`       public ${this.strapiModelAttributeToProperty(m.interfaceName, aName, m.attributes[aName])}`);
            }
        if (util.addField) {
            let addFields = util.addField(m.interfaceName);
            if (addFields && Array.isArray(addFields)) {
                for (let f of addFields) {
                    result.push(`       public ${f.name}: ${f.type};`);
                }
            }
        }
        result.push(`       public createdAt: Date;`);
        result.push(`       public updatedAt: Date;`);
        result.push(`  `);
        result.push(`       constructor(${(0, change_case_1.camelCase)(m.info.singularName)}: Partial<${(0, change_case_1.pascalCase)(m.interfaceName)}>) {`);
        result.push(`           Object.assign(this, ${(0, change_case_1.camelCase)(m.info.singularName)});`);
        result.push(`       }`);
        result.push('   }');
        result.push('}');
        if (this.config.enum)
            result.push('', ...this.strapiModelAttributeToEnum(m.interfaceName, m.attributes));
        return result.join('\n');
    }
    ;
    modelToInterface(m) {
        const result = [];
        result.push(...this.strapiModelExtractImports(m));
        if (result.length > 0)
            result.push('');
        result.push(`import { Strapi } from './strapi/${(0, change_case_1.paramCase)(m.interfaceName)}.model';`);
        result.push('');
        result.push('/**');
        result.push(`* Model definition for ${m.info.displayName}`);
        result.push('*/');
        result.push(`export class ${(0, change_case_1.pascalCase)(m.interfaceName)} extends Strapi.${(0, change_case_1.pascalCase)(m.interfaceName)} {`);
        result.push(``);
        result.push(`   constructor(${(0, change_case_1.camelCase)(m.info.singularName)}: Partial<${(0, change_case_1.pascalCase)(m.interfaceName)}>) {`);
        result.push(`       super(${(0, change_case_1.camelCase)(m.info.singularName)});`);
        result.push(`       Object.assign(this, ${(0, change_case_1.camelCase)(m.info.singularName)});`);
        result.push(`   }`);
        result.push('}');
        return result.join('\n');
    }
    ;
    /**
     * Find all required models and import them.
     *
     * @param m Strapi model to examine
     * @param structure Overall output structure
     */
    strapiModelExtractImports(m) {
        const toImportDefinition = (name) => {
            const found = findModel(this.strapiModels, name);
            const toFolder = (f) => {
                let rel = path_1.default.normalize(path_1.default.relative(path_1.default.dirname(m.ouputFile), path_1.default.dirname(f.ouputFile)));
                rel = path_1.default.normalize(rel + path_1.default.sep + path_1.default.basename(f.ouputFile));
                if (!rel.startsWith('..'))
                    rel = '.' + path_1.default.sep + rel;
                return rel.replace('\\', '/').replace('\\', '/');
            };
            return found ? `import ${(this.config.importAsType && this.config.importAsType(m.interfaceName) ? 'type ' : '')}{ ${found.interfaceName} } from '${toFolder(found)}';` : '';
        };
        const imports = [];
        if (m.attributes)
            for (const aName in m.attributes) {
                if (!m.attributes.hasOwnProperty(aName))
                    continue;
                const a = m.attributes[aName];
                if ((a.collection || a.model || a.component || '').toLowerCase() === m.modelName)
                    continue;
                const proposedImport = toImportDefinition(a.collection || a.model || a.component || '');
                if (proposedImport)
                    imports.push(proposedImport);
                imports.push(...(a.components || [])
                    .filter(c => c !== m.modelName)
                    .map(toImportDefinition));
            }
        return imports
            .filter((value, index, arr) => arr.indexOf(value) === index) // is unique
            .sort();
    }
    ;
    /**
     * Convert a Strapi Attribute to a TypeScript property.
     *
     * @param interfaceName name of current interface
     * @param name Name of the property
     * @param a Attributes of the property
     * @param structure Overall output structure
     * @param enumm Use Enum type (or string literal types)
     */
    strapiModelAttributeToProperty(interfaceName, name, a) {
        const findModelName = (n) => {
            const result = findModel(this.strapiModels, n);
            if (!result && n !== '*')
                console.debug(`type '${n}' unknown on ${interfaceName}[${name}] => fallback to 'any'. Add in the input arguments the folder that contains *.settings.json with info.name === '${n}'`);
            return result ? result.interfaceName : 'any';
        };
        const buildDynamicZoneComponent = (n) => {
            const result = findModel(this.strapiModels, n);
            if (!result && n !== '*')
                console.debug(`type '${n}' unknown on ${interfaceName}[${name}] => fallback to 'any'. Add in the input arguments the folder that contains *.settings.json with info.name === '${n}'`);
            return result ? `    | ({ __component: '${result.modelName}' } & ${result.interfaceName})\n` : 'any';
        };
        const required = !a.required && !(!this.config.collectionCanBeUndefined && (a.collection || a.repeatable)) && a.type !== 'dynamiczone' ? '?' : '';
        const collection = a.collection || a.repeatable ? '[]' : '';
        let propType = 'unknown';
        if (a.collection) {
            propType = findModelName(a.collection);
        }
        else if (a.component) {
            propType = findModelName(a.component);
        }
        else if (a.model) {
            propType = findModelName(a.model);
        }
        else if (a.type === "dynamiczone") {
            propType = `(\n${a.components.map(buildDynamicZoneComponent).join('')}  )[]`;
        }
        else if (a.type) {
            propType = util.toPropertyType(interfaceName, name, a, this.config.enum);
        }
        return `${util.toPropertyName(name, interfaceName)}${required}: ${propType}${collection};`;
    }
    ;
    /**
     * Convert all Strapi Enum to TypeScript Enumeration.
     *
     * @param interfaceName name of current interface
     * @param a Attributes
     */
    strapiModelAttributeToEnum(interfaceName, attributes) {
        const enums = [];
        for (const aName in attributes) {
            if (!attributes.hasOwnProperty(aName))
                continue;
            if (attributes[aName].type === 'enumeration') {
                enums.push(`export enum ${util.toEnumName(aName, interfaceName)} {`);
                attributes[aName].enum.forEach(e => {
                    enums.push(`  ${e} = "${e}",`);
                });
                enums.push(`}\n`);
            }
        }
        return enums;
    }
}
/**
 * Export a StrapiModel to a TypeScript interface
 */
const convert = async (strapiModels, config) => {
    return new Converter(strapiModels, config).run();
};
exports.convert = convert;
