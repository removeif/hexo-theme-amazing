---
title: docker安装与使用

toc: true
keywords: categories-docker
date: 2019-09-23 21:35:08
thumbnail: https://cdn.jsdelivr.net/gh/removeif/blog_image/img/2019/20190923213827.png
tags: docker
categories: [基础工具类,docker]
---
### 简介

#### Docker简介

Docker 使用客户端-服务器 (C/S) 架构模式。Docker 客户端会与 Docker 守护进程进行通信。Docker 守护进程会处理复杂繁重的任务，例如建立、运行、发布你的 Docker 容器。Docker 客户端和守护进程可以运行在同一个系统上，当然你也可以使用 Docker 客户端去连接一个远程的 Docker 守护进程。Docker 客户端和守护进程之间通过 socket 或者 RESTful API 进行通信。
<!-- more -->

![](https://cdn.jsdelivr.net/gh/removeif/blog_image/img/2019/20190923210318.png)

- Docker: 开源的容器虚拟化平台
- Docker Hub: 用于分享、管理 Docker 容器的 Docker SaaS 平台 -- [Docker Hub](https://link.jianshu.com/?t=https://registry.hub.docker.com/search?q=library)

#### Docker 守护进程

如上图所示，Docker 守护进程运行在一台主机上。用户并不直接和守护进程进行交互，而是通过 Docker 客户端间接和其通信。

#### Docker 客户端

Docker 客户端，实际上是 docker 的二进制程序，是主要的用户与 Docker 交互方式。它接收用户指令并且与背后的 Docker 守护进程通信，如此来回往复。

#### Docker 内部

要理解 Docker 内部构建，需要理解以下三种部件：

- Docker 镜像 - Docker images
- Docker 仓库 - Docker registeries
- Docker 容器 - Docker containers

#### Docker 镜像

Docker 镜像是 Docker 容器运行时的只读模板，每一个镜像由一系列的层 (layers) 组成。Docker 使用 UnionFS 来将这些层联合到单独的镜像中。UnionFS 允许独立文件系统中的文件和文件夹(称之为分支)被透明覆盖，形成一个单独连贯的文件系统。正因为有了这些层的存在，Docker 是如此的轻量。当你改变了一个 Docker 镜像，比如升级到某个程序到新的版本，一个新的层会被创建。因此，不用替换整个原先的镜像或者重新建立(在使用虚拟机的时候你可能会这么做)，只是一个新的层被添加或升级了。现在你不用重新发布整个镜像，只需要升级，层使得分发 Docker 镜像变得简单和快速。

#### Docker 仓库

Docker 仓库用来保存镜像，可以理解为代码控制中的代码仓库。同样的，Docker 仓库也有公有和私有的概念。公有的 Docker 仓库名字是 Docker Hub。Docker Hub 提供了庞大的镜像集合供使用。这些镜像可以是自己创建，或者在别人的镜像基础上创建。Docker 仓库是 Docker 的分发部分。

#### Docker 容器

Docker 容器和文件夹很类似，一个Docker容器包含了所有的某个应用运行所需要的环境。每一个 Docker 容器都是从 Docker 镜像创建的。Docker 容器可以运行、开始、停止、移动和删除。每一个 Docker 容器都是独立和安全的应用平台，Docker 容器是 Docker 的运行部分。

#### Docker 从 0.9 版本开始使用 libcontainer 替代 lxc，libcontainer 和 Linux 系统的交互图如下

![](https://cdn.jsdelivr.net/gh/removeif/blog_image/img/2019/20190923215017.png)


### 安装

#### mac安装

mac 的安装，一行代码，其余系统的安装方式，请自行搜索

```java
$ brew cask install docker
$ docker was successfully installed!
```

#### 镜像加速

鉴于国内网络问题，后续拉取 Docker 镜像十分缓慢，我们可以需要配置加速器来解决，我使用的是网易的镜像地址：**http://hub-mirror.c.163.com**。

在任务栏点击 Docker for mac 应用图标 -> Perferences... -> Daemon -> Registry mirrors。在列表中填写加速器地址即可。修改完成之后，点击 Apply & Restart 按钮，Docker 就会重启并应用配置的镜像地址了。

![](https://cdn.jsdelivr.net/gh/removeif/blog_image/img/2019/20190923204940.png)

- 通过 docker info 来查看是否配置成功。

```bash
$ docker info
Containers: 0
 Running: 0
 Paused: 0
 Stopped: 0
Images: 0
Server Version: 18.09.2
Storage Driver: overlay2
 Backing Filesystem: extfs
 Supports d_type: true
 Native Overlay Diff: true
Logging Driver: json-file
Cgroup Driver: cgroupfs
Plugins:
 Volume: local
 Network: bridge host macvlan null overlay
 Log: awslogs fluentd gcplogs gelf journald json-file local logentries splunk syslog
Swarm: inactive
...
```

- 查看相关的使用命令

```bash
$ docker
Usage:	docker [OPTIONS] COMMAND

A self-sufficient runtime for containers

Options:
      --config string      Location of client config files (default "/Users/liyuechao/.docker")
  -D, --debug              Enable debug mode
  -H, --host list          Daemon socket(s) to connect to
  -l, --log-level string   Set the logging level ("debug"|"info"|"warn"|"error"|"fatal") (default "info")
      --tls                Use TLS; implied by --tlsverify
      --tlscacert string   Trust certs signed only by this CA (default "/Users/liyuechao/.docker/ca.pem")
      --tlscert string     Path to TLS certificate file (default "/Users/liyuechao/.docker/cert.pem")
      --tlskey string      Path to TLS key file (default "/Users/liyuechao/.docker/key.pem")
      --tlsverify          Use TLS and verify the remote
  -v, --version            Print version information and quit

Management Commands:
  builder     Manage builds
  config      Manage Docker configs
  container   Manage containers
  image       Manage images
  network     Manage networks
  node        Manage Swarm nodes
  plugin      Manage plugins
  secret      Manage Docker secrets
  service     Manage services
  stack       Manage Docker stacks
  swarm       Manage Swarm
  system      Manage Docker
  trust       Manage trust on Docker images
  volume      Manage volumes

Commands:
  attach      Attach local standard input, output, and error streams to a running container
  build       Build an image from a Dockerfile
  commit      Create a new image from a container's changes
  cp          Copy files/folders between a container and the local filesystem
  create      Create a new container
  diff        Inspect changes to files or directories on a container's filesystem
  events      Get real time events from the server
  exec        Run a command in a running container
  export      Export a container's filesystem as a tar archive
  history     Show the history of an image
  images      List images
  import      Import the contents from a tarball to create a filesystem image
  info        Display system-wide information
  inspect     Return low-level information on Docker objects
  kill        Kill one or more running containers
  load        Load an image from a tar archive or STDIN
  login       Log in to a Docker registry
  logout      Log out from a Docker registry
  logs        Fetch the logs of a container
  pause       Pause all processes within one or more containers
  port        List port mappings or a specific mapping for the container
  ps          List containers
  pull        Pull an image or a repository from a registry
  push        Push an image or a repository to a registry
  rename      Rename a container
  restart     Restart one or more containers
  rm          Remove one or more containers
  rmi         Remove one or more images
  run         Run a command in a new container
  save        Save one or more images to a tar archive (streamed to STDOUT by default)
  search      Search the Docker Hub for images
  start       Start one or more stopped containers
  stats       Display a live stream of container(s) resource usage statistics
  stop        Stop one or more running containers
  tag         Create a tag TARGET_IMAGE that refers to SOURCE_IMAGE
  top         Display the running processes of a container
  unpause     Unpause all processes within one or more containers
  update      Update configuration of one or more containers
  version     Show the Docker version information
  wait        Block until one or more containers stop, then print their exit codes
```

#### 安装mysql实例

`docker search mysql` 查看mysql相关的安装文件

`docker pull mysql:5.7.21`（这边是5.7.21指的是TAG版本，不指定的话默认会下载最新的LATEST版本）

`docker images`查看所有镜像

简单新建容器
`docker run -p 3306:3306 --name mysql -e MYSQL_ROOT_PASSWORD=123456 -d mysql`

接下来就可以使用NAVICAT连接127.0.0.1的ROOT账户了，密码是上面配置的123456

#### 常用命令

```bash
docker images : 列出本地镜像
docker pull : 从镜像仓库中拉取或者更新指定镜像

docker run ：创建一个新的容器并运行一个命令
-d: 后台运行容器，并返回容器ID
-p: 端口映射，格式为：主机(宿主)端口:容器端口
--name="nginx-lb": 为容器指定一个名称
-v：目录映射，格式为：主机目录:容器目录

docker rm ：删除一个或多个容器
docker start :启动一个或多少已经被停止的容器
docker stop :停止一个运行中的容器
docker kill :杀掉一个运行中的容器（强制）
docker restart :重启容器
docker port :列出指定的容器的端口映射，或者查找将PRIVATE_PORT NAT到面向公众的端口。

docker logs : 获取容器的日志
-f : 跟踪日志输出
--since :显示某个开始时间的所有日志
-t : 显示时间戳
--tail :仅列出最新N条容器日志

docker exec -i -t  mynginx /bin/bash：在容器mynginx中开启一个交互模式的终端，即通过SSH协议进入容器

docker ps : 列出容器
-a :显示所有的容器，包括未运行的。

docker cp：拷贝主机docker cp /www/runoob 96f7f14e99ab:/www/
```

#### Docker 端口映射

```ruby
# Find IP address of container with ID <container_id> 通过容器 id 获取 ip
$ sudo docker inspect <container_id> | grep IPAddress | cut -d ’"’ -f 4
```

无论如何，这些 ip 是基于本地系统的并且容器的端口非本地主机是访问不到的。此外，除了端口只能本地访问外，对于容器的另外一个问题是这些 ip 在容器每次启动的时候都会改变。

Docker 解决了容器的这两个问题，并且给容器内部服务的访问提供了一个简单而可靠的方法。Docker 通过端口绑定主机系统的接口，允许非本地客户端访问容器内部运行的服务。为了简便的使得容器间通信，Docker 提供了这种连接机制。

- 自动映射端口

`-P` 使用时需要指定 `--expose` 选项，指定需要对外提供服务的端口

```ruby
$ sudo docker run -t -P --expose 22 --name server  ubuntu:14.04
```

使用 `docker run -P` 自动绑定所有对外提供服务的容器端口，映射的端口将会从没有使用的端口池中 (49000..49900) 自动选择，你可以通过 `docker ps` 、`docker inspect <container_id>` 或者 `docker port <container_id> <port>` 确定具体的绑定信息。

- 绑定端口到指定接口

基本语法

```xml
$ sudo docker run -p [([<host_interface>:[host_port]])|(<host_port>):]<container_port>[/udp] <image> <cmd>
```

默认不指定绑定 ip 则监听所有网络接口。

- 绑定 TCP 端口

```ruby
# Bind TCP port 8080 of the container to TCP port 80 on 127.0.0.1 of the host machine.
$ sudo docker run -p 127.0.0.1:80:8080 <image> <cmd>
# Bind TCP port 8080 of the container to a dynamically allocated TCP port on 127.0.0.1 of the host machine.
$ sudo docker run -p 127.0.0.1::8080 <image> <cmd>
# Bind TCP port 8080 of the container to TCP port 80 on all available interfaces of the host machine.
$ sudo docker run -p 80:8080 <image> <cmd>
# Bind TCP port 8080 of the container to a dynamically allocated TCP port on all available interfaces
$ sudo docker run -p 8080 <image> <cmd>
```

- 绑定 UDP 端口

```ruby
# Bind UDP port 5353 of the container to UDP port 53 on 127.0.0.1 of the host machine.
$ sudo docker run -p 127.0.0.1:53:5353/udp <image> <cmd>
```

#### Docker 网络配置

![](https://cdn.jsdelivr.net/gh/removeif/blog_image/img/2019/20190923211147.png)

Dokcer 通过使用 Linux 桥接提供容器之间的通信，docker0 桥接接口的目的就是方便 Docker 管理。当 Docker daemon 启动时需要做以下操作：

- creates the docker0 bridge if not present
  - \# 如果 docker0 不存在则创建
- searches for an IP address range which doesn’t overlap with an existing route
  - \# 搜索一个与当前路由不冲突的 ip 段
- picks an IP in the selected range
  - \# 在确定的范围中选择 ip
- assigns this IP to the docker0 bridge
  - \# 绑定 ip 到 docker0

#### Docker 四种网络模式

docker run 创建 Docker 容器时，可以用 --net 选项指定容器的网络模式，Docker 有以下 4 种网络模式：

- host 模式，使用 --net=host 指定。
- container 模式，使用 --net=container:NAME_or_ID 指定。
- none 模式，使用 --net=none 指定。
- bridge 模式，使用 --net=bridge 指定，默认设置。

#### 桥接网络

![](https://cdn.jsdelivr.net/gh/removeif/blog_image/img/2019/20190923211419.png)

不同容器之间的通信可以借助于 pipework 这个工具给 docker 容器新建虚拟网卡并绑定 IP 桥接到 br0

pipework 可以创建容器的 vlan 网络，这里不作过多的介绍了，官方文档已经写的很清楚了，可以查看以下两篇文章：

- [Pipework 官方文档](https://link.jianshu.com/?t=https://github.com/jpetazzo/pipework)
- [Docker 网络详解及 pipework 源码解读与实践](https://link.jianshu.com/?t=http://www.infoq.com/cn/articles/docker-network-and-pipework-open-source-explanation-practice)

### 开发容器镜像

为了构建容器镜像，我们必须创建一个dockerfile，它将包含所有必要的信息。请参考这个文档（[https://nodejs.org/en/docs/guides/nodejs-docker-webapp/](https://link.jianshu.com/?t=https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)）来开发dockerfile。

#### 构建Docker容器

```bash
$docker build -t containername
```

这个命令将把Dockerfile放到当前的目录中。如果你的dockerfile名称不一样而且在不同的位置，可以使用-f 标签来指定dockerfile的名称。“docker build”命令将在“-t”标签指定的名称中构建容器镜像。

#### 镜像命名惯例

当在本地运行的时候，可以给Docker容器随便起什么名。可以简单的像上面提到的“myApp”。但是如果你想发布镜像到Docker Hub中，那么就需要遵循一个指定的命名惯例。这个惯例可以帮助Docker工具来发布容器镜像到正确的命名空间和资源库中。

格式：NameSpace/Repository:Version

```bash
$docker build -t saravasu/techietweak:001
```

还能用“docker tag”命令从外部镜像创建镜像

#### 在Docker中列出所有镜像

```bash
$docker images
```

### 运行容器

#### 启动Docker容器

使用“docker run”命令来启动Docker容器。

```java
$docker run -d -p 8080:8080 saravasu/techietweak:001
```

“-d”选项在分离模式中运行容器，因此容器继续运行，甚至终端被关闭。

“-p”命令用来映射端口。在这个例子中，“-p 8080:8080”第一个端口号是Docker主机用的端口。第二个端口号是被Docker容器使用。根据这个命令，所有的流量到达Docker主机端口，将转到Docker容器端口。

#### 检查当前运行的容器

```bash
$docker ps
```

一个Docker容器在名为“trusting_snyder.”中运行。

若要列出所有的容器，使用“- a”切换。

```bash
$docker ps -a
```

#### 展示运行容器的控制台日志

```bash
$docker logs <containerName>
```

容器名称可以通过 “docker ps” 命令发现。

#### 登陆到容器

```bash
$docker exec -it containerId /bin/bash
```

上面的命令将提示你使用容器的“bash”。

#### 停止运行的容器

```bash
$docker stop <containername>
```

#### 从Docker移除容器镜像

```bash
$docker rm imageId
```

使用“docker images” 或“docker images -a.”命令发现容器的imageId。

```bash
$docker rmi -f <List Of Image Ids>
```

上面的命令将强有力的删除指定的镜像。

### 发布容器镜像

Docker容器镜像可以发布到本地dockyard或公共Docker Hub。这两个过程和命令都是一样的。要在Docker Hub中发布Docker映像，首先在[http://hub.docker.com](https://link.jianshu.com/?t=http://hub.docker.com)上创建名称空间和资源库。

我用了我的命名空间“saravasu”和资源库“techietweak”来进行这个练习。

#### 登陆Docker Hub

$docker login

如果你想登陆到本地的资源库，需要提供URL。如果URL不是特定的，那么这个命令将登陆到Docker Hub中。

$docker login [http://localhost:8080](https://link.jianshu.com/?t=http://localhost:8080)

#### 标记容器镜像

要将Docker容器映像推到Docker Hub，它必须以特定的格式标记：< Namespace > / < Repository >:< Version >。如果未指定该版本，将被视为“默认”。在下面的命令中，我标记了镜像：

```bash
$docker tag myapp:latest saravasu/techietweak:001
```

#### 把Docker镜像推到Docker Hub中

```bash
$docker push saravasu/techietweak:001
```

#### 在Docker Hub中检查容器镜像

现在登陆你的Docker Hub账户，然后在各自的资源库中检查镜像。

### 部署容器

#### 拉出Docker容器镜像

在目标环境中，从主机登陆到Docker Hub中，并且从Docker Hub中拉出容器镜像。如果你想从自己的dockyard拉出，使用“$docker login <hostname>”命令指定自己dockyard的主机名。

$docker login

上面的命令将登陆到[https://hub.docker.com](https://link.jianshu.com/?t=https://hub.docker.com)，因为主机名没有指定。

```bash
$docker pull saravasu/techietweak:001
```

#### 检查镜像

docker pull命令从Docker Hub下载容器镜像。我们可以使用“docker images”命令来验证相同的结果。

$docker images

#### 运行容器

现在，我们可以用同样的方式运行Docker容器，就像在开发环境中运行一样，用我们以前做过的方式来测试它。

```bash
$docker run -d -p 8080:8080 saravasu/techietweak:001
```

docker run命令启动容器。为了验证，可以使用“docker ps”命令。Docker创建了一个新的容器，以“naughty_lewin.的名字运行。

正如我们在上面看到的，Docker引擎为运行的容器提供了一个随机的名称，但这可能在自动化中是个问题，因此指定一个我们要参考的名称总是好的。这可以通过使用“- name”参数实现。

```bash
$docker run -d -p 8080:8080 --name "myNodeJsWebContainer" saravasu/techietweak:001
```

参考链接：

https://www.jianshu.com/p/83d360604619

https://www.jianshu.com/p/1c5fef69897f

https://www.jianshu.com/p/a611fbe0d12b