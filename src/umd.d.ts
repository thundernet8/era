import * as compose from 'koa-compose';
import { IEraContext } from './context';
import { IEraState } from './state';
import { EraApplication } from './app';
import {
    ParameterizedContext,
    Request as KoaRequest,
    Response as KoaResponse,
    Next as KoaNext
} from 'koa';

type Application = EraApplication;

type EraContext = ParameterizedContext<IEraState, IEraContext>;

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
