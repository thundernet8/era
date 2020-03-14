import { autoInjectable, container } from 'tsyringe';
import { HttpMethod } from '../interfaces/http-method';
import { Constructor } from '../interfaces/constructor';

function normalizePath(path: string) {
    if (!path) return '';
    if (!path.startsWith('/')) {
        path = `/${path}`;
    }
    return path;
}

/**
 * 控制器装饰器
 * @param prefix 路由前缀
 */
export function Controller(prefix: string = '') {
    return (target: Constructor<any>) => {
        target.prototype.__route_prefix__ = normalizePath(prefix);
        // controllerRegisterMetadata.set(target, target);
        const newTarget = autoInjectable()(target);
        container.register(newTarget, newTarget);
        return newTarget;
    };
}

/**
 * 请求方法装饰器工厂方法
 */
function HttpBaseMethod(route: string, method: HttpMethod) {
    return (target: any, name: string) => {
        const proto = target.constructor.prototype;
        if (!proto.__actions__) {
            proto.__actions__ = [];
        }
        proto.__actions__.push({
            method,
            handler: name,
            route: normalizePath(route)
        });
    };
}

/**
 * 请求装饰器，适用所有类型请求
 * @param route 请求路径
 */
export function HttpAll(route: string) {
    return HttpBaseMethod(route, HttpMethod.All);
}

/**
 * GET请求装饰器
 * @param route 请求路径
 */
export function HttpGet(route: string) {
    return HttpBaseMethod(route, HttpMethod.Get);
}

/**
 * POST请求装饰器
 * @param route 请求路径
 */
export function HttpPost(route: string) {
    return HttpBaseMethod(route, HttpMethod.Post);
}

/**
 * PUT请求装饰器
 * @param route 请求路径
 */
export function HttpPut(route: string) {
    return HttpBaseMethod(route, HttpMethod.Put);
}

/**
 * PATCH请求装饰器
 * @param route 请求路径
 */
export function HttpPatch(route: string) {
    return HttpBaseMethod(route, HttpMethod.Patch);
}

/**
 * DELETE请求装饰器
 * @param route 请求路径
 */
export function HttpDelete(route: string) {
    return HttpBaseMethod(route, HttpMethod.Delete);
}
