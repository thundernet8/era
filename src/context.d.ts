import Koa from 'koa';

export interface IEagleContext extends Koa.Context {
    _contextprop: string;
}