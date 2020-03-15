import { Constructor } from '../interfaces';

export class ScopeException extends Error {
    name: string = '';
    scope: string = '';
    currentScope: string = '';

    constructor(name: string, scope: string, currentScope: string) {
        super(`${name} is scoped for ${scope}, but used in ${currentScope}`);
        this.name = name;
        this.scope = scope;
        this.currentScope = currentScope;
    }
}
