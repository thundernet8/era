import { Constructor, MiddlewareDecoratorOptions } from '../interfaces';
/**
 * 中间件装饰器
 */
export declare function Middleware(options?: MiddlewareDecoratorOptions): (target: Constructor<any>) => void;
