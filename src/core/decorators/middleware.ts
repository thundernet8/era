import { autoInjectable, container } from 'tsyringe';
import { Constructor, MiddlewareScope } from '../interfaces';

/**
 * 中间件装饰器
 */
export function Middleware(scope: MiddlewareScope = 'All') {
    return (target: Constructor<any>) => {
        target.prototype.scope = scope;
        const newTarget = autoInjectable()(target);
        container.register(newTarget, newTarget);
        return newTarget;
    };
}
