import { HttpMethod, Constructor, EraMiddleware } from '../interfaces';
import { ControllerRegistry } from '../registry';
import { normalizePath } from '../utils';

interface ControllerDecoratorOptions {
    /**
     * 控制器scoped的中间件
     */
    middlewares?: Constructor<EraMiddleware>[];
}

/**
 * 控制器装饰器
 * @param prefix 路由前缀
 */
export function Controller(
    prefix: string = '',
    options: ControllerDecoratorOptions = {}
) {
    return (target: Constructor<any>) => {
        ControllerRegistry.registerController(
            target,
            normalizePath(prefix),
            options.middlewares || []
        );
    };
}
