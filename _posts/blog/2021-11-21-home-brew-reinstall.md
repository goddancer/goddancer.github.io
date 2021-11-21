---
layout: post
title: homebrew卸载与重装
categories: [Homebrew, Mac]
description: reinstall home brew
keywords: homebrew, brew
---

> 在玩homebrew的时候，不小心玩坏了，怎么重新安装呢，如果不熟悉的话，还是有点浪费时间的，所以决定简单记录一下

## 卸载

### 1、官网卸载方法

[uninstall-homebrew官方指引](https://github.com/homebrew/install#uninstall-homebrew)

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```
实际运行时却发现报错：

`curl: (7) Failed to connect to raw.githubusercontent.com port 443: Connection refused`

443端口连不上，但是可信吗？我们复制地址到浏览器进行443端口访问，是可以访问的，已经做了科学上网，所以明显不是网络问题。

经过一番查找资料发现：<strong style="color: red;">苹果新系统提升了安全等级，禁止了直接执行远程脚本</strong>，所以<strong style="color: red;">把脚本下载到本地执行就好</strong>。

okay..let's have try

浏览器打开，复制脚本内容，保存到本地shell文件，然后bash执行，依然还是报错：

`curl: (7) Failed to connect to raw.githubusercontent.com port 443: Connection refused`

查看[uninstall源码](https://github.com/Homebrew/install/blob/master/uninstall.sh#L275)发现，这玩意居然是一个套娃...

不过问题我们清楚了，解决起来就比较简单，远程脚本本地化即可。

<span style="text-decoration: underline dotted green">这里额外说明一点，用这种方式去进行[install](https://github.com/Homebrew/install/blob/master/install.sh)是没问题的，当前版本的脚本中没有依赖其他远程脚本。</span>

### 2、暴力卸载法

> 有时候感觉暴力也是一种美学，虽然这篇文章就是因为这个原因才有机会写的...--!

暴力而直接，也许需要sudo赋权。直接删掉brew相关的文件和目录即可...

```shell
sudo rm -rf /usr/local/.git ~/Library/Caches/Homebrew /usr/local/Homebrew
```

## 重装

我们已经掌握了卸载时使用的第一种方法，我们也有科学上网的环境，所以我们膨胀了，直接搞，安装!

然后就是相对漫长的等待，也不至于很慢，但是很容易EOF，很容易hung up...

<strong style="color: red;">修改brew镜像源将是一个很推荐的选择</strong>，相信我，得丝滑！

[清华源传送门](https://mirrors.tuna.tsinghua.edu.cn/help/homebrew/)

很丝滑地，安装结束。