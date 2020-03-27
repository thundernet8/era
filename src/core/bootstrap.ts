import { container } from 'tsyringe';
container.register(String, {
    useValue: ''
});
container.register(Boolean, {
    useValue: false
});

import * as path from 'path';
import Router from 'koa-router';
import clc from 'cli-color';
import { EraApplication } from '../app';
import { ActionExecutor } from './helpers';
import { DIException } from './exceptions';
import { Logger } from './services';
import {
    MiddlewareRegistry,
    ServiceRegistry,
    ControllerRegistry
} from './registry';

const yellow = clc.xterm(3);

function loadMiddlewares(app: EraApplication) {
    const logger = new Logger('Bootstrap<Middleware>');
    const start = Date.now();
    logger.log('Load middlewares');
    const middlewareMetadatas = MiddlewareRegistry.getMiddlewares(app.config);
    const router = new Router();
    for (const middlewareMetadata of middlewareMetadatas) {
        logger.log(`+ Load middleware ${yellow(middlewareMetadata.type.name)}`);
        try {
            const actionMetadata = middlewareMetadata.action;
            const middleware = (ctx, next) => {
                ActionExecutor.exec(actionMetadata, ctx, next);
            };
            router.all(middlewareMetadata.paths, middleware);
        } catch (e) {
            throw new DIException(
                `The middleware class:[${middlewareMetadata.type.name}] cannot be resolved`,
                e
            );
        }
    }
    app.use(router.routes());
    app.use(router.allowedMethods());
    logger.log(`Load middlewares done ${yellow(`+${Date.now() - start}ms`)}`);
}

function loadServices() {
    const logger = new Logger('Bootstrap<Service>');
    const start = Date.now();
    logger.log('Load services');
    const serviceMetadatas = ServiceRegistry.getServices();
    for (const serviceMetadata of serviceMetadatas) {
        logger.log(`+ Load service ${yellow(serviceMetadata.type.name)}`);
        try {
            ServiceRegistry.resolve(serviceMetadata.type);
        } catch (e) {
            console.log('e', e);
            throw new DIException(
                `The service class:[${serviceMetadata.type.name}] cannot be resolved`,
                e
            );
        }
    }
    logger.log(`Load services done ${yellow(`+${Date.now() - start}ms`)}`);
}

function loadControllers(app: EraApplication) {
    const logger = new Logger('Bootstrap<Controller>');
    logger.log('Load controllers');
    const start = Date.now();
    const router = new Router();
    const controllerMetadatas = ControllerRegistry.getControllers();
    for (const controllerMetadata of controllerMetadatas) {
        logger.log(`+ Load controller ${controllerMetadata.type.name}`);
        try {
            ControllerRegistry.resolveController(controllerMetadata.type);
        } catch (e) {
            throw new DIException(
                `The controller class:[${controllerMetadata.type.name}] cannot be resolved`,
                e
            );
        }
        const routePrefix = controllerMetadata.routePrefix;
        const controllerMiddlewareMetadatas =
            controllerMetadata.middlewares || [];
        const controllerMiddlewares = controllerMiddlewareMetadatas.map(
            metadata => {
                const actionMetadata = metadata.action;
                return (ctx, next) => {
                    ActionExecutor.exec(actionMetadata, ctx, next);
                };
            }
        );
        const subRouter = new Router({
            prefix: routePrefix
        });
        const actions = Array.from(controllerMetadata.actions.values());
        for (const action of actions) {
            const { routes } = action;
            const actionHandler = (ctx, next) => {
                ActionExecutor.exec(action, ctx, next);
            };
            for (const route of routes) {
                const fullPath = `${route.method.toUpperCase()} ${path.join(
                    controllerMetadata.routePrefix,
                    route.path
                )}`;
                logger.log(`+ Register route: ${yellow(fullPath)}`);
                subRouter[route.method](
                    route.path,
                    ...controllerMiddlewares,
                    actionHandler
                );
            }
        }
        router.use(subRouter.routes());
        router.use(subRouter.allowedMethods());
    }

    app.use(router.routes());
    app.use(router.allowedMethods());
    logger.log(`Load controllers done ${yellow(`+${Date.now() - start}ms`)}`);
}

export default function bootstrap(app: EraApplication) {
    // registerPrimitiveTypes();
    loadMiddlewares(app);
    loadServices();
    loadControllers(app);
}
