import { ConnectionOptions } from 'typeorm';
import { AppOption } from './core/interfaces';

type InnerMiddleware = 'requestId' | 'responseTime' | 'bodyParser' | 'static';

export interface IEraConfig extends AppOption {
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
    /**
     * 启用的内置中间件
     */
    coreMiddlewares?: InnerMiddleware[];
}
