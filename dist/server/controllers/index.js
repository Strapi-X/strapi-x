"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const my_controller_1 = __importDefault(require("./my-controller"));
const middlewares_controller_1 = __importDefault(require("./middlewares-controller"));
const generators_controller_1 = __importDefault(require("./generators-controller"));
exports.default = {
    myController: my_controller_1.default,
    middlewaresController: middlewares_controller_1.default,
    generatorsController: generators_controller_1.default
};
