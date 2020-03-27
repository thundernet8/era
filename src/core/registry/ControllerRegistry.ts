import { autoInjectable, container } from 'tsyringe';
import {
    Constructor,
    EraMiddleware,
    HttpMethod,
    IController
} from '../interfaces';
import { ActionRegistry, ActionMetadata } from './ActionRegistry';
import { MiddlewareMetadata, MiddlewareRegistry } from './MiddlewareRegistry';

class ControllerMetadata {
    public readonly type: Constructor;

    public routePrefix: string;

    public middlewares: MiddlewareMetadata[];

    public readonly actions: Map<string, ActionMetadata>;

    constructor(type: Constructor) {
        this.type = type;
        this.routePrefix = '';
        this.middlewares = [];
        this.actions = new Map();
    }
}

export class ControllerRegistry {
    private static readonly controllers: Map<
        Constructor,
        ControllerMetadata
    > = new Map();

    public static registerController(
        controller: Constructor,
        routePrefix: string,
        middlewares?: Constructor<EraMiddleware>[]
    ) {
        const newTarget = autoInjectable()(controller);
        container.register(newTarget, newTarget);
        if (!this.controllers.get(newTarget)) {
            const controllerMetadata = this.resolveControllerMetadata(
                newTarget
            );
            controllerMetadata.routePrefix = routePrefix || '/';
            controllerMetadata.middlewares = (middlewares || []).map(
                middleware => {
                    return MiddlewareRegistry.getMiddleware(middleware)!;
                }
            );

            this.controllers.set(newTarget, controllerMetadata);
        }

        return newTarget;
    }

    public static registerAction(
        controller: Constructor,
        actionName: string,
        httpMethod: HttpMethod,
        paths: string[]
    ) {
        const controllerMetadata = this.resolveControllerMetadata(controller);
        const actionMetadata = ActionRegistry.resolveActionMetadata(
            controller,
            actionName
        );

        for (const path of paths) {
            actionMetadata.routes.push({
                method: httpMethod,
                path
            });
        }

        controllerMetadata.actions.set(actionName, actionMetadata);
    }

    public static resolveControllerMetadata(controller: Constructor) {
        let controllerMetadata = this.controllers.get(controller);

        if (typeof controllerMetadata === 'undefined') {
            controllerMetadata = new ControllerMetadata(controller);
            this.controllers.set(controller, controllerMetadata);
        }

        return controllerMetadata;
    }

    public static resolveController(controller: Constructor) {
        return container.resolve<IController>(controller);
    }

    public static getControllers() {
        return Array.from(this.controllers.values());
    }
}
