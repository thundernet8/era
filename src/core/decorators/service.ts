import { Constructor, ServiceDecoratorOptions } from '../interfaces';
import { ServiceRegistry } from '../registry';

/**
 * 服务装饰器
 */
export function Service(options: ServiceDecoratorOptions = {}) {
    return (target: Constructor<any>) => {
        ServiceRegistry.register(target, options);
    };
}
