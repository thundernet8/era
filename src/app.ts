/// <reference types="node" />
/// <reference types="koa-bodyparser" />
import 'reflect-metadata';
import Koa from 'koa';
import * as accepts from "accepts";
import * as Cookies from "cookies";
import { EventEmitter } from "events";
import { IncomingMessage, ServerResponse, Server } from "http";
import { Http2ServerRequest, Http2ServerResponse } from 'http2';
import httpAssert = require("http-assert");
import * as Keygrip from "keygrip";
import * as compose from "koa-compose";
import { Socket, ListenOptions } from "net";
import * as url from "url";
import * as fs from 'fs';
import * as path from 'path';
import merge from 'deepmerge';
import { IEagleContext as RawContextT } from './context';
import { IEagleState as RawStateT } from './state';
import { IEagleConfig as RawConfigT } from './config';
import { BaseKV } from './core/interfaces/kit';
import { AppOption } from './core/interfaces/app-option';
import bootstrap from './core/bootstrap';

export * from './core';

export interface EagleApplication<StateT = RawStateT, ContextT = RawContextT> extends Koa<StateT, ContextT> {
    test: number;
}

export type CombinedEagleInstance<
    Instance extends EagleApplication,
    Props
> = Props & Instance;

export interface EagleConstructor<
    V extends EagleApplication = EagleApplication
> {
    new <Props>(): CombinedEagleInstance<V, Props>;
}

export class EagleApplication<StateT = RawStateT, ContextT = RawContextT> extends Koa<StateT, ContextT> {
    /**
     * 应用名
     */
    name = '';

    /**
     * 应用环境
     */
    env: string = '';

    config!: RawConfigT & AppOption;

    readonly projectRoot: string = path.resolve(process.cwd());

    private async init(options?: AppOption) {
        this.loadEnv();
        this.loadConfig(options);
        // 加载路由/控制器/服务
        bootstrap(this as any);
        // TODO 基础服务和中间件挂载
    }

    async run(options?: AppOption, beforeInit?: Function) {
        try {
            await this.init(options);
            if (beforeInit && typeof beforeInit === 'function') {
                await beforeInit();
            }
            const port = this.config.port || 8080;
            if (!this.config.notListen) {
                await new Promise(resolve => {
                    this.listen(port, () => {
                        resolve();
                        console.log(
                            `Server start listen at http://127.0.0.1:${port}`
                        );
                    });
                });
            }
        } catch (e) {
            this.onStartUpError(e);
        }
    }

    private loadEnv() {
        let rawEnv: string = process.env.APP_ENV || '';
        let formatEnv = '';
        if (!rawEnv) {
            const envFilePath = path.join(this.projectRoot, 'config/env');
            if (
                fs.existsSync(envFilePath) &&
                fs.statSync(envFilePath).isFile()
            ) {
                rawEnv = fs.readFileSync(envFilePath).toString();
            }
        }
        // 可用环境列表local/dev/stag/test/prod
        const envMap = {
            local: 'local',
            dev: 'dev',
            develop: 'dev',
            development: 'dev',
            test: 'test',
            stag: 'stag',
            staging: 'stag',
            prod: 'prod',
            production: 'prod'
        };
        if (!Object.keys(envMap).includes(rawEnv || '')) {
            rawEnv = process.env.NODE_ENV === 'production' ? 'dev' : 'local';
        }
        formatEnv = envMap[rawEnv];
        process.env.SERVER_ENV = formatEnv;
        if (!process.env.APP_ENV) {
            process.env.APP_ENV = formatEnv;
        }
        this.env = formatEnv;
    }

    private loadConfig(options: AppOption = {}) {
        let defaultConfig: BaseKV = {};
        let envBasedConfig: BaseKV = {};
        try {
            defaultConfig = require(path.join(
                this.projectRoot,
                'config/config.default'
            ));
            if (defaultConfig.default) {
                defaultConfig = defaultConfig.default;
            }
        } catch (e) {}
        try {
            envBasedConfig = require(path.join(
                this.projectRoot,
                `config/config.${this.env}`
            ));
            if (envBasedConfig.default) {
                envBasedConfig = envBasedConfig.default;
            }
        } catch (e) {}
        const config = merge(merge(defaultConfig, envBasedConfig), options);
        config.env = this.env;
        this.config = config as RawConfigT & AppOption;
        if (options.name) {
            this.name = options.name;
        }
    }

    private onStartUpError(e: Error) {
        console.log(e);
        process.exit(1);
    }
}

export interface Eagle {
    Context: RawContextT;
    State: RawStateT;
}

export const Eagle: EagleConstructor = {} as any;

export default EagleApplication;

declare module 'koa' {
    export class Application extends EagleApplication {
        xyz: string;
    }

    interface Request {
        body?: any;
        rawBody: string;
    }
}