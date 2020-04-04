import { injectable, container } from 'tsyringe';
import { Constructor, IService, ServiceDecoratorOptions } from '../interfaces';

class ServiceMetadata {
    public readonly type: Constructor;

    constructor(type: Constructor) {
        this.type = type;
    }
}

export class ServiceRegistry {
    private static services: Map<Constructor, ServiceMetadata> = new Map();

    public static register(
        type: Constructor,
        options: ServiceDecoratorOptions = {}
    ) {
        injectable()(type);
        const singleton = !!options.singleton;
        const injectToken = options.injectToken || type;
        if (singleton) {
            container.registerSingleton(injectToken, type);
        } else {
            container.register(injectToken, type);
        }
        if (!this.services.get(type)) {
            const metadata = new ServiceMetadata(type);
            this.services.set(type, metadata);
        }
    }

    public static resolve(type: Constructor) {
        return container.resolve<IService>(type);
    }

    public static getServices() {
        return Array.from(this.services.values());
    }
}
