import responseTime from 'koa-response-time';
import { EraMiddlewareClass } from '../interfaces';
import { Middleware } from '../decorators';
import { IEraContext } from '../../context';

@Middleware({
    priority: 0,
    enable(options) {
        return (options.coreMiddlewares || []).indexOf('responseTime') > -1;
    },
})
export class ResponseTimeMiddleware implements EraMiddlewareClass {
    async use(ctx: IEraContext, next) {
        return responseTime({
            hrtime: false,
        })(ctx, next);
    }
}
