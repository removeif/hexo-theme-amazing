---
title: 算法成长之路leetcode1-4

toc: true
recommend: 1
keywords: categories-algorithm
date: 2019-11-05 18:18:47
thumbnail: https://cdn.jsdelivr.net/gh/removeif/blog_image/img/2019/20191105182220.png
tags: [二分查找,分治算法,字符串,滑动窗口]
categories: [algorithm]
---
## 1.[Two Sum](https://leetcode-cn.com/problems/two-sum/)

### desc

Given an array of integers, return indices of the two numbers such that they add up to a specific target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.
<!-- more -->

**Example:**

```txt
Given nums = [2, 7, 11, 15], target = 9,
Because nums[0] + nums[1] = 2 + 7 = 9,
return [0, 1].

```

### solution

#### s.eg1.

```java
//24 ms	38 MB s.O(n^2) k.O(1)
class Solution {
    public int[] twoSum(int[] nums, int target) {
        int[] result =new int[2];
        for(int i = 0;i<nums.length-1;i++){
            for(int j = i+1;j<nums.length;j++){
                if(nums[i]+nums[j] == target){
                    result[0] = i;
                    result[1] = j;
                    return new int[]{i,j};
                }
            }
        }
        return new int[0];
    }
}
```

#### eg2.

```java
// 3 ms	37.2 MB s.O(n) k.O(n)
class Solution {
    public int[] twoSum(int[] nums, int target) {
        HashMap<Integer,Integer> cache = new HashMap();
        for(int i = 0;i<nums.length;i++){
            if(cache.get(nums[i]) != null){
                return new int[]{cache.get(nums[i]),i};
            }
            cache.put(target-nums[i],i);
        }
        return new int[0];
    }
}
```

## 2.[Add Two Numbers](https://leetcode-cn.com/problems/add-two-numbers/)

### des

You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order and each of their nodes contain a single digit. Add the two numbers and return it as a linked list.

You may assume the two numbers do not contain any leading zero, except the number 0 itself.

**Example:**

```txt
Input: (2 -> 4 -> 3) + (5 -> 6 -> 4)
Output: 7 -> 0 -> 8
Explanation: 342 + 465 = 807.
```

### solution

#### eg1.

```java
// 2 ms	44.7 MB
class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
         int carry = 0; // 进位
         ListNode head = new ListNode(0);
         ListNode cur = head; // 一定要用两个链表，不能用一个操作
       while(l1 != null ||l2 != null|| carry != 0){ // lastSum当最后一位刚好进1的时候，需要在循环
           
            int l1v =  l1 == null?0:l1.val;
            int l2v =  l2 == null?0:l2.val;
            int temp =l1v+l2v+carry;
            ListNode node;
            if(temp>=10){
               node = new ListNode(temp-10);
               lastSum = 1;
            }else{
               node = new ListNode(temp);
               lastSum = 0;
            }
           
            if(l1 != null) l1 = l1.next;
            if(l2 != null) l2 = l2.next;
         
            cur.next = node;
            cur = node;
        }
        return head.next;
    }
}
```

## 3.[Longest Substring Without Repeating Characters](https://leetcode-cn.com/problems/longest-substring-without-repeating-characters/)

### desc

Given a string, find the length of the longest substring without repeating characters.

**Example 1:**

```txt
Input: "abcabcbb"
Output: 3 
Explanation: The answer is "abc", with the length of 3. 
```

**Example 2:**

```txt
Input: "bbbbb"
Output: 1
Explanation: The answer is "b", with the length of 1.
```

**Example 3:**

```txt
Input: "pwwkew"
Output: 3
Explanation: The answer is "wke", with the length of 3. 
             Note that the answer must be a substring, "pwke" is a subsequence and not a substring.
```

### solution

#### eg1.

```java
//2 ms 24.05% 36.9 MB 95.35%
class Solution {
    public int lengthOfLongestSubstring(String s) {
        Set<Character> strSet = new HashSet();
        int maxLen = 0;
        if(s != null && s.length() >0){
            char ss[] = s.toCharArray(); //利用toCharArray方法转换
		    for (int i = 0; i < ss.length-1; i++) {
                strSet.add(ss[i]);
                for(int j = i+1; j<ss.length; j++){
                    int oL = strSet.size();
                    strSet.add(ss[j]);
                    int cL = strSet.size();
                    if(oL != cL){ // 不相等时记下个数
                        if(cL > maxLen){
                            maxLen = cL;
                        }
                    }else{ // 相等时 跳出此次循环 清空set
                           strSet.clear();
                           break;
                    }
                 }
             }
            if(maxLen == 0){ // 全相等时
                maxLen = 1;
            }
        }
        return maxLen;
    }
}
```



#### eg2.

```java
// 2 ms	37.3 MB
class Solution {
    public int lengthOfLongestSubstring(String s) {
        int maxLength = 0;
        char[] chars = s.toCharArray();
        int leftIndex = 0;//记录最左边相等时的值，然后向右滑动窗口
        for (int j = 0; j < chars.length; j++) {
          for (int innerIndex = leftIndex; innerIndex < j; innerIndex++) {
            if (chars[innerIndex] == chars[j]) {
              maxLength = Math.max(maxLength, j - leftIndex);
              leftIndex = innerIndex + 1;
              break;
            }
          }
        }
        return Math.max(chars.length - leftIndex, maxLength);
        }
}
```





## 4.[Median of Two Sorted Arrays](https://leetcode-cn.com/problems/median-of-two-sorted-arrays/)

### desc

There are two sorted arrays nums1 and nums2 of size m and n respectively.

Find the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).

You may assume nums1 and nums2 cannot be both empty.

**Example 1:**

```txt
nums1 = [1, 3]
nums2 = [2]
The median is 2.0
```

**Example 2:**

```txt
nums1 = [1, 2]
nums2 = [3, 4]
The median is (2 + 3)/2 = 2.5
```

### solution

#### eg1.

```java
// 20 ms  10.07%
// 2.2 MB 99.84%
class Solution {
    public double findMedianSortedArrays(int[] nums1, int[] nums2) {
        int maxL = 0;
        if (nums1.length >= nums2.length) {
            maxL = nums1.length;
        } else {
            maxL = nums2.length;
        }
        List<Integer> newList = new ArrayList(maxL);
        for (int i = 0; i < maxL; i++) {
            if (i < nums1.length) {
                newList.add(nums1[i]);
            }
            if (i < nums2.length) {
                newList.add(nums2[i]);
            }
        }

        int size = newList.size();
        int index = size / 2;
        newList.sort(Comparator.comparing(Integer::valueOf));
        if (size % 2 == 0) {
            return (newList.get(index) + newList.get(index - 1)) / 2d;
        } else {
            return newList.get(index);
        }
    }
}
```



#### eg2.

```java
class Solution {
    public double findMedianSortedArrays(int[] nums1, int[] nums2) {
        int n = nums1.length + nums2.length;
        double res = 0.0;
        if (n <= 0) {
            return res;
        }
        if ((n & 1) == 0) {
            res = (findKth(nums1, nums2, 0, 0, n / 2) + findKth(nums1, nums2, 0, 0, n / 2 + 1)) / 2.0;
        }
        else {
            res = findKth(nums1, nums2, 0, 0, n / 2 + 1);
        }
        return res;
    }
    private int findKth(int[] nums1, int[] nums2, int start1, int start2, int k) {
        if (start1 >= nums1.length) {
            return nums2[start2 + k - 1];
        }
        if (start2 >= nums2.length) {
            return nums1[start1 + k - 1];
        }
        if (k == 1) {
            return Math.min(nums1[start1], nums2[start2]);
        }
        int left = start1 + k / 2 - 1 >= nums1.length ? Integer.MAX_VALUE : nums1[start1 + k / 2 - 1];
        int right = start2 + k / 2 - 1 >= nums2.length ? Integer.MAX_VALUE : nums2[start2 + k / 2 - 1];
        if (left < right) {
            return findKth(nums1, nums2, start1 + k / 2, start2, k - k / 2);
        }
        return findKth(nums1, nums2, start1, start2 + k / 2, k - k / 2);
    }
}
```

#### eg3.

```java
// 二分查找、分治算法
class Solution {
    public double findMedianSortedArrays(int[] A, int[] B) {
        //m:A数组的长度
        int m = A.length;
        //n:B数组的长度

        int n = B.length;
        //如果A的长度大于B
        if (m > n) { // to ensure m<=n
            //交换AB数组，确保m<=n
            int[] temp = A; A = B; B = temp;
            int tmp = m; m = n; n = tmp;
        }
        //设置两个指针，iMin为头指针，IMAX为尾指针，halfLen为中位数指针
        int iMin = 0, iMax = m, halfLen = (m + n + 1) / 2;
        //如果头指针走向不大于尾指针，进行循环
        while (iMin <= iMax) {
            //i为中位数
            int i = (iMin + iMax) / 2;
            //j为
            int j = halfLen - i;
            if (i < iMax && B[j - 1] > A[i]){
                iMin = i + 1; // i is too small
            }
            else if (i > iMin && A[i - 1] > B[j]) {
                iMax = i - 1; // i is too big
            }
            else { // i is perfect
                int maxLeft = 0;
                if (i == 0) { maxLeft = B[j-1]; }
                else if (j == 0) { maxLeft = A[i - 1]; }
                else { maxLeft = Math.max(A[i - 1], B[j - 1]); }
                if ( (m + n) % 2 == 1 ) { return maxLeft; }

                int minRight = 0;
                if (i == m) { minRight = B[j]; }
                else if (j == n) { minRight = A[i]; }
                else { minRight = Math.min(B[j], A[i]); }

                return (maxLeft + minRight) / 2.0;
            }
        }
        return 0d;
    }
}
```


