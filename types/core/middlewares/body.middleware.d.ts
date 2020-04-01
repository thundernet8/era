import { EraMiddlewareClass } from '../interfaces';
import { IEraContext } from '../../context';
export declare class BodyParserMiddleware implements EraMiddlewareClass {
    use(ctx: IEraContext, next: any): Promise<void>;
}
