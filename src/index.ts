/// <reference types="node" />
import Koa from 'koa';
import { ContextT as RawContext } from './context';
import { StateT as RawStateT } from './state';
import { ConfigT as RawConfigT } from './config';

export default class Eagle<ConfigT, StateT = {}, ContextT = {}> extends Koa<
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
