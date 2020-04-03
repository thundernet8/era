import { EraFilter } from '../interfaces';
/**
 * 异常过滤器装饰器
 */
export declare function ExceptionFilter(): (target: EraFilter) => void;
/**
 * 为控制器或控制器方法添加过滤器
 * @param filter
 */
export declare function UseFilters(...filters: EraFilter[]): (target: any, name?: string | undefined, ...rest: any[]) => never;
