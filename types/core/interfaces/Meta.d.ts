export declare enum ParamType {
    Path = 0,
    Query = 1,
    Body = 2,
    File = 3,
    Header = 4,
    Context = 5,
    Next = 6
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
