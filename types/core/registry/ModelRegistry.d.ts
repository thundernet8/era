import { EntityOptions } from 'typeorm';
import { Constructor } from '../interfaces';
export declare class ModelRegistry {
    private static models;
    static register(type: Constructor, name?: string, options?: EntityOptions): void;
    static getModels(): Constructor<any>[];
}
