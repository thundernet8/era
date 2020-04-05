import { MiddlewareDecoratorOptions, EraMiddleware } from '../interfaces';
import { MiddlewareRegistry } from '../registry';
import { isClass } from '../utils';

/**
 * 中间件装饰器
 */
export function Middleware(options: MiddlewareDecoratorOptions = {}) {
    return (target: EraMiddleware) => {
        MiddlewareRegistry.register(target, options);
    };
}

/**
 * 为控制器添加中间件
 * @param middleware
 */
export function UseMiddlewares(...middlewares: EraMiddleware[]) {
    return (target: any) => {
        if (isClass(target)) {
            MiddlewareRegistry.registerForController(target, middlewares);
        }
        throw new Error(
            `UseMiddlewares decorator can only be use for a controller class`
        );
    };
}
