---
title: Git常见操作总结
date: 2022-03-21 15:09:36
tags:
---



我们先来理解下 Git 工作区、暂存区和版本库概念：

- **工作区：**就是你在电脑里能看到的目录。
- **暂存区：**英文叫 stage 或 index。一般存放在 **.git** 目录下的 index 文件（.git/index）中，所以我们把暂存区有时也叫作索引（index）。
- **版本库：**工作区有一个隐藏目录 **.git**，这个不算工作区，而是 Git 的版本库

![image-20220321162417377](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/image-20220321162417377.png)

首先是简单的操作：

- git init - 初始化仓库。
- git add . - 添加文件到暂存区。
- git commit - 将暂存区内容添加到仓库中。
- git clone -拷贝一份远程仓库，也就是下载一个项目。
- git  rm   删除工作区文件。
- git  commit    提交暂存区到本地仓库。
- git diff     比较文件的不同，即暂存区和工作区的差异。
- git status    查看仓库当前的状态，显示有变更的文件。
- git  mv  移动或重命名工作区文件。
- git reset -- hard HEAD^   回退到当前版本之前提交的版本（一个^相当于往前一个版本）。
- git reset --hard  （部分）版本号    回退到任意一个之前提交的版本
- git checkout -- <文件路径>  回退到上一个版本提交的状态（此时是没有提交的状态，相当于Ctrl + z）
- git  reset HEAD  <文件路径文件名>  将文件撤销追踪 ，撤出暂存区。

- git log -查看提交本地仓库的记录日志

- git tag -创建标签 格式：git tag <标签名>

  标签默认加到最新的一次提交上。

  git tag <标签名>  <某一次commit的ID>  ：给某一次的commit添加标签

  git tag -d <标签名> : 标签名

远程操作：

- git remote ：远程仓库操作
- git fetch  ：从远程获取代码库

- git push ：本地仓库文件推送到远程仓库

  例如：git push origin master

- git pull：拉取远程仓库到本地。

分支

- git branch <分支名> -创建分支

  git branch -查看所有分支

  git checkout <分支名字> -切换分支

  git branch -d <分支名称>   -删除分支，注意的是不能删除当前分支。并且分支有commit操作的时候也不能删除（必须经过合并）

  git branch -D <分支名称>  强制删除某一分支

  git checkout -b <分支名称>  -直接创建一个新的分支并且跳转。

- git merge <合并的分支名> 

合并冲突：

- git merge -abort  ：忽略其他分支，保留现在分支代码（解决合并冲突）



创建 远程仓库

[GIT教程](https://www.runoob.com/git/git-remote-repo.html)

