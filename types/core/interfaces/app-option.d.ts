import bodyParser from 'koa-bodyparser';
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
