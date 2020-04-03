import { HttpStatus } from '../interfaces';
export declare class HttpException extends Error {
    status: number;
    constructor(msg: string, status: HttpStatus, stack?: string);
}
export declare class ForbiddenException extends HttpException {
    constructor(msg: string, status: HttpStatus, stack?: string);
}
export declare class InternalServerErrorException extends HttpException {
    constructor(msg: string, status: HttpStatus, stack?: string);
}
export declare class NotFoundException extends HttpException {
    constructor(msg: string, status: HttpStatus, stack?: string);
}
export declare class UnauthorizedException extends HttpException {
    constructor(msg: string, status: HttpStatus, stack?: string);
}
