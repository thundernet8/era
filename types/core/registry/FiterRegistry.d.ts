import { Constructor, FilterDecoratorOptions, FilterPosition, EraFilter, EraFilterFunction } from '../interfaces';
import { ActionMetadata } from '../../core/registry';
export declare class FilterMetadata {
    readonly type: EraFilter;
    readonly paths: string[];
    readonly priority: number;
    readonly position: FilterPosition;
    readonly action: ActionMetadata | Function;
    constructor(type: EraFilter, action: ActionMetadata | Function, options?: FilterDecoratorOptions);
}
export declare class FilterRegistry {
    private static filters;
    private static globalUsedFilters;
    private static controllerUsedFilters;
    private static actionUsedFilters;
    static register(type: EraFilter, options?: FilterDecoratorOptions): void;
    private static resolveFilterMetadata;
    static registerForGlobal(filter: EraFilter): void;
    static registerForController(controller: Constructor, filter: EraFilter): void;
    static registerForAction(controller: Constructor, actionName: string, filter: EraFilter): void;
    static getFilters(controller: Constructor, actionName: string): FilterMetadata[];
    static getBeforeFilters(controller: Constructor, actionName: string): FilterMetadata[];
    static getAfterFilters(controller: Constructor, actionName: string): FilterMetadata[];
    static resolveFilterHandler(filter: FilterMetadata): EraFilterFunction;
}
