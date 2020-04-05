import { Constructor, EraMiddleware, EraFilter } from '../interfaces';
import { ControllerRegistry } from '../registry';
import { normalizePath } from '../utils';

/**
 * 控制器装饰器
 * @param prefix 路由前缀
 */
export function Controller(prefix: string = '') {
    return (target: Constructor<any>) => {
        ControllerRegistry.registerController(target, normalizePath(prefix));
    };
}
