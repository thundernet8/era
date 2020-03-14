import * as path from 'path';
import Router from 'koa-router';
import { container } from 'tsyringe';
import { EagleApplication } from '../app';
import { scan } from './helpers/scanner';
import { DIException } from './exceptions';
import { Logger } from './services/log.service';

function registerPrimitiveTypes() {
    container.register(String, {
        useValue: ''
    });
    container.register(Boolean, {
        useValue: false
    });
}

function loadControllersAndRoutes(app: EagleApplication) {
    const logger = new Logger('Controller');
    const start = Date.now();
    const router = new Router();
    const controllerDir = path.resolve(app.projectRoot, 'app/controller');
    logger.log(`Scan controller dirctory: ${controllerDir}`);
    const controllerConstructors = scan(
        controllerDir,
        '**/*.controller.{js,ts}'
    );
    for (const controllerConstructor of controllerConstructors) {
        logger.log(`Collect controller ${controllerConstructor.name}`);
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
        const subRouter = new Router({
            prefix: routePrefix
        });
        const actions = proto.__actions__ || [];
        for (const action of actions) {
            logger.log(
                `Register route: ${action.method.toUpperCase()} ${path.join(
                    proto.__route_prefix__ || '/',
                    action.route
                )}`
            );
            var a = '';
            subRouter[action.method](action.route, (ctx, next) => {
                const controller = container.resolve<any>(
                    controllerConstructor
                );
                if (controller) {
                    return controller[action.handler](ctx, next);
                }
                // TODO log controller not resolved
                return next();
            });
        }
        router.use(subRouter.routes());
        router.use(subRouter.allowedMethods());
    }

    app.use(router.routes());
    app.use(router.allowedMethods());
    logger.log(
        `Scan controller done: ${((Date.now() - start) / 1000).toFixed(2)}s`
    );
}

function loadServices(dir: string, log: boolean = true) {
    const logger = new Logger('Service');
    const start = Date.now();
    if (log) {
        logger.log(`Scan service dirctory: ${dir}`);
    }
    const serviceConstructors = scan(dir, '**/*.service.{js,ts}');
    for (const serviceConstructor of serviceConstructors) {
        if (log) {
            logger.log(`Collect service ${serviceConstructor.name}`);
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
        logger.log(
            `Scan service done: ${((Date.now() - start) / 1000).toFixed(2)}s`
        );
    }
}

export default function bootstrap(app: EagleApplication) {
    registerPrimitiveTypes();
    loadControllersAndRoutes(app);
    loadServices(path.resolve(__dirname, 'services'), false);
    loadServices(path.resolve(app.projectRoot, 'app/service'));
}
