import { IEraContext } from '../../context';

export interface EraMiddleware {
    name?: string;
    use(ctx: IEraContext, next: Function): void;
}
