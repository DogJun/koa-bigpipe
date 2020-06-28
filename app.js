const Koa = require('koa')
const Router = require('koa-router')
const path = require('path')
const fs = require('fs')
const app = new Koa()
const router = new Router()

const task1 = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // resolve('我是第一次输出<br/>')
      resolve(`<script>addHtml('part1', '我是第一次输出')</script>`)
    }, 2000)
  })
}
const task2 = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // resolve('我是第二次输出')
      resolve(`<script>addHtml('part2', '我是第二次输出')</script>`)
    }, 2000)
  })
}

router.get('/', async (ctx, next) => {
  ctx.status = 200
  ctx.type = 'html'
  const filename = path.resolve(__dirname, 'index.html')
  const stream = fs.createReadStream(filename)
  // demo1
  // const file = fs.readFileSync('./index.html', 'utf-8')
  // ctx.res.write(file)
  // ctx.res.end()
  // demo2 页面输出ok, 说明状态是好的，但是没有输出数据
  // stream.pipe(ctx.res)
  // demo3
  // function createSsrStreamPromise () {
  //   return new Promise((resolve, reject) => {
  //     stream.on('error', err => {reject(err)}).pipe(ctx.res)
  //   })
  // }
  // await createSsrStreamPromise()
  // demo4 报错 write after end
  // stream.on('data', (chunk) => {
  //   ctx.res.write(chunk) 
  // })
  // demo5
  // function createSsrStreamPromise () {
  //   return new Promise((resolve, reject) => {
  //     const stream = fs.createReadStream(filename)
  //     stream.on('data', (chunk) => {
  //       ctx.res.write(chunk)
  //     })
  //   })
  // }
  // await createSsrStreamPromise();
  // demo6 体验bigpipe
  const file = fs.readFileSync('./index.html', 'utf-8')
  ctx.res.write(file)
  const result1 = await task1()
  ctx.res.write(result1)
  const result2 = await task2()
  ctx.res.write(result2)
  ctx.res.end()
})

app.use(router.routes())
  .use(router.allowedMethods())

app.listen(8080, () => {
  console.log('服务已经启动...🍺')
})
