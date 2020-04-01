import { Constructor, EraMiddleware, HttpMethod, IController } from '../interfaces';
import { ActionMetadata } from './ActionRegistry';
declare class ControllerMetadata {
    readonly type: Constructor;
    routePrefix: string;
    readonly actions: Map<string, ActionMetadata>;
    constructor(type: Constructor);
}
export declare class ControllerRegistry {
    private static readonly controllers;
    static registerController(controller: Constructor, routePrefix: string, middlewares?: EraMiddleware[]): Constructor<any>;
    static registerAction(controller: Constructor, actionName: string, httpMethod: HttpMethod, paths: string[]): void;
    static resolveControllerMetadata(controller: Constructor): ControllerMetadata;
    static resolveController(controller: Constructor): IController;
    static getControllers(): ControllerMetadata[];
}
export {};
