---
title: MySQL技术内幕-事务
date: 2022-02-12 13:56:18
tags: thinks
categories: thinks
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

事务是数据库区别与文件系统的重要特征之一。



InnoDB存储引擎的事务完全符合ACID特性：

即：原子性（atomicity）

一致性（consistency）

持久性（isolation）

隔离性（durability）

