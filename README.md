# Jico

## 目录结构

> 详细可参考：[Jekyll目录结构](https://www.jekyll.com.cn/docs/structure/)

|-- _data: 格式化的站点数据，Jekyll将自动加载此目录下的数据文件，通过`site.<dataName>`访问
|-- _drafts: 尚未发布的内容，命名不包含日期，通过`--drafts`进行启动预览
|-- _includes: 可mixed in page的抽离混合内容，通过`{% include file.ext %}`进行引用
|-- _layouts: 布局信息，通过`{{ content }}`inject content into the web page
|-- _posts: 已经发布的内容，必须遵循`YEAR-MONTH-DAY-title.MARKUP`格式
|-- _site: Jekyll转换完所有的文件以后，将在此目录下放置生成的站点内容。最好将此目录配置到`.gitignore`
|-- _sass: 可以import到`main.scss`的样式片段
|-- _wiki: 已经发布的wiki页面
|-- assets: 页面可以使用的静态资源，通过`{{ site.url }}/assets/`进行使用
|-- images: 文章和页面中使用到的图片
|-- pages: 基础页面
|-- _config.yml: 配置信息存储
## 致谢

本博客外观基于 [mzlogin](https://mazhuang.org/) 修改，感谢！

[1]: https://github.com/mzlogin/chinese-copywriting-guidelines
[2]: https://help.github.com/articles/setting-up-your-pages-site-locally-with-jekyll/
[3]: https://github.com/mzlogin/mzlogin.github.io/issues/2
