import { ParamType, Constructor, ParamDecoratorOptions } from '../interfaces';
import { ActionRegistry } from '../registry';

function registerParam(
    klass: Constructor<any>,
    paramType: ParamType,
    action: string,
    index: number,
    expression?: string,
    options?: ParamDecoratorOptions
) {
    ActionRegistry.registerParam(
        klass,
        action,
        index,
        paramType,
        expression || '',
        options
    );
}

export function Context() {
    return (target: any, action: string, index: number) => {
        registerParam(target.constructor, ParamType.Context, action, index);
    };
}

export function Next() {
    return (target: any, action: string, index: number) => {
        registerParam(target.constructor, ParamType.Next, action, index, '');
    };
}

export function Path(expression?: string, options?: ParamDecoratorOptions) {
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

export function Query(expression?: string, options?: ParamDecoratorOptions) {
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

export function Body(expression?: string, options?: ParamDecoratorOptions) {
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

export function Header(expression?: string, options?: ParamDecoratorOptions) {
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

export function Cookie(expression: string, options?: ParamDecoratorOptions) {
    return (target: any, action: string, index: number) => {
        registerParam(
            target.constructor,
            ParamType.Cookie,
            action,
            index,
            expression,
            options
        );
    };
}
