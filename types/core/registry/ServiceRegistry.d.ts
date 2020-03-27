import { Constructor, IService } from '../interfaces';
declare class ServiceMetadata {
    readonly type: Constructor;
    constructor(type: Constructor);
}
export declare class ServiceRegistry {
    private static services;
    static register(type: Constructor): void;
    static resolve(type: Constructor): IService;
    static getServices(): ServiceMetadata[];
}
export {};
