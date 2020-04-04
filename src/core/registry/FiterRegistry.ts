import { container, injectable } from 'tsyringe';
import {
    Constructor,
    FilterDecoratorOptions,
    FilterPosition,
    EraFilter,
    EraExceptionFilterClass,
    EraExceptionFilterLambda
} from '../interfaces';
import { IEraConfig } from '../../config';
import { isClass } from '../utils';
import { ActionMetadata, ActionRegistry } from '../registry';
import { ActionExecutor } from '../helpers';

export class FilterMetadata {
    public readonly type: EraFilter;

    public readonly paths: string[];

    public readonly priority: number;

    public readonly position: FilterPosition;

    public readonly action: ActionMetadata | Function;

    constructor(
        type: EraFilter,
        action: ActionMetadata | Function,
        options: FilterDecoratorOptions = {}
    ) {
        this.type = type;
        this.action = action;
        if (typeof options.priority !== 'undefined') {
            this.priority = options.priority;
        } else {
            this.priority = 10;
        }

        if (Array.isArray(options.match)) {
            this.paths = options.match;
        } else {
            this.paths = ['(.*)'];
        }

        if (options.position === 'after') {
            this.position = 'after';
        } else {
            this.position = 'before';
        }
    }
}

export class FilterRegistry {
    private static filters: Map<EraFilter, FilterMetadata> = new Map();

    private static globalUsedFilters: FilterMetadata[] = [];

    private static controllerUsedFilters: Map<
        Constructor,
        FilterMetadata[]
    > = new Map();

    private static actionUsedFilters: Map<
        Constructor,
        Map<string, FilterMetadata>
    > = new Map();

    public static register(
        type: EraFilter,
        options: FilterDecoratorOptions = {}
    ) {
        let filterMetadata = this.filters.get(type);
        if (!filterMetadata) {
            if (isClass(type)) {
                injectable()(type as Constructor<EraExceptionFilterClass>);
                container.register(
                    type as Constructor<EraExceptionFilterClass>,
                    type as Constructor<EraExceptionFilterClass>
                );
            }
            const action = isClass(type)
                ? ActionRegistry.resolveActionMetadata(
                      type as Constructor<EraExceptionFilterClass>,
                      'catch'
                  )
                : (type as EraExceptionFilterLambda);
            filterMetadata = new FilterMetadata(type, action, options);
            this.filters.set(type, filterMetadata);
        }
    }

    private static resolveFilterMetadata(filter: EraFilter) {
        let filterMetadata = this.filters.get(filter);
        if (!filterMetadata) {
            this.register(filter);
            filterMetadata = this.filters.get(filter);
        }

        return filterMetadata;
    }

    public static registerForGlobal(filter: EraFilter) {
        const filterMetadata = this.resolveFilterMetadata(filter);
        if (
            filterMetadata &&
            this.globalUsedFilters.indexOf(filterMetadata) < 0
        ) {
            this.globalUsedFilters.push(filterMetadata);
        }
    }

    public static registerForController(
        controller: Constructor,
        filters: EraFilter[]
    ) {
        for (const filter of filters) {
            const filterMetadata = this.resolveFilterMetadata(filter);
            if (filterMetadata) {
                const controllerFilterMetadatas =
                    this.controllerUsedFilters.get(controller) || [];
                if (controllerFilterMetadatas.indexOf(filterMetadata) < 0) {
                    controllerFilterMetadatas.push(filterMetadata);
                }
                this.controllerUsedFilters.set(
                    controller,
                    controllerFilterMetadatas
                );
            }
        }
    }

    // public static registerForAction(
    //     controller: Constructor,
    //     actionName: string,
    //     filter: EraFilter
    // ) {
    //     const filterMetadata = this.resolveFilterMetadata(filter);
    //     if (filterMetadata) {
    //         const filterMetadataMap =
    //             this.actionUsedFilters.get(controller) || new Map();
    //         const filterMetadatas = filterMetadataMap.get(actionName) || [];
    //         if (filterMetadatas.indexOf(filterMetadata) < 0) {
    //             filterMetadatas.push(filterMetadata);
    //         }
    //         filterMetadataMap.set(actionName, filterMetadatas);
    //         this.actionUsedFilters.set(controller, filterMetadataMap);
    //     }
    // }

    public static getFilters(controller: Constructor, actionName: string) {
        const controllerFilters: FilterMetadata[] =
            this.controllerUsedFilters.get(controller) || [];
        let actionFilters;
        if (this.actionUsedFilters.get(controller)) {
            actionFilters =
                this.actionUsedFilters.get(controller)!.get(actionName) || [];
        } else {
            actionFilters = [];
        }
        const filters = (<FilterMetadata[]>[])
            .concat(this.globalUsedFilters)
            .concat(controllerFilters)
            .concat(actionFilters);
        return filters.sort((a, b) => a.priority - b.priority);
    }

    public static resolveFilterHandler(
        filter: FilterMetadata
    ): EraExceptionFilterLambda {
        if (typeof filter.action === 'function') {
            return filter.type as EraExceptionFilterLambda;
        }
        return async (exception, ctx) => {
            const metadata = <ActionMetadata>filter.action;
            const instance = container.resolve(metadata.type);
            return instance[metadata.actionName](exception, ctx);
        };
    }
}