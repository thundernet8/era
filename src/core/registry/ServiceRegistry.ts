import { injectable, container } from 'tsyringe';
import { Constructor, IService } from '../interfaces';

class ServiceMetadata {
    public readonly type: Constructor;

    constructor(type: Constructor) {
        this.type = type;
    }
}

export class ServiceRegistry {
    private static services: Map<Constructor, ServiceMetadata> = new Map();

    public static register(type: Constructor) {
        injectable()(type);
        container.register(type, type);
        if (!this.services.get(type)) {
            const metadata = new ServiceMetadata(type);
            this.services.set(type, metadata);
        }

        return type;
    }

    public static resolve(type: Constructor) {
        return container.resolve<IService>(type);
    }

    public static getServices() {
        return Array.from(this.services.values());
    }
}
