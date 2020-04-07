## 中间件

中间件加载器会自动扫描位于`app/middleware`文件夹下的中间件，每个中间件需要使用中间件装饰器进行修饰，由于纯函数无法使用装饰器，因此注册纯函数中间件时，请将装饰器作为高阶函数来包装中间件工厂函数使用。

### 类形式装饰器

```ts
import { Middleware, EraMiddlewareClass } from 'era2';

@Middleware({
    priority: 0,
    enable: true,
})
export class ResponseTimeMiddleware implements EraMiddlewareClass {
    async use(ctx, next) {
        const now = Date.now();
        await next();
        console.log(`response time: ${Date.now() - now}`);
    }
}
```

### 纯函数形式装饰器

```ts
import { Middleware, EraMiddlewareLambdaFactory } from 'era2';

const ResponseTimeMiddleware: EraMiddlewareLambdaFactory = (appConfig, app) => {
    return (ctx, next) => {
        const now = Date.now();
        await next();
        console.log(`response time: ${Date.now() - now}`);
    };
};

export default Middleware({
    enable: true,
})(ResponseTimeMiddleware);
```
