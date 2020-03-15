import { container } from 'tsyringe';
import { EraMiddleware, MiddlewareScope, Constructor } from '../interfaces';
import { ScopeException } from '../exceptions';

export function isMiddlewareMatchScope(
    middlewareConstructor: Constructor<EraMiddleware> | EraMiddleware,
    scope: MiddlewareScope
) {
    if (!scope) {
        return true;
    }
    let instance;
    let name;
    if (typeof middlewareConstructor === 'function') {
        instance = container.resolve<EraMiddleware>(middlewareConstructor);
        name = middlewareConstructor.name;
    } else {
        instance = middlewareConstructor;
        name = instance.__proto__.constructor.name;
    }
    const match =
        !instance.scope || instance.scope === 'All' || instance.scope === scope;
    if (!match) {
        throw new ScopeException(name, instance.scope!, scope);
    }
    return true;
}
