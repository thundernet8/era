import * as path from 'path';
import Router from 'koa-router';
import { container } from 'tsyringe';
import { EagleApplication } from '../app';
import { scan } from './helper/scanner';

export function loadRoutes(app: EagleApplication) {
    // TODO resolve all controllers for test
    const router = new Router();
    const controllerDir = path.resolve(app.projectRoot, 'app/controller');
    const controllerConstructors = scan(
        controllerDir,
        './**/*.controller.(ts|js)'
    );
    for (const controllerConstructor of controllerConstructors) {
        if (!container.isRegistered(controllerConstructor)) {
            throw new Error(
                `The controller class:[${controllerConstructor.name}] must be decorated by @Controller decorator`
            );
        }
        const proto = controllerConstructor.prototype;
        const subRouter = new Router({
            prefix: proto.__route_prefix__ || '/'
        });
        // proto.__actions__.push({
        //     method,
        //     handler: name,
        //     route: normalizePath(route)
        // });
        const actions = proto.__actions__ || [];
        for (const action of actions) {
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
}
