---
title: JVM-常见参数配置
date: 2022-03-31 19:05:35
tags:
---

**测试环境：\**JVM配置为\**2核1G，JAVA8，固定设置堆大小 1G**

1

```
java version "1.8.0_192"
```

2

```
Java(TM) SE Runtime Environment (build 1.8.0_192-b12)
```

3

```
Java HotSpot(TM) 64-Bit Server VM (build 25.192-b12, mixed mode)
```

4

```

```

5

```
# 默认大小通常太小，尽量授予尽可能多的内存，增加CPU的时候，内存也应该增加
```

6

```
java -Xmx1024m  -jar performance-1.0.0.jar
```

**1、 示例代码 -1**

1

```
// 启动程序，模拟用户请求
```

2

```
// 每100毫秒钟创建150线程，每个线程创建一个512kb的对象，最多一秒同时存在1500线程，占用内存750m（75%），查看GC的情况
```

3

```
@SpringBootApplication
```

4

```
public class PerformanceApplication {
```

5

```
    public static void main(String[] args) {
```

6

```
        SpringApplication.run(PerformanceApplication.class, args);
```

7

```
        Executors.newScheduledThreadPool(1).scheduleAtFixedRate(() -> {
```

8

```
            new Thread(() -> {
```

9

```
                for (int i = 0; i < 150; i++) {
```

10

```
                    try {
```

11

```
                        //  不干活，专门512kb的小对象
```

12

```
                        byte[] temp = new byte[1024 * 512];
```

13

```
                        Thread.sleep(new Random().nextInt(1000)); // 随机睡眠1秒以内
```

14

```
                    } catch (InterruptedException e) {
```

15

```
                        e.printStackTrace();
```

16

```
                    }
```

17

```
                }
```

18

```
            }).start();
```

19

```
        }, 100, 100, TimeUnit.MILLISECONDS);
```

20

```
    }
```

21

```
}
```

22

```

```

23

```
// 打包 mvn clean package
```

24

```
// 服务器上运行 performance-1.0.0.jar
```

25

```
// 对象存活在1秒左右的场景，远远超过平时接口的响应时间要求，场景应该为吞吐量优先
```

1.1 GC分析，主要查看GC导致的stop-the-world，这将导致我们的程序延时增大。

1

```
# 查找到performance-1.0.0.jar的进程号
```

2

```
jcmd | grep "performance-1.0.0.jar" | awk '{print $1}'
```

3

```
# jmap 打印heap的概要信息，GC使用的算法，heap的配置及wise heap的使用情况
```

4

```
jmap -heap $(jcmd | grep "performance-1.0.0.jar" | awk '{print $1}') 
```

5

```

```

6

```
# 收集GC日志（日志离线分析，主要用于检查故障看出是不是因为GC导致的程序卡顿）
```

7

```
# 不建议直接输出 java -Xmx1024m -XX:+PrintGCDetails -XX:+PrintGCTimeStamps -jar performance-1.0.0.jar
```

8

```
java -Xmx1024m -Xloggc:/netease/gc1.log -jar performance-1.0.0.jar
```

9

```
# 分析GC日志（）
```

10

```
GCViewer工具，辅助分析GC日志文件 https://github.com/chewiebug/GCViewer
```

11

```

```

12

```
# jstat 动态监控GC统计信息，间隔1000毫秒统计一次，每10行数据后输出列标题
```

13

```
jstat -gc -h10 $(jcmd | grep "performance-1.0.0.jar" | awk '{print $1}') 1000
```

14

```

```

1.2 GC调优

1

```
# 通过命令查看参数：java -XX:+PrintFlagsFinal –version | grep 参数关键字
```

2

```
# Parallel GC  服务器默认  java -Xmx1024m -Xloggc:/netease/gc1.log -jar performance-1.0.0.jar
```

3

```
UseAdaptiveSizePolicy自适应默认开启，所以Eden区会自动变化大小
```

4

```
 S0C    S1C    S0U    S1U      EC       EU        OC         OU       MC     MU    CCSC   CCSU   YGC     YGCT    FGC    FGCT     GCT   
```

5

```
29184.0 29184.0  0.0    0.0   290816.0 275028.2  214528.0   90453.2   35068.0 33496.5 4656.0 4334.9     15    0.285   7      0.549    0.834
```

6

```
29184.0 37888.0 28704.9  0.0   273408.0 195849.2  214528.0   136022.6  35068.0 33497.2 4656.0 4334.9     16    0.306   7      0.549    0.856
```

7

```
37888.0 37888.0  0.0    0.0   273408.0 141381.4  230912.0   89954.2   35068.0 33497.7 4656.0 4334.9     17    0.341   8      0.624    0.966
```

8

```
37888.0 49152.0 37409.1  0.0   250880.0 98232.2   230912.0   127331.4  35068.0 33498.4 4656.0 4334.9     18    0.363   8      0.624    0.987
```

9

```
49152.0 49152.0  0.0   48673.5 250880.0 82729.6   230912.0   152932.2  35068.0 33498.8 4656.0 4334.9     19    0.385   8      0.624    1.009
```

10

```
49152.0 63488.0  0.0    0.0   222208.0 70943.1   234496.0   90654.2   35068.0 33505.3 4656.0 4334.9     20    0.409   9      0.697    1.106
```

11

```
63488.0 63488.0  0.0   63009.9 222208.0 104636.8  234496.0   100894.5  35068.0 33508.4 4656.0 4334.9     21    0.431   9      0.697    1.128
```

12

```
63488.0 81920.0 63009.9  0.0   185344.0 139024.0  234496.0   111646.8  35068.0 33512.1 4656.0 4334.9     22    0.452   9      0.697    1.149
```

13

```
91648.0 100864.0 74786.3  0.0   147456.0 33980.1   234496.0   111646.8  35068.0 33528.3 4656.0 4334.9     24    0.495   9      0.697   1.192
```

14

```
107520.0 112640.0 74274.3  0.0   123904.0 30746.2   234496.0   111646.8  35068.0 33528.3 4656.0 4334.9     26    0.539   9      0.697  1.236
```

15

```
默认情况，实时监控结果：10秒内11次YGC，2次FullGC，总耗时0.4秒
```

16

```

```

17

```
1、 调大-XX:ParallelGCThreads=4  java -Xmx1024m -Xloggc:/netease/gc2.log -XX:ParallelGCThreads=4  -jar performance-1.0.0.jar
```

18

```
 S0C    S1C    S0U    S1U      EC       EU        OC         OU       MC     MU    CCSC   CCSU   YGC     YGCT    FGC    FGCT     GCT   
```

19

```
10752.0 9216.0  0.0    0.0   264192.0 195460.3  105472.0   58165.2   35120.0 33480.3 4656.0 4333.8     13    0.153   3      0.219    0.373
```

20

```
10752.0 12288.0  0.0    0.0   324608.0 59139.9   135168.0   69954.5   35120.0 33483.8 4656.0 4334.9     14    0.180   4      0.277    0.458
```

21

```
10752.0 12288.0  0.0    0.0   324608.0 190623.5  135168.0   69954.5   35120.0 33483.8 4656.0 4334.9     14    0.180   4      0.277    0.458
```

22

```
10752.0 12288.0  0.0    0.0   324608.0 317022.0  135168.0   69954.5   35120.0 33483.8 4656.0 4334.9     14    0.180   4      0.277    0.458
```

23

```
12288.0 12288.0  0.0    0.0   324608.0 156095.2  166912.0   82766.1   35120.0 33486.7 4656.0 4334.9     15    0.199   5      0.325    0.524
```

24

```
12288.0 12288.0  0.0    0.0   324608.0 311437.3  166912.0   82766.1   35120.0 33486.7 4656.0 4334.9     15    0.199   5      0.325    0.524
```

25

```
12288.0 15360.0  0.0    0.0   318464.0 175117.9  195072.0   90455.3   35120.0 33487.1 4656.0 4334.9     16    0.217   6      0.380    0.598
```

26

```
15360.0 15360.0  0.0    0.0   318464.0 37004.8   212480.0   90463.3   35120.0 33487.1 4656.0 4334.9     17    0.231   7      0.430    0.661
```

27

```
15360.0 15360.0  0.0    0.0   318464.0 225927.9  212480.0   90463.3   35120.0 33487.1 4656.0 4334.9     17    0.231   7      0.430    0.661
```

28

```
15360.0 19456.0  0.0    0.0   310272.0 103539.3  230400.0   90983.0   35120.0 33487.8 4656.0 4334.9     18    0.243   8      0.484    0.727
```

29

```
实时监控结果：10秒内5次GC，总耗时0.35。 如果有多线程，一定要调大参数
```

30

```

```

31

```
2、 降低耗时，设置-XX:MaxGCPauseMills=10   java -Xmx1024m -Xloggc:/netease/gc3.log -XX:MaxGCPauseMillis=10  -jar performance-1.0.0.jar
```

32

```
 S0C    S1C    S0U    S1U      EC       EU        OC         OU       MC     MU    CCSC   CCSU   YGC     YGCT    FGC    FGCT     GCT   
```

33

```
12800.0 18944.0  0.0    0.0   121856.0 15777.8   176640.0   86351.4   35120.0 33512.4 4656.0 4333.5     21    0.217  11      0.523    0.740
```

34

```
12800.0 22016.0  0.0    0.0   121856.0 54705.3   185856.0   88403.0   35120.0 33513.2 4656.0 4333.5     22    0.230  12      0.568    0.798
```

35

```
25088.0 22016.0  0.0    0.0   121856.0 91971.1   188416.0   88918.6   35120.0 33513.2 4656.0 4333.5     23    0.243  13      0.613    0.856
```

36

```
33280.0 29184.0  0.0    0.0   117760.0 31698.5   183296.0   88412.8   35120.0 33513.2 4656.0 4333.5     25    0.268  15      0.707    0.975
```

37

```
33280.0 38912.0  0.0    0.0   112128.0 91608.5   179200.0   88928.0   35120.0 33513.2 4656.0 4333.5     26    0.280  16      0.754    1.035
```

38

```
45056.0 52224.0  0.0    0.0   104960.0 64733.6   174080.0   88420.9   35120.0 33513.7 4656.0 4333.5     28    0.305  18      0.844    1.149
```

39

```
60416.0 70144.0  0.0    0.0   95232.0  51840.1   173568.0   89100.1   35120.0 33514.1 4656.0 4333.5     30    0.331  19      0.891    1.222
```

40

```
74752.0 86016.0 71714.2  0.0   83968.0  79793.1   173568.0   89100.1   35120.0 33514.1 4656.0 4333.5     32    0.355  19      0.891    1.245
```

41

```
108032.0 102400.0  0.0   72770.2 76800.0  62256.3   173568.0   89100.1   35120.0 33514.8 4656.0 4333.5     35    0.392  19    0.891    1.283
```

42

```
116224.0 116224.0  0.0   73282.2 71680.0   3641.2   173568.0   89108.1   35120.0 33518.8 4656.0 4333.5     39    0.441  19    0.891    1.331
```

43

```
实时监控结果：10秒内18次YGC，8次FGC，GC次数变多，总的时间反倒变长。 代表单次GC时间加速，会换来更多的GC次数，这种情况下不合适。
```

44

```

```

45

```
# CMS
```

46

```
3、 改用CMS回收器  java -Xmx1024m -Xloggc:/netease/gc4.log -XX:+UseConcMarkSweepGC  -jar performance-1.0.0.jar
```

47

```
 S0C    S1C    S0U    S1U      EC       EU        OC         OU       MC     MU    CCSC   CCSU   YGC     YGCT    FGC    FGCT     GCT   
```

48

```
2048.0 2048.0 1540.4  0.0   16384.0   3091.6   166784.0   144616.6  35144.0 33474.4 4680.0 4334.1     84    0.415  39      0.235    0.651
```

49

```
2048.0 2048.0 1540.4  0.0   16384.0    0.0     195804.0   166637.9  35144.0 33477.0 4680.0 4334.1     92    0.450  44      0.271    0.721
```

50

```
2048.0 2048.0 1538.4  0.0   16384.0   5661.8   195804.0   125169.0  35144.0 33477.0 4680.0 4334.1    100    0.480  49      0.298    0.778
```

51

```
2048.0 2048.0 1538.4  0.0   16384.0   5153.7   217156.0   187639.7  35144.0 33477.4 4680.0 4334.1    110    0.520  53      0.323    0.843
```

52

```
2048.0 2048.0  0.0   1540.4 16384.0    0.0     241052.0   207613.3  35144.0 33477.4 4680.0 4334.1    121    0.564  57      0.347    0.911
```

53

```
2048.0 2048.0  0.0   1540.4 16384.0   8773.2   241052.0   185600.7  35144.0 33477.4 4680.0 4334.1    131    0.603  61      0.371    0.974
```

54

```
2048.0 2048.0  0.0   1538.4 16384.0    0.0     242600.0   160004.8  35144.0 33477.4 4680.0 4334.1    143    0.649  65      0.396    1.045
```

55

```
2048.0 2048.0  0.0   1540.4 16384.0   4648.6   381032.0   228619.2  35144.0 33478.1 4680.0 4334.1    155    0.709  66      0.409    1.118
```

56

```
2048.0 2048.0 1566.2  0.0   16384.0   5402.5   381548.0   374564.8  35400.0 33721.3 4680.0 4364.3    168    0.782  67      0.410    1.192
```

57

```
实时监控结果：10秒内85次YGC，28次FGC，总耗时0.54。 cms这种高频回收并不是适合这个场景。
```

58

```
4、 增加线程 java -Xmx1024m -Xloggc:/netease/gc4.log -XX:+UseConcMarkSweepGC  -XX:ConcGCThreads=3 -jar performance-1.0.0.jar
```

59

```
 S0C    S1C    S0U    S1U      EC       EU        OC         OU       MC     MU    CCSC   CCSU   YGC     YGCT    FGC    FGCT     GCT   
```

60

```
2048.0 2048.0  0.0   1538.8 16384.0   7246.8   156612.0   80654.6   35196.0 33516.0 4732.0 4333.0     73    0.364  38      0.225    0.589
```

61

```
2048.0 2048.0 1538.4  0.0   16384.0   5170.8   163448.0   84756.2   35196.0 33516.3 4732.0 4333.0     80    0.393  42      0.250    0.643
```

62

```
2048.0 2048.0 1540.4  0.0   16384.0    0.0     177112.0   146202.8  35196.0 33517.5 4732.0 4333.0     88    0.423  46      0.275    0.698
```

63

```
2048.0 2048.0 1540.8  0.0   16384.0   8246.7   203568.0   125726.2  35196.0 33519.0 4732.0 4333.0     96    0.455  50      0.299    0.754
```

64

```
2048.0 2048.0 1540.4  0.0   16384.0    0.0     213816.0   158500.2  35196.0 33519.0 4732.0 4333.0    106    0.497  55      0.325    0.822
```

65

```
2048.0 2048.0 1538.4  0.0   16384.0    0.0     217236.0   157992.8  35196.0 33519.3 4732.0 4333.0    116    0.536  59      0.349    0.886
```

66

```
2048.0 2048.0 1540.8  0.0   16384.0    0.0     259916.0   167213.6  35196.0 33519.3 4732.0 4333.0    126    0.577  62      0.373    0.950
```

67

```
2048.0 2048.0  0.0   1538.4 16384.0    0.0     259916.0   211763.6  35196.0 33519.3 4732.0 4333.0    137    0.617  65      0.387    1.004
```

68

```
2048.0 2048.0  0.0   1536.0 16384.0   3608.3   349532.0   256826.1  35196.0 33519.3 4732.0 4333.0    149    0.682  67      0.399    1.081
```

69

```
2048.0 2048.0  0.0   1540.4 16384.0   3087.0   349532.0   250174.0  35196.0 33520.5 4732.0 4333.0    161    0.726  69      0.412    1.139
```

70

```
实时监控结果：10秒内88次YGC，31次FGC，总耗时0.55，差不多的情况。
```

71

```
# G1 建议大堆使用
```

72

```
5、 改用G1 java -Xmx1024m -Xloggc:/netease/gc10.log  -XX:+UseG1GC -jar performance-1.0.0.jar
```

73

```
S0C    S1C    S0U    S1U      EC       EU        OC         OU       MC     MU    CCSC   CCSU   YGC     YGCT    FGC    FGCT     GCT   
```

74

```
 0.0    0.0    0.0    0.0   55296.0   4096.0   993280.0   244610.8  35200.0 33464.4 4736.0 4333.5    168    1.229   0      0.000    1.229
```

75

```
 0.0    0.0    0.0    0.0   55296.0   6144.0   993280.0   411220.0  35200.0 33466.3 4736.0 4333.5    177    1.414   0      0.000    1.414
```

76

```
 0.0    0.0    0.0    0.0   660480.0 17408.0   388096.0   248910.9  35200.0 33466.3 4736.0 4333.5    187    1.645   0      0.000    1.645
```

77

```
 0.0    0.0    0.0    0.0   613376.0 39936.0   435200.0   435196.7  35200.0 33466.3 4736.0 4333.5    197    1.863   0      0.000    1.863
```

78

```
 0.0    0.0    0.0    0.0   55296.0   6144.0   993280.0   502275.2  35200.0 33466.3 4736.0 4333.5    206    2.088   0      0.000    2.088
```

79

```
 0.0    0.0    0.0    0.0   55296.0   6144.0   993280.0   497159.3  35200.0 33466.3 4736.0 4333.5    216    2.320   0      0.000    2.320
```

80

```
 0.0    0.0    0.0    0.0   493568.0 41984.0   555008.0   553992.8  35200.0 33466.3 4736.0 4333.5    227    2.556   0      0.000    2.556
```

81

```
 0.0    0.0    0.0    0.0   660480.0  1024.0   388096.0   205221.1  35200.0 33466.3 4736.0 4333.5    237    2.822   0      0.000    2.822
```

82

```
 0.0    0.0    0.0    0.0   55296.0   6144.0   993280.0   464105.0  35200.0 33466.7 4736.0 4333.5    247    3.056   0      0.000    3.056
```

83

```
 0.0    0.0    0.0    0.0   570368.0 38912.0   478208.0   477630.5  35200.0 33469.3 4736.0 4333.5    258    3.322   0      0.000    3.322
```

84

```
实时监控结果：不行...
```

85

```
6、增加分区大小 java -Xmx1024m -Xloggc:/netease/gc11.log  -XX:+UseG1GC -XX:G1HeapRegionSize=64m -jar performance-1.0.0.jar
```

86

```
 S0C    S1C    S0U    S1U      EC       EU        OC         OU       MC     MU    CCSC   CCSU   YGC     YGCT    FGC    FGCT     GCT   
```

87

```
 0.0   32768.0  0.0   32768.0 65536.0    0.0     360448.0   248859.1  35196.0 33493.9 4732.0 4333.3    123    1.723   0      0.000    1.723
```

88

```
 0.0   32768.0  0.0   32768.0 163840.0 65536.0   262144.0   150835.5  35196.0 33493.9 4732.0 4333.3    127    1.784   0      0.000    1.784
```

89

```
 0.0   32768.0  0.0   32768.0 65536.0    0.0     360448.0   194563.3  35196.0 33493.9 4732.0 4333.3    132    1.834   0      0.000    1.834
```

90

```
 0.0   32768.0  0.0   32768.0 131072.0   0.0     294912.0   192001.0  35196.0 33493.9 4732.0 4333.3    136    1.880   0      0.000    1.880
```

91

```
 0.0   32768.0  0.0   32768.0 196608.0   0.0     229376.0   111728.2  35196.0 33493.9 4732.0 4333.3    142    1.943   0      0.000    1.943
```

92

```
 0.0   32768.0  0.0   32768.0 131072.0 65536.0   294912.0   180224.5  35196.0 33493.9 4732.0 4333.3    144    1.972   0      0.000    1.972
```

93

```
 0.0   32768.0  0.0   32768.0 163840.0 98304.0   262144.0   126091.5  35196.0 33493.9 4732.0 4333.3    150    2.036   0      0.000    2.036
```

94

```
 0.0   32768.0  0.0   32768.0 98304.0  32768.0   327680.0   201220.0  35196.0 33493.9 4732.0 4333.3    154    2.081   0      0.000    2.081
```

95

```
 0.0   32768.0  0.0   32768.0 163840.0 65536.0   262144.0   144384.5  35196.0 33493.9 4732.0 4333.3    159    2.132   0      0.000    2.132
```

96

```
 0.0   32768.0  0.0   32768.0 196608.0   0.0     229376.0   107380.4  35196.0 33493.9 4732.0 4333.3    166    2.199   0      0.000    2.199
```

**2、 示例代码 -2**

1

```
// 启动程序，模拟用户请求
```

2

```
// 每100毫秒钟创建1000线程，每个线程创建一个512kb的对象，最多100毫秒内同时存在1000线程，并发量1000/s，吞吐量6000/s，查看GC的情况
```

3

```
@SpringBootApplication
```

4

```
public class PerformanceApplication {
```

5

```
    public static void main(String[] args) {
```

6

```
        SpringApplication.run(PerformanceApplication.class, args);
```

7

```
        Executors.newScheduledThreadPool(1).scheduleAtFixedRate(() -> {
```

8

```
            new Thread(() -> {
```

9

```
                for (int i = 0; i < 1000; i++) {
```

10

```
                    try {
```

11

```
                        //  不干活，专门512kb的小对象
```

12

```
                        byte[] temp = new byte[1024 * 512];
```

13

```
                        Thread.sleep(new Random().nextInt(100)); // 随机睡眠200毫秒秒以内
```

14

```
                    } catch (InterruptedException e) {
```

15

```
                        e.printStackTrace();
```

16

```
                    }
```

17

```
                }
```

18

```
            }).start();
```

19

```
        }, 100, 100, TimeUnit.MILLISECONDS);
```

20

```
    }
```

21

```
}
```

22

```

```

23

```
// 打包 mvn clean package
```

24

```
// 服务器上运行 performance-1.1.0.jar
```

25

```
// 对象存活时间短，处理量大，属于响应时间优先
```



**2.1**  **GC调优**



1

```
# 实时监控：jstat -gc -h10 $(jcmd | grep "performance-1.1.0.jar" | awk '{print $1}') 1000
```

2

```
# Parallel GC  服务器默认  java -Xmx1024m -Xloggc:/netease/gc6.log -jar performance-1.1.0.jar
```

3

```
UseAdaptiveSizePolicy自适应默认开启，所以Eden区会自动变化大小
```

4

```
 S0C    S1C    S0U    S1U      EC       EU        OC         OU       MC     MU    CCSC   CCSU   YGC     YGCT    FGC    FGCT     GCT   
```

5

```
37376.0 37888.0 34817.1  0.0   272384.0 92500.6   125952.0   57532.9   35120.0 33541.2 4656.0 4335.4    286    2.698   7      0.360    3.059
```

6

```
36864.0 36864.0 32289.0  0.0   275456.0   0.0     125952.0   87877.8   35120.0 33541.2 4656.0 4335.4    300    2.812   7      0.360    3.173
```

7

```
35328.0 35840.0 31777.0  0.0   276480.0   0.0     128000.0   61118.4   35120.0 33542.5 4656.0 4335.4    314    2.924   8      0.404    3.328
```

8

```
34816.0 34816.0 31297.0  0.0   279552.0 139082.4  128000.0   102215.6  35120.0 33555.8 4656.0 4335.4    328    3.029   8      0.404    3.433
```

9

```
33792.0 33792.0 30752.9  0.0   281600.0 181082.7  130048.0   68303.1   35120.0 33555.8 4656.0 4335.4    342    3.138   9      0.448    3.586
```

10

```
33280.0 33280.0  0.0   29728.9 282624.0 132715.1  130048.0   122168.7  35120.0 33555.8 4656.0 4335.4    357    3.254   9      0.448    3.701
```

11

```
33280.0 33280.0 25152.8  0.0   282624.0 78765.8   132608.0   98078.6   35120.0 33556.9 4656.0 4335.4    372    3.361  10      0.490    3.851
```

12

```
31232.0 27136.0  0.0   26688.8 285696.0 136307.1  136704.0   76004.6   35120.0 33558.1 4656.0 4335.4    387    3.479  11      0.542    4.021
```

13

```
31744.0 31232.0 26656.8  0.0   286208.0   0.0     138752.0   49337.7   35120.0 33558.1 4656.0 4335.4    402    3.595  12      0.585    4.180
```

14

```
29184.0 29184.0 25152.8  0.0   289792.0   0.0     138752.0   112435.6  35120.0 33558.1 4656.0 4335.4    418    3.716  12      0.585    4.301
```

15

```
默认情况，实时监控结果：10秒内132次YGC，5次FullGC，单词YGC耗时0.008s，总耗时1.242秒
```

16

```

```

17

```
1、 调大-XX:ParallelGCThreads=4  java -Xmx1024m -Xloggc:/netease/gc7.log -XX:ParallelGCThreads=4  -jar performance-1.1.0.jar
```

18

```
 S0C    S1C    S0U    S1U      EC       EU        OC         OU       MC     MU    CCSC   CCSU   YGC     YGCT    FGC    FGCT     GCT   
```

19

```
47616.0 48128.0 43073.3  0.0   252416.0 227997.7  130560.0   122261.9  35120.0 33506.0 4656.0 4334.8    197    2.479   6      0.359    2.838
```

20

```
47104.0 47104.0 43105.3  0.0   254976.0 153173.5  116736.0   67205.9   35120.0 33506.0 4656.0 4334.8    208    2.629   7      0.405    3.034
```

21

```
46080.0 46080.0 44097.3 42529.3 257024.0   0.0     116736.0   86822.5   35120.0 33506.0 4656.0 4334.8   221    2.767   7      0.405    3.172
```

22

```
45568.0 45568.0  0.0   42049.3 258048.0 129250.1  116736.0   104391.0  35120.0 33506.0 4656.0 4334.8    233    2.933   7      0.405    3.338
```

23

```
44544.0 44544.0  0.0   43041.3 260096.0 27359.1   120320.0   68802.0   35120.0 33506.0 4656.0 4334.8    245    3.111   8      0.463    3.574
```

24

```
44544.0 44544.0 39937.2  0.0   260096.0 51577.7   120320.0   97642.8   35120.0 33506.0 4656.0 4334.8    258    3.283   8      0.463    3.746
```

25

```
44544.0 36864.0  0.0   36353.1 261120.0  7862.2   121856.0   68276.2   35120.0 33506.0 4656.0 4334.8    271    3.439   9      0.508    3.947
```

26

```
42496.0 42496.0  0.0   37441.1 263680.0   0.0     121856.0   106301.3  35120.0 33506.0 4656.0 4334.8    285    3.654   9      0.508    4.162
```

27

```
40960.0 41472.0 37889.2  0.0   265216.0   0.0     122880.0   85228.3   35120.0 33506.0 4656.0 4334.8    298    3.834  10      0.551    4.385
```

28

```
41472.0 41472.0 37441.1  0.0   266240.0   0.0     123904.0   57506.1   35120.0 33515.1 4656.0 4334.8    312    4.010  11      0.595    4.605
```

29

```
实时监控结果：10秒内115次GC，5次fullGC，总耗时1.767，单次YGC时间0.014s 多线程，也不管用
```

30

```

```

31

```
2、 降低耗时，设置-XX:MaxGCPauseMills=5   java -Xmx1024m -Xloggc:/netease/gc8.log -XX:MaxGCPauseMillis=5  -jar performance-1.1.0.jar
```

32

```
 S0C    S1C    S0U    S1U      EC       EU        OC         OU       MC     MU    CCSC   CCSU   YGC     YGCT    FGC    FGCT     GCT   
```

33

```
11264.0 12800.0  0.0    0.0   50688.0    0.0     48128.0    28445.5   35200.0 33483.7 4736.0 4334.6     22    0.136   3      0.184    0.320
```

34

```
26624.0 25088.0  0.0   18496.6 44032.0  11192.5   48128.0    32045.6   35200.0 33483.7 4736.0 4334.6     29    0.165   3      0.184    0.349
```

35

```
33792.0 34304.0 21504.7  0.0   39424.0  11034.2   48128.0    36789.8   35200.0 33483.7 4736.0 4334.6     40    0.218   3      0.184    0.401
```

36

```
34304.0 34816.0 27712.8  0.0   37888.0    0.0     64512.0    44331.6   35200.0 33483.9 4736.0 4334.6     54    0.296   5      0.266    0.561
```

37

```
32768.0 26624.0  0.0    0.0   37888.0    0.0     76288.0    49968.7   35200.0 33483.9 4736.0 4334.6     69    0.385   9      0.429    0.815
```

38

```
47616.0 48640.0 39489.2  0.0   28672.0    0.0     84992.0    54068.5   35200.0 33483.9 4736.0 4334.6     92    0.543  11      0.513    1.056
```

39

```
57856.0 57856.0  0.0   19968.6 20480.0   9283.9   100352.0   59194.0   35200.0 33484.9 4736.0 4334.6    123    0.764  15      0.682    1.446
```

40

```
35840.0 36864.0 13312.4  0.0   13824.0    0.0     115200.0   88901.4   35200.0 33487.8 4736.0 4335.7    172    1.076  26      1.113    2.188
```

41

```
24576.0 17408.0  0.0   16896.5  9216.0    0.0     99840.0    82761.6   35200.0 33488.2 4736.0 4335.7    227    1.363  40      1.757    3.121
```

42

```
14848.0 14848.0 9216.3  0.0    6144.0    0.0     95744.0    84799.3   35200.0 33488.5 4736.0 4335.7    310    1.657  55      2.399    4.056
```

43

```
实时监控结果：结果不太好，不合适。
```

44

```

```

45

```
# CMS
```

46

```
3、 改用CMS回收器  java -Xmx1024m -Xloggc:/netease/gc9.log -XX:+UseConcMarkSweepGC  -jar performance-1.1.0.jar
```

47

```
 S0C    S1C    S0U    S1U      EC       EU        OC         OU       MC     MU    CCSC   CCSU   YGC     YGCT    FGC    FGCT     GCT   
```

48

```
2048.0 2048.0 1536.0  0.0   16384.0    0.0     848412.0   836821.7  35220.0 33468.3 4756.0 4331.8    116    0.804   7      0.037    0.841
```

49

```
17024.0 17024.0 16901.3  0.0   136320.0 91188.6   878208.0   75373.9   35220.0 33468.5 4756.0 4331.8    122    0.859   8      0.114    0.973
```

50

```
17024.0 17024.0  0.0   16901.3 136320.0 90524.2   878208.0   154741.3  35220.0 33468.5 4756.0 4331.8    127    0.900   8      0.114    1.015
```

51

```
17024.0 17024.0  0.0   16901.3 136320.0 67869.0   878208.0   279165.8  35220.0 33468.5 4756.0 4331.8    133    0.953   8      0.114    1.068
```

52

```
17024.0 17024.0 16898.9  0.0   136320.0 29055.4   878208.0   462985.0  35220.0 33469.5 4756.0 4331.8    140    1.020   8      0.114    1.134
```

53

```
17024.0 17024.0  0.0   16898.9 136320.0 32667.9   878208.0   681621.7  35220.0 33472.4 4756.0 4332.9    147    1.089   8      0.114    1.204
```

54

```
17024.0 17024.0  0.0   16902.3 136320.0 27188.4   878208.0   294018.9  35220.0 33472.8 4756.0 4332.9    155    1.174  10      0.128    1.302
```

55

```
17024.0 17024.0 16900.9  0.0   136320.0   0.0     878208.0   607890.7  35220.0 33473.4 4756.0 4332.9    164    1.266  10      0.128    1.394
```

56

```
17024.0 17024.0  0.0   16898.9 136320.0 80996.3   878208.0   225418.4  35220.0 33475.7 4756.0 4332.9    173    1.358  12      0.140    1.499
```

57

```
17024.0 17024.0 16898.9  0.0   136320.0   0.0     878208.0   607899.4  35220.0 33475.7 4756.0 4332.9    184    1.470  12      0.140    1.611
```

58

```
实时监控结果：高频回收，会抢占用户线程，根据实际需要进行调优
```

59

```

```

60

```
# G1 建议大堆使用
```

61

```
4、 改用G1 java -Xmx1024m -Xloggc:/netease/gc10.log  -XX:+UseG1GC -jar performance-1.1.0.jar
```

62

```
S0C    S1C    S0U    S1U      EC       EU        OC         OU       MC     MU    CCSC   CCSU   YGC     YGCT    FGC    FGCT     GCT   
```

63

```
 0.0    0.0    0.0    0.0   55296.0   8192.0   993280.0   592928.3  35200.0 33534.8 4736.0 4331.4    272    3.725   0      0.000    3.725
```

64

```
 0.0    0.0    0.0    0.0   55296.0   8192.0   993280.0   597028.5  35200.0 33534.8 4736.0 4331.4    284    3.988   0      0.000    3.988
```

65

```
 0.0    0.0    0.0    0.0   55296.0   7168.0   993280.0   490485.7  35200.0 33535.9 4736.0 4331.4    295    4.299   0      0.000    4.299
```

66

```
 0.0    0.0    0.0    0.0   55296.0   8192.0   993280.0   603137.7  35200.0 33537.1 4736.0 4331.4    308    4.568   0      0.000    4.568
```

67

```
 0.0    0.0    0.0    0.0   641024.0 22528.0   407552.0   392447.4  35200.0 33537.1 4736.0 4331.4    319    4.869   0      0.000    4.869
```

68

```
 0.0    0.0    0.0    0.0   55296.0   2048.0   993280.0   316671.2  35200.0 33537.1 4736.0 4331.4    330    5.151   0      0.000    5.151
```

69

```
 0.0    0.0    0.0    0.0   55296.0   7168.0   993280.0   614372.8  35200.0 33537.1 4736.0 4331.4    342    5.408   0      0.000    5.408
```

70

```
 0.0    0.0    0.0    0.0   449536.0 44032.0   599040.0   598790.9  35200.0 33537.1 4736.0 4331.4    355    5.715   0      0.000    5.715
```

71

```
 0.0    0.0    0.0    0.0   55296.0   1024.0   993280.0   299773.5  35200.0 33537.1 4736.0 4331.4    367    6.045   0      0.000    6.045
```

72

```
 0.0    0.0    0.0    0.0   55296.0   7168.0   993280.0   625419.5  35200.0 33537.1 4736.0 4331.4    380    6.335   0      0.000    6.335
```

73

```
 实时监控结果：难看的数据
```

74

```
5、增加分区大小 java -Xmx1024m -Xloggc:/netease/gc11.log  -XX:+UseG1GC -XX:G1HeapRegionSize=64m -jar performance-1.1.0.jar
```

75

```
 S0C    S1C    S0U    S1U      EC       EU        OC         OU       MC     MU    CCSC   CCSU   YGC     YGCT    FGC    FGCT     GCT   
```

76

```
 0.0   65536.0  0.0   65536.0 327680.0 262144.0  229376.0   43625.6   35196.0 33417.9 4732.0 4335.1     84    0.899   0      0.000    0.899
```

77

```
 0.0   65536.0  0.0   65536.0 327680.0 229376.0  229376.0   44153.1   35196.0 33417.9 4732.0 4335.1     89    0.944   0      0.000    0.944
```

78

```
 0.0   65536.0  0.0   65536.0 327680.0   0.0     229376.0   43658.6   35196.0 33417.9 4732.0 4335.1     95    1.001   0      0.000    1.001
```

79

```
 0.0   65536.0  0.0   65536.0 327680.0 196608.0  229376.0   43673.1   35196.0 33417.9 4732.0 4335.1    100    1.047   0      0.000    1.047
```

80

```
 0.0   65536.0  0.0   65536.0 327680.0 131072.0  229376.0   43690.6   35196.0 33417.9 4732.0 4335.1    106    1.113   0      0.000    1.113
```

81

```
 0.0   65536.0  0.0   65536.0 327680.0 196608.0  229376.0   43705.6   35196.0 33417.9 4732.0 4335.1    112    1.181   0      0.000    1.181
```

82

```
 0.0   65536.0  0.0   65536.0 327680.0 98304.0   229376.0   44236.6   35196.0 33418.6 4732.0 4335.1    119    1.271   0      0.000    1.271
```

83

```
 0.0   65536.0  0.0   65536.0 327680.0 131072.0  229376.0   43743.6   35196.0 33419.1 4732.0 4335.1    126    1.360   0      0.000    1.360
```

84

```
 0.0   65536.0  0.0   65536.0 327680.0 196608.0  229376.0   44274.6   35196.0 33419.8 4732.0 4335.1    133    1.461   0      0.000    1.461
```

85

```
 0.0   65536.0  0.0   65536.0 393216.0 196608.0  262144.0   43781.6   35196.0 33419.8 4732.0 4335.1    140    1.546   0      0.000    1.546
```





**
**



**3、 结语**

主要是演示切换的过程和思路，实际还是要结合系统情况、系统需要来调整。

1、 GC调优就是逐步调试的过程，对每个参数的含义了解后，再根据官方手册，一个个调试，找到符合应用的最佳配置点。是一个细致活，难度高。

2、 再重复一句，性能问题，98.75%上是业务代码上面。

3、 无监控，不调优。



