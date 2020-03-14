import { autoInjectable, container } from 'tsyringe';
import { Constructor } from '../interfaces/constructor';

/**
 * 服务装饰器
 */
export function Service() {
    return (target: Constructor<any>) => {
        const newTarget = autoInjectable()(target);
        container.register(newTarget, newTarget);
        return newTarget;
    };
}