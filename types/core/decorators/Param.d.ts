import { ParamDecoratorOptions } from '../interfaces';
export declare function Context(): (target: any, action: string, index: number) => void;
export declare function Next(): (target: any, action: string, index: number) => void;
export declare function Path(expression?: string, options?: ParamDecoratorOptions): (target: any, action: string, index: number) => void;
export declare function Query(expression?: string, options?: ParamDecoratorOptions): (target: any, action: string, index: number) => void;
export declare function Body(expression?: string, options?: ParamDecoratorOptions): (target: any, action: string, index: number) => void;
export declare function Header(expression?: string, options?: ParamDecoratorOptions): (target: any, action: string, index: number) => void;
export declare function Cookie(expression: string, options?: ParamDecoratorOptions): (target: any, action: string, index: number) => void;
