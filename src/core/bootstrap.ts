import * as path from 'path';
import Router from 'koa-router';
import { container } from 'tsyringe';
import clc from 'cli-color';
import { EraApplication } from '../app';
import { scan } from './helpers/scanner';
import { DIException } from './exceptions';
import { Logger } from './services/log.service';
import { IEraContext } from '../context';

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
    const logger = new Logger('Controller');
    const start = Date.now();
    const router = new Router();
    const controllerDir = path.resolve(app.projectRoot, 'app/controller');
    logger.log(`Load controllers from directory: ${controllerDir}`);
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
        const subRouter = new Router({
            prefix: routePrefix
        });
        const actions = proto.__actions__ || [];
        for (const action of actions) {
            logger.log(
                `+ Register route: ${action.method.toUpperCase()} ${path.join(
                    proto.__route_prefix__ || '/',
                    action.route
                )}`
            );
            const actionMiddlewares =
                proto.__action_middlewares__[action.handler] || [];
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
                        ctx.app.diLogger.error(e.message);
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
    const logger = new Logger('Service');
    const start = Date.now();
    if (log) {
        logger.log(`Load services from directory: ${dir}`);
    }
    const serviceConstructors = scan(dir, '**/*.service.{js,ts}');
    for (const serviceConstructor of serviceConstructors) {
        if (log) {
            logger.log(`+ Load service ${serviceConstructor.name}`);
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

function loadMiddlewares(dir: string, log: boolean = true) {
    const logger = new Logger('Middleware');
    const start = Date.now();
    if (log) {
        logger.log(`Load middlewares from directory: ${dir}`);
    }
    const middlewareConstructors = scan(dir, '**/*.middleware.{js,ts}');
    for (const middlewareConstructor of middlewareConstructors) {
        if (log) {
            logger.log(`+ Load middleware ${middlewareConstructor.name}`);
        }
        if (!container.isRegistered(middlewareConstructor)) {
            throw new DIException(
                `The middleware class:[${middlewareConstructor.name}] must be decorated by @Middleware decorator`
            );
        }
        try {
            container.resolve(middlewareConstructor);
        } catch (e) {
            throw new DIException(
                `The middleware class:[${middlewareConstructor.name}] cannot be resolved`
            );
        }
    }
    if (log) {
        logger.log(
            `Load middlewares done ${yellow(`+${Date.now() - start}ms`)}`
        );
    }
}

export default function bootstrap(app: EraApplication) {
    registerPrimitiveTypes();
    loadMiddlewares(path.resolve(__dirname, 'middlewares'), false);
    loadMiddlewares(path.resolve(app.projectRoot, 'app/middlewares'));
    loadServices(path.resolve(__dirname, 'services'), false);
    loadServices(path.resolve(app.projectRoot, 'app/service'));
    loadControllersAndRoutes(app);
}
