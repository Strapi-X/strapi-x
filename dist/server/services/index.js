"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const my_service_1 = __importDefault(require("./my-service"));
const middleware_service_1 = __importDefault(require("./middleware-service"));
const generators_service_1 = __importDefault(require("./generators-service"));
exports.default = {
    myService: my_service_1.default,
    middlewaresService: middleware_service_1.default,
    generatorsService: generators_service_1.default
};
