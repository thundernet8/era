/// <reference types="node" />
import Koa from 'koa';
import { IEagleContext as RawContext } from './context';
import { IEagleState as RawStateT } from './state';
import { IEagleConfig as RawConfigT } from './config';

export interface EagleApplication<ConfigT = {}, StateT = {}, ContextT = {}> {
    _appprop: string;
}

export type CombinedEagleInstance<Instance extends EagleApplication, Props> = Props & Instance;

// Data, Methods, Computed, Record<PropNames, any>
export interface EagleConstructor<V extends EagleApplication = EagleApplication> {
  new <Props>(): CombinedEagleInstance<V, Props>;
}

export class EagleApplication<ConfigT, StateT = {}, ContextT = {}> extends Koa<
    RawStateT & StateT,
    RawContext & ContextT
> {
    /**
     * 应用名
     */
    name = '';

    /**
     * 应用环境
     */
    env: string = '';

    config!: RawConfigT & ConfigT;

    constructor() {
        super();
        this.config = {} as RawConfigT & ConfigT;
    }
}
