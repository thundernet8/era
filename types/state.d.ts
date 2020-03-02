import Koa from 'koa';

export interface IEagleState extends Koa.DefaultState {
    _stateprop: string;
}