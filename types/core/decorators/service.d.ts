import { Constructor, ServiceDecoratorOptions } from '../interfaces';
/**
 * 服务装饰器
 */
export declare function Service(options?: ServiceDecoratorOptions): (target: Constructor<any>) => void;
