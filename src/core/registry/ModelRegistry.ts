import { container } from 'tsyringe';
import { Entity, EntityOptions } from 'typeorm';
import { Constructor } from '../interfaces';

export class ModelRegistry {
    private static models: Map<Constructor, Constructor> = new Map();

    public static register(
        type: Constructor,
        name?: string,
        options: EntityOptions = {}
    ) {
        // injectable()(type);
        Entity(name, options)(type);
        container.register(type, {
            useFactory: () => {
                const dbService: any = container.resolve('DB');
                return dbService.getRepository(type);
            }
        });
        this.models.set(type, type);
    }

    public static getModels() {
        return Array.from(this.models.values());
    }
}
