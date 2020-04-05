import { container } from 'tsyringe';
container.register(String, {
    useValue: '',
});
container.register(Boolean, {
    useValue: false,
});

import * as path from 'path';
import Router from 'koa-router';
import clc from 'cli-color';
import { EraApplication } from '../app';
import { ActionExecutor, scan, FilterExecutor } from './helpers';
import { DIException } from './exceptions';
import { Logger } from './services';
import {
    MiddlewareRegistry,
    ServiceRegistry,
    ControllerRegistry,
    FilterRegistry,
    InterceptorRegistry,
} from './registry';
import { DBService } from './services/db.service';

const yellow = clc.xterm(3);

function loadMiddlewares(app: EraApplication) {
    const logger = new Logger('Bootstrap<Middleware>');
    const start = Date.now();
    logger.log('Load middlewares');

    const internalMiddlewareDir = path.resolve(
        path.resolve(__dirname, 'middlewares')
    );
    logger.log(
        `Scan middlewares from directory: ${yellow(internalMiddlewareDir)}`
    );
    scan(internalMiddlewareDir, '**/*.middleware.{js,ts}');
    const middlewareDir = path.resolve(app.projectRoot, 'app/middleware');
    logger.log(`Scan middlewares from directory: ${yellow(middlewareDir)}`);
    scan(middlewareDir, '**/*.middleware.{js,ts}');

    const middlewareMetadatas = MiddlewareRegistry.getGlobalMiddlewares(
        app.config
    );
    const router = new Router();
    for (const middlewareMetadata of middlewareMetadatas) {
        logger.log(`+ Load middleware ${yellow(middlewareMetadata.type.name)}`);
        try {
            const middleware = MiddlewareRegistry.resolveMiddlewareHandler(
                middlewareMetadata
            );
            router.all(middlewareMetadata.paths, middleware as any);
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

function loadServices(app: EraApplication) {
    const logger = new Logger('Bootstrap<Service>');
    const start = Date.now();
    logger.log('Load services');

    const internalServiceDir = path.resolve(
        path.resolve(__dirname, 'services')
    );
    logger.log(`Scan services from directory: ${yellow(internalServiceDir)}`);
    scan(internalServiceDir, '**/*.service.{js,ts}');
    const serviceDir = path.resolve(app.projectRoot, 'app/service');
    logger.log(`Scan services from directory: ${yellow(serviceDir)}`);
    scan(serviceDir, '**/*.service.{js,ts}');

    const serviceMetadatas = ServiceRegistry.getServices();
    for (const serviceMetadata of serviceMetadatas) {
        logger.log(`+ Load service ${yellow(serviceMetadata.type.name)}`);
        // try {
        //     ServiceRegistry.resolve(serviceMetadata.type);
        // } catch (e) {
        //     throw new DIException(
        //         `The service class:[${serviceMetadata.type.name}] cannot be resolved`,
        //         e
        //     );
        // }
    }
    logger.log(`Load services done ${yellow(`+${Date.now() - start}ms`)}`);
}

function loadControllers(app: EraApplication) {
    const logger = new Logger('Bootstrap<Controller>');
    logger.log('Load controllers', 'Bootstrap');
    const start = Date.now();

    const controllerDir = path.resolve(app.projectRoot, 'app/controller');
    logger.log(`Scan controllers from directory: ${yellow(controllerDir)}`);
    scan(controllerDir, '**/*.controller.{js,ts}');

    const router = new Router();
    const controllerMetadatas = ControllerRegistry.getControllers();
    for (const controllerMetadata of controllerMetadatas) {
        logger.log(`+ Load controller ${controllerMetadata.type.name}`);
        // try {
        //     ControllerRegistry.resolveController(controllerMetadata.type);
        // } catch (e) {
        //     throw new DIException(
        //         `The controller class:[${controllerMetadata.type.name}] cannot be resolved`,
        //         e
        //     );
        // }
        const routePrefix = controllerMetadata.routePrefix;
        const controllerMiddlewareMetadatas = MiddlewareRegistry.getControllerMiddlewares(
            controllerMetadata.type
        );
        const controllerMiddlewares = controllerMiddlewareMetadatas.map(
            MiddlewareRegistry.resolveMiddlewareHandler
        );
        const subRouter = new Router({
            prefix: routePrefix,
        });
        const actions = Array.from(controllerMetadata.actions.values());
        for (const action of actions) {
            const { routes } = action;
            const actionHandler = async (ctx, next) => {
                try {
                    return ActionExecutor.exec(action, ctx, next);
                } catch (e) {
                    ctx.exception = e;
                }
            };

            const interceptors = InterceptorRegistry.getInterceptors(
                controllerMetadata.type,
                action.actionName
            ).map(InterceptorRegistry.resolveInterceptorHandler);

            const exceptionFilters = FilterRegistry.getFilters(
                controllerMetadata.type,
                action.actionName
            ).map(FilterRegistry.resolveFilterHandler);

            const respSetMiddleware = async (ctx, next) => {
                const result = await next();
                if (typeof ctx.response._body === 'undefined') {
                    // ctx.response.writable
                    ctx.status = 200;
                    ctx.body = result;
                }
                return result;
            };

            const filtersApplyMiddleware = async (ctx, next) => {
                try {
                    const result = await next();
                    if (ctx.exception) {
                        const exception = ctx.exception;
                        ctx.exception = null;
                        throw exception;
                    }
                    return result;
                } catch (e) {
                    FilterExecutor.applyFilters(e, ctx, exceptionFilters);
                }
            };

            for (const route of routes) {
                const fullPath = `${route.method.toUpperCase()} ${path.join(
                    controllerMetadata.routePrefix,
                    route.path
                )}`;
                logger.log(`+ Register route: ${yellow(fullPath)}`);
                subRouter[route.method](
                    route.path,
                    ...(controllerMiddlewares as any),
                    respSetMiddleware,
                    filtersApplyMiddleware,
                    ...(interceptors as any),
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

function loadModels(app: EraApplication) {
    const logger = new Logger('Bootstrap<Model>');
    const start = Date.now();
    logger.log('Load models');

    const modelDir = path.resolve(app.projectRoot, 'app/model');
    logger.log(`Scan models from directory: ${yellow(modelDir)}`);
    scan(modelDir, '**/*.model.{js,ts}');
    logger.log(`Load models done ${yellow(`+${Date.now() - start}ms`)}`);
}

async function connectDB(app: EraApplication) {
    if (app.config.db) {
        app.logger.log(`init db connection`, 'Database');
        const db = new DBService(app);
        container.registerInstance('DB', db);
        await db.init();
    }
}

export default async function bootstrap(app: EraApplication) {
    container.registerInstance('App', app);
    loadMiddlewares(app);
    loadServices(app);
    loadControllers(app);
    loadModels(app);
    await connectDB(app);
}
