import koaStatic from 'koa-static';
import * as path from 'path';
import { EraMiddlewareLambdaFactory } from '../interfaces';
import { Middleware } from '../decorators';
// import { IEraContext } from '../../context';

const StaticMiddleware: EraMiddlewareLambdaFactory = (_, app) => {
    const options = app.config.static || {};
    const root = options.root || 'public';
    const absRoot = path.resolve(app.projectRoot, 'app', root);
    return koaStatic(absRoot, options!);
};

export default Middleware({
    enable(options) {
        return (
            !options.coreMiddlewares ||
            (options.coreMiddlewares || []).indexOf('static') > -1
        );
    },
})(StaticMiddleware);
