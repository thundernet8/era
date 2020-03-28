import { Constructor } from '../interfaces';
import { ServiceRegistry } from '../registry';

/**
 * 服务装饰器
 */
export function Service() {
    return (target: Constructor<any>) => {
        ServiceRegistry.register(target);
    };
}
