import { Constructor, EraInterceptor, EraInterceptorLambda } from '../interfaces';
import { ActionMetadata } from '../registry';
export declare class InterceptorMetadata {
    readonly type: EraInterceptor;
    readonly action: ActionMetadata | Function;
    constructor(type: EraInterceptor, action: ActionMetadata | Function);
}
export declare class InterceptorRegistry {
    private static interceptors;
    private static globalUsedInterceptors;
    private static controllerUsedInterceptors;
    private static actionUsedInterceptors;
    static register(type: EraInterceptor): void;
    private static resolveInterceptorMetadata;
    static registerForGlobal(filter: EraInterceptor): void;
    static registerForController(controller: Constructor, interceptors: EraInterceptor[]): void;
    static registerForAction(controller: Constructor, actionName: string, interceptors: EraInterceptor[]): void;
    static getInterceptors(controller: Constructor, actionName: string): InterceptorMetadata[];
    static resolveInterceptorHandler(interceptor: InterceptorMetadata): EraInterceptorLambda;
}
