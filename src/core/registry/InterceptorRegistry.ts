import { container, injectable } from 'tsyringe';
import {
    Constructor,
    EraInterceptor,
    EraInterceptorClass,
    EraInterceptorLambda
} from '../interfaces';
import { IEraConfig } from '../../config';
import { isClass } from '../utils';
import { ActionMetadata, ActionRegistry } from '../registry';
import { ActionExecutor } from '../helpers';

export class InterceptorMetadata {
    public readonly type: EraInterceptor;

    public readonly action: ActionMetadata | Function;

    constructor(type: EraInterceptor, action: ActionMetadata | Function) {
        this.type = type;
        this.action = action;
    }
}

export class InterceptorRegistry {
    private static interceptors: Map<
        EraInterceptor,
        InterceptorMetadata
    > = new Map();

    private static globalUsedInterceptors: InterceptorMetadata[] = [];

    private static controllerUsedInterceptors: Map<
        Constructor,
        InterceptorMetadata[]
    > = new Map();

    private static actionUsedInterceptors: Map<
        Constructor,
        Map<string, InterceptorMetadata>
    > = new Map();

    public static register(type: EraInterceptor) {
        let interceptorMetadata = this.interceptors.get(type);
        if (!interceptorMetadata) {
            if (isClass(type)) {
                injectable()(type as Constructor<EraInterceptorClass>);
                container.register(
                    type as Constructor<EraInterceptorClass>,
                    type as Constructor<EraInterceptorClass>
                );
            }
            const action = isClass(type)
                ? ActionRegistry.resolveActionMetadata(
                      type as Constructor<EraInterceptorClass>,
                      'intercept'
                  )
                : (type as EraInterceptorLambda);
            interceptorMetadata = new InterceptorMetadata(type, action);
            this.interceptors.set(type, interceptorMetadata);
        }
    }

    private static resolveInterceptorMetadata(filter: EraInterceptor) {
        let interceptorMetadata = this.interceptors.get(filter);
        if (!interceptorMetadata) {
            this.register(filter);
            interceptorMetadata = this.interceptors.get(filter);
        }

        return interceptorMetadata;
    }

    public static registerForGlobal(filter: EraInterceptor) {
        const interceptorMetadata = this.resolveInterceptorMetadata(filter);
        if (
            interceptorMetadata &&
            this.globalUsedInterceptors.indexOf(interceptorMetadata) < 0
        ) {
            this.globalUsedInterceptors.push(interceptorMetadata);
        }
    }

    public static registerForController(
        controller: Constructor,
        interceptors: EraInterceptor[]
    ) {
        for (const interceptor of interceptors) {
            const interceptorMetadata = this.resolveInterceptorMetadata(
                interceptor
            );
            if (interceptorMetadata) {
                const controllerInterceptorMetadatas =
                    this.controllerUsedInterceptors.get(controller) || [];
                if (
                    controllerInterceptorMetadatas.indexOf(
                        interceptorMetadata
                    ) < 0
                ) {
                    controllerInterceptorMetadatas.push(interceptorMetadata);
                }
                this.controllerUsedInterceptors.set(
                    controller,
                    controllerInterceptorMetadatas
                );
            }
        }
    }

    public static registerForAction(
        controller: Constructor,
        actionName: string,
        interceptors: EraInterceptor[]
    ) {
        for (const interceptor of interceptors) {
            const interceptorMetadata = this.resolveInterceptorMetadata(
                interceptor
            );
            if (interceptorMetadata) {
                const interceptorMetadataMap =
                    this.actionUsedInterceptors.get(controller) || new Map();
                const interceptorMetadatas =
                    interceptorMetadataMap.get(actionName) || [];
                if (interceptorMetadatas.indexOf(interceptorMetadata) < 0) {
                    interceptorMetadatas.push(interceptorMetadata);
                }
                interceptorMetadataMap.set(actionName, interceptorMetadatas);
                this.actionUsedInterceptors.set(
                    controller,
                    interceptorMetadataMap
                );
            }
        }
    }

    public static getInterceptors(controller: Constructor, actionName: string) {
        const controllerInterceptors: InterceptorMetadata[] =
            this.controllerUsedInterceptors.get(controller) || [];
        let actionInterceptors;
        if (this.actionUsedInterceptors.get(controller)) {
            actionInterceptors =
                this.actionUsedInterceptors.get(controller)!.get(actionName) ||
                [];
        } else {
            actionInterceptors = [];
        }
        return (<InterceptorMetadata[]>[])
            .concat(this.globalUsedInterceptors)
            .concat(controllerInterceptors)
            .concat(actionInterceptors);
    }

    public static resolveInterceptorHandler(
        interceptor: InterceptorMetadata
    ): EraInterceptorLambda {
        if (typeof interceptor.action === 'function') {
            return interceptor.type as EraInterceptorLambda;
        }
        return async (ctx, next) => {
            return ActionExecutor.exec(
                interceptor.action as ActionMetadata,
                ctx,
                next
            );
        };
    }
}
