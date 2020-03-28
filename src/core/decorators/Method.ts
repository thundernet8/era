import { HttpMethod, Constructor, EraMiddleware } from '../interfaces';
import { normalizePath } from '../utils';
import { ControllerRegistry } from '../registry';

interface MethodDecoratorOptions {
    /**
     * 路由方法scoped的中间件
     */
    // middlewares?: Constructor<EraMiddleware>[]; // TODO remove
}

/**
 * 请求方法装饰器工厂方法
 */
function HttpBaseMethod(
    route: string | string[],
    method: HttpMethod,
    middlewares: Constructor<EraMiddleware>[] = []
) {
    return (target: any, name: string) => {
        const routes = Array.isArray(route) ? route : [route];
        ControllerRegistry.registerAction(
            target.constructor,
            name,
            method,
            routes.map(normalizePath)
        );
    };
}

/**
 * 请求装饰器，适用所有类型请求
 * @param route 请求路径
 */
export function HttpAll(
    route: string | string[],
    options: MethodDecoratorOptions = {}
) {
    return HttpBaseMethod(route, HttpMethod.All);
}

/**
 * GET请求装饰器
 * @param route 请求路径
 */
export function HttpGet(
    route: string | string[],
    options: MethodDecoratorOptions = {}
) {
    return HttpBaseMethod(route, HttpMethod.Get);
}

/**
 * POST请求装饰器
 * @param route 请求路径
 */
export function HttpPost(
    route: string | string[],
    options: MethodDecoratorOptions = {}
) {
    return HttpBaseMethod(route, HttpMethod.Post);
}

/**
 * PUT请求装饰器
 * @param route 请求路径
 */
export function HttpPut(
    route: string | string[],
    options: MethodDecoratorOptions = {}
) {
    return HttpBaseMethod(route, HttpMethod.Put);
}

/**
 * PATCH请求装饰器
 * @param route 请求路径
 */
export function HttpPatch(
    route: string | string[],
    options: MethodDecoratorOptions = {}
) {
    return HttpBaseMethod(route, HttpMethod.Patch);
}

/**
 * DELETE请求装饰器
 * @param route 请求路径
 */
export function HttpDelete(
    route: string | string[],
    options: MethodDecoratorOptions = {}
) {
    return HttpBaseMethod(route, HttpMethod.Delete);
}
