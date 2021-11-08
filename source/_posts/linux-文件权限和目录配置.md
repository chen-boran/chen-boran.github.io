---
title: linux 文件权限和目录配置
date: 2021-10-03 09:33:25
tags: 
categories: 
keywords:
description: some of my essay
top_img: 
comments: 
cover: https://ae01.alicdn.com/kf/Ue5889eaf11594a4aabca090c5d5060798.jpg
toc:  
toc_number:
copyright:
mathjax:
katex:
---

## linux 文件权限和目录配置

涉及命令：

- 切换用户：su -用户名      exit退出
- 显示文件的所有属性权限：ls - al



### 文件权限

- Linux的每个文件中,可可分别给予使用者，群组，与其他人三种方式的rwx的权限。

- root，一般用户的用户相关信息记录在/etc/passwd;个人密码记录在 /etc/shadow/;组名记录在 /etc/group

- 访问文件需要相关的权限，

- 群组最有用的功能之一，就是当你的团队开发资源的时候，每个账户都可以有多个群组支持。

- 利用ls -l显示的文件属性中，第一个字段是文件的权限，共有十位，

  第一位是文件类型，：d:目录，-:文件,I:连接档，b：接口设备。c:串行端口设备。

  接下来三个为一组，分为使用者，群组，其他人权限，权限有rwx三种，：可读 可写 可执行

**linux文件权限重要性：** 

- 系统保护
- 文件开发、数据共享
- 权限设置避免安全问题

修改文件属性和群组

**更改文件的群组支持chgrp**

要被改变的组名必须要在/etc/group 文件内存在才 行。

```
 chgrp [-R] dirname/filename
 注：[-R] 是递归修改，更改文件目录下的所有文件或者目录的权限
```

**修改文件的拥有者为chown**，更改一个文件的拥有者与群组，使用什么指令。chown chgrp

```
将目录中所有文件或目录更改文件拥有者
chown [-R] 帐号名称 文件或目录
chown [-R] 帐号名称：用户组名称 文件或目录
```

**修改文件的权限用chmod**

- chmod修改权限的方式：

  - 符号法：u 、g、o、分别代表 user、group、others三种身份

    ​		+、-、=分别代表加入、移除、设置三种操作

    例如：增加某个文件的让所有人可写入的权限 ：chmod a+w  文件名

  - 数字法：rwx分数 分别为421；各种身份的权限数字进行累加

    例如：当一个文件的修改权限为 -rwx-xr--指令：chmod 754  文件名  或者chmod u=rwx，g=rx，o=r 文件名 



### 权限的意义

权限对于目录和文件的作用略有不同，下面我们分开概述：

- 文件
  - r，可读此文件的实际内容，如读取文本文件的文字内容等。
  - w，可以编辑，新增或者修改该文件的内容（不能删除）
  - x，该文件具有可以被系统执行的权利。

- 目录：
  - r：read contents in directory	可以查询文件名数据
  - w：modify contents directory  可以对文件进行改动，包括 移动、新建、删除、重命名等。
  - x：accessdirectory    能够进入该目录作为当前工作目录

**注意：**

- 要开放目录给任何人浏览，应该至少也要给予r及x的权限，但w的权限不可随便给。
- 能否读取到某个文件内容，跟该文件所在的目录权限有关系，目录至少需要x的权限

### linux文件种类：

常规文件：包括文本文件、二进制文件、数据文件  第一个字符为 -

目录   director

链接文件   类似windows的快捷方式

设备与设备文件 device  包括 区块blocks和字符文件character 

数据接口文件  sockets

数据接送文件   FIFO pipe



- Linux档名的限制，单一文件或目录最大容许的文件名为255个英文字符或者128 个汉字字符。

- linux一个文件能否执行和文件扩展名没有关系，文件扩展名是用来便于用户是别文件功能，能否执行与 文件权限中的  权限的是个属性有关
- 文件能否执行成功最终要看件的内容

### linux目录配置：

- 绝对路径文件名为从根目录/开始写起，否则都为相对路径。

- .  表示当前目录          ..  表示上级目录

常见目录功能:

```
/：根目录 ，最重要的目录
/etc/:几乎系统所有的配置文件案都在这里，尤其是passwd和shaow
/boot/:开机配置文件。也是预设摆放核心vmlinuz的地方。
/usr/bin,/bin:一般执行档摆放的地方。
/var/log:摆放系统注册表文件的地方法
/dev:摆放所有系统装置文件的目录
/use/sbin,/sbin：系统管理员常用的指令集
/run:将经常变动的项目移动到内存暂存
```

根目录：

![](https://www.hualigs.cn/image/615904e2ddc91.jpg)

![](https://www.hualigs.cn/image/615904e3495de.jpg)

/usr

![](https://www.hualigs.cn/image/615904e341b8c.jpg)

/var

 ![](https://www.hualigs.cn/image/615904e33db17.jpg)



- 文档名有【.】开头表示为隐藏文档，需要使用ls-a这个-a选项才可以显示出隐藏文档的内容，而使用ls -al才能显示出属性。

