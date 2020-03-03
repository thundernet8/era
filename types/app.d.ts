import 'reflect-metadata';
import Koa from 'koa';
import { IEagleContext as RawContextT } from './context';
import { IEagleState as RawStateT } from './state';
import { IEagleConfig as RawConfigT } from './config';
import { AppOption } from './core/interfaces/app-option';
export * from './core';
export interface EagleApplication<StateT = RawStateT, ContextT = RawContextT> extends Koa<StateT, ContextT> {
    test: number;
}
export declare type CombinedEagleInstance<Instance extends EagleApplication, Props> = Props & Instance;
export interface EagleConstructor<V extends EagleApplication = EagleApplication> {
    new <Props>(): CombinedEagleInstance<V, Props>;
}
export declare class EagleApplication<StateT = RawStateT, ContextT = RawContextT> extends Koa<StateT, ContextT> {
    /**
     * 应用名
     */
    name: string;
    /**
     * 应用环境
     */
    env: string;
    config: RawConfigT & AppOption;
    readonly projectRoot: string;
    private init;
    run(options?: AppOption, beforeInit?: Function): Promise<void>;
    private loadEnv;
    private loadConfig;
    private onStartUpError;
}
export interface Eagle {
    Context: RawContextT;
    State: RawStateT;
}
export declare const Eagle: EagleConstructor;
export default EagleApplication;
declare module 'koa' {
    class Application extends EagleApplication {
        xyz: string;
    }
    interface Request {
        body?: any;
        rawBody: string;
    }
}
