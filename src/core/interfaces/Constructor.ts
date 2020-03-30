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

export interface EraMiddlewareClass extends Constructor {
    name?: string;
    use: EraMiddlewareFunction;
}

export type EraMiddlewareFunction = (ctx: IEraContext, next: Function) => void;

export type EraMiddleware = EraMiddlewareClass | EraMiddlewareFunction;

export interface EraFilterClass extends Constructor {
    name?: string;
    use: EraFilterFunction;
}

export type EraFilterFunction = (ctx: IEraContext, next: Function) => void;

export type EraFilter = EraFilterClass | EraFilterFunction;
