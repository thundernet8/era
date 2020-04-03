import {
    FilterDecoratorOptions,
    EraFilter,
    EraExceptionFilterClass,
    Constructor
} from '../interfaces';
import { FilterRegistry } from '../registry';
import { isClass, isObject } from '../utils';

/**
 * 异常过滤器装饰器
 */
export function ExceptionFilter() {
    // options: FilterDecoratorOptions = {}
    return (target: EraFilter) => {
        FilterRegistry.register(target, {} /* options */);
    };
}

/**
 * 为控制器或控制器方法添加过滤器
 * @param filter
 */
export function UseFilters(...filters: EraFilter[]) {
    return (target: any, name?: string, ...rest) => {
        if (isClass(target)) {
            FilterRegistry.registerForController(target, filters);
        }
        // if (
        //     isObject(target) &&
        //     name &&
        //     typeof target[name] === 'function' &&
        //     rest.length === 0
        // ) {
        //     FilterRegistry.registerForAction(
        //         target.constructor as Constructor,
        //         name,
        //         filter
        //     );
        // }
        throw new Error(
            `UseFilters decorator can only be use for a controller class`
        );
    };
}
