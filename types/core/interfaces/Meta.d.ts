import { IEraContext } from '../../context';
export declare enum ParamType {
    Path = 0,
    Query = 1,
    Body = 2,
    File = 3,
    Header = 4,
    Request = 5,
    Response = 6,
    Context = 7,
    Next = 8,
    Error = 9
}
export declare enum HttpMethod {
    All = "all",
    Get = "get",
    Post = "post",
    Delete = "delete",
    Put = "put",
    Patch = "patch",
    Options = "options",
    Head = "head"
}
export interface ActionRoute {
    method: HttpMethod;
    path: string;
}
export interface EraMiddleware {
    name?: string;
    use(ctx: IEraContext, next: Function): void;
}
