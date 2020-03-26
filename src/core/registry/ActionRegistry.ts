import {
    Constructor,
    ParamType,
    ParamDecoratorOptions,
    ActionRoute
} from '../../core/interfaces';
import { Reflection } from '../../core/helpers';
import { arrayToMap } from '../../core/utils';

class ActionParamMetadata {
    public readonly controller: Constructor;

    public readonly actionName: string;

    public readonly returnType: Constructor;

    public readonly index: number;

    /**
     * 当参数没有类型装饰器时无法获得paramType
     */
    public readonly paramType: ParamType | undefined;

    /**
     * 当参数没有类型装饰器时无法获得表达式名
     */
    public readonly expression: string | undefined;

    public readonly defaultValue: any;

    public readonly required: boolean;

    constructor(
        controller: Constructor,
        actionName: string,
        index: number,
        returnType: Constructor,
        paramType?: ParamType,
        expression?: string,
        options: ParamDecoratorOptions = {}
    ) {
        this.controller = controller;
        this.actionName = actionName;
        this.returnType = returnType;
        this.index = index;
        // paramType和expression在解析参数装饰器时设置
        if (typeof paramType !== 'undefined') {
            this.paramType = paramType;
        }
        if (typeof expression !== 'undefined') {
            this.expression = expression;
        }
        if (typeof options.defaultValue !== 'undefined') {
            this.defaultValue = options.defaultValue;
        }
        if (typeof options.required !== 'undefined') {
            this.required = options.required;
        } else {
            this.required = false;
        }
    }
}

export class ActionMetadata {
    public readonly actionName: string;

    public readonly controller: Constructor;

    public routes: ActionRoute[];

    private _params: Map<number, ActionParamMetadata>;

    get params() {
        return this._params;
    }

    set params(value: Map<number, ActionParamMetadata>) {
        this._params = value;
    }

    // get httpMethodAndPaths(): HTTPMethodAndPath[] {
    //     return this._httpMethodAndPaths;
    // }

    constructor(
        controller: Constructor,
        actionName: string,
        params?: Map<number, ActionParamMetadata>
    ) {
        this.controller = controller;
        this.actionName = actionName;

        if (typeof params !== 'undefined') {
            this._params = params;
        } else {
            this._params = new Map();
        }
        this.routes = [];
    }
}

export class ActionRegistry {
    public static readonly handlers: Map<
        Constructor,
        Map<string, ActionMetadata>
    > = new Map();

    /**
     * 控制器方法参数类型装饰器调用来注册参数的元信息
     * @param controller
     * @param actionName
     * @param index
     * @param paramType
     * @param expression
     * @param options
     */
    public static registerParam(
        controller: Constructor,
        actionName: string,
        index: number,
        paramType: ParamType,
        expression: string,
        options?: ParamDecoratorOptions
    ) {
        const actionMetadata = this.resolveActionMetadata(
            controller,
            actionName
        );
        const params = Reflection.getParams(controller.prototype, actionName);
        const returnType = params[index];

        const paramMetadata = new ActionParamMetadata(
            controller,
            actionName,
            index,
            returnType,
            paramType,
            expression,
            options
        );
        actionMetadata.params.set(index, paramMetadata);
    }

    public static resolveActionMetadata(
        controller: Constructor,
        actionName: string
    ) {
        let actionStore = this.handlers.get(controller);

        if (typeof actionStore === 'undefined') {
            actionStore = new Map();
            this.handlers.set(controller, actionStore);
        }

        let actionMetadata = actionStore.get(actionName);

        if (typeof actionMetadata === 'undefined') {
            actionMetadata = new ActionMetadata(controller, actionName);

            const params = Reflection.getParams(
                controller.prototype,
                actionName
            );

            if (params) {
                const actionParams = params.map(
                    (returnType, index) =>
                        new ActionParamMetadata(
                            controller,
                            actionName,
                            index,
                            returnType
                        )
                );
                const actionParamsMap: Map<
                    number,
                    ActionParamMetadata
                > = arrayToMap(actionParams);
                actionMetadata.params = actionParamsMap;
            }

            actionStore.set(actionName, actionMetadata);
        }

        return actionMetadata;
    }
}
