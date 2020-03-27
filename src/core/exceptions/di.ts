export class DIException extends Error {
    constructor(msg, e: Error) {
        super(msg);
        this.stack = e.stack;
    }
}
