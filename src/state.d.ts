import Koa from 'koa';

export interface IEraState extends Koa.DefaultState {
    _customizeStateProp: string;
}
