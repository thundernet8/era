/// <reference types="node" />
/// <reference types="koa-bodyparser" />
import 'reflect-metadata';
import Koa from 'koa';
import * as fs from 'fs';
import * as path from 'path';
import merge from 'deepmerge';
import clc from 'cli-color';
import bootstrap from './core/Bootstrap';
import { IEraContext as RawContextT } from './context';
import { IEraState as RawStateT } from './state';
import { IEraConfig as RawConfigT } from './config';
import { BaseKV, AppOption, EraFilter } from './core/interfaces';
import { Logger } from './core';
import { FilterRegistry } from './core/registry';

const yellow = clc.xterm(3);

export * from './core';

export interface EraApplication<StateT = RawStateT, ContextT = RawContextT>
    extends Koa<StateT, ContextT> {
    test: number;
}

export type CombinedEraInstance<
    Instance extends EraApplication,
    Props
> = Props & Instance;

export interface EraConstructor<V extends EraApplication = EraApplication> {
    new <Props>(): CombinedEraInstance<V, Props>;
}

export class EraApplication<
    StateT = RawStateT,
    ContextT = RawContextT
> extends Koa<StateT, ContextT> {
    /**
     * 应用名
     */
    name = '';

    /**
     * 应用环境
     */
    env: string = '';

    /**
     * 默认logger
     */
    logger!: Logger;

    /**
     * Dependency Injection logger
     */
    diLogger!: Logger;

    /**
     * Middleware logger
     */
    middlewareLogger!: Logger;

    config!: RawConfigT & AppOption;

    readonly projectRoot: string = path.resolve(process.cwd());

    public useFilter(filter: EraFilter) {
        FilterRegistry.registerForGlobal(filter);
    }

    public async run(options?: AppOption, beforeInit?: Function) {
        try {
            await this.init(options);
            if (beforeInit && typeof beforeInit === 'function') {
                await beforeInit();
            }
            const port = this.config.port;
            if (!this.config.notListen) {
                await new Promise(resolve => {
                    this.listen(port, () => {
                        resolve();
                        this.logger.log(
                            `Server start listen at http://127.0.0.1:${port}`
                        );
                    });
                });
            }
        } catch (e) {
            this.onStartUpError(e);
        }
    }

    private async init(options: AppOption = {}) {
        const name = options.name || 'App';
        this.logger = new Logger(name);
        this.diLogger = new Logger('DependencyInjection');
        this.middlewareLogger = new Logger('Middleware');
        // 设定环境
        this.loadEnv();
        // 加载配置
        this.loadConfig(options);
        // 加载路由/控制器/服务
        bootstrap(this as any);
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
        config.port = config.port || process.env.PORT || 8080;
        this.config = config as RawConfigT & AppOption;
        if (options.name) {
            this.name = options.name;
        }
    }

    private onStartUpError(e: Error) {
        console.error(e);
        process.exit(1);
    }
}

export interface Era {
    Context: RawContextT;
    State: RawStateT;
}

export const Era: EraConstructor = {} as any;

export default EraApplication;

declare module 'koa' {
    export class Application extends EraApplication {
        _customizeAppProp: string;
    }

    interface Request {
        body?: any;
        rawBody: string;
    }
}
