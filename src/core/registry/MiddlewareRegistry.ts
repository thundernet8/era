import { container, injectable } from 'tsyringe';
import {
    Constructor,
    MiddlewareDecoratorOptions,
    EraMiddleware
} from '../interfaces';
import { ActionMetadata, ActionRegistry } from './ActionRegistry';
import { IEraConfig } from '../../config';

export class MiddlewareMetadata {
    public readonly type: Constructor;

    public readonly paths: string[];

    public priority: number;

    public readonly checkEnable: (...args) => boolean;

    public readonly action: ActionMetadata;

    constructor(
        type: Constructor,
        action: ActionMetadata,
        options: MiddlewareDecoratorOptions = {}
    ) {
        this.type = type;
        this.action = action;
        if (typeof options.priority !== 'undefined') {
            this.priority = options.priority;
        } else {
            this.priority = 10;
        }

        if (typeof options.enable === 'boolean') {
            this.checkEnable = () => !!options.enable;
        } else if (typeof options.enable === 'function') {
            this.checkEnable = options.enable;
        } else {
            this.checkEnable = () => true;
        }

        if (Array.isArray(options.match)) {
            this.paths = options.match;
        } else {
            this.paths = ['(.*)'];
        }
    }
}

export class MiddlewareRegistry {
    private static middlewares: Map<
        Constructor,
        MiddlewareMetadata
    > = new Map();

    public static register(
        type: Constructor,
        options: MiddlewareDecoratorOptions
    ) {
        injectable()(type);
        container.register(type, type);
        let middlewareMetadata = this.middlewares.get(type);
        if (!middlewareMetadata) {
            container.register(type, type);
            const action = ActionRegistry.resolveActionMetadata(type, 'use');
            action.isMiddlewareAction = true;
            middlewareMetadata = new MiddlewareMetadata(type, action, options);
            this.middlewares.set(type, middlewareMetadata);
        }

        return type;
    }

    // public static resolve(type: Constructor) {
    //     return container.resolve<EraMiddleware>(type);
    // }

    public static getMiddlewares(appConfig: IEraConfig) {
        const middlewares: MiddlewareMetadata[] = [];
        this.middlewares.forEach(middleware => {
            if (middleware.checkEnable(appConfig)) {
                middlewares.push(middleware);
            }
        });
        return middlewares.sort((a, b) => a.priority - b.priority);
    }

    public static getMiddleware(type: Constructor) {
        return this.middlewares.get(type);
    }
}
