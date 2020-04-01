import { IEraContext } from '../../context';
import EraApplication from '../../app';

export type Constructor<T = any> = {
    new (...args: any[]): T;
};

export interface IController {
    ctx: IEraContext;
    app: EraApplication;
}

export interface IService {
    ctx: IEraContext;
    app: EraApplication;
}

export interface EraMiddlewareClass {
    name?: string;
    use: EraMiddlewareFunction;
}

export type EraMiddlewareFunction = (
    ctx: IEraContext,
    next: Function
) => Promise<any>;

export type EraMiddleware =
    | Constructor<EraMiddlewareClass>
    | EraMiddlewareFunction;

export interface EraFilterClass {
    name?: string;
    use: EraFilterFunction;
}

export type EraFilterFunction = (
    ctx: IEraContext,
    next: Function
) => Promise<any>;

export type EraFilter = Constructor<EraFilterClass> | EraFilterFunction;
