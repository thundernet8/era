import { container, injectable } from 'tsyringe';
import {
    Constructor,
    EraFilter,
    EraExceptionFilterClass,
    EraExceptionFilterLambda,
} from '../interfaces';
import { isClass } from '../utils';
import { ActionMetadata, ActionRegistry } from '../registry';

export class FilterMetadata {
    public readonly type: EraFilter;

    public readonly action: ActionMetadata | Function;

    constructor(type: EraFilter, action: ActionMetadata | Function) {
        this.type = type;
        this.action = action;
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

    public static register(type: EraFilter) {
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
            filterMetadata = new FilterMetadata(type, action);
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
        return filters;
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
