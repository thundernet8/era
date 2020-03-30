import {
    FilterDecoratorOptions,
    EraFilter,
    EraFilterClass
} from '../interfaces';
import { FilterRegistry } from '../registry';
import { isClass } from '../utils';
import { isObject } from 'util';

/**
 * 过滤器装饰器
 */
export function Filter(options: FilterDecoratorOptions = {}) {
    return (target: EraFilterClass) => {
        FilterRegistry.register(target, options);
    };
}

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
            FilterRegistry.registerForAction(target.constructor, name, filter);
        }
        throw new Error(
            `useFilter decorator can only be use for a class or a method of class`
        );
    };
}
