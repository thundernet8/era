import { container } from 'tsyringe';
import { ActionMetadata } from '../registry';
import { IEraContext } from '../../context';
import { ParamType } from '../interfaces';
import { Logger } from '../services/Log.Service';
import { EraController, EraService } from '../baseclass';

export class ActionExecutor {
    static logger: Logger = new Logger('ActionExecutor');

    static getBody(ctx: IEraContext, expression: string = '') {
        const body = ctx.request.body || {};
        if (!expression) {
            return body;
        }
        return body[expression];
    }

    static getHeader(ctx: IEraContext, expression: string = '') {
        const headers = ctx.request.headers;
        if (!expression) {
            return headers;
        }
        return headers[expression];
    }

    static getCookie(ctx: IEraContext, expression: string = '') {
        const cookies = ctx.cookies;
        if (!expression) {
            return '';
        }
        return cookies.get(expression);
    }

    static getQuery(ctx: IEraContext, expression: string = '') {
        const query = ctx.request.query;
        if (!expression) {
            return query;
        }
        return query[expression];
    }

    static getParam(ctx: IEraContext, expression: string = '') {
        const params = ctx.params;
        if (!expression) {
            return params;
        }
        return params[expression];
    }

    static exec(
        actionMetadata: ActionMetadata,
        ctx: IEraContext,
        next: Function
    ) {
        let args: any[] = [];
        /**
         * 未被装饰器装饰的参数，第一个为ctx，第二个为next，其他为undefined
         */
        let undecoratedArgIndex = 0;
        const undecoratedArgs = [ctx, next];
        actionMetadata.params.forEach(param => {
            if (!param.isDecorated) {
                args.push(undecoratedArgs[undecoratedArgIndex]);
                undecoratedArgIndex++;
            } else {
                switch (param.paramType) {
                    case ParamType.Context:
                        args.push(ctx);
                        break;
                    case ParamType.Next:
                        args.push(next);
                        break;
                    case ParamType.Body:
                        args.push(this.getBody(ctx, param.expression));
                        break;
                    case ParamType.Header:
                        args.push(this.getHeader(ctx, param.expression));
                        break;
                    case ParamType.Cookie:
                        args.push(this.getCookie(ctx, param.expression));
                        break;
                    case ParamType.Path:
                        args.push(this.getParam(ctx, param.expression));
                        break;
                    case ParamType.Query:
                        args.push(this.getQuery(ctx, param.expression));
                        break;
                    case ParamType.File:
                        args.push(undefined); // TODO file
                        break;
                    default:
                        args.push(undefined);
                }
            }
        });

        if (args.length < 1 && actionMetadata.isMiddlewareAction) {
            args = [ctx, next];
        }

        const instance = container.resolve(actionMetadata.type);
        if (
            instance instanceof EraController ||
            instance instanceof EraService
        ) {
            instance['ctx'] = ctx;
            instance['app'] = ctx.app;
        }
        // TODO handle not resolved exception
        return instance[actionMetadata.actionName].apply(instance, args);
    }
}
