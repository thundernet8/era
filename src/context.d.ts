import Koa from 'koa';
import { IRouterParamContext } from 'koa-router';
import { IEraState } from './state';

export interface IEraContext extends IRouterParamContext<IEraState> {}

export interface IEraContext extends Koa.Context {
    // params: any;
    _customizeContextProp: string;
    [key: string]: any;
}
