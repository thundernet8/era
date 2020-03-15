export declare class ScopeException extends Error {
    name: string;
    scope: string;
    currentScope: string;
    constructor(name: string, scope: string, currentScope: string);
}
