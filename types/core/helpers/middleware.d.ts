import { EraMiddleware, MiddlewareScope, Constructor } from '../interfaces';
export declare function isMiddlewareMatchScope(middlewareConstructor: Constructor<EraMiddleware> | EraMiddleware, scope: MiddlewareScope): boolean;
