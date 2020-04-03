import { HttpStatus } from '../interfaces';

export class HttpException extends Error {
    status: number;
    constructor(msg: string, status: HttpStatus, stack?: string) {
        super(msg);
        this.status = status;
        this.stack = stack;
    }
}

export class ForbiddenException extends HttpException {
    constructor(msg: string, status: HttpStatus, stack?: string) {
        super(msg, HttpStatus.FORBIDDEN, stack);
    }
}

export class InternalServerErrorException extends HttpException {
    constructor(msg: string, status: HttpStatus, stack?: string) {
        super(msg, HttpStatus.INTERNAL_SERVER_ERROR, stack);
    }
}

export class NotFoundException extends HttpException {
    constructor(msg: string, status: HttpStatus, stack?: string) {
        super(msg, HttpStatus.NOT_FOUND, stack);
    }
}

export class UnauthorizedException extends HttpException {
    constructor(msg: string, status: HttpStatus, stack?: string) {
        super(msg, HttpStatus.UNAUTHORIZED, stack);
    }
}
