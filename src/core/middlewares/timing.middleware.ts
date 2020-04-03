import responseTime from 'koa-response-time';
import { EraMiddlewareClass } from '../interfaces';
import { Middleware } from '../decorators';
import { IEraContext } from '../../context';

@Middleware({
    priority: 0
})
export class ResponseTimeMiddleware implements EraMiddlewareClass {
    async use(ctx: IEraContext, next) {
        return responseTime({
            hrtime: false
        })(ctx, next);
    }
}
