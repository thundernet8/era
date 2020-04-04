import { ConnectionOptions } from 'typeorm';

export interface IEraConfig {
    /**
     * 应用环境
     */
    readonly env?: string;
    /**
     * koa-requestid的选项
     */
    requestId?: {
        expose?: string | false;
        header?: string | false;
        query?: string | false;
    };
    /**
     * typeorm 连接数据库信息
     */
    db?: ConnectionOptions;
    _customizeConfigProp?: string;
}
