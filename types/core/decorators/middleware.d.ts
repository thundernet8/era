import { Constructor, MiddlewareScope } from '../interfaces';
/**
 * 中间件装饰器
 */
export declare function Middleware(scope?: MiddlewareScope): (target: Constructor<any>) => any;
