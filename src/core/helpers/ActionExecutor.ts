import { container } from 'tsyringe';
import { ActionMetadata } from '../registry';
import { IEraContext } from '../../context';
import { ParamType } from '../interfaces';
import { Logger } from '../services/Log.Service';
import { EraController, EraService } from '../baseclass';

export class ActionExecutor {
    static logger: Logger = new Logger('ActionExecutor');

    static exec(
        actionMetadata: ActionMetadata,
        ctx: IEraContext,
        next: Function
    ) {
        const args: any[] = [];
        /**
         * 未被装饰器装饰的参数，第一个为ctx，第二个为next，其他为undefined
         */
        let undecoratedArgIndex = 0;
        const undecoratedArgs = [ctx, next];
        actionMetadata.params.forEach(param => {
            if (!param.isDecorated) {
                args.push(undecoratedArgs[undecoratedArgIndex]);
                undecoratedArgIndex++;
            } else {
                switch (param.paramType) {
                    case ParamType.Context:
                        args.push(ctx);
                        break;
                    case ParamType.Next:
                        args.push(next);
                        break;
                    // TODO more
                    default:
                        args.push(undefined);
                }
            }
        });

        const instance = container.resolve(actionMetadata.type);
        if (
            instance instanceof EraController ||
            instance instanceof EraService
        ) {
            instance['ctx'] = ctx;
            instance['app'] = ctx.app;
        }
        // TODO handle not resolved exception
        return instance[actionMetadata.actionName].apply(instance, args);
    }
}
