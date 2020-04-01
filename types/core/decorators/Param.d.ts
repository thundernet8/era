import { ParamDecoratorOptions } from '../interfaces';
export declare function ContextParam(): (target: any, action: string, index: number) => void;
export declare function NextParam(): (target: any, action: string, index: number) => void;
export declare function PathParam(expression?: string, options?: ParamDecoratorOptions): (target: any, action: string, index: number) => void;
export declare function QueryParam(expression?: string, options?: ParamDecoratorOptions): (target: any, action: string, index: number) => void;
export declare function BodyParam(expression?: string, options?: ParamDecoratorOptions): (target: any, action: string, index: number) => void;
export declare function HeaderParam(expression?: string, options?: ParamDecoratorOptions): (target: any, action: string, index: number) => void;
