import { EraExceptionFilterLambda } from '../interfaces';
import { HttpException } from '../exceptions';
import { IEraContext } from '../../context';
export declare class FilterExecutor {
    static applyFilters(exception: HttpException, ctx: IEraContext, filters: EraExceptionFilterLambda[]): Promise<void>;
}
