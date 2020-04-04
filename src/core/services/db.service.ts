import {
    ConnectionOptions,
    createConnection,
    Connection,
    Repository,
    ConnectionManager
} from 'typeorm';
import { inject, container } from 'tsyringe';
import { Service } from '../decorators';
import { EraApplication } from '../../app';
import { Constructor } from '../interfaces';
import { ModelRegistry } from '../registry/ModelRegistry';

@Service({
    singleton: true,
    injectToken: 'DB'
})
export class DBService {
    public connection: Connection = null as any;
    private config: ConnectionOptions = null as any;
    constructor(readonly app: EraApplication) {
        if (app.config.db) {
            this.config = app.config.db;
            this.init();
        }
    }

    public async init() {
        const entities = ModelRegistry.getModels();
        this.connection = await createConnection({
            ...this.config,
            entities
        });
    }

    public getRepository<T>(model: Constructor<T>) {
        return this.connection.getRepository<T>(model);
    }
}
