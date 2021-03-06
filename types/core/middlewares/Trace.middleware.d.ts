import { EraMiddlewareClass } from '../interfaces';
import { IEraContext } from '../../context';
export declare class TraceMiddleware implements EraMiddlewareClass {
    use(ctx: IEraContext, next: any): Promise<any>;
}
