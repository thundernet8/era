import { Constructor } from '../interfaces/constructor';
/**
 * 控制器装饰器
 * @param prefix 路由前缀
 */
export declare function Controller(prefix?: string): (target: Constructor<any>) => void;
/**
 * 请求装饰器，适用所有类型请求
 * @param route 请求路径
 */
export declare function HttpAll(route: string): (target: any, name: string) => void;
/**
 * GET请求装饰器
 * @param route 请求路径
 */
export declare function HttpGet(route: string): (target: any, name: string) => void;
/**
 * POST请求装饰器
 * @param route 请求路径
 */
export declare function HttpPost(route: string): (target: any, name: string) => void;
/**
 * PUT请求装饰器
 * @param route 请求路径
 */
export declare function HttpPut(route: string): (target: any, name: string) => void;
/**
 * PATCH请求装饰器
 * @param route 请求路径
 */
export declare function HttpPatch(route: string): (target: any, name: string) => void;
/**
 * DELETE请求装饰器
 * @param route 请求路径
 */
export declare function HttpDelete(route: string): (target: any, name: string) => void;
