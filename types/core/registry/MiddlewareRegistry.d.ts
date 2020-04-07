import { Constructor, MiddlewareDecoratorOptions, EraMiddleware, EraMiddlewareLambda } from '../interfaces';
import { ActionMetadata } from './ActionRegistry';
import EraApplication from '../../app';
export declare class MiddlewareMetadata {
    readonly type: EraMiddleware;
    readonly paths: string[];
    priority: number;
    readonly checkEnable: (...args: any[]) => boolean;
    readonly action: ActionMetadata | Function;
    constructor(type: EraMiddleware, action: ActionMetadata | Function, options?: MiddlewareDecoratorOptions);
}
export declare class MiddlewareRegistry {
    private static middlewares;
    private static globalUsedMiddlewares;
    private static controllerUsedMiddlewares;
    static register(type: EraMiddleware, options?: MiddlewareDecoratorOptions): void;
    private static resolveMiddlewareMetadata;
    static registerForGlobal(middleware: EraMiddleware): void;
    static registerForController(controller: Constructor, middlewares: EraMiddleware[]): void;
    static getGlobalMiddlewares(app: EraApplication): MiddlewareMetadata[];
    static getControllerMiddlewares(controller: Constructor): MiddlewareMetadata[];
    static getMiddleware(type: EraMiddleware): MiddlewareMetadata | undefined;
    static resolveMiddlewareHandler(middleware: MiddlewareMetadata, app: EraApplication): EraMiddlewareLambda;
}
