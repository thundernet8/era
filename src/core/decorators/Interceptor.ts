import {
    EraInterceptor,
    EraInterceptorClass,
    Constructor
} from '../interfaces';
import { InterceptorRegistry } from '../registry';
import { isClass, isObject } from '../utils';

/**
 * 拦截器装饰器
 */
export function Interceptor() {
    return (target: EraInterceptor) => {
        InterceptorRegistry.register(target);
    };
}

/**
 * 为控制器或控制器方法添加拦截器
 * @param interceptor
 */
export function UseInterceptors(...interceptors: EraInterceptor[]) {
    return (target: any, name?: string, ...rest) => {
        if (isClass(target)) {
            InterceptorRegistry.registerForController(target, interceptors);
        }
        if (
            isObject(target) &&
            name &&
            typeof target[name] === 'function' &&
            rest.length === 0
        ) {
            InterceptorRegistry.registerForAction(
                target.constructor as Constructor,
                name,
                interceptors
            );
        }
        throw new Error(
            `UseInterceptors decorator can only be use for a controller class or a route method`
        );
    };
}
