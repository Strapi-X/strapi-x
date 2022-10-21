"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = [
    {
        method: 'GET',
        path: '/',
        handler: 'myController.index',
        config: {
            policies: [],
        },
    },
    {
        method: 'GET',
        path: '/middlewares',
        handler: 'middlewaresController.findAll',
        config: {
            policies: [],
        },
    },
    {
        method: 'GET',
        path: '/routes',
        handler: 'middlewaresController.getRoutes',
        config: {
            policies: [],
        },
    },
    {
        method: 'GET',
        path: '/routes-middlewares',
        handler: 'middlewaresController.getRouteMiddlewares',
        config: {
            policies: [],
        },
    },
    {
        method: 'GET',
        path: '/schemas',
        handler: 'middlewaresController.getSchemas',
        config: {
            policies: [],
        },
    },
    {
        method: 'POST',
        path: '/regen',
        handler: 'middlewaresController.saveMiddlewaresConfigurations',
        config: {
            policies: [],
        },
    },
    {
        method: 'POST',
        path: '/middlewares/delete',
        handler: 'middlewaresController.deleteMiddlewaresConfigurations',
        config: {
            policies: [],
        },
    },
    {
        method: 'POST',
        path: '/generator/models/typescript',
        handler: 'generatorsController.generateModels',
        config: {
            policies: [],
        },
    },
    {
        method: 'POST',
        path: '/generator/services/typescript',
        handler: 'generatorsController.generateServices',
        config: {
            policies: [],
        },
    },
];
