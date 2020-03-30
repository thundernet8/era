import { type } from 'os';

export const isUndefined = (obj: any): obj is undefined =>
    typeof obj === 'undefined';

export const isNil = (obj: any): obj is null | undefined =>
    isUndefined(obj) || obj === null;

export const isObject = (fn: any): fn is object =>
    !isNil(fn) && typeof fn === 'object';

export const isClass = (klass: any) => {
    return (
        typeof klass === 'function' &&
        klass.prototype.constructor.name !== 'Function' &&
        klass.prototype.constructor.name !== 'Object'
    );
};

export function arrayToMap(data: any[]): Map<number, any> {
    const map = new Map<number, any>();
    data.forEach((item, index) => {
        map.set(index, item);
    });
    return map;
}

export function normalizePath(path: string) {
    if (!path) return '';
    if (!path.startsWith('/')) {
        path = `/${path}`;
    }
    return path;
}
