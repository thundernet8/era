export declare class HttpException extends Error {
    code: number;
    constructor(msg: string, code: number);
}
