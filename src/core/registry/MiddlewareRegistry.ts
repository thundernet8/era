import { container, injectable } from 'tsyringe';
import {
    Constructor,
    MiddlewareDecoratorOptions,
    EraMiddleware,
    EraMiddlewareClass,
    EraMiddlewareLambda
} from '../interfaces';
import { ActionMetadata, ActionRegistry } from './ActionRegistry';
import { IEraConfig } from '../../config';
import { isClass } from '../utils';
import { ActionExecutor } from '../helpers';

export class MiddlewareMetadata {
    public readonly type: EraMiddleware;

    public readonly paths: string[];

    public priority: number;

    public readonly checkEnable: (...args) => boolean;

    public readonly action: ActionMetadata | Function;

    constructor(
        type: EraMiddleware,
        action: ActionMetadata | Function,
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
        EraMiddleware,
        MiddlewareMetadata
    > = new Map();

    private static globalUsedMiddlewares: MiddlewareMetadata[] = [];

    private static controllerUsedMiddlewares: Map<
        Constructor,
        MiddlewareMetadata[]
    > = new Map();

    public static register(
        type: EraMiddleware,
        options: MiddlewareDecoratorOptions = {}
    ) {
        let middlewareMetadata = this.middlewares.get(type);
        if (!middlewareMetadata) {
            if (isClass(type)) {
                injectable()(type as Constructor<EraMiddlewareClass>);
                container.register(
                    type as Constructor<EraMiddlewareClass>,
                    type as Constructor<EraMiddlewareClass>
                );
            }
            const action = isClass(type)
                ? ActionRegistry.resolveActionMetadata(
                      type as Constructor<EraMiddlewareClass>,
                      'use'
                  )
                : (type as EraMiddlewareLambda);
            if (action instanceof ActionMetadata) {
                action.isMiddlewareAction = true;
            }
            middlewareMetadata = new MiddlewareMetadata(type, action, options);
            this.middlewares.set(type, middlewareMetadata);
        }
    }

    private static resolveMiddlewareMetadata(middleware: EraMiddleware) {
        let middlewareMetadata = this.middlewares.get(middleware);
        if (!middlewareMetadata) {
            this.register(middleware);
            middlewareMetadata = this.middlewares.get(middleware);
        }

        return middlewareMetadata;
    }

    public static registerForGlobal(middleware: EraMiddleware) {
        const middlewareMetadata = this.resolveMiddlewareMetadata(middleware);
        if (
            middlewareMetadata &&
            this.globalUsedMiddlewares.indexOf(middlewareMetadata) < 0
        ) {
            this.globalUsedMiddlewares.push(middlewareMetadata);
        }
    }

    public static registerForController(
        controller: Constructor,
        middlewares: EraMiddleware[]
    ) {
        for (const middleware of middlewares) {
            const middlewareMetadata = this.resolveMiddlewareMetadata(
                middleware
            );
            if (middlewareMetadata) {
                const controllerMiddlewareMetadatas =
                    this.controllerUsedMiddlewares.get(controller) || [];
                if (
                    controllerMiddlewareMetadatas.indexOf(middlewareMetadata) <
                    0
                ) {
                    controllerMiddlewareMetadatas.push(middlewareMetadata);
                }
                this.controllerUsedMiddlewares.set(
                    controller,
                    controllerMiddlewareMetadatas
                );
            }
        }
    }

    public static getGlobalMiddlewares(appConfig: IEraConfig) {
        const middlewares: MiddlewareMetadata[] = [];
        // 默认启用的中间件作为全局中间件
        this.middlewares.forEach(middleware => {
            if (middleware.checkEnable(appConfig)) {
                middlewares.push(middleware);
            }
        });
        // app.useMiddleware注册的中间件强制启用并作为全局中间件
        this.globalUsedMiddlewares.forEach(middleware => {
            if (middlewares.indexOf(middleware) < 0) {
                middlewares.push(middleware);
            }
        });
        return middlewares.sort((a, b) => a.priority - b.priority);
    }

    public static getControllerMiddlewares(controller: Constructor) {
        return this.controllerUsedMiddlewares.get(controller) || [];
    }

    public static getMiddleware(type: EraMiddleware) {
        return this.middlewares.get(type);
    }

    public static resolveMiddlewareHandler(
        middleware: MiddlewareMetadata
    ): EraMiddlewareLambda {
        if (typeof middleware.action === 'function') {
            return middleware.type as EraMiddlewareLambda;
        }
        return async (ctx, next) => {
            return ActionExecutor.exec(
                middleware.action as ActionMetadata,
                ctx,
                next
            );
        };
    }
}
