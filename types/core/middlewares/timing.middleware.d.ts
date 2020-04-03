import { EraMiddlewareClass } from '../interfaces';
import { IEraContext } from '../../context';
export declare class ResponseTimeMiddleware implements EraMiddlewareClass {
    use(ctx: IEraContext, next: any): Promise<any>;
}
