import bodyParse from 'koa-bodyparser';
import { EraMiddleware } from '../interfaces';
import { Middleware } from '../decorators';
import { IEraContext } from '../../context';

@Middleware()
export class BodyParserMiddleware implements EraMiddleware {
    async use(ctx: IEraContext, next) {
        const options = ctx.app.config.bodyParserOptions || {
            formLimit: '1mb'
        };
        await bodyParse(options)(ctx, next);
    }
}
