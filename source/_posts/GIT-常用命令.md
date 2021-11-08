---
title: GIT 常用命令
date: 2021-06-20 20:02:39
 
tags: 
categories: 
keywords:
description: some of my thinks
top_img: 
comments: 
cover: https://ae01.alicdn.com/kf/Ue5889eaf11594a4aabca090c5d5060798.jpg
toc:  
toc_number:
copyright:
mathjax:
katex:
---

前言：学习一个门技术或者一个知识点，最终目标是学以致用。大谈理论大可不必。GIT就是这样一个工具，重点掌握如何使用方便日常代码管理。

## 概述

- Git    everything is local

- 免费、开源的**分布式**版本控制工具

- 用于版本控制（个人开发-->团队协作）

- 官网：[https://git-scm.com](https://git-scm.com/)

- 基本工作流程（存储到本地库历史版本最终应该上传到远程代码托管中心）

  ![image-20211018154954412](C:\Users\ASUS\AppData\Roaming\Typora\typora-user-images\image-20211018154954412.png)

安装过程在此不做介绍，网上有很多安装教程

下面详细介绍：GIT 命令、GIT 分支、github、idea整合Gitgitlab（基于局域网）

## GIT常用命令

| 命令名称                             | 作用           |
| ------------------------------------ | -------------- |
| git config --global user.name 用户名 | 设置用户签名   |
| git config --global user.email 邮箱  | 设置用户签名   |
| git init                             | 初始化本地库   |
| git status                           | 查看本地库状态 |
| git add 文件名                       | 添加到暂存区   |
| git commit -m "日志信息" 文件名      | 提交到本地库   |
| git reflog                           | 查看历史记录   |
| git reset --hard 版本号              | 版本穿梭       |
|                                      |                |

用户签名可以在本机的用户目录中.gitconfig中查看

- Git中命令行命令和linux相同，我们使用vim编辑器编辑信息。

- 查看本地库的状态：git status  

  //包括目录中未提交到缓存区、已经提交到缓存区、已经发布为历史版本等类型的文件，并用不同颜色显示

  删除暂存区文件： "git rm --cached <file>..." 

- **提交本地库**：**git** **commit**   -m "日志信息  文件名

- **git reflog** **查看版本信息**（简略信息）

  **git log** 查看版本详细信息(包括文件的版本信息、提交的用户、完整的版本号等信息)

- ![](C:\Users\ASUS\AppData\Roaming\Typora\typora-user-images\image-20211018162821693.png)

- 版本穿梭：文件更改之后，最终commit到本地库中

  - 本地库只显示最新的版本文件，并且按行管理版本，新增一个版本就会删除之前的版本行，添加新的行进去。

  - Git 支持穿越版本，通过指针更改，变换版本信息，对应相关版本的文件（前后穿越都可）

    使用命令：**git reset --hard** **版本号**

  ​				

 ## 分支操作

| 命令名称             | 作用                         |
| -------------------- | ---------------------------- |
| Git branch -v        | 查看当前分支                 |
| Git branch hot-fix   | 添加热分支（紧急修复）       |
| Git checkout  分支名 | 切换当前分支                 |
| Git merge  分支名    | 合并分支（没有产生合并冲突） |
| 手动更改合文件 vim   | 合并分支（产生合并冲突）     |
|                      |                              |

- 分支可以在不影响主分支的前提下，并行得推进功能添加，单独进行开发，提高了开发效率，并且各个分支之间互相并不影响。

- 查看分支

  ![image-20211018164349203](C:\Users\ASUS\AppData\Roaming\Typora\typora-user-images\image-20211018164349203.png)

  明显看到当前只有一个分支master

- 增加分支      Git branch 分支名

  ![image-20211018164549438](C:\Users\ASUS\AppData\Roaming\Typora\typora-user-images\image-20211018164549438.png)

  此时已经有了两个分支(hot-fi 是主分支master的副本)

- 切换分支   Git checkout  分支名

  ![image-20211018165122993](C:\Users\ASUS\AppData\Roaming\Typora\typora-user-images\image-20211018165122993.png)

- 合并分支：  Git merge  分支名

  - 分支对文件进行了修改等操作，此时主分支和副分支内容不同，可以在主分支的角度上进行合并分支操作：Git merge hot-fi

  - 假设在hot-fi中修改了内容，主分支不变，之后就会对主分支内容添加hot-fi分支添加的内容

  ​       合并前后对比如下：

  ![image-20211018165918020](C:\Users\ASUS\AppData\Roaming\Typora\typora-user-images\image-20211018165918020.png)

```
特定情况下合并分支时，会产生冲突

冲突产生的原因：

合并分支时，两个分支在同一个文件的同一个位置有两套完全不同的修改。Git 无法替

我们决定使用哪一个。必须人为决定新代码内容

需要手动合并 
		1）编辑有冲突的文件，删除特殊符号，决定要使用的内容
		2）添加到暂存区
		3）执行提交（注意：此时使用 git commit 命令时不能带文件名）
```

## github

- 官网：[https://github.com/](https://github.com/)
- 重点熟悉github页面了解使用流程
  - 创建远程仓库![image-20211018192017858](C:\Users\ASUS\AppData\Roaming\Typora\typora-user-images\image-20211018192017858.png)
- 常见操作

| **命令名称**                       | **作用**                                                 |
| ---------------------------------- | -------------------------------------------------------- |
| git remote -v                      | 查看当前所有远程地址别名                                 |
| git remote add 别名 远程地址       | 起别名                                                   |
| git push 别名 分支                 | 推送本地分支上的内容到远程仓库                           |
| git clone 远程地址                 | 将远程仓库的内容克隆到本地                               |
| git pull 远程库地址别名 远程分支名 | 将远程仓库对于分支最新内容拉下来后与当前本地分支直接合并 |

相关操作和本机操作类似：

- 克隆远程仓库到本地		 		Git clone 远程地址
- 推送本地分支到远程仓库        Git push 别名 分支
- 拉取远程库内容：					git pull 远程库地址别名 远程分支名

