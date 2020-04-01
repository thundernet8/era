import { FilterDecoratorOptions, EraFilter, EraFilterClass, Constructor } from '../interfaces';
/**
 * 过滤器装饰器
 */
export declare function Filter(options?: FilterDecoratorOptions): (target: Constructor<EraFilterClass>) => void;
/**
 * 为控制器或控制器方法添加过滤器
 * @param filter
 */
export declare function useFilter(filter: EraFilter): (target: any, name?: string | undefined, ...rest: any[]) => never;
