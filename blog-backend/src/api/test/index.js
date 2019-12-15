import Router from 'koa-router';

const test = new Router();

test.get("/", ctx => {
    ctx.body ='1';
});

export default test;