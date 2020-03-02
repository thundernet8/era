/// <reference types="koa-bodyparser" />
import Koa from 'koa';
import { IEagleContext as RawContext } from './context';
import { IEagleState as RawStateT } from './state';
import { IEagleConfig as RawConfigT } from './config';
export interface EagleApplication<ConfigT = {}, StateT = {}, ContextT = {}> {
    _appprop: string;
}
export declare type CombinedEagleInstance<Instance extends EagleApplication, Props> = Props & Instance;
export interface EagleConstructor<V extends EagleApplication = EagleApplication> {
    new <Props>(): CombinedEagleInstance<V, Props>;
}
export declare class EagleApplication<ConfigT, StateT = {}, ContextT = {}> extends Koa<RawStateT & StateT, RawContext & ContextT> {
    /**
     * 应用名
     */
    name: string;
    /**
     * 应用环境
     */
    env: string;
    config: RawConfigT & ConfigT;
    constructor();
}
