import Koa from 'koa';
import { IRouterParamContext } from 'koa-router';
import { IEraState } from './state';

export interface IEraContext extends IRouterParamContext<IEraState> {}

export interface IEraContext extends Koa.Context {
    requestId: string;
    _customizeContextProp: string;
    [key: string]: any;
}
