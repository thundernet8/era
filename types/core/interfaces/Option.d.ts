import bodyParser from 'koa-bodyparser';
import EraApplication from '../../app';
import { IEraConfig } from '../../config';
import { Constructor } from './Constructor';
/**
 * koa-static中间件的选项
 */
interface StaticOption {
    /**
     * 静态资源文件夹相对于app文件夹的路径，默认public
     */
    root?: string;
    maxage?: number;
    hidden?: boolean;
    index?: string;
    defer?: boolean;
    gzip?: boolean;
    setHeaders?: (...args: any[]) => any;
    extensions?: string[] | false;
}
export interface AppOption {
    name?: string;
    env?: string;
    notListen?: boolean;
    /**
     * 应用监听端口，默认8080，本地环境会在端口被占用时尝试更换可用端口
     */
    port?: number;
    /**
     * 视图模板文件夹相对于app文件夹的路径，默认view
     */
    viewDir?: string;
    /**
     * 静态资源中间件选项
     */
    static?: StaticOption;
    /**
     * koa-bodyparser的选项
     */
    bodyParserOptions?: bodyParser.Options;
}
export interface ParamDecoratorOptions {
    required?: boolean;
    defaultValue?: any;
}
export interface MiddlewareDecoratorOptions {
    /**
     * 中间件优先级，数值越低优先被执行，默认10
     */
    priority?: number;
    /**
     * 路由匹配，使用koa路由格式
     */
    match?: string[];
    /**
     * 是否启用，默认是
     */
    enable?: boolean | MiddlewareEnableFunction;
}
declare type MiddlewareEnableFunction = (config: IEraConfig, app: EraApplication) => boolean;
export interface ServiceDecoratorOptions {
    singleton?: boolean;
    injectToken?: string | Constructor;
}
export {};
