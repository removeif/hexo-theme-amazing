---
title: Git如何优雅地回退代码
toc: true
recommend: 1
keywords: categories-java基础工具类,Git,Git如何优雅地回退代码
date: 2020-02-01 21:30:26
thumbnail: https://cdn.jsdelivr.net/gh/removeif/blog_image/img/2020/20200201215930.png
tags: Git
categories: [基础工具类,Git]
---
### 前言

从接触编程就开始使用 Git 进行代码管理，先是自己玩 Github，又在工作中使用 Gitlab，虽然使用时间挺长，可是也只进行一些常用操作，如推拉代码、提交、合并等，更复杂的操作没有使用过，看过的教程也逐渐淡忘了，有些对不起 Linus 大神。

出来混总是要还的，前些天就遇到了 Git 里一种十分糟心的场景，并为之前没有深入理解 Git 命令付出了一下午时间的代价。

先介绍一下这种场景，我们一个项目从 N 版本升到 A 版本时引入了另一项目的 jar 包，又陆续发布了 B、C 版本，但在 C 版本后忽然发现了 A 版本引入的 jar 包有极大的性能问题，B、C 版本都是基于 A 版本发布的，要修复 jar 包性能问题，等 jar 包再发版还得几天，可此时线上又有紧急的 Bug 要修，于是就陷入了进退两难的境地。

最后决定先将代码回退到 A 版本之前，再基于旧版本修复 Bug，也就开始了五个小时的受苦之路。
<!-- more -->

### 基础试探

#### revert

首先肯定的是 revert，`git revert commit_id` 能产生一个 与 commit_id 完全相反的提交，即 commit_id 里是添加， revert 提交里就是删除。

但是使用 git log 查看了提交记录后，我就打消了这种想法，因为提交次数太多了，中途还有几次从其他分支的 merge 操作。

”利益于”我们不太干净的提交记录，要完成从 C 版本到 N 版本的 revert，我需要倒序执行 revert 操作几十次，如果其中顺序错了一次，最终结果可能就是不对的。

另外我们知道我们在进行代码 merge 时，也会把 merge 信息产生一次新的提交，而 revert 这次 merge commit 时需要指定 m 参数，以指定 `mainline`

这个 mainline 是主线，也是我们要保留代码的主分支，从 feature 分支往 develop 分支合并，或由 develop 分支合并到 master 的提交还好确定，但 feature 分支互相合并时，我哪知道哪个是主线啊。

所以 revert 的文案被废弃了。

#### Reset

然后就考虑 `reset` 了， reset 也能使代码回到某次提交，但跟 revert 不同的是， reset 是将提交的 HEAD 指针指到某次提交，之后的提交记录会消失，就像从没有过这么一次提交。

但由于我们都在 feature 分支开发，我在 feature 分支上将代码回退到某次提交后，将其合并到 develop 分支时却被提示报错。

这是因为 feature 分支回退了提交后，在 git 的 workflow 里，feature 分支是落后于 develop 分支的，而合并向 develop 分支，又需要和 develop 分支保持最新的同步，需要将 develop 分支的数据合并到 feature 分支上，而合并后，原来被 reset 的代码又回来了。

这个时候另一个可选项是在 master 分支上执行 reset，使用 `--hard` 选项完全抛弃这些旧代码，reset 后再强制推到远端。

```bash
master> git reset --hard commit_id
master> git push --force origin master
```

但是还是有问题，首先，我们的 master 分支在 gitlab 里是被保护的，不能使用 force push，毕竟风险挺大了，万一有人 reset 到最开始的提交再强制 push 的话，虽然可以使用 `reflog` 恢复，但也是一番折腾。

另外，reset 毕竟太野蛮，我们还是想能保留提交历史，以后排查问题也可以参考。

### 升级融合

#### rebase

只好用搜索引擎继续搜索，看到有人提出可以先使用 `rebase` 把多个提交合并成一个提交，再使用 revert 产生一次反提交，这种方法的思路非常清晰，把 revert 和 rebase 两个命令搭配得很好，相当于使用 revert 回退的升级版。

先说一下 rebase，**rebase** 是”变基”的意思，这里的”基”，在我理解是指[多次] commit 形成的 git workflow，使用 rebase，我们可以改变这些历史提交，修改 commit 信息，将多个 commit 进行组合。

介绍 rebase 的文档有很多，我们直接来说用它来进行代码回退的步骤。

1. 首先，切出一个新分支 F，使用 git log 查询一下`要回退到`的 commit 版本 N。

2. 使用命令 `git rebase -i N`， -i 指定交互模式后，会打开 git rebase 编辑界面，形如：

   ```bash
   pick 6fa5869 commit1
   pick 0b84ee7 commit2
   pick 986c6c8 commit3
   pick 91a0dcc commit4
   ```

3. 这些 commit 自旧到新由上而下排列，我们只需要在 commit_id 前添加操作命令即可。

   在合并 commit 这个需求里，我们可以选择 `pick(p)` 最旧的 commit1，然后在后续的 commit_id 前添加 `squash(s)` 命令，将这些 commits 都合并到最旧的 commit1 上。

4. 保存 rebase 结果后，再编辑 commit 信息，使这次 rebase 失效，git 会将之前的这些 commit 都删除，并将其更改合并为一个新的 commit5

   如果出错了，也可以使用 `git rebase --abort/--continue/--edit-todo`` `对之前的编辑进行撤销、继续编辑。

5. 这个时候，主分支上的提交记录是 `older, commit1, commit2, commit3, commit4`

   而 F 分支上的提交记录是 `older, commit5`，由于 F 分支的祖先节点是 older，明显落后于主分支的 commit4，将 F 分支向主分支合并是不允许的

   所以我们需要执行 `git merge master` 将主分支向 F 分支合并，合并后 git 会发现 commit1 到 commit4 提交的内容和 F 分支上 commit5 的修改内容是完全相同的，会自动进行合并，内容不变，但多了一个 commit5。

6. 再在 F 分支上对 commit5 进行一次 revert 反提交，就实现了把 commit1 到 commit4 的提交全部回退。

这种方法的取巧之处在于巧妙地利用了 rebase 操作历史提交的功能和 git 识别修改相同自动合并的特性，操作虽然复杂，但历史提交保留得还算完整。

rebase 这种修改历史提交的功能非常实用，能够很好地解决我们遇到的一个小功能提交了好多次才好使，而把 git 历史弄得乱七八糟的问题，只需要注意避免在多人同时开发的分支使用就行了。

遗憾的是，当天我并没有理解到 rebase 的这种思想，又由于试了几个方法都不行太过于慌乱，在 rebase 完成后，向主分支合并被拒之后对这些方式的可行性产生了怀疑，又加上有同事提出听起来更可行的方式，就中断了操作。

#### 文件操作

这种更可行的方式就是对文件操作，然后让 git 来识别变更，具体是：

1. 从主分支上切出一个跟主分支完全相同的分支 F。
2. 从文件管理系统复制项目文件夹为 bak，在 bak 内使用 `git checkout N` 将代码切到想要的历史提交，这时候 git 会将 bak 内的文件恢复到 N 状态。
3. 在从文件管理系统内，将 bak 文件夹下 `除了 .git` 文件夹下的所有内容复制粘贴到原项目目录下。git 会纯从文件级别识别到变更，然后更新工作区。
4. 在原项目目录下执行 `add 和 commit`，完成反提交。

这种方式的巧妙之处在于利用 git 本身对文件的识别，不牵涉到对 workflow 操作。

### 小结

最后终于靠着文件操作方式成功完成了代码回退，事后想来真是一把心酸泪。

为了让我的五个小时不白费，复盘一下当时的场景，学习并总结一下四种代码回退的方式：

- revert 适合需要回退的历史提交不多，且无合并冲突的情景。
- 如果你可以向 master 强推代码，且想让 git log 里不再出现被回退代码的痕迹，可以使用 `git reset --hard + git push --force`` `的方式。
- 如果你有些 geek，追求用”正规而正统”的方式来回退代码，rebase + revert 满足你的需求。
- 如果你不在乎是否优雅，想用最简单，最直接的方式，文件操作正合适。

git 真的是非常牛逼的代码管理工具，入手简单，三五个命令组合起来就足够完成工作需求，又对 geeker 们非常友好，你想要的骚操作它都支持，学无止境啊。


参考文章:
[参考链接](https://mp.weixin.qq.com/s/R2FC922c49bS4CaWd47mug)

