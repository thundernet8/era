import { Constructor, EraMiddleware } from '../interfaces';
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
export declare function Controller(prefix?: string, options?: ControllerDecoratorOptions): (target: Constructor<any>) => any;
interface MethodDecoratorOptions {
    /**
     * 路由方法scoped的中间件
     */
    middlewares?: Constructor<EraMiddleware>[];
}
/**
 * 请求装饰器，适用所有类型请求
 * @param route 请求路径
 */
export declare function HttpAll(route: string, options?: MethodDecoratorOptions): (target: any, name: string) => void;
/**
 * GET请求装饰器
 * @param route 请求路径
 */
export declare function HttpGet(route: string, options?: MethodDecoratorOptions): (target: any, name: string) => void;
/**
 * POST请求装饰器
 * @param route 请求路径
 */
export declare function HttpPost(route: string, options?: MethodDecoratorOptions): (target: any, name: string) => void;
/**
 * PUT请求装饰器
 * @param route 请求路径
 */
export declare function HttpPut(route: string, options?: MethodDecoratorOptions): (target: any, name: string) => void;
/**
 * PATCH请求装饰器
 * @param route 请求路径
 */
export declare function HttpPatch(route: string, options?: MethodDecoratorOptions): (target: any, name: string) => void;
/**
 * DELETE请求装饰器
 * @param route 请求路径
 */
export declare function HttpDelete(route: string, options?: MethodDecoratorOptions): (target: any, name: string) => void;
export {};
