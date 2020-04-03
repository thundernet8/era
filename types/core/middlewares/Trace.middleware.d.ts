/// <reference path="../../app.d.ts" />
/// <reference types="koa" />
/// <reference types="koa-compose" />
/// <reference types="koa-bodyparser" />
import { EraMiddlewareClass } from '../interfaces';
import { IEraContext } from '../../context';
export declare class TraceMiddleware implements EraMiddlewareClass {
    use(ctx: IEraContext, next: any): Promise<import("koa-compose").Middleware<import("koa").ParameterizedContext<import("koa").DefaultState, import("koa").DefaultContext>>>;
}
