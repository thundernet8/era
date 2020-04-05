import bodyParse from 'koa-bodyparser';
import { EraMiddlewareClass } from '../interfaces';
import { Middleware } from '../decorators';
import { IEraContext } from '../../context';

@Middleware({
    enable(options) {
        return (
            !options.coreMiddlewares ||
            (options.coreMiddlewares || []).indexOf('bodyParser') > -1
        );
    },
})
export class BodyParserMiddleware implements EraMiddlewareClass {
    async use(ctx: IEraContext, next) {
        const options = ctx.app.config.bodyParserOptions || {
            formLimit: '1mb',
        };
        await bodyParse(options)(ctx, next);
    }
}
