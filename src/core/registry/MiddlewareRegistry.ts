import { container, injectable } from 'tsyringe';
import {
    Constructor,
    MiddlewareDecoratorOptions,
    EraMiddleware,
    EraMiddlewareClass,
    EraMiddlewareFunction
} from '../interfaces';
import { ActionMetadata, ActionRegistry } from './ActionRegistry';
import { IEraConfig } from '../../config';
import { isClass } from '../utils';
import { ActionExecutor } from 'core/helpers';

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

    private static globalUsedFilters: MiddlewareMetadata[] = [];

    private static controllerUsedFilters: Map<
        Constructor,
        MiddlewareMetadata[]
    > = new Map();

    public static register(
        type: EraMiddleware,
        options: MiddlewareDecoratorOptions
    ) {
        let middlewareMetadata = this.middlewares.get(type);
        if (!middlewareMetadata) {
            if (isClass(type)) {
                injectable()(type as EraMiddlewareClass);
                container.register(
                    type as EraMiddlewareClass,
                    type as EraMiddlewareClass
                );
            }
            const action = isClass(type)
                ? ActionRegistry.resolveActionMetadata(
                      type as EraMiddlewareClass,
                      'use'
                  )
                : (type as EraMiddlewareFunction);
            // action.isMiddlewareAction = true; // TODO
            middlewareMetadata = new MiddlewareMetadata(type, action, options);
            this.middlewares.set(type, middlewareMetadata);
        }
    }

    private static resolveMiddlewareMetadata(middleware: EraMiddleware) {
        let filterMetadata = this.middlewares.get(middleware);
        if (!filterMetadata) {
            this.register(filter);
            filterMetadata = this.filters.get(filter);
        }

        return filterMetadata;
    }

    public static registerForGlobal(middleware: EraMiddleware) {
        const filterMetadata = this.resolveMiddlewareMetadata(filter);
        if (
            filterMetadata &&
            this.globalUsedFilters.indexOf(filterMetadata) < 0
        ) {
            this.globalUsedFilters.push(filterMetadata);
        }
    }

    public static registerForController(
        controller: Constructor,
        filter: EraFilter
    ) {
        const filterMetadata = this.resolveFilterMetadata(filter);
        if (filterMetadata) {
            const controllerFilterMetadatas =
                this.controllerUsedFilters.get(controller) || [];
            if (controllerFilterMetadatas.indexOf(filterMetadata) < 0) {
                controllerFilterMetadatas.push(filterMetadata);
            }
            this.controllerUsedFilters.set(
                controller,
                controllerFilterMetadatas
            );
        }
    }

    public static getMiddlewares(appConfig: IEraConfig) {
        const middlewares: MiddlewareMetadata[] = [];
        this.middlewares.forEach(middleware => {
            if (middleware.checkEnable(appConfig)) {
                middlewares.push(middleware);
            }
        });
        return middlewares.sort((a, b) => a.priority - b.priority);
    }

    public static getMiddleware(type: EraMiddleware) {
        return this.middlewares.get(type);
    }

    public static resolveMiddlewareHandler(
        middleware: MiddlewareMetadata
    ): EraMiddlewareFunction {
        if (typeof middleware.action === 'function') {
            return middleware.type as EraMiddlewareFunction;
        }
        return (ctx, next) => {
            ActionExecutor.exec(middleware.action as ActionMetadata, ctx, next);
        };
    }
}
