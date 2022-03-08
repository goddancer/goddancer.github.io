This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

---

为了达到资讯详情页

* 资讯分不同的category，不同category认为样式效果有本质差异，否则使用同一种category
* 增加预览模式preview：
  - preview复用category策略，目的是使预览和发布使用相同tempalte保证效果一致性；同时见效维护成本
  - 预览模式使用SSR，不需要考虑性能，不用ISR优化
  - 预览模式和cagegory使用不同的策略，即使文章ID相同，也不会相互影响；不会污染ISR缓存池
* 预览仅启用QA环境？
  - 预览模式通过环境变量注入的方式，在QA机器启用QA、Stage、Live三个环境的预览支持
  - 预览模式和Live模式使用不同的接口
* 文章如何发布：
  - 当发布的文章内容接口已经支持时，
  - 预览模式和Live模式使用不同的数据获取接口，发不到Live的容器仅支持正式接口的访问，可以通过环境变量进行控制
  - 后端通过ID通过正式接口调用是否返回数据来控制是否发布
【预览模式与正式模式】
* 首先明确，出于安全策略，两者需要隔离，防止程序变动导致共享缓存污染的情况，导致文章异常：
  - 这里可以通过环境变量的方式，部署两套完全不同的容器：
    1. 纯预览容器，有以下特点：
      * 只支持SSR模式
      * 无需多个环境部署多个容器，可以在访问时传递环境参数即可
      * 该容器只用于预览，共享仓库源码
    2. 灰度容器，有以下特点：
      * 容器唯一，通过环境变量注入的方式部署不同环境
      * 只有基于category的SSG+ISR模式
      * 灰度容器定时重启，释放缓存空间

【下线】
* 下线通过404的方式实现，分两个步骤：
  - 前端程序在ISR构建时，通过后端接口检查当前文章是否下线，如果下线，构建一个404文章；否则正常构建
  - 线上动态上下线文章时，首先后端接口返回文章下线状态；前端触发重新构建，激活检查、构建步骤
* 文章下线检查方式：
  - 方案一：新增一个单独的接口，通过文章id查询是否命中下线名单，命中以后，前端不再获取文章数据，返回404；
  - 方案二：通过文章id查询数据的接口返回下线标志或者无数据标志，前端返回404；
  - 需要考虑到程序重启的情况，下线标志需要持久化
* 后端需要提供的功能：
  - 一个查询接口，用于检查当前文章是否下线。文章下线以后，预构建接口也不能再返回对应文章id。
  - 一个预构建接口，用于返回文章id、category等。方便通过定时重启程序的方式，清除本地过多的next缓存，同时在初始化构建时能够将近期的文章生成静态文件，提升性能

【nextjs cache策略】
When a request is made to a page that was pre-rendered at build time, it will initially show the cached page.

* Any requests to the page after the initial request and before 10 seconds are also cached and instantaneous.
* After the 10-second window, the next request will still show the cached (stale) page
* Next.js triggers a regeneration of the page in the background.
* Once the page generates successfully, Next.js will invalidate the cache and show the updated page. If the background regeneration fails, the old page would still be unaltered.


【docker】

```docker
FROM node:alpine

RUN mkdir -p /usr/src/app
ENV PORT 3000

WORKDIR /usr/src/app

COPY package.json /usr/src/app
COPY yarn.lock /usr/src/app

# Production use node instead of root
# USER node

RUN yarn install --production

COPY . /usr/src/app

RUN yarn build

EXPOSE 3000
CMD [ "yarn", "start" ]
```







