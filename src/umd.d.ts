import * as accepts from 'accepts';
import * as Cookies from 'cookies';
import { IncomingMessage, ServerResponse, Server } from 'http';
import * as compose from 'koa-compose';
import { IEagleContext } from './context';
import { IEagleState } from './state';
import { EagleApplication } from './app';
import {
    ParameterizedContext,
    BaseContext,
    BaseRequest,
    BaseResponse,
    Request as KoaRequest,
    Response as KoaResponse,
    Next as KoaNext,
    Context as KoaContext
} from 'koa';

type Application = EagleApplication;

// interface ExtendableContext extends BaseContext {
//     app: Application;
//     request: KoaRequest;
//     response: KoaResponse;
//     req: IncomingMessage;
//     res: ServerResponse;
//     originalUrl: string;
//     cookies: Cookies;
//     accept: accepts.Accepts;
//     /**
//      * To bypass Koa's built-in response handling, you may explicitly set `ctx.respond = false;`
//      */
//     respond?: boolean;
// }

type EagleContext = ParameterizedContext<IEagleState, IEagleContext>;

// interface EagleRequest extends BaseRequest {
//     app: Application;
//     req: IncomingMessage;
//     res: ServerResponse;
//     ctx: EagleContext;
//     response: EagleResponse;
//     originalUrl: string;
//     ip: string;
//     accept: accepts.Accepts;
// }

// interface EagleResponse extends BaseResponse {
//     app: Application;
//     req: IncomingMessage;
//     res: ServerResponse;
//     ctx: EagleContext;
//     request: EagleRequest;
// }

declare namespace Eagle {
    export type Context = EagleContext;
    export type State = IEagleState;
    export type Middleware<
        StateT = IEagleState,
        CustomT = IEagleContext
    > = compose.Middleware<EagleContext>;
    export type Request = KoaRequest & { ctx: EagleContext };
    export type Response = KoaResponse & { ctx: EagleContext };
    export type Next = KoaNext;
}

declare class Eagle extends EagleApplication {}

export = Eagle;

export as namespace Eagle;
