import bodyParser from 'koa-bodyparser';
import { IEraConfig } from '../../config';
export interface AppOption {
    name?: string;
    env?: string;
    notListen?: boolean;
    /**
     * 应用监听端口，默认8080，本地环境会在端口被占用时尝试更换可用端口
     */
    port?: number;
    /**
     * 视图模板文件夹相对于app文件夹的路径，默认views
     */
    viewDir?: string;
    /**
     * 静态资源文件夹相对于app文件夹的路径，默认public
     */
    staticDir?: string;
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
declare type MiddlewareEnableFunction = (config: IEraConfig) => boolean;
export interface FilterDecoratorOptions {
    /**
     * 过滤器优先级，数值越低优先被执行，默认10
     */
    priority?: number;
    /**
     * 路由匹配，使用koa路由格式
     */
    match?: string[];
    /**
     * 过滤器作用于请求上下文位置，默认before，即在请求处理前
     */
    position?: FilterPosition;
}
export declare type FilterPosition = 'before' | 'after';
export {};
