import * as accepts from 'accepts';
import * as Cookies from 'cookies';
import { IncomingMessage, ServerResponse, Server } from 'http';
import * as compose from 'koa-compose';
import { IEraContext } from './context';
import { IEraState } from './state';
import { EraApplication } from './app';
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

type Application = EraApplication;

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

type EraContext = ParameterizedContext<IEraState, IEraContext>;

// interface EraRequest extends BaseRequest {
//     app: Application;
//     req: IncomingMessage;
//     res: ServerResponse;
//     ctx: EraContext;
//     response: EraResponse;
//     originalUrl: string;
//     ip: string;
//     accept: accepts.Accepts;
// }

// interface EraResponse extends BaseResponse {
//     app: Application;
//     req: IncomingMessage;
//     res: ServerResponse;
//     ctx: EraContext;
//     request: EraRequest;
// }

declare namespace Era {
    export type Context = EraContext;
    export type State = IEraState;
    export type Middleware<
        StateT = IEraState,
        CustomT = IEraContext
    > = compose.Middleware<EraContext>;
    export type Request = KoaRequest & { ctx: EraContext };
    export type Response = KoaResponse & { ctx: EraContext };
    export type Next = KoaNext;
}

declare class Era extends EraApplication {}

export = Era;

export as namespace Era;
