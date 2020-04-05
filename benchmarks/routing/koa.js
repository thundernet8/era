const Koa = require('koa');
const app = new Koa();

let n = parseInt(process.env.MW || '1', 10);

console.log(`  ${n} endpoints - Koa`);

while (n--) {
    app.use((ctx, next) => {
        if (ctx.path === `/${n}`) {
            ctx.body = 'hello world';
        }
        return next();
    });
}

app.use((ctx, next) => {
    if (ctx.path === '/') {
        ctx.body = 'Hello World';
    }
    return next();
});

app.listen(8080);
