import {
    HttpMethod,
    Constructor,
    EraMiddleware,
    EraFilter
} from '../interfaces';
import { ControllerRegistry, FilterRegistry } from '../registry';
import { normalizePath } from '../utils';

interface ControllerDecoratorOptions {
    /**
     * 控制器scoped的中间件
     */
    middlewares?: EraMiddleware[];
    /**
     * 控制器scoped的过滤器
     */
    filters?: EraFilter[];
}

/**
 * 控制器装饰器
 * @param prefix 路由前缀
 */
export function Controller(
    prefix: string = ''
    // options: ControllerDecoratorOptions = {}
) {
    return (target: Constructor<any>) => {
        ControllerRegistry.registerController(
            target,
            normalizePath(prefix)
            // options.middlewares || []
        );
        // if (options.filters && options.filters.length > 0) {
        //     for (const filter of options.filters) {
        //         FilterRegistry.registerForController(target, filter);
        //     }
        // }
    };
}
