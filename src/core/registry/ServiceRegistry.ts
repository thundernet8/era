import { autoInjectable, container } from 'tsyringe';
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
        const newTarget = autoInjectable()(type);
        container.register(newTarget, newTarget);
        // container.register(type, newTarget);
        if (!this.services.get(newTarget)) {
            const metadata = new ServiceMetadata(newTarget);
            this.services.set(newTarget, metadata);
        }

        return newTarget;
    }

    public static resolve(type: Constructor) {
        return container.resolve<IService>(type);
    }

    public static getServices() {
        return Array.from(this.services.values());
    }
}
