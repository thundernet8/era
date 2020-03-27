import { IEraContext } from '../../context';
export declare type MiddlewareScope = 'App' | 'Controller' | 'Method' | 'All';
export interface EraMiddleware {
    name?: string;
    /**
     * 中间件的应用生效scope
     * 当中间件指定scope后，在不正确的scope使用将抛出异常
     */
    scope?: MiddlewareScope;
    use(ctx: IEraContext, next: Function): void;
}