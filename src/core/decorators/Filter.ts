import { EraFilter } from '../interfaces';
import { FilterRegistry } from '../registry';
import { isClass } from '../utils';

/**
 * 异常过滤器装饰器
 */
export function ExceptionFilter() {
    // options: FilterDecoratorOptions = {}
    return (target: EraFilter) => {
        FilterRegistry.register(target);
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
        throw new Error(
            `UseFilters decorator can only be use for a controller class`
        );
    };
}
