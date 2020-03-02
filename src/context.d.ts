import Koa from 'koa';

export interface IEagleContext extends Koa.DefaultContext {
    _contextprop: string;
}