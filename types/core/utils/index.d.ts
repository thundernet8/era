export declare const isUndefined: (obj: any) => obj is undefined;
export declare const isNil: (obj: any) => obj is null | undefined;
export declare const isObject: (fn: any) => fn is object;
export declare function arrayToMap(data: any[]): Map<number, any>;
export declare function normalizePath(path: string): string;
