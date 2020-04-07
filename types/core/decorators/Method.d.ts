/**
 * 请求装饰器，适用所有类型请求
 * @param route 请求路径
 */
export declare function HttpAll(route: string | string[]): (target: any, name: string) => void;
/**
 * GET请求装饰器
 * @param route 请求路径
 */
export declare function HttpGet(route: string | string[]): (target: any, name: string) => void;
/**
 * POST请求装饰器
 * @param route 请求路径
 */
export declare function HttpPost(route: string | string[]): (target: any, name: string) => void;
/**
 * PUT请求装饰器
 * @param route 请求路径
 */
export declare function HttpPut(route: string | string[]): (target: any, name: string) => void;
/**
 * PATCH请求装饰器
 * @param route 请求路径
 */
export declare function HttpPatch(route: string | string[]): (target: any, name: string) => void;
/**
 * DELETE请求装饰器
 * @param route 请求路径
 */
export declare function HttpDelete(route: string | string[]): (target: any, name: string) => void;
