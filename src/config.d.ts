export interface IEraConfig {
    /**
     * 应用环境
     */
    env: string;
    /**
     * koa-requestid的选项
     */
    requestId?: {
        expose?: string | false;
        header?: string | false;
        query?: string | false;
    };
    _customizeConfigProp: string;
}
