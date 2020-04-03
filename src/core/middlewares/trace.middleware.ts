import requestId from 'koa-requestid';
import { EraMiddlewareClass } from '../interfaces';
import { Middleware } from '../decorators';
import { IEraContext } from '../../context';

@Middleware()
export class TraceMiddleware implements EraMiddlewareClass {
    async use(ctx: IEraContext, next) {
        return requestId(
            Object.assign(
                {
                    expose: 'X-Request-Id',
                    header: 'X-Request-Id',
                    query: 'requestId'
                },
                ctx.app.config.requestId
            )
        )(ctx, next);
    }
}
