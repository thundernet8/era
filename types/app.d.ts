import 'reflect-metadata';
import Koa from 'koa';
import { IEraContext as RawContextT } from './context';
import { IEraState as RawStateT } from './state';
import { IEraConfig as RawConfigT } from './config';
import { AppOption } from './core/interfaces/app-option';
import { Logger } from './core/services';
export * from './core';
export interface EraApplication<StateT = RawStateT, ContextT = RawContextT> extends Koa<StateT, ContextT> {
    test: number;
}
export declare type CombinedEraInstance<Instance extends EraApplication, Props> = Props & Instance;
export interface EraConstructor<V extends EraApplication = EraApplication> {
    new <Props>(): CombinedEraInstance<V, Props>;
}
export declare class EraApplication<StateT = RawStateT, ContextT = RawContextT> extends Koa<StateT, ContextT> {
    /**
     * 应用名
     */
    name: string;
    /**
     * 应用环境
     */
    env: string;
    /**
     * 默认logger
     */
    logger: Logger;
    config: RawConfigT & AppOption;
    readonly projectRoot: string;
    private init;
    run(options?: AppOption, beforeInit?: Function): Promise<void>;
    private loadEnv;
    private loadConfig;
    private onStartUpError;
}
export interface Era {
    Context: RawContextT;
    State: RawStateT;
}
export declare const Era: EraConstructor;
export default EraApplication;
declare module 'koa' {
    class Application extends EraApplication {
        xyz: string;
    }
    interface Request {
        body?: any;
        rawBody: string;
    }
}
