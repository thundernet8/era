import { EntityOptions } from 'typeorm';
import { inject } from 'tsyringe';
import { Constructor } from '../interfaces';
import { ModelRegistry } from '../registry';

/**
 * 数据模型装饰器
 */
export function Model(name?: string, options: EntityOptions = {}) {
    return (target: Constructor<any>) => {
        ModelRegistry.register(target, name, options);
    };
}

/**
 * 从Service 构造器参数注入model
 * @param model
 */
export function InjectModel(model: Constructor) {
    return inject(model);
}
