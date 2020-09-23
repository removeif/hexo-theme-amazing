---
title: 算法成长之路leetcode15-16

toc: true
recommend: 1
keywords: categories-java,算法成长之路leetcode15. 3Sum,leetcode16. 3Sum Closest
date: 2020-01-01 21:14:27
thumbnail: https://cdn.jsdelivr.net/gh/removeif/blog_image/img/2020/20200101211709.png
tags: [双指针]
categories: [algorithm]
---

#### [15. 3Sum](https://leetcode-cn.com/problems/3sum/)

Given an array nums of n integers, are there elements a, b, c in nums such that a + b + c = 0? Find all unique triplets in the array which gives the sum of zero.
<!-- more -->
Note:

The solution set must not contain duplicate triplets.

##### Example

```text
Example:
Given array nums = [-1, 0, 1, 2, -1, -4],

A solution set is:
[
  [-1, 0, 1],
  [-1, -1, 2]
]

```

##### JAVA题解

```java
package algorithm;

import java.util.*;

/**
 * 给定一个包含 n 个整数的数组 nums，判断 nums 中是否存在三个元素 a，b，c ，
 * 使得 a + b + c = 0 ？找出所有满足条件且不重复的三元组。
 *
 * 注意：答案中不可以包含重复的三元组。
 *
 * 例如, 给定数组 nums = [-1, 0, 1, 2, -1, -4]，
 *
 * 满足要求的三元组集合为：
 * [
 *   [-1, 0, 1],
 *   [-1, -1, 2]
 * ]
 *
 * 来源：力扣（LeetCode）
 * 链接：https://leetcode-cn.com/problems/3sum
 * 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
 */
public class Leetcode15 {
    // ❌错解
    public static List<List<Integer>> threeSum(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        Set<String> ids = new HashSet<>();
        for (int i = 0; i < nums.length - 2; i++) {
            for (int j = i+1; j < nums.length-1; j++) {
                for (int k = j+1; k < nums.length; k++) {
                    if(nums[i]+nums[j]+nums[k] == 0){
                        String i2 = nums[i] + ""+nums[j]+nums[k];
                        System.out.println(nums[i]+","+nums[j]+","+nums[k]+"="+i2);
                        if(!ids.contains(i2)){
                            ids.add(i2);
                            res.add(Arrays.asList(nums[i],nums[j],nums[k]));
                        }
                    }
                }
            }
        }
        return res;
    }

    /**
     * 思路
     * 标签：数组遍历
     * 首先对数组进行排序，排序后固定一个数 nums[i]nums[i]，再使用左右指针指向 nums[i]nums[i]后面的两端，数字分别为 nums[L]nums[L] 和 nums[R]nums[R]，计算三个数的和 sumsum 判断是否满足为 00，满足则添加进结果集
     * 如果 nums[i]nums[i]大于 00，则三数之和必然无法等于 00，结束循环
     * 如果 nums[i]nums[i] == nums[i-1]nums[i−1]，则说明该数字重复，会导致结果重复，所以应该跳过
     * 当 sumsum == 00 时，nums[L]nums[L] == nums[L+1]nums[L+1] 则会导致结果重复，应该跳过，L++L++
     * 当 sumsum == 00 时，nums[R]nums[R] == nums[R-1]nums[R−1] 则会导致结果重复，应该跳过，R--R−−
     * 时间复杂度：O(n^2)，n 为数组长度
     *
     * 作者：guanpengchn
     * 链接：https://leetcode-cn.com/problems/3sum/solution/hua-jie-suan-fa-15-san-shu-zhi-he-by-guanpengchn/
     * 来源：力扣（LeetCode）
     * 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
     * @param nums
     * @return
     */
    public static List<List<Integer>> threeSum1(int[] nums) {
        List<List<Integer>> ans = new ArrayList();
        int len = nums.length;
        if (nums == null || len < 3) return ans;
        Arrays.sort(nums); // 排序
        for (int i = 0; i < len; i++) {
            if (nums[i] > 0) break; // 如果当前数字大于0，则三数之和一定大于0，所以结束循环
            if (i > 0 && nums[i] == nums[i - 1]) continue; // 去重
            int L = i + 1;
            int R = len - 1;
            while (L < R) {
                int sum = nums[i] + nums[L] + nums[R];
                if (sum == 0) {
                    ans.add(Arrays.asList(nums[i], nums[L], nums[R]));
                    // 此时nums[L] == nums[L + 1] 会重复，继续跳过一个
                    while (L < R && nums[L] == nums[L + 1]) L++; // 去重
                    while (L < R && nums[R] == nums[R - 1]) R--; // 去重
                    L++;
                    R--;
                } else if (sum < 0) L++;
                else if (sum > 0) R--;
            }
        }
        return ans;
    }


    public static void main(String[] args) {
        System.out.println(threeSum(new int[]{-4, -2, -2, -2, 0, 1, 2, 2, 2, 3, 3, 4, 4, 6, 6}));
    }
}

```

#### [16. 3Sum Closest](https://leetcode-cn.com/problems/3sum-closest/)

Given an array nums of n integers and an integer target, find three integers in nums such that the sum is closest to target. Return the sum of the three integers. You may assume that each input would have exactly one solution.

##### Example

```text
Example:

Given array nums = [-1, 2, 1, -4], and target = 1.

The sum that is closest to the target is 2. (-1 + 2 + 1 = 2).

```

##### JAVA题解

```java
package algorithm;

import java.util.Arrays;

/**
 * 给定一个包括 n 个整数的数组 nums 和 一个目标值 target。找出 nums 中的三个整数，
 * 使得它们的和与 target 最接近。返回这三个数的和。假定每组输入只存在唯一答案。
 *
 * 例如，给定数组 nums = [-1，2，1，-4], 和 target = 1.
 *
 * 与 target 最接近的三个数的和为 2. (-1 + 2 + 1 = 2).
 *
 * 来源：力扣（LeetCode）
 * 链接：https://leetcode-cn.com/problems/3sum-closest
 * 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
 */
public class Leetcode16 {
    // 想到的思路，找出所有的组合以及它们的sum，然后排好序二分法查找sum中最接近的
    public int threeSumClosest(int[] nums, int target) {

        return 0;
    }

    /**
     * 思路
     * 标签：排序和双指针
     * 本题目因为要计算三个数，如果靠暴力枚举的话时间复杂度会到 O(n^3)，需要降低时间复杂度
     * 首先进行数组排序，时间复杂度 O(nlogn)O(nlogn)
     * 在数组 nums 中，进行遍历，每遍历一个值利用其下标i，形成一个固定值 nums[i]
     * 再使用前指针指向 start = i + 1 处，后指针指向 end = nums.length - 1 处，也就是结尾处
     * 根据 sum = nums[i] + nums[start] + nums[end] 的结果，判断 sum 与目标 target 的距离，如果更近则更新结果 ans
     * 同时判断 sum 与 target 的大小关系，因为数组有序，如果 sum > target 则 end--，如果 sum < target 则 start++，如果 sum == target 则说明距离为 0 直接返回结果
     * 整个遍历过程，固定值为 n 次，双指针为 n 次，时间复杂度为 O(n^2)
     * 总时间复杂度：O(nlogn) + O(n^2) = O(n^2)
     *
     * 作者：guanpengchn
     * 链接：https://leetcode-cn.com/problems/3sum-closest/solution/hua-jie-suan-fa-16-zui-jie-jin-de-san-shu-zhi-he-b/
     * 来源：力扣（LeetCode）
     * 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
     * @param nums
     * @param target
     * @return
     */
    public int threeSumClosest1(int[] nums, int target) {

        Arrays.sort(nums);
        int ans = nums[0] + nums[1] + nums[2];
        for(int i=0;i<nums.length;i++) {
            int start = i+1, end = nums.length - 1;
            while(start < end) {
                int sum = nums[start] + nums[end] + nums[i];
                // 结果差值更小时，取更小的
                if(Math.abs(target - sum) < Math.abs(target - ans))
                    ans = sum;
                // 结果大于目标，右边的左移
                if(sum > target)
                    end--;
                else if(sum < target)
                    start++;
                else
                    // 相等时直接返回结果
                    return ans;
            }
        }
        return ans;
    }
}
```

