import { autoInjectable, container } from 'tsyringe';
import { Constructor, EraMiddleware, HttpMethod } from '../interfaces';
import { ActionRegistry, ActionMetadata } from './ActionRegistry';

class ControllerMetadata {
    public readonly type: Constructor;

    public routePrefix: string;

    public middlewares: Constructor<EraMiddleware>[];

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
        const controllerMetadata = this.resolveControllerMetadata(controller);
        controllerMetadata.routePrefix = routePrefix;
        controllerMetadata.middlewares = middlewares || [];
        const newTarget = autoInjectable()(controller);
        container.register(newTarget, newTarget);
        return newTarget;
    }

    public static registerAction(
        controller: Constructor,
        actionName: string,
        httpMethod: HttpMethod,
        path: string
    ) {
        const controllerMetadata = this.resolveControllerMetadata(controller);
        const actionMetadata = ActionRegistry.resolveActionMetadata(
            controller,
            actionName
        );

        actionMetadata.routes.push({
            method: httpMethod,
            path
        });

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

    public static resolveController(controller: Constructor) {}
}
