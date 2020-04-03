import { ActionMetadata } from '../registry';
import { IEraContext } from '../../context';
import { Logger } from '../services/Log.Service';
export declare class ActionExecutor {
    static logger: Logger;
    static getBody(ctx: IEraContext, expression?: string): any;
    static getHeader(ctx: IEraContext, expression?: string): any;
    static getCookie(ctx: IEraContext, expression?: string): string | undefined;
    static getQuery(ctx: IEraContext, expression?: string): any;
    static getParam(ctx: IEraContext, expression?: string): any;
    static exec(actionMetadata: ActionMetadata, ctx: IEraContext, next: Function): any;
}
