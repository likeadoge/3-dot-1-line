const serve = require('koa-static');
const Koa = require('koa');
const app = new Koa();
const { dir, port } = require('./conf')

app.use(serve(dir));

app.listen(port);

console.log(`listening on port ${port}`);