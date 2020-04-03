import { MiddlewareDecoratorOptions, EraMiddleware } from '../interfaces';
/**
 * 中间件装饰器
 */
export declare function Middleware(options?: MiddlewareDecoratorOptions): (target: EraMiddleware) => void;
/**
 * 为控制器添加中间件
 * @param middleware
 */
export declare function UseMiddlewares(...middlewares: EraMiddleware[]): (target: any) => never;
