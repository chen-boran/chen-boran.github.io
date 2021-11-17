---
title: Redis Sentinel
date: 2021-11-17 21:19:49
tags:
- [Redis]
- ["学习笔记"]
categories:
 
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

Sentinel（哨岗、哨兵）是Redis的高可用性（highavailability）解决方案

通过Sentinel系统监视任意多的主服务器和从服务器，自动升级下线主服务器的从属服务器为主服务器，代理执行原主机的相关工作

![image-20211117212353672](https://i.loli.net/2021/11/17/cNiLAkld9wQZMYK.png)
