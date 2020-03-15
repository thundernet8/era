import * as path from 'path';
import Router from 'koa-router';
import { container } from 'tsyringe';
import clc from 'cli-color';
import { EraApplication } from '../app';
import { scan, isMiddlewareMatchScope } from './helpers';
import { DIException } from './exceptions';
import { Logger } from './services';
import { IEraContext } from '../context';
import { EraMiddleware } from './interfaces';

const yellow = clc.xterm(3);

function registerPrimitiveTypes() {
    container.register(String, {
        useValue: ''
    });
    container.register(Boolean, {
        useValue: false
    });
}

function loadControllersAndRoutes(app: EraApplication) {
    const logger = new Logger('Bootstrap<Controller>');
    const start = Date.now();
    const router = new Router();
    const controllerDir = path.resolve(app.projectRoot, 'app/controller');
    logger.log(`Load controllers from directory: ${yellow(controllerDir)}`);
    const controllerConstructors = scan(
        controllerDir,
        '**/*.controller.{js,ts}'
    );
    for (const controllerConstructor of controllerConstructors) {
        logger.log(`+ Load controller ${controllerConstructor.name}`);
        if (!container.isRegistered(controllerConstructor)) {
            throw new DIException(
                `The controller class:[${controllerConstructor.name}] must be decorated by @Controller decorator`
            );
        }
        try {
            container.resolve(controllerConstructor);
        } catch (e) {
            throw new DIException(
                `The controller class:[${controllerConstructor.name}] cannot be resolved`
            );
        }
        const proto = controllerConstructor.prototype;
        const routePrefix = proto.__route_prefix__ || '/';
        const controllerMiddlewares = proto.__middlewares__ || [];
        for (const middleware of controllerMiddlewares) {
            try {
                isMiddlewareMatchScope(middleware, 'Controller');
            } catch (e) {
                logger.error(e.message);
                throw e;
            }
        }
        const subRouter = new Router({
            prefix: routePrefix
        });
        const actions = proto.__actions__ || [];
        for (const action of actions) {
            const fullPath = `${action.method.toUpperCase()} ${path.join(
                proto.__route_prefix__ || '/',
                action.route
            )}`;
            logger.log(`+ Register route: ${yellow(fullPath)}`);
            const actionMiddlewares =
                proto.__action_middlewares__[action.handler] || [];
            for (const middleware of actionMiddlewares) {
                try {
                    isMiddlewareMatchScope(middleware, 'Method');
                } catch (e) {
                    logger.error(e.message);
                    throw e;
                }
            }
            subRouter[action.method](
                action.route,
                ...controllerMiddlewares,
                ...actionMiddlewares,
                (ctx: IEraContext, next) => {
                    try {
                        const controller = container.resolve<any>(
                            controllerConstructor
                        );
                        if (controller) {
                            return controller[action.handler](ctx, next);
                        }
                        throw new DIException(
                            `The controller ${controllerConstructor.name} cannot be resolved`
                        );
                    } catch (e) {
                        ctx.app.diLogger.error(e.message, e.stack);
                        ctx.body = e.message;
                        ctx.status = 500;
                    }
                    return next();
                }
            );
        }
        router.use(subRouter.routes());
        router.use(subRouter.allowedMethods());
    }

    app.use(router.routes());
    app.use(router.allowedMethods());
    logger.log(`Load controllers done ${yellow(`+${Date.now() - start}ms`)}`);
}

function loadServices(dir: string, log: boolean = true) {
    const logger = new Logger('Bootstrap<Service>');
    const start = Date.now();
    if (log) {
        logger.log(`Load services from directory: ${yellow(dir)}`);
    }
    const serviceConstructors = scan(dir, '**/*.service.{js,ts}');
    for (const serviceConstructor of serviceConstructors) {
        if (log) {
            logger.log(`+ Load service ${yellow(serviceConstructor.name)}`);
        }
        if (!container.isRegistered(serviceConstructor)) {
            throw new DIException(
                `The service class:[${serviceConstructor.name}] must be decorated by @Service decorator`
            );
        }
        try {
            container.resolve(serviceConstructor);
        } catch (e) {
            throw new DIException(
                `The service class:[${serviceConstructor.name}] cannot be resolved`
            );
        }
    }
    if (log) {
        logger.log(`Load services done ${yellow(`+${Date.now() - start}ms`)}`);
    }
}

function loadMiddlewares(app: EraApplication, dir: string) {
    const logger = new Logger('Bootstrap<Middleware>');
    const start = Date.now();
    logger.log(`Load middlewares from directory: ${yellow(dir)}`);
    const middlewareConstructors = scan(dir, '**/*.middleware.{js,ts}');
    for (const middlewareConstructor of middlewareConstructors) {
        logger.log(`+ Load middleware ${yellow(middlewareConstructor.name)}`);
        if (!container.isRegistered(middlewareConstructor)) {
            throw new DIException(
                `The middleware class:[${middlewareConstructor.name}] must be decorated by @Middleware decorator`
            );
        }
        try {
            const middleware = container.resolve<EraMiddleware>(
                middlewareConstructor
            );
            if (middleware.scope === 'All' || middleware.scope === 'App') {
                app.useMiddleware(middlewareConstructor);
            }
        } catch (e) {
            throw new DIException(
                `The middleware class:[${middlewareConstructor.name}] cannot be resolved`
            );
        }
    }
    logger.log(`Load middlewares done ${yellow(`+${Date.now() - start}ms`)}`);
}

export default function bootstrap(app: EraApplication) {
    // registerPrimitiveTypes();
    loadMiddlewares(app, path.resolve(__dirname, 'middlewares'));
    loadMiddlewares(app, path.resolve(app.projectRoot, 'app/middlewares'));
    loadServices(path.resolve(__dirname, 'services'), false);
    loadServices(path.resolve(app.projectRoot, 'app/service'));
    loadControllersAndRoutes(app);
}

registerPrimitiveTypes();
