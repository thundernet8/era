import { Constructor } from '../interfaces';
/**
 * 控制器装饰器
 * @param prefix 路由前缀
 */
export declare function Controller(prefix?: string): (target: Constructor<any>) => void;
