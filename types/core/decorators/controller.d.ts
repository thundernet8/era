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
export {};
