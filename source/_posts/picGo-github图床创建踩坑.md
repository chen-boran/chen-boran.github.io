---
title: picGo+github图床创建踩坑
date: 2021-10-28 21:22:41
tags:
- thinks
categories:
- Essay
keywords:
description:
top_img:
comments:
cover:
toc:
toc_number:
copyright:
copyright_author:
copyright_author_href:
copyright_url:
copyright_info:
mathjax:
katex:
aplayer:
highlight_shrink:
aside:
---

## 1.安装

typora升级到最新版本 

picgo升级到最新版本：version2.3.0

一：创建GitHub仓库
首先登陆 GitHub，新建一个仓库或者也可以使用一个已有仓库

注意：仓库属性必须为公共（public）的，否则图片上传上去之后是没法显示，之后的调用也会出错

二：设置token

需要在 GitHub 上生成一个 token 以便 PicGo 来操作我们的仓库，

步骤如下：

个人中心Settings->Developer settings ->Personal access tokens

创建 token

点击 Generate new token 创建一个新 token，选择 repo，同时它会把包含其中的都会勾选上。点击绿色按钮，Generate token 。生成一个 token ，记得复制保存到其他地方，这个 token 只显示一次！！

 3.PicGo配置
PicGo下载地址
https://github.com/Molunerfinn/PicGo/releases

配置 PicGo


打开 PicGo 面板，

选择github仓库

仓库名格式为 用户名/仓库名
分支名：master
token：上一个咱们创建的token

然后点击确定即可完成绑定，即可设置成默认图床

 

## 在typore配置自动上传

打开typora，点开左上角文件，选择**偏好设置**

1. 设置插入图片时为【上传图片】
2. 勾选【对本地位置的图片应用上述规则】
3. 在上传服务中选择“PicGo(app)”
4. 在路径中选择picgo安装目录**PicGo.exe**

可以点击下面的验证图片上传选项，上传成功！

 配置完成之后，图片复制进typora之后就会自动经由picGo上传到github的仓库了，并且生成相关的URL地址。

## 常见问题

#### 1

在上传图片到picGo的时候，显示上传失败：服务器错误

仔细检查github图床配置的相关信息

错误原因是：**仓库名前面没有添加github账号**

​						注意格式一定要是：账号名/仓库名

​						缺一不可！！！！！

​						并且仓库名中最好不要有特殊字符，空格等，避免发生不知名的错误

#### 2

安装 picGo的时候想要更改安装路径，更改之后安装目录没有文件，应用程序无法打开。

使用了默认路径之后重新安装，才解决这个问题。

建议使用系统默认路径即可

#### 3

picGo上传成功typore中显示加载失败

查找相关资料，原因是github屏蔽掉了图片，需要修改host。
路径：C:\Windows\System32\drivers\etc\hosts


 找到host文件，用记事本格式打开，添加代码

#GitHub Start 

140.82.113.3      github.com
140.82.114.20     gist.github.com
151.101.184.133    assets-cdn.github.com
151.101.184.133    raw.githubusercontent.com
151.101.184.133    gist.githubusercontent.com
151.101.184.133    cloud.githubusercontent.com
151.101.184.133    camo.githubusercontent.com
151.101.184.133    avatars0.githubusercontent.com
199.232.68.133     avatars0.githubusercontent.com
199.232.28.133     avatars1.githubusercontent.com
151.101.184.133    avatars1.githubusercontent.com
151.101.184.133    avatars2.githubusercontent.com
199.232.28.133     avatars2.githubusercontent.com
151.101.184.133    avatars3.githubusercontent.com
199.232.68.133     avatars3.githubusercontent.com
151.101.184.133    avatars4.githubusercontent.com
199.232.68.133     avatars4.githubusercontent.com
151.101.184.133    avatars5.githubusercontent.com
199.232.68.133     avatars5.githubusercontent.com
151.101.184.133    avatars6.githubusercontent.com
199.232.68.133     avatars6.githubusercontent.com
151.101.184.133    avatars7.githubusercontent.com
199.232.68.133     avatars7.githubusercontent.com
151.101.184.133    avatars8.githubusercontent.com
199.232.68.133     avatars8.githubusercontent.com

#GitHub End

host更改权限具体参考：https://www.jb51.net/os/win10/526668.html

保存重启一下Typora软件即可

 #### 4

保存某些格式的图片 例如 png

可能会出现上传失败的问题，更改图片格式重新上传即可！



参考博客： https://blog.csdn.net/weixin_46025371/article/details/111105266

