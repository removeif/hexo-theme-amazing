---
title: 算法成长之路leetcode21-22
toc: true
recommend: 1
keywords: categories-java 算法成长之路leetcode21-22 21. Merge Two Sorted Lists 22. Generate Parentheses
uniqueId: '2020-02-10 10:19:10/"算法成长之路leetcode21-22".html'
date: 2020-02-10 18:19:10
thumbnail: https://cdn.jsdelivr.net/gh/removeif/blog_image/img/2020/20200210181822.png
tags: [递归,链表]
categories: [algorithm]
---
### [21. Merge Two Sorted Lists](https://leetcode-cn.com/problems/merge-two-sorted-lists/)

Merge two sorted linked lists and return it as a new list. The new list should be made by splicing together the nodes of the first two lists.
<!-- more -->
#### Example:

```text
Input: 1->2->4, 1->3->4
Output: 1->1->2->3->4->4
```

#### JAVA题解：

```java
package algorithm.c3;

/**
 * 将两个有序链表合并为一个新的有序链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的。 
 *
 * 示例：
 *
 * 输入：1->2->4, 1->3->4
 * 输出：1->1->2->3->4->4
 *
 * 来源：力扣（LeetCode）
 * 链接：https://leetcode-cn.com/problems/merge-two-sorted-lists
 * 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
 */
public class Leetcode21 {

    // 错解
    public ListNode mergeTwoLists(ListNode l1, ListNode l2) {

        ListNode l = new ListNode(0);
        ListNode cur = l;
        while (l1.next != null || l2.next != null){

            if (l1.next == null) {
                cur.next = l2;
            } else if (l2.next == null) {
                cur.next = l1;
            }else {
                if(l1.val > l2.val){
                    cur.next= l2;
                    l2 = l2.next;
                }else if(l1.val == l2.val){
                    cur.next= l2;
                    cur.next.next = l1;
                    l1 = l1.next;
                    l2 = l2.next;
                }else{
                    cur.next = l1;
                    l1 = l1.next;
                }
            }
            cur = cur.next;
        }

        return l.next;

    }

    public ListNode mergeTwoLists1(ListNode l1, ListNode l2) {
        // maintain an unchanging reference to node ahead of the return node.
        ListNode prehead = new ListNode(-1);

        ListNode prev = prehead;
        while (l1 != null && l2 != null) {
            if (l1.val <= l2.val) {
                prev.next = l1;
                l1 = l1.next;
            } else {
                prev.next = l2;
                l2 = l2.next;
            }
            prev = prev.next;
        }

        // exactly one of l1 and l2 can be non-null at this point, so connect
        // the non-null list to the end of the merged list.
        prev.next = l1 == null ? l2 : l1;

        return prehead.next;
    }

    // 递归
    public ListNode mergeTwoLists2(ListNode l1, ListNode l2) {
        if (l1 == null) {
            return l2;
        } else if (l2 == null) {
            return l1;
        } else if (l1.val < l2.val) {
            l1.next = mergeTwoLists(l1.next, l2);
            return l1;
        } else {
            l2.next = mergeTwoLists(l1, l2.next);
            return l2;
        }
    }
  
    public static void main(String[] args) {
        ListNode l1 = new ListNode(1);
        l1.next = new ListNode(2);
        l1.next.next = new ListNode(4);

        ListNode l2 = new ListNode(1);
        l2.next = new ListNode(1);
        l2.next.next = new ListNode(3);

        System.out.println(new Leetcode21().mergeTwoLists1(l1,l2));

    }

    public static class ListNode {
        int val;
        ListNode next;

        ListNode(int x) {
            val = x;
        }
    }
}
```

### [22. Generate Parentheses](https://leetcode-cn.com/problems/generate-parentheses/)

Given n pairs of parentheses, write a function to generate all combinations of well-formed parentheses.

#### Example:

```text
For example, given n = 3, a solution set is:

[
  "((()))",
  "(()())",
  "(())()",
  "()(())",
  "()()()"
]
```

#### JAVA题解：

```java
package algorithm.c3;

import java.util.LinkedList;
import java.util.List;

/**
 * 给出 n 代表生成括号的对数，请你写出一个函数，使其能够生成所有可能的并且有效的括号组合。
 *
 * 例如，给出 n = 3，生成结果为：
 *
 * [
 *   "((()))",
 *   "(()())",
 *   "(())()",
 *   "()(())",
 *   "()()()"
 * ]
 *
 * 来源：力扣（LeetCode）
 * 链接：https://leetcode-cn.com/problems/generate-parentheses
 * 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
 */
public class Leetcode22 {

    /**
     *
     * 在此题中，动态规划的思想类似于数学归纳法，当知道所有 i<n 的情况时，我们可以通过某种算法算出 i=n 的情况。
     * 本题最核心的思想是，考虑 i=n 时相比 n-1 组括号增加的那一组括号的位置。
     *
     * 思路：
     * 当我们清楚所有 i<n 时括号的可能生成排列后，对与 i=n 的情况，我们考虑整个括号排列中最左边的括号。
     * 它一定是一个左括号，那么它可以和它对应的右括号组成一组完整的括号 "( )"，我们认为这一组是相比 n-1 增加进来的括号。
     *
     * 那么，剩下 n-1 组括号有可能在哪呢？
     *
     * 【这里是重点，请着重理解】
     *
     * 剩下的括号要么在这一组新增的括号内部，要么在这一组新增括号的外部（右侧）。
     *
     * 既然知道了 i<n 的情况，那我们就可以对所有情况进行遍历：
     *
     * "(" + 【i=p时所有括号的排列组合】 + ")" + 【i=q时所有括号的排列组合】
     *
     * 其中 p + q = n-1，且 p q 均为非负整数。
     *
     * 事实上，当上述 p 从 0 取到 n-1，q 从 n-1 取到 0 后，所有情况就遍历完了。
     *
     * 注：上述遍历是没有重复情况出现的，即当 (p1,q1)≠(p2,q2) 时，按上述方式取的括号组合一定不同。
     *
     * 作者：yuyu-13
     * 链接：https://leetcode-cn.com/problems/generate-parentheses/solution/zui-jian-dan-yi-dong-de-dong-tai-gui-hua-bu-lun-da/
     * 来源：力扣（LeetCode）
     * 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
     *
     * 简单来说，在求N个括号的排列组合时，把第N种情况（也就是N个括号排列组合）视为单独拿一个括号E出来，
     * 剩下的N-1个括号分为两部分，P个括号和Q个括号，P+Q=N-1，然后这两部分分别处于括号E内和括号E的右边，
     * 各自进行括号的排列组合。由于我们是一步步计算得到N个括号的情况的，所以小于等于N-1个括号的排列组合方式我们是已知的（
     * 用合适的数据结构存储，方便后续调用，且在存储时可利用特定数据结构实现题目某些要求，如排序，去重等），
     * 且P+Q=N-1，P和Q是小于等于N-1的，所以我们能直接得到P个和Q个括号的情况，进而得到N个括号的结果！
     *
     * 楼主的算法思想很巧妙，赞一个~这个算法主要的基点就是将排列组合的情况分为了括号内和括号外这两种情况，
     * 且仅存在两种情况！至于为什么，原因在于楼主的算法的前提是单独拿出来的括号E的左边在N个括号所有排列组合情况中都是处于最左边，
     * 所以不存在括号位于括号E的左边的情况。因此，N-1个括号（拿出了括号E）仅可能分布于括号E内和括号E外，分为两种子情况讨论！
     * 这种思想还可以应用于其他类似的题的求解中，即怎样合理高效的利用前面步骤的计算结果得出当前步骤结果，从而得出最终结果。
     *
     * @param n
     * @return
     */
    public List<String> generateParenthesis(int n) {
        LinkedList<LinkedList<String>> result = new LinkedList<LinkedList<String>>();
        if (n == 0)
            return result.get(0);
        LinkedList<String> list0 = new LinkedList<String>();
        list0.add("");
        result.add(list0);
        LinkedList<String> list1 = new LinkedList<String>();
        list1.add("()");
        result.add(list1);
        for (int i = 2; i <= n; i++) {
            LinkedList<String> temp = new LinkedList<String>();
            for (int j = 0; j < i; j++) {
                List<String> str1 = result.get(j);
                List<String> str2 = result.get(i - 1 - j);
                for (String s1 : str1) {
                    for (String s2 : str2) {
                        String el = "(" + s1 + ")" + s2;
                        temp.add(el);
                    }
                }

            }
            result.add(temp);
        }
        return result.get(n);
    }
}
```
