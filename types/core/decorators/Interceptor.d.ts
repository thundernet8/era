import { EraInterceptor } from '../interfaces';
/**
 * 拦截器装饰器
 */
export declare function Interceptor(): (target: EraInterceptor) => void;
/**
 * 为控制器或控制器方法添加拦截器
 * @param interceptor
 */
export declare function UseInterceptors(...interceptors: EraInterceptor[]): (target: any, name?: string | undefined, ...rest: any[]) => never;
