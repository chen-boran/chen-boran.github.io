---
title: Zookeeper
date: 2021-10-31 21:16:49
tags: 
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

## 1. 概念

ZooKeeper 是分布式应用程序的高性能协调服务。它在一个简单的界面中公开了公共服务——例如命名、配置管理、同步和组服务，因此您不必从头开始编写它们。您可以使用现成的它来实现共识、组管理、领导者选举和出席协议。您可以根据自己的特定需求在此基础上进行构建。

zookeeper主要是文件系统和通知机制

文件系统主要是用来存储数据
通知机制主要是服务器或者客户端进行通知，并且监督
基于观察者模式设计的分布式服务管理框架，开源的分布式框架

**特点**

一个leader，多个follower的集群
集群只要有半数以上包括半数就可正常服务，一般安装奇数台服务器
全局数据一致，每个服务器都保存同样的数据，实时更新
更新的请求顺序保持顺序（来自同一个服务器）
数据更新的原子性，数据要么成功要么失败
数据实时更新性很快
主要的集群步骤为

服务端启动时去注册信息（创建都是临时节点）
获取到当前在线服务器列表，并且注册监听
服务器节点下线
服务器节点上下线事件通知
process(){重新再去获取服务器列表，并注册监听}
数据结构
与 Unix 文件系统很类似，可看成树形结构，每个节点称做一个 ZNode。每一个 ZNode 默认能够存储 1MB 的数据。也就是只能存储小数据

应用场景

统一命名服务（域名服务）
统一配置管理（一个集群中的所有配置都一致，且也要实时更新同步）
将配置信息写入ZooKeeper上的一个Znode，各个客户端服务器监听这个Znode。一旦Znode中的数据被修改，ZooKeeper将通知各个客户端服务器
统一集群管理（掌握实时状态）
将节点信息写入ZooKeeper上的一个ZNode。监听ZNode获取实时状态变化
服务器节点动态上下线
软负载均衡（根据每个节点的访问数，让访问数最少的服务器处理最新的数据需求）

## 2. 安装

**目录介绍：**

bin目录 框架启动停止，客户端和服务端的
conf 配置文件信息
docs文档
lib 配置文档的依赖

### 2.2 本地安装过程



安装运行在Linux系统

官网首页： 

https://zookeeper.apache.org/

**1）** 安装前准备

（1）安装 JDK 

（2） 拷贝 apache-zookeeper-3.5.7-bin.tar.gz 安装包到 Linux 系统中

（3） 解压到指定目录 

 		 tar -zxvf apache-zookeeper-3.5.7bin.tar.gz -C /opt/module/ 

（4） 修改名称 

 		mv apache-zookeeper-3.5.7 -bin/ zookeeper-3.5.7 

**2）** 配置修改 

（1） 将/opt/module/zookeeper-3.5.7/conf 这个路径下的 zoo_sample.cfg 修改为 zoo.cfg； 

 		 mv zoo_sample.cfg zoo.cfg 

（2） 打开 zoo.cfg 文件，修改 dataDir 路径： 

​	 	vim zoo.cfg 

​		修改如下内容： 

​		dataDir=/opt/module/zookeeper-3.5.7/zkData 

（3） 在/opt/module/zookeeper-3.5.7/这个目录上创建 zkData 文件夹 

 	mkdir zkData 

**3）** 操作 **Zookeeper** 

（1） 启动 Zookeeper 

​	 bin/zkServer.sh start 

（2） 查看进程是否启动 

 jps 

（3） 查看状态 

  bin/zkServer.sh status 

（4） 启动客户端 

  bin/zkCli.sh 

（5） 退出客户端： 

 		quit 

（6） 停止 Zookeeper 

 

### 2.2 配置文件conf

**5大参数**

1. tickTime = 2000发送时间
2. initLimit = 10 第一次建立通信的时间（本例：10 x tickTime =2 s），最长容忍时间 ，超过，则建立通信失败
3. syncLimit = 5建立好连接后，下次的通信时间如果超过设定值，通信将会失败
4. dataDir保存zookeeper的数据，默认是temp会被系统定期清除（因此修改成我们自定义的路径）
5. clientPort = 2181客户端的连接端口 

## 3.zookeeper集群操作

### **3.1** 集群安装 

假设三个节点部署zookeeper
那么需要3台服务器

**1）** 集群规划 

在 hadoop102、hadoop103 和 hadoop104 三个节点上都部署 Zookeeper。 

思考：如果是*10* 台服务器，需要部署多少台*Zookeeper*？ 

**2）** 解压安装 

（1） 在 hadoop102 解压 Zookeeper 安装包到/opt/module/目录下 

[atguigu@hadoop102 software]$ tar -zxvf apache-zookeeper-3.5.7bin.tar.gz -C /opt/module/ 

（2） 修改 apache-zookeeper-3.5.7-bin 名称为 zookeeper-3.5.7 

[atguigu@hadoop102 module]$ mv apache-zookeeper-3.5.7-bin/ zookeeper-3.5.7 

**3）** 配置服务器编号 

（1） 在/opt/module/zookeeper-3.5.7/这个目录下创建 zkData 

[atguigu@hadoop102 zookeeper-3.5.7]$ mkdir zkData 

（2） 在/opt/module/zookeeper-3.5.7/zkData 目录下创建一个 myid 的文件 

[atguigu@hadoop102 zkData]$ vi myid 

在文件中添加与 server 对应的编号（注意：上下不要有空行，左右不要有空格） 

2 

注意：添加 myid 文件，一定要在 Linux 里面创建，在 notepad++里面很可能乱码 

（3） 拷贝配置好的 zookeeper 到其他机器上 

[atguigu@hadoop102 module ]$ xsync  zookeeper-3.5.7 

并分别在 hadoop103、hadoop104 上修改 myid 文件中内容为 3、4 

**4）** 配置**zoo.cfg**文件 

（1） 重命名/opt/module/zookeeper-3.5.7/conf 这个目录下的 zoo_sample.cfg 为 zoo.cfg 

[atguigu@hadoop102 conf]$ mv zoo_sample.cfg zoo.cfg 

（2） 打开 zoo.cfg 文件 

[atguigu@hadoop102 conf]$ vim zoo.cfg 

\#修改数据存储路径配置 

dataDir=/opt/module/zookeeper-3.5.7/zkData 

\#增加如下配置 

\#######################cluster########################## server.2=hadoop102:2888:3888 

server.3=hadoop103:2888:3888 

server.4=hadoop104:2888:3888 

（3） 配置参数解读 

server.A=B:C:D。 

**A** 是一个数字，表示这个是第几号服务器；集群模式下配置一个文件 myid，这个文件在 dataDir 目录下，这个文件里面有一个数据就是 A 的值，Zookeeper 启动时读取此文件，拿到里面的数据与 zoo.cfg 里面的配置信息比较从而判断到底是哪个 server。 

**B** 是这个服务器的地址； 

**C** 是这个服务器 Follower 与集群中的 Leader 服务器交换信息的端口； 

**D** 是万一集群中的 Leader 服务器挂了，需要一个端口来重新进行选举，选出一个新的

Leader，而这个端口就是用来执行选举时服务器相互通信的端口。 

（4） 同步 zoo.cfg 配置文件 

[atguigu@hadoop102 conf]$ xsync zoo.cfg 

**选举机制**
面试的重点
 第一次启动时

非第一次启动，注意选举的规则 

![image-20211031211854524](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/image-20211031211854524.png)

 ![image-20211031211930380](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/image-20211031211930380.png)

**集群启动停止脚本**
当涉及的服务器很多，就需要逐个服务器去启动和关闭

可以创建开启和关闭脚本文件

大致如下：
在文件目录下建立一个后缀名为sh的文件

```
#!/bin/bash
case $1 in
"start"){
for i in hadoop102 hadoop103 hadoop104
do
echo ---------- zookeeper $i 启动 ------------
ssh $i "/opt/module/zookeeper-3.5.7/bin/zkServer.sh 
start"
done
};;
"stop"){
for i in hadoop102 hadoop103 hadoop104
do
echo ---------- zookeeper $i 停止 ------------ 
ssh $i "/opt/module/zookeeper-3.5.7/bin/zkServer.sh 
stop"
done
};;
"status"){
for i in hadoop102 hadoop103 hadoop104
do
echo ---------- zookeeper $i 状态 ------------ 
ssh $i "/opt/module/zookeeper-3.5.7/bin/zkServer.sh 
status"
done
};;
esac
```


修改该文件的权限

chmod 777 zk.sh
之后在一个服务器中执行./zk.sh start就可启动脚本文件，其他命令也如此

查看其进程号
可以通过jpsall 就可查看所有服务器的进程

### 3.2 客户端命令

 **常用命令**
 

| 命令        | 功能                                                         |
| ----------- | ------------------------------------------------------------ |
| help        | 显示所有操作命令                                             |
| Ls path     | 使用 ls 命令来查看当前 znode 的子节点 [可监听] ，-w 监听子节点变化，-s 附加次级信息 |
| create      | 普通创建                                                     |
| create -s   | 创建含有序列的节点                                           |
| create -e   | 临时创建节点（重启或者超时消失）                             |
| get path    | 获得节点的值 [可监听] ，-w 监听节点内容变化                  |
| get path -s | 附加次级信息                                                 |
| set         | 设置节点的具体值                                             |
| delete      | 删除节点                                                     |
| deleteall   | 递归删除节点                                                 |
| stat        | 查看结点状态                                                 |

 

**客户端显示命令**

查看当前znode包含的信息

[zk: localhost:2181(CONNECTED) 0] ls /
[zookeeper]

查看当前数据节点详细信息

ls -s /

 ![image-20211031202949441](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/image-20211031202949441.png)

```
注意：
启动客户端的时候默认是本地的localhost
如果要启动专门的服务器
开启客户端服务时使用以下格式：
	bin/zkCli.sh -server 服务器名:2181
 
```

 **节点类型**
 持久/短暂
有序号/无序号

创建节点不带序号的 ：  create 

创建节点带序号的 ： create  -s

创建同名节点也会区分不同

退出客户端之后，这些节点并没有被清除

创建临时节点 ：create -e
临时节点不带序号-e
临时节点带序号：create  -e -s
如果退出客户端，这些短暂节点将会被清除

修改节点的值 ：set key value

 ![image-20211031211955891](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/image-20211031211955891.png)

 **监听器原理**

客户端注册监听它关心的目录节点，当目录节点发生变化（数据改变、节点删除、子目录节点增加删除）时，ZooKeeper 会通知客户端。监听机制保证 ZooKeeper 保存的任何的数

据的任何改变都能快速的响应到监听了该节点的应用程序。

1）节点的值变化监听 

（1） 在 hadoop104 主机上注册监听/sanguo 节点数据变化 

 	get -w /sanguo  

（2） 在 hadoop103 主机上修改/sanguo 节点的数据 

 	 set /sanguo "xisi" 

（3） 观察 hadoop104 主机收到数据变化的监听  

 注意：在hadoop103再多次修改/sanguo的值，hadoop104上不会再收到监听。因为注册

一次，只能监听一次。想再次监听，需要再次注册。 

2 ）节点的子节点变化监听（路径变化） 

（1） 在 hadoop104 主机上注册监听/sanguo 节点的子节点变化 

 ls -w /sanguo  

（2） 在 hadoop103 主机/sanguo 节点上创建子节点 

  create /sanguo/jin "simayi" Created /sanguo/jin 

（3） 观察 hadoop104 主机收到子节点变化的监听 

注意：节点的路径变化，也是注册一次，生效一次。想多次生效，就需要多次注册。 

3）节点删除与查看 

**（1）** 删除节点 

  delete /sanguo/jin 

**（2）** 递归删除节点 

  deleteall /sanguo/shuguo 

**(3）** 查看节点状态 

  stat /sanguo  

### 3.3 客户端代码操作

创建一个工程
在pom文件中配好依赖文件

```
<dependencies>
<dependency>
    <groupId>junit</groupId>
    <artifactId>junit</artifactId>
    <version>RELEASE</version>
</dependency>

<dependency>
    <groupId>org.apache.logging.log4j</groupId>
    <artifactId>log4j-core</artifactId>
    <version>2.8.2</version>
</dependency>

<dependency>
    <groupId>org.apache.zookeeper</groupId>
    <artifactId>zookeeper</artifactId>
    <version>3.5.7</version>
</dependency>
</dependencies>
```


资源配置文件中配置日志文件

```
log4j.rootLogger=INFO, stdout 
log4j.appender.stdout=org.apache.log4j.ConsoleAppender 
log4j.appender.stdout.layout=org.apache.log4j.PatternLayout 
log4j.appender.stdout.layout.ConversionPattern=%d %p [%c] 

- %m%n 
  log4j.appender.logfile=org.apache.log4j.FileAppender 
  log4j.appender.logfile.File=target/spring.log 
  log4j.appender.logfile.layout=org.apache.log4j.PatternLayout 
  log4j.appender.logfile.layout.ConversionPattern=%d %p [%c] 
- %m%n
   
```

在客户端中生成具体代码
初始化并且负责监听节点
主要通过设置连接的服务器，以及超时参数，监听匿名函数new Watcher() {}

     // 注意：逗号左右不能有空格
     private String connectString = "hadoop102:2181,hadoop103:2181,hadoop104:2181";
        private int sessionTimeout = 2000;
        private ZooKeeper zkClient;@Before
    public void init() throws IOException {
    
        zkClient = new ZooKeeper(connectString, sessionTimeout, new Watcher() {
            @Override
            public void process(WatchedEvent watchedEvent) {
        });
    }
    
    }


 
创建一个新的节点
创建的节点必须在初始化节点这些之后，通过注解，在之前中加入before

第一个参数是路径
第二个参数是数据，要求是字节类型，需要用getBytes()
第三个参数是权限，Ids.OPEN_ACL_UNSAFE允许所有人进行访问
第四个参数是创建节点的类型

```
 @Test
    public void create() throws KeeperException, InterruptedException {
        String nodeCreated = zkClient.create("/manongyanjiuseng ", "123".getBytes(), ZooDefs.Ids.OPEN_ACL_UNSAFE, CreateMode.PERSISTENT);
 
```

获取子节点并且监听其变化
获取子节点通过getChildren()
关于获取子节点一共有两种

获取子节点第一个是路径，第二个是监听函数，如果使用true，则会使用初始化函数中重写的监听函数

    @Test
    public void getChildren() throws KeeperException, InterruptedException {
        List<String> children = zkClient.getChildren("/", true);
    for (String child : children) {
        System.out.println(child);
    }
    
    // 延时
    Thread.sleep(Long.MAX_VALUE);



注册一次生效一次，还需要在进行注册
希望通过延迟函数延迟程序的结束，继续监听Thread.sleep(Long.MAX_VALUE);
放在监听函数中就可以注册一次生效一次，之后在注册

       zkClient = new ZooKeeper(connectString, sessionTimeout, new Watcher() {
        @Override
        public void process(WatchedEvent watchedEvent) {
       System.out.println("-------------------------------");
        List<String> children = null;
        try {
            children = zkClient.getChildren("/", true);
    
            for (String child : children) {
                System.out.println(child);
            }
    
            System.out.println("-------------------------------");
        } catch (KeeperException e) {
            e.printStackTrace();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
    });

 

判断节点是否存在
exits函数，返回的是状态信息，通过状态信息判断是否还在
第一个参数是路径
第二个参数是是否监听

 

    @Test
    public void exist() throws KeeperException, InterruptedException {
    Stat stat = zkClient.exists("/manongyanjiuseng", false);
    
    System.out.println(stat==null? "not exist " : "exist");


### 3.4  写数据流程

(客户端向服务端)

发送给leader的时候
通俗解释：客户端给服务器的leader发送写请求，写完数据后给手下发送写请求，手下写完发送给leader，超过半票以上都写了则发回给客户端。之后leader在给其他手下让他们写，写完在发数据给leader

![image-20211031212021671](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/image-20211031212021671.png)

发送给follower的时候
通俗解释：客户端给手下发送写的请求，手下给leader发送写的请求，写完后，给手下发送写的请求，手下写完后给leader发送确认，超过半票，leader确认后，发给刻划断，之后leader在发送写请求给其他手下

 ![image-20211031212037192](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/image-20211031212037192.png)

## 4. 案例：服务器动态上下线监听

图示：

 ![image-20211031212052454](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/image-20211031212052454.png)

服务器上线的时候其实就是服务器启动时去注册信息（创建的都是临时节点）
客户端获取到当前在线的服务器列表后
服务器节点下线后给集群管理
集群管理服务器节点的下件时间通知给客户端
客户端通过获取服务器列表重选选择服务器
服务器代码

获取zookeeper集群的连接，通过zookeeper的构造函数ZooKeeper(connectString, sessionTimeout, new Watcher(){})
将其服务注册到zookeeper集群中，具体通过create的函数，通过获取每个服务器名字、其值、权限、节点类型
执行该函数通过延迟函数
public class DistributeServer {

    private String connectString = "hadoop102:2181,hadoop103:2181,hadoop104:2181";
    private int sessionTimeout = 2000;
    private ZooKeeper zk;
    
    public static void main(String[] args) throws IOException, KeeperException, InterruptedException {
    
        DistributeServer server = new DistributeServer();
        // 1 获取zk连接
        server.getConnect();
    
        // 2 注册服务器到zk集群
        server.regist(args[0]);


        // 3 启动业务逻辑（睡觉）
        server.business();
    
    }
    
    private void business() throws InterruptedException {
        Thread.sleep(Long.MAX_VALUE);
    }
    
    private void regist(String hostname) throws KeeperException, InterruptedException {
        String create = zk.create("/servers/"+hostname, hostname.getBytes(), ZooDefs.Ids.OPEN_ACL_UNSAFE, CreateMode.EPHEMERAL_SEQUENTIAL);
    
        System.out.println(hostname +" is online") ;
    }
    
    private void getConnect() throws IOException {
    
        zk = new ZooKeeper(connectString, sessionTimeout, new Watcher() {
            @Override
            public void process(WatchedEvent watchedEvent) {
    
            }
        });
    }


 
客户端代码

获取zookeeper集群的连接，通过zookeeper的构造函数ZooKeeper(connectString, sessionTimeout, new Watcher(){})
客户端通过监听每个节点，具体监听通过getChildren函数，获取其节点位置，以及是否使用初始化的监听函数，true为使用。获取到的都是以列表存在，输出的时候通过遍历实现，输出的还是一些数组格式。将这些数组都封装到一个列表中，最后统一输出列表即可
执行该函数通过延迟函数
因为注册的时候记录一次
所以在初始化的时候，将其注册放在初始化内部getServerList();

 

    public class DistributeClient {
    private String connectString = "hadoop102:2181,hadoop103:2181,hadoop104:2181";
    private int sessionTimeout = 2000;
    private ZooKeeper zk;
    
    public static void main(String[] args) throws IOException, KeeperException, InterruptedException {
        DistributeClient client = new DistributeClient();
    
        // 1 获取zk连接
        client.getConnect();
    
        // 2 监听/servers下面子节点的增加和删除
        client.getServerList();
    
        // 3 业务逻辑（睡觉）
        client.business();
    
    }
    
    private void business() throws InterruptedException {
        Thread.sleep(Long.MAX_VALUE);
    }
    
    private void getServerList() throws KeeperException, InterruptedException {
        List<String> children = zk.getChildren("/servers", true);
    
        ArrayList<String> servers = new ArrayList<>();
    
        for (String child : children) {
    
            byte[] data = zk.getData("/servers/" + child, false, null);
    
            servers.add(new String(data));
        }
    
        // 打印
        System.out.println(servers);
    }
    
    private void getConnect() throws IOException {
        zk = new ZooKeeper(connectString, sessionTimeout, new Watcher() {
            @Override
            public void process(WatchedEvent watchedEvent) {
    
                try {
                    getServerList();
                } catch (KeeperException e) {
                    e.printStackTrace();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        });
    }

 
 

## 5. 案例：分布式锁

###  5.1 原生zookeeper分布式锁

图示：

![image-20211031212109623](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/image-20211031212109623.png)

创建节点，判断是否是最小的节点
如果不是最小的节点，需要监听前一个的节点

健壮性可以通过CountDownLatch类

内部的代码中具体参数设置
可参考这些文章
java中substring用法详细分析（全）

监听函数
如果集群状态是连接，则释放connectlatch
如果集群类型是删除，且前一个节点的位置等于该节点的文职，则释放该节点

判断节点是否存在不用一直监听
获取节点信息要一直监听getData

 

    public class DistributedLock {
    private final String connectString = "hadoop102:2181,hadoop103:2181,hadoop104:2181";
    private final int sessionTimeout = 2000;
    private final ZooKeeper zk;
    
    private CountDownLatch connectLatch = new CountDownLatch(1);
    private CountDownLatch waitLatch = new CountDownLatch(1);
    
    private String waitPath;
    private String currentMode;
    
    public DistributedLock() throws IOException, InterruptedException, KeeperException {
    
        // 获取连接
        zk = new ZooKeeper(connectString, sessionTimeout, new Watcher() {
            @Override
            public void process(WatchedEvent watchedEvent) {
                // connectLatch  如果连接上zk  可以释放
                if (watchedEvent.getState() == Event.KeeperState.SyncConnected){
                    connectLatch.countDown();
                }
    
                // waitLatch  需要释放
                if (watchedEvent.getType()== Event.EventType.NodeDeleted && watchedEvent.getPath().equals(waitPath)){
                    waitLatch.countDown();
                }
            }
        });
    
        // 等待zk正常连接后，往下走程序
        connectLatch.await();
    
        // 判断根节点/locks是否存在
        Stat stat = zk.exists("/locks", false);
    
        if (stat == null) {
            // 创建一下根节点
            zk.create("/locks", "locks".getBytes(), ZooDefs.Ids.OPEN_ACL_UNSAFE, CreateMode.PERSISTENT);
        }
    }
    
    // 对zk加锁
    public void zklock() {
        // 创建对应的临时带序号节点
        try {
            currentMode = zk.create("/locks/" + "seq-", null, ZooDefs.Ids.OPEN_ACL_UNSAFE, CreateMode.EPHEMERAL_SEQUENTIAL);
    
            // wait一小会, 让结果更清晰一些
            Thread.sleep(10);
    
            // 判断创建的节点是否是最小的序号节点，如果是获取到锁；如果不是，监听他序号前一个节点
    
            List<String> children = zk.getChildren("/locks", false);
    
            // 如果children 只有一个值，那就直接获取锁； 如果有多个节点，需要判断，谁最小
            if (children.size() == 1) {
                return;
            } else {
                Collections.sort(children);
    
                // 获取节点名称 seq-00000000
                String thisNode = currentMode.substring("/locks/".length());
                // 通过seq-00000000获取该节点在children集合的位置
                int index = children.indexOf(thisNode);
    
                // 判断
                if (index == -1) {
                    System.out.println("数据异常");
                } else if (index == 0) {
                    // 就一个节点，可以获取锁了
                    return;
                } else {
                    // 需要监听  他前一个节点变化
                    waitPath = "/locks/" + children.get(index - 1);
                    zk.getData(waitPath,true,new Stat());
    
                    // 等待监听
                    waitLatch.await();
    
                    return;
                }
            }


        } catch (KeeperException e) {
            e.printStackTrace();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }


    }
    
    // 解锁
    public void unZkLock() {
    
        // 删除节点
        try {
            zk.delete(this.currentMode,-1);
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (KeeperException e) {
            e.printStackTrace();
        }
    
    }



测试代码： 

    public class DistributedLockTest { 
    public static void main(String[] args) throws InterruptedException, IOException, KeeperException {
    
       final  DistributedLock lock1 = new DistributedLock();
    
        final  DistributedLock lock2 = new DistributedLock();
    
       new Thread(new Runnable() {
           @Override
           public void run() {
               try {
                   lock1.zklock();
                   System.out.println("线程1 启动，获取到锁");
                   Thread.sleep(5 * 1000);
    
                   lock1.unZkLock();
                   System.out.println("线程1 释放锁");
               } catch (InterruptedException e) {
                   e.printStackTrace();
               }
           }
       }).start();
    
        new Thread(new Runnable() {
            @Override
            public void run() {
    
                try {
                    lock2.zklock();
                    System.out.println("线程2 启动，获取到锁");
                    Thread.sleep(5 * 1000);
    
                    lock2.unZkLock();
                    System.out.println("线程2 释放锁");
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }).start();
    
    }


###  5.2 curator分布式锁

原生的 Java API 开发存在的问题
（1）会话连接是异步的，需要自己去处理。比如使用CountDownLatch
（2）Watch 需要重复注册，不然就不能生效
（3）开发的复杂性还是比较高的
（4）不支持多节点删除和创建。需要自己去递归

curator可以解决上面的问题

添加相关的依赖文件

```
<dependency>
    <groupId>org.apache.curator</groupId>
    <artifactId>curator-framework</artifactId>
    <version>4.3.0</version>
</dependency>
<dependency>
    <groupId>org.apache.curator</groupId>
    <artifactId>curator-recipes</artifactId>
    <version>4.3.0</version>
</dependency>
<dependency>
    <groupId>org.apache.curator</groupId>
    <artifactId>curator-client</artifactId>
    <version>4.3.0</version>
</dependency>
```


 
主要是通过工程类的定义


编写实现代码如下

    public class CuratorLockTest {
    public static void main(String[] args) {
    
        // 创建分布式锁1
        InterProcessMutex lock1 = new InterProcessMutex(getCuratorFramework(), "/locks");
    
        // 创建分布式锁2
        InterProcessMutex lock2 = new InterProcessMutex(getCuratorFramework(), "/locks");
    
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    lock1.acquire();
                    System.out.println("线程1 获取到锁");
    
                    lock1.acquire();
                    System.out.println("线程1 再次获取到锁");
    
                    Thread.sleep(5 * 1000);
    
                    lock1.release();
                    System.out.println("线程1 释放锁");
    
                    lock1.release();
                    System.out.println("线程1  再次释放锁");
    
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }).start();
    
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    lock2.acquire();
                    System.out.println("线程2 获取到锁");
    
                    lock2.acquire();
                    System.out.println("线程2 再次获取到锁");
    
                    Thread.sleep(5 * 1000);
    
                    lock2.release();
                    System.out.println("线程2 释放锁");
    
                    lock2.release();
                    System.out.println("线程2  再次释放锁");
    
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }).start();
    }
    
    private static CuratorFramework getCuratorFramework() {
    
        ExponentialBackoffRetry policy = new ExponentialBackoffRetry(3000, 3);
    
        CuratorFramework client = CuratorFrameworkFactory.builder().connectString("hadoop102:2181,hadoop103:2181,hadoop104:2181")
                .connectionTimeoutMs(2000)
                .sessionTimeoutMs(2000)
                .retryPolicy(policy).build();
    
        // 启动客户端
        client.start();
    
        System.out.println("zookeeper 启动成功");
        return client;
    }

## 6.总结企业面试

企业中常考的面试有选举机制、集群安装以及常用命令

1.选举机制
半数机制，超过半数的投票通过，即通过。
（1）第一次启动选举规则：
投票过半数时，服务器 id 大的胜出
（2）第二次启动选举规则：
		①EPOCH 大的直接胜出
		②EPOCH 相同，事务 id 大的胜出
		③事务 id 相同，服务器 id 大的胜出

2.集群安装

安装奇数台
服务器台数多：好处，提高可靠性；坏处：提高通信延时



3.ZK 集群中有几种不同的角色 ，以及区别？

  Leader、Follower、Observer 三种角色。

 区别：

 集群中有且只能有一个 Leader，Leader 负责对整个集群的写请求事务进行提交，在一个集群选出 Leader 之前是无法对外提供服务的。Follower 和 Observer 都只能处理读请求，区别是 Follower 有投票权可以参与 Leader 的竞选，Observer 无法参与 Leader 的竞选

4.常用命令
ls、get、create、delete

 

[Zookeeper常见面试题](https://zhuanlan.zhihu.com/p/)





本文来源于尚硅谷2021 Zookeeper课程，仅供个人学习。

