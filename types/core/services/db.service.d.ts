import { Connection } from 'typeorm';
import { EraApplication } from '../../app';
import { Constructor } from '../interfaces';
export declare class DBService {
    readonly app: EraApplication;
    connection: Connection;
    private config;
    constructor(app: EraApplication);
    init(): Promise<void>;
    getRepository<T>(model: Constructor<T>): import("typeorm").Repository<T>;
}
