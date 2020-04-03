import { IEraContext } from '../../context';
import EraApplication from '../../app';
import { HttpException } from '../exceptions';
export declare type Constructor<T = any> = {
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
export declare type EraMiddlewareLambda = (ctx: IEraContext, next: Function) => Promise<any>;
export declare type EraMiddleware = Constructor<EraMiddlewareClass> | EraMiddlewareLambda;
export interface EraExceptionFilterClass {
    name?: string;
    catch: EraExceptionFilterLambda;
}
export declare type EraExceptionFilterLambda = (exception: HttpException, ctx: IEraContext) => Promise<any> | any;
export declare type EraFilter = Constructor<EraExceptionFilterClass> | EraExceptionFilterLambda;
export interface EraInterceptorClass {
    name?: string;
    intercept: EraInterceptorLambda;
}
export declare type EraInterceptorLambda = (ctx: IEraContext, next: Function) => Promise<any>;
export declare type EraInterceptor = Constructor<EraInterceptorClass> | EraInterceptorLambda;
