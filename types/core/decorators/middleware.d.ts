import { Constructor, MiddlewareDecoratorOptions, EraMiddlewareClass, EraMiddleware } from '../interfaces';
/**
 * 中间件装饰器
 */
export declare function Middleware(options?: MiddlewareDecoratorOptions): (target: Constructor<EraMiddlewareClass>) => void;
/**
 * 为控制器添加中间件
 * @param middleware
 */
export declare function useMiddleware(middleware: EraMiddleware): (target: any) => never;
