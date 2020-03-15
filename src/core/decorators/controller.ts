import { autoInjectable, container } from 'tsyringe';
import { HttpMethod, Constructor, EraMiddleware } from '../interfaces';

function normalizePath(path: string) {
    if (!path) return '';
    if (!path.startsWith('/')) {
        path = `/${path}`;
    }
    return path;
}

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
        target.prototype.__route_prefix__ = normalizePath(prefix);
        target.prototype.__middlewares__ = options.middlewares || [];
        const newTarget = autoInjectable()(target);
        container.register(newTarget, newTarget);
        return newTarget;
    };
}

interface MethodDecoratorOptions {
    /**
     * 路由方法scoped的中间件
     */
    middlewares?: Constructor<EraMiddleware>[];
}

/**
 * 请求方法装饰器工厂方法
 */
function HttpBaseMethod(
    route: string,
    method: HttpMethod,
    middlewares: Constructor<EraMiddleware>[] = []
) {
    return (target: any, name: string) => {
        const proto = target.constructor.prototype;
        if (!proto.__actions__) {
            proto.__actions__ = [];
        }
        if (!proto.__action_middlewares__) {
            proto.__action_middlewares__ = [];
        }
        proto.__actions__.push({
            method,
            handler: name,
            route: normalizePath(route)
        });
        proto.__action_middlewares__[name] = middlewares;
    };
}

/**
 * 请求装饰器，适用所有类型请求
 * @param route 请求路径
 */
export function HttpAll(route: string, options: MethodDecoratorOptions = {}) {
    return HttpBaseMethod(route, HttpMethod.All, options.middlewares);
}

/**
 * GET请求装饰器
 * @param route 请求路径
 */
export function HttpGet(route: string, options: MethodDecoratorOptions = {}) {
    return HttpBaseMethod(route, HttpMethod.Get, options.middlewares);
}

/**
 * POST请求装饰器
 * @param route 请求路径
 */
export function HttpPost(route: string, options: MethodDecoratorOptions = {}) {
    return HttpBaseMethod(route, HttpMethod.Post, options.middlewares);
}

/**
 * PUT请求装饰器
 * @param route 请求路径
 */
export function HttpPut(route: string, options: MethodDecoratorOptions = {}) {
    return HttpBaseMethod(route, HttpMethod.Put, options.middlewares);
}

/**
 * PATCH请求装饰器
 * @param route 请求路径
 */
export function HttpPatch(route: string, options: MethodDecoratorOptions = {}) {
    return HttpBaseMethod(route, HttpMethod.Patch, options.middlewares);
}

/**
 * DELETE请求装饰器
 * @param route 请求路径
 */
export function HttpDelete(
    route: string,
    options: MethodDecoratorOptions = {}
) {
    return HttpBaseMethod(route, HttpMethod.Delete, options.middlewares);
}
