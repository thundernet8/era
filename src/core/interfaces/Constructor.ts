import { IEraContext } from '../../context';
import { IEraConfig } from '../../config';
import EraApplication from '../../app';
import { HttpException } from '../exceptions';

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
    use: EraMiddlewareLambda;
}

export type EraMiddlewareLambda = (
    ctx: IEraContext,
    next: () => Promise<any>
) => Promise<any>;

export type EraMiddlewareLambdaFactory = (
    appConfig: IEraConfig,
    app: EraApplication
) => EraMiddlewareLambda;

export type EraMiddleware =
    | Constructor<EraMiddlewareClass>
    | EraMiddlewareLambdaFactory;

export interface EraExceptionFilterClass {
    name?: string;
    catch: EraExceptionFilterLambda;
}

export type EraExceptionFilterLambda = (
    exception: HttpException,
    ctx: IEraContext
) => Promise<any> | any;

export type EraFilter =
    | Constructor<EraExceptionFilterClass>
    | EraExceptionFilterLambda;

export interface EraInterceptorClass {
    name?: string;
    intercept: EraInterceptorLambda;
}

export type EraInterceptorLambda = (
    ctx: IEraContext,
    next: () => Promise<any>
) => Promise<any>;

export type EraInterceptor =
    | Constructor<EraInterceptorClass>
    | EraInterceptorLambda;
