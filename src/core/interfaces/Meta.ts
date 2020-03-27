import { IEraContext } from '../../context';

export enum ParamType {
    Path,
    Query,
    Body,
    File,
    Header,
    Request,
    Response,
    Context,
    Next,
    Error
}

export enum HttpMethod {
    All = 'all',
    Get = 'get',
    Post = 'post',
    Delete = 'delete',
    Put = 'put',
    Patch = 'patch',
    Options = 'options',
    Head = 'head'
}

export interface ActionRoute {
    method: HttpMethod;
    path: string;
}

export interface EraMiddleware {
    name?: string;
    use(ctx: IEraContext, next: Function): void;
}
