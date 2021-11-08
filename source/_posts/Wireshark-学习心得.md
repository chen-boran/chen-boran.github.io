---
title: Wireshark 学习心得
date: 2021-07-11 12:50:01
tags:
---



# 1.基本介绍

首先介绍软件基本页面布局和功能

![image-20210711135223797](C:\Users\ASUS\AppData\Roaming\Typora\typora-user-images\image-20210711135223797.png)

如图：

包括最上方的选向窗口和下面的工具栏

| 名称 | 功能                 | 补充 |
| ---- | -------------------- | ---- |
| 文件 | 包括文件存储         |      |
| 编辑 |                      |      |
| 视图 |                      |      |
| 跳转 |                      |      |
| 捕获 |                      |      |
| 分析 | 捕获信息的分析       |      |
| 统计 | 对于所捕获信息的统计 |      |
| 电话 |                      |      |
| 无线 |                      |      |



# 2.过滤

接着重点是Wirshark的过滤功能，通过过滤器可以筛选许多不必要的信息，（设置 Caputure Filter 之前一定要三思而后行，避免筛除有用的包）

过滤是wireshark最难，最有趣的地方，值得深入学习。

wireshark还设置了查找功能，如果对于过滤命令不够熟悉，可是使用查找功能进行筛选，效果是一样的。具体操作：

- 点击感兴趣的一条内容-->右键 Prepare a filter-->select--》自动生成过滤表达式

<img src="C:\Users\ASUS\AppData\Roaming\Typora\typora-user-images\image-20210711135015254.png" alt="image-20210711135015254" style="zoom:80%;" />







以下是常用的筛选命令：来自 [Wireshark官网](https://www.wireshark.org/) ,过多信息在此不做赘述，具体参见    Wireshark User’s Guide&&[参考标准](https://www.wireshark.org/docs/dfref/)





### IP

在过滤器中输入IP.之后会有相应的显示，和java的方法类似



![image-20210711130532533](C:\Users\ASUS\AppData\Roaming\Typora\typora-user-images\image-20210711130532533.png)

常见的IP筛选如下:

| FIELD NAME  | DESCRIPTION                   | TYPE                      |
| ----------- | ----------------------------- | ------------------------- |
| ip.addr     | Source or Destination Address | IPv4 address              |
| ip.dst      | Destination Address           | IPv4 address              |
| ip.id       | Identification                | Unsigned integer, 2 bytes |
| ip.len      | Total Length                  | Unsigned integer, 2 bytes |
| ip.flags    | Flags                         | Unsigned integer, 1 byte  |
| ip.opt.mtu  | MTU                           | Unsigned integer, 2 bytes |
| ip.src      | Source Address                | IPv4 address              |
| ip.src_host | Source Host                   | Character string          |
| ip.ttl      | Time to Live                  | Unsigned integer, 1 byte  |
| ip.version  | Version                       | Unsigned integer, 1 byte  |



## Examples



Capture only traffic to or from IP address 172.18.5.4:

- 

  

  ```
  host 172.18.5.4
  ```

  

  

Capture traffic to or from a range of IP addresses:

- 

  

  ```
  net 192.168.0.0/24
  ```

  

  

or

- 

  

  ```
  net 192.168.0.0 mask 255.255.255.0
  ```

  

  

Capture traffic from a range of IP addresses:

- 

  

  ```
  src net 192.168.0.0/24
  ```

  

  

or

- 

  

  ```
  src net 192.168.0.0 mask 255.255.255.0
  ```

  

  

Capture traffic to a range of IP addresses:

- 

  

  ```
  dst net 192.168.0.0/24
  ```

  

  

or

- 

  

  ```
  dst net 192.168.0.0 mask 255.255.255.0
  ```

  

  

Capture only DNS (port 53) traffic:

- 

  

  ```
  port 53
  ```

  

  

Capture non-HTTP and non-SMTP traffic on your server (both are equivalent):

- 

  

  ```
  host www.example.com and not (port 80 or port 25)
  ```

  

  

  

  ```
  host www.example.com and not port 80 and not port 25
  ```

  

  

Capture except all ARP and DNS traffic:

- 

  

  ```
  port not 53 and not arp
  ```

  

  

Capture traffic within a range of ports

- 

  

  ```
  (tcp[0:2] > 1500 and tcp[0:2] < 1550) or (tcp[2:2] > 1500 and tcp[2:2] < 1550)
  ```

  

  

or, with newer versions of libpcap (0.9.1 and later):

- 

  

  ```
  tcp portrange 1501-1549
  ```

  

  

Capture only Ethernet type EAPOL:

- 

  

  ```
  ether proto 0x888e
  ```

  

  

Reject ethernet frames towards the Link Layer Discovery Protocol Multicast group:

- 

  

  ```
  not ether dst 01:80:c2:00:00:0e
  ```

  

  

Capture only IPv4 traffic - the shortest filter, but sometimes very useful to get rid of lower layer protocols like ARP and STP:

- 

  

  ```
  ip
  ```

  

  

Capture only unicast traffic - useful to get rid of noise on the network if you only want to see traffic to and from your machine, not, for example, broadcast and multicast announcements:

- 

  

  ```
  not broadcast and not multicast
  ```

  

  

Capture IPv6 "all nodes" (router and neighbor advertisement) traffic. Can be used to find rogue RAs:

- 

  

  ```
  dst host ff02::1
  ```

  

  

Capture HTTP GET requests. This looks for the bytes 'G', 'E', 'T', and ' ' (hex values 47, 45, 54, and 20) just after the TCP header. "tcp[12:1] & 0xf0) >> 2" figures out the TCP header length. From Jefferson Ogata via the [tcpdump-workers mailing list](http://seclists.org/tcpdump/2004/q4/95).

- 

  

  ```
  port 80 and tcp[((tcp[12:1] & 0xf0) >> 2):4] = 0x47455420
  ```

  

  



## Useful Filters



Blaster and Welchia are RPC worms. (Does anyone have better links, i.e. ones that describe or show the actual payload?)

[Blaster worm](http://www.sans.org/security-resources/malwarefaq/w32_blasterworm.php):

- 

  

  ```
  dst port 135 and tcp port 135 and ip[2:2]==48
  ```

  

  

[Welchia worm](http://securityresponse.symantec.com/avcenter/venc/data/detecting.traffic.due.to.rpc.worms.html):

- 

  

  ```
  icmp[icmptype]==icmp-echo and ip[2:2]==92 and icmp[8:4]==0xAAAAAAAA
  ```

  

  The filter looks for an icmp echo request that is 92 bytes long and has an icmp payload that begins with 4 bytes of A's (hex). It is the signature of the welchia worm just before it tries to compromise a system.

  

  

Many worms try to spread by contacting other hosts on ports 135, 445, or 1433. This filter is independent of the specific worm instead it looks for SYN packets originating from a local network on those specific ports. Please change the network filter to reflect your own network.



```
dst port 135 or dst port 445 or dst port 1433  and tcp[tcpflags] & (tcp-syn) != 0 and tcp[tcpflags] & (tcp-ack) = 0 and src net 192.168.0.0/24
```



[Heartbleed Exploit](https://web.archive.org/web/20140419183909/http://www.riverbed.com/blogs/Retroactively-detecting-a-prior-Heartbleed-exploitation-from-stored-packets-using-a-BPF-expression.html):

- 

  

  ```
  tcp src port 443 and (tcp[((tcp[12] & 0xF0) >> 4 ) * 4] = 0x18) and (tcp[((tcp[12] & 0xF0) >> 4 ) * 4 + 1] = 0x03) and (tcp[((tcp[12] & 0xF0) >> 4 ) * 4 + 2] < 0x04) and ((ip[2:2] - 4 * (ip[0] & 0x0F)  - 4 * ((tcp[12] & 0xF0) >> 4) > 69))
  ```

# 3.常见功能

### 1.分析

在wireshark中的分析选项中

- Analyze-->Export info Composite

- statistics-->service response time-->选定相关协议响应（**时间统计表**）----------衡量服务器性能
- statistic-->TCP Stream Graph   (**信息统计图**)

### 2.搜索功能

- 快捷键：ctrl+f

- 效果图：

  <img src="C:\Users\ASUS\AppData\Roaming\Typora\typora-user-images\image-20210711140444529.png" alt="image-20210711140444529" style="zoom:200%;" />
