import Koa from 'koa';

export interface IEraContext extends Koa.Context {
    _contextprop: string;
}
