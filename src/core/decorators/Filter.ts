import {
    FilterDecoratorOptions,
    EraFilter,
    EraFilterClass,
    Constructor
} from '../interfaces';
import { FilterRegistry } from '../registry';
import { isClass, isObject } from '../utils';

/**
 * 过滤器装饰器
 */
export function Filter(options: FilterDecoratorOptions = {}) {
    return (target: Constructor<EraFilterClass>) => {
        FilterRegistry.register(target, options);
    };
}

/**
 * 为控制器或控制器方法添加过滤器
 * @param filter
 */
export function useFilter(filter: EraFilter) {
    return (target: any, name?: string, ...rest) => {
        if (isClass(target)) {
            FilterRegistry.registerForController(target, filter);
        }
        if (
            isObject(target) &&
            name &&
            typeof target[name] === 'function' &&
            rest.length === 0
        ) {
            FilterRegistry.registerForAction(
                target.constructor as Constructor,
                name,
                filter
            );
        }
        throw new Error(
            `useFilter decorator can only be use for a class or a method of class`
        );
    };
}
