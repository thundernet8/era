import { autoInjectable, container } from 'tsyringe';
import { Constructor } from '../interfaces/constructor';

/**
 * 中间件装饰器
 */
export function Middleware() {
    return (target: Constructor<any>) => {
        const newTarget = autoInjectable()(target);
        container.register(newTarget, newTarget);
        return newTarget;
    };
}
