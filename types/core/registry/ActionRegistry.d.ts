import { Constructor, ParamType, ParamDecoratorOptions, ActionRoute } from '../../core/interfaces';
declare class ActionParamMetadata {
    readonly controller: Constructor;
    readonly actionName: string;
    readonly returnType: Constructor;
    readonly index: number;
    /**
     * 当参数没有类型装饰器时无法获得paramType
     */
    readonly paramType: ParamType | undefined;
    /**
     * 当参数没有类型装饰器时无法获得表达式名
     */
    readonly expression: string | undefined;
    readonly defaultValue: any;
    readonly required: boolean;
    readonly isDecorated: boolean;
    constructor(controller: Constructor, actionName: string, index: number, returnType: Constructor, paramType?: ParamType, expression?: string, isDecorated?: boolean, options?: ParamDecoratorOptions);
}
export declare class ActionMetadata {
    readonly actionName: string;
    readonly type: Constructor;
    routes: ActionRoute[];
    private _params;
    get params(): Map<number, ActionParamMetadata>;
    set params(value: Map<number, ActionParamMetadata>);
    constructor(type: Constructor, actionName: string, params?: Map<number, ActionParamMetadata>);
}
export declare class ActionRegistry {
    static readonly handlers: Map<Constructor, Map<string, ActionMetadata>>;
    /**
     * 控制器方法参数类型装饰器调用来注册参数的元信息
     * @param type
     * @param actionName
     * @param index
     * @param paramType
     * @param expression
     * @param options
     */
    static registerParam(type: Constructor, actionName: string, index: number, paramType: ParamType, expression: string, options?: ParamDecoratorOptions): void;
    static resolveActionMetadata(type: Constructor, actionName: string): ActionMetadata;
}
export {};
