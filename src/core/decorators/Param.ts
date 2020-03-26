import { ParamType, Constructor, ParamDecoratorOptions } from '../interfaces';
import { ActionRegistry } from '../registry';

function registerParam(
    klass: Constructor<any>,
    paramType: ParamType,
    action: string,
    index: number,
    expression: string,
    options?: ParamDecoratorOptions
) {
    ActionRegistry.registerParam(
        klass,
        action,
        index,
        paramType,
        expression,
        options
    );
}

export function ContextParam(
    expression: string,
    options?: ParamDecoratorOptions
) {
    return (target: any, action: string, index: number) => {
        registerParam(
            target.constructor,
            ParamType.Context,
            action,
            index,
            expression,
            options
        );
    };
}

export function NextParam() {
    return (target: any, action: string, index: number) => {
        registerParam(target.constructor, ParamType.Next, action, index, '');
    };
}

export function PathParam(expression: string, options?: ParamDecoratorOptions) {
    return (target: any, action: string, index: number) => {
        registerParam(
            target.constructor,
            ParamType.Path,
            action,
            index,
            expression,
            options
        );
    };
}

export function QueryParam(
    expression: string,
    options?: ParamDecoratorOptions
) {
    return (target: any, action: string, index: number) => {
        registerParam(
            target.constructor,
            ParamType.Query,
            action,
            index,
            expression,
            options
        );
    };
}

export function BodyParam(
    expression?: string,
    options?: ParamDecoratorOptions
) {
    return (target: any, action: string, index: number) => {
        registerParam(
            target.constructor,
            ParamType.Body,
            action,
            index,
            expression || '',
            options
        );
    };
}

export function HeaderParam(
    expression: string,
    options?: ParamDecoratorOptions
) {
    return (target: any, action: string, index: number) => {
        registerParam(
            target.constructor,
            ParamType.Header,
            action,
            index,
            expression,
            options
        );
    };
}
