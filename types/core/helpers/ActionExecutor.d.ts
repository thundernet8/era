import { ActionMetadata } from '../registry';
import { IEraContext } from '../../context';
import { Logger } from '../services/Log.Service';
export declare class ActionExecutor {
    static logger: Logger;
    static exec(actionMetadata: ActionMetadata, ctx: IEraContext, next: Function): any;
}
