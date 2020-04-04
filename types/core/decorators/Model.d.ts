import { EntityOptions } from 'typeorm';
import { Constructor } from '../interfaces';
/**
 * 数据模型装饰器
 */
export declare function Model(name?: string, options?: EntityOptions): (target: Constructor<any>) => void;
/**
 * 从Service 构造器参数注入model
 * @param model
 */
export declare function InjectModel(model: Constructor): (target: any, propertyKey: string | symbol, parameterIndex: number) => any;
