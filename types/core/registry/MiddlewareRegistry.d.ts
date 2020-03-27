import { Constructor, MiddlewareDecoratorOptions } from '../interfaces';
import { ActionMetadata } from './ActionRegistry';
import { IEraConfig } from '../../config';
export declare class MiddlewareMetadata {
    readonly type: Constructor;
    readonly paths: string[];
    priority: number;
    readonly checkEnable: (...args: any[]) => boolean;
    readonly action: ActionMetadata;
    constructor(type: Constructor, action: ActionMetadata, options?: MiddlewareDecoratorOptions);
}
export declare class MiddlewareRegistry {
    private static middlewares;
    static register(type: Constructor, options: MiddlewareDecoratorOptions): any;
    static getMiddlewares(appConfig: IEraConfig): MiddlewareMetadata[];
    static getMiddleware(type: Constructor): MiddlewareMetadata | undefined;
}
