import { EraMiddleware } from '../interfaces';
import { IEraContext } from '../../context';
export declare class BodyParserMiddleware implements EraMiddleware {
    use(ctx: IEraContext, next: any): Promise<void>;
}
