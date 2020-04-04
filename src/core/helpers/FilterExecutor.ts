import { EraExceptionFilterLambda } from '../interfaces';
import { HttpException } from '../exceptions';
import { IEraContext } from '../../context';

const globalExceptionFilter: EraExceptionFilterLambda = (
    exception: HttpException,
    ctx
) => {
    if (exception instanceof HttpException) {
        ctx.status = exception.status;
        ctx.body = exception.message;
    } else {
        ctx.status = 500;
        ctx.body = 'Internal Server Error';
    }
};

export class FilterExecutor {
    static async applyFilters(
        exception: HttpException,
        ctx: IEraContext,
        filters: EraExceptionFilterLambda[]
    ) {
        if (typeof ctx.response['_body'] !== 'undefined') {
            return;
        }
        let result;
        let resolved = false;
        let i = 0;
        while (i < filters.length) {
            const filter = filters[i];
            try {
                result = await filter(exception, ctx);
                resolved = true;
                break;
            } catch (e) {
                exception = e;
                i++;
            }
        }

        if (!resolved) {
            globalExceptionFilter(exception, ctx);
        } else {
            ctx.status = 200;
            ctx.body = result;
        }
    }
}
