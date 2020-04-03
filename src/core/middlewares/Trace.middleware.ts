import requestId from 'koa-requestid';
import { EraMiddleware, EraMiddlewareClass } from '../interfaces';
import { Middleware } from '../decorators';
import { IEraContext } from '../../context';

@Middleware()
export class TraceMiddleware implements EraMiddlewareClass {
    async use(ctx: IEraContext, next) {
        return requestId(
            Object.assign(
                {
                    header: 'X-Req-Id'
                },
                ctx.app.config.requestId
            )
        );
    }
}
