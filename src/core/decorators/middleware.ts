import { autoInjectable, container } from 'tsyringe';
import { Constructor, MiddlewareDecoratorOptions } from '../interfaces';
import { MiddlewareRegistry } from '../registry';

/**
 * 中间件装饰器
 */
export function Middleware(options: MiddlewareDecoratorOptions = {}) {
    return (target: Constructor<any>) => {
        return MiddlewareRegistry.register(target, options);
    };
}
