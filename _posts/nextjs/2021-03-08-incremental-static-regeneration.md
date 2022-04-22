---
layout: post
title: Incremental Static Regeneration
categories: [Nextjs]
description: Incremental Static Regeneration
keywords: ISR, static generation, nextjs, 增量构建
---

## 背景

我们假设以下场景，因为一些需求我们需要搭建一个`CMS`发布系统，他需要支持以下功能：
* 发布文章之前需要预览
* 考虑`SEO`，文章最好静态化
* 大体量的文章访问，如果采用`CSR`的方式，会对接口造成比较大的负担，所以最好可以支持静态构建，以提升稳定性
* 支持静态文件的缓存策略，利用客户端缓存减小并发给服务器的静态资源压力
* 考虑到文章的体量以及资讯的即时性，我们只缓存近一周的文章，以节省服务器磁盘空间，其他的时间较久的文章需要在访问时动态生成以供临时访问
* 文章需要支持发布上线
* 文章需要支持下线
* 文章下线404以后支持重新上线，恢复访问
* 预览模式最好和live模式为同一份生成代码，以保证一致性，同时降低分别维护的成本

## 方案

比较自然的，我们就能想到以下方案：
1. 静态构建服务
* 考虑文章页面的内容简单，容易静态，不像SPA一样需要太多动态的页面逻辑，所以通过loader进行静态化也是比较简单的
* 静态话以后，进行上线、下线就比较简单了：
  - 上线触发服务端的构建程序，同步到nginx目录即可；
  - 下线只需要查找删除即可
* 预览的话就没什么要求了，CSR就行，仍然可以复用同一套模版
* 那唯一需要解决的问题就是静态生成文件管理：
  - 怎么生成近一周的文章？
    * 可以通过nodejs脚本，进行批量构建，也可以实现
  - **历史文章怎么动态构建？**
    * ***这个就稍微比较复杂，暂时没有很好的思路，怎么在静态文件和动态之前切换，似乎除了通过一个动态的服务实现以外，都不是很方便**
    > 可以在nginx判断静态资源是否存在，不存在则跳转
```nginx
if( !-e $request_filename )
{
  rewrite ^/(.*)$ index.html last;
}
```
2. SSR
* 不考虑性能以及稳定性的话，SSR也许是最好的方式
  - 不需要担心文章体量增大导致的磁盘压力
  - 上线、下线通过数据接口就能实现，显示内容或者显示404即可
  - 预览和live查看没有本质区别，一套即可
  - ***不存在实际的缓存近一周文章的概念，都是SSR**
  - 比较不友好的点可能就是稳定性与并发这块
    * 毕竟访问量上去以后，动态的SSR也是会有性能压力的
    * 静态资源并发与请求对服务压力完全不是一个量级
    * **没办法通过C端复用静态资源的方式提升响应速度以及降低并发压力**
3. ISR
* **Nextjs的ISR方案似乎完美的解决了这个问题，下面主要介绍这种方案**

## ISR(Incremental Static Regeneration)

> ISR是组合`getStaticPaths`和`getStaticProps`两个API实现的

### 增量静态构建钩子

* 我们通过不同的category定义具有明显区别的资讯文章类型，对没中类型尽性单独的渲染呈现

```typescript
// pages/articles/[id].tsx
export const getStaticPaths = async () => {
  // 这里我们可以增加一个近期高频热点资讯的接口，返回文章ID列表，提前进行静态化构建，提前应对高并发
  return {
    paths: [
      {
        params: {
          id: '9', // 这里需要设置至少默认值，否则初次构建会因为缺少动态路由承载页面而失败
        },
      }
    ],
    fallback: 'blocking', // 在页面生成之前，一直pending等待；可以通过设置为true，在构建完成之前显示一个等待页面
  }
}

export const getStaticProps = async ({ params: { id } }: any) => {
  // 通过时间模拟静态资源，时间能简单的观察到ISR的缓存以及revalidate是否生效
  const res = await fetch('http://localhost:4000/api/time')
  // 每次构建前的渲染，检查一次当前文章是否删除，如果删除，直接返回404
  const checkDelete = await fetch(`http://localhost:4000/api/deleted?id=${id}`)
  const deleteData = await checkDelete.json()
  const time = await res.json()
  return {
    props: {
      id: id,
      time: time,
    },
    revalidate: false,
    notFound: deleteData.deleted,
  }
}
```

### revalidate激活

* 我们通过一个私密的`SECRET`触发`revalidate`，但是`demo`给的例子是通过`GET`的方式实现，虽然一般调用激活是在一个安全的企业内网环境，但是显式的调用方式仍然具有很多不安全因素，容易泄漏导致不按预期的`revalidate_check`操作
  - 优化方式是：
    1. 通过`POST`方式
    2. 通过自定义`headers`，以及加解密协议，将`body`部分进行加密，且每次加密内容均不一致，增加破解以及重放难度
* 在`body`中我们可以额外指定文章的`path`以及其他更多的定制参数，**进而控制文章在下线404以及404重新上线以后的激活操作**
* 文章上线一般都会有一个唯一的文章`id`，前端不再额外控制该文章是否外显，当资讯接口有数据返回时，即正常外显
  - 如果有场景需要的话，可以增加一个外显的`check`接口进一步控制

```javascript
// pages/api/revalidate.js

export default async function handler(req: any, res: any) {
  // Check for secret to confirm this is a valid request
  if (req.query.secret !== process.env.MY_SECRET_TOKEN) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  try {
    // 具体page路径
    await res.unstable_revalidate('/articles/1')
    return res.json({
      revalidated: true,
    })
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).send('Error revalidating')
  }
}
```

### demo

> `// packages/next-demo`

1. `yarn dev:4000`启动本地接口服务，以供初次`SG`构建
  - `/api/time`：文章正文内容模拟，方便查看缓存变动更新情况
  - `/api/deleted`：下架文章`check`接口，通过`packages/next-demo/data/del.json`数据模拟数据库(按需手动修改)
  - `api/revalidate`：触发`/articles/1`文章刷新
2. `yarn build`构建服务
3. `yarn start`通过`production mode`预览服务
4. 查看`/articles/1`，文章显示正常；变更`packages/next-demo/data/del.json`id为1，模拟数据库下架操作；触发一次文章刷新；此时应该404
5. 修改`packages/next-demo/data/del.json`，模拟文章重新上架；触发一次文章刷新；此时应该正常显示文章内容

测试结束


---

[1] [incremental-static-regeneration](https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration)