---
thumbnail: https://cdn.jsdelivr.net/gh/removeif/blog_image/20190620152744.png
title: leetcode-2-Add Two Numbers

toc: true
keywords: java,problems
date: 2018-11-16 16:03:54
tags: 
categories: [algorithm]
---
# Add Two Numbers

>You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order and each of their nodes contain a single digit. Add the two numbers and return it as a linked list.
 You may assume the two numbers do not contain any leading zero, except the number 0 itself.
 <!-- more -->
 **Example:**
 >Input: (2 -> 4 -> 3) + (5 -> 6 -> 4)
  Output: 7 -> 0 -> 8
  Explanation: 342 + 465 = 807.
  
## common 
  ```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode(int x) { val = x; }
 * }
 */
class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
            ListNode dummyHead = new ListNode(0); // 一点要赋值一个节点，进行操作
    ListNode p = l1, q = l2, curr = dummyHead;
    int carry = 0;
    while (p != null || q != null) {
        int x = (p != null) ? p.val : 0;
        int y = (q != null) ? q.val : 0;
        int sum = carry + x + y;
        carry = sum / 10;
        curr.next = new ListNode(sum % 10);
        curr = curr.next;
        if (p != null) p = p.next;
        if (q != null) q = q.next;
    }
    if (carry > 0) {
        curr.next = new ListNode(carry);
    }
    return dummyHead.next;
    }
}
```
## best
```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode(int x) { val = x; }
 * }
 */
   class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        ListNode head = new ListNode(0);
        int carry = 0;
        while(l1!=null||l2!=null||carry>0)
        {
            ListNode itr = head;
            while(itr.next!=null)
                itr = itr.next; // 寻找最后一个节点
            int sum = ( (l1==null ? 0 : l1.val) + (l2==null ? 0 : l2.val) + carry);
            carry = sum/10;
            ListNode temp = new ListNode(sum%10);
            itr.next = temp;
            if(l1!=null)
                l1 = l1.next;
            if(l2!=null)
                l2 = l2.next;
        }
        
        return head.next;
    }
}
```