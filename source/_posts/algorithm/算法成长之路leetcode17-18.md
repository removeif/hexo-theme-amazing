---
title: 算法成长之路leetcode17-18

toc: true
recommend: 1
keywords: categories-双指针,递归回溯 leetcode 17-18 17. Letter Combinations of a Phone Number 18. 4Sum
date: 2020-01-08 21:55:24
thumbnail: https://cdn.jsdelivr.net/gh/removeif/blog_image/img/2020/20200108220236.png
tags: [双指针,递归回溯]
categories: [algorithm]
---

#### [17. Letter Combinations of a Phone Number](https://leetcode-cn.com/problems/letter-combinations-of-a-phone-number/)

Given a string containing digits from 2-9 inclusive, return all possible letter combinations that the number could represent.
<!-- more -->

A mapping of digit to letters (just like on the telephone buttons) is given below. Note that 1 does not map to any letters.

##### Example

```text
Example:

Input: "23"
Output: ["ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"].
Note:

Although the above answer is in lexicographical order, your answer could be in any order you want.

```

##### JAVA题解

```java
package algorithm;

import java.util.*;

/**
 * 给定一个仅包含数字 2-9 的字符串，返回所有它能表示的字母组合。
 *
 * 给出数字到字母的映射如下（与电话按键相同）。注意 1 不对应任何字母。
 *
 示例:
 输入："23"
 输出：["ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"].
 */
public class Leetcode17 {

    public static List<String> letterCombinations(String digits) {

        List<String> res = new ArrayList<>();
        String[] indexToStr = new String[]{"", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"};
        if (digits == null || "".equals(digits))
            return res;
        else if(digits.length() == 1) {
            char[] chars = indexToStr[Integer.parseInt(digits)].toCharArray();
            for (int i = 0; i < chars.length; i++) {
                res.add(new String(new char[]{chars[i]}));
            }
        }

        char[] charArray = digits.toCharArray();
        char[] i0Char = indexToStr[(int) charArray[0] - (int) ('0')].toCharArray();

        for (int i = 1; i < charArray.length; i++) {

            for (int i1 = 0; i1 < i0Char.length; i1++) {
                char[] chars1 = indexToStr[(int) charArray[i] - (int) ('0')].toCharArray();
                for (int i2 = 0; i2 < chars1.length; i2++) {
                    res.add(new String(new char[]{i0Char[i1], chars1[i2]}));
                }
            }

        }
        return res;
    }

    Map<String, String> phone = new HashMap<String, String>() {{
        put("2", "abc");
        put("3", "def");
        put("4", "ghi");
        put("5", "jkl");
        put("6", "mno");
        put("7", "pqrs");
        put("8", "tuv");
        put("9", "wxyz");
    }};

    List<String> output = new ArrayList<String>();

    public void backtrack(String combination, String next_digits) {
        // if there is no more digits to check
        if (next_digits.length() == 0) {
            // the combination is done
            output.add(combination);
        }
        // if there are still digits to check
        else {
            // iterate over all letters which map
            // the next available digit
            String digit = next_digits.substring(0, 1);
            String letters = phone.get(digit);
            for (int i = 0; i < letters.length(); i++) {
                String letter = phone.get(digit).substring(i, i + 1);
                // append the current letter to the combination
                // and proceed to the next digits
                backtrack(combination + letter, next_digits.substring(1));
            }
        }
    }

    /**
     * 方法：回溯
     * 回溯是一种通过穷举所有可能情况来找到所有解的算法。如果一个候选解最后被发现并不是可行解，回溯算法会舍弃它，并在前面的一些步骤做出一些修改，并重新尝试找到可行解。
     *
     * 给出如下回溯函数 backtrack(combination, next_digits) ，它将一个目前已经产生的组合 combination 和接下来准备要输入的数字 next_digits 作为参数。
     *
     * 如果没有更多的数字需要被输入，那意味着当前的组合已经产生好了。
     * 如果还有数字需要被输入：
     * 遍历下一个数字所对应的所有映射的字母。
     * 将当前的字母添加到组合最后，也就是 combination = combination + letter 。
     * 重复这个过程，输入剩下的数字： backtrack(combination + letter, next_digits[1:]) 。
     *
     * 有动画图解
     * 作者：LeetCode
     * 链接：https://leetcode-cn.com/problems/letter-combinations-of-a-phone-number/solution/dian-hua-hao-ma-de-zi-mu-zu-he-by-leetcode/
     * 来源：力扣（LeetCode）
     * 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
     * @param digits
     * @return
     */
    public List<String> letterCombinations1(String digits) {
        if (digits.length() != 0)
            backtrack("", digits);
        return output;
    }


    public static void main(String[] args) {
        System.out.println(letterCombinations("3"));
        System.out.println(new Leetcode17().letterCombinations1("234"));
    }
}

```

#### [18. 4Sum](https://leetcode-cn.com/problems/4sum/)

Given an array nums of n integers and an integer target, are there elements a, b, c, and d in nums such that a + b + c + d = target? Find all unique quadruplets in the array which gives the sum of target.

Note:

The solution set must not contain duplicate quadruplets.

##### Example

```text
Example:

Given array nums = [1, 0, -1, 0, -2, 2], and target = 0.

A solution set is:
[
  [-1,  0, 0, 1],
  [-2, -1, 1, 2],
  [-2,  0, 0, 2]
]

```

##### JAVA题解

```java
package algorithm;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * 给定一个包含 n 个整数的数组 nums 和一个目标值 target，判断 nums 中是否存在四个元素 a，b，c 和 d ，
 * 使得 a + b + c + d 的值与 target 相等？找出所有满足条件且不重复的四元组。
 *
 * 注意：
 *
 * 答案中不可以包含重复的四元组。
 *
 * 示例：
 *
 * 给定数组 nums = [1, 0, -1, 0, -2, 2]，和 target = 0。
 *
 * 满足要求的四元组集合为：
 * [
 *   [-1,  0, 0, 1],
 *   [-2, -1, 1, 2],
 *   [-2,  0, 0, 2]
 * ]
 *
 * 来源：力扣（LeetCode）
 * 链接：https://leetcode-cn.com/problems/4sum
 * 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
 */
public class Leetcode18 {

    /**
     * 思路：
     *
     *  四数之和与前面三数之和的思路几乎是一样的，嗝。（刚好前些天才写了三数之和的题解）
     *  如果前面的三数之和会做了的话，这里其实就是在前面的基础上多添加一个遍历的指针而已。
     *  会做三数之和的可以不用看下面的了。。
     *
     *  使用四个指针(a<b<c<d)。固定最小的a和b在左边，c=b+1,d=_size-1 移动两个指针包夹求解。
     *  保存使得nums[a]+nums[b]+nums[c]+nums[d]==target的解。偏大时d左移，偏小时c右移。c和d相
     *  遇时，表示以当前的a和b为最小值的解已经全部求得。b++,进入下一轮循环b循环，当b循环结束后。
     *  a++，进入下一轮a循环。 即(a在最外层循环，里面嵌套b循环，再嵌套双指针c,d包夹求解)。
     * 准备工作：
     *
     *  因为要使用双指针的方法，排序是必须要做der~。 时间复杂度O(NlogN).
     *
     * 作者：misakasagiri-2
     * 链接：https://leetcode-cn.com/problems/4sum/solution/shuang-zhi-zhen-jie-fa-can-zhao-san-shu-zhi-he-ge-/
     * 来源：力扣（LeetCode）
     * 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
     *
     * @param nums
     * @param target
     * @return
     */
    public List<List<Integer>> fourSum(int[] nums, int target) {
        /*定义一个返回值*/
        List<List<Integer>> result = new ArrayList<>();
        /*当数组为null或元素小于4个时，直接返回*/
        if (nums == null || nums.length < 4) {
            return result;
        }
        /*对数组进行从小到大排序*/
        Arrays.sort(nums);
        System.out.println("-4,-1,-1,0,1,2");
        /*数组长度*/
        int length = nums.length;
        /*定义4个指针k，i，j，h  k从0开始遍历，i从k+1开始遍历，留下j和h，j指向i+1，h指向数组最大值*/
        for (int k = 0; k < length - 3; k++) {
            /*当k的值与前面的值相等时忽略*/
            if (k > 0 && nums[k] == nums[k - 1]) {
                continue;
            }
            /*获取当前最小值，如果最小值比目标值大，说明后面越来越大的值根本没戏*/
            int min1 = nums[k] + nums[k + 1] + nums[k + 2] + nums[k + 3];
            if (min1 > target) {
                break;
            }
            /*获取当前最大值，如果最大值比目标值小，说明后面越来越小的值根本没戏，忽略*/
            int max1 = nums[k] + nums[length - 1] + nums[length - 2] + nums[length - 3];
            if (max1 < target) {
                continue;
            }
            /*第二层循环i，初始值指向k+1*/
            for (int i = k + 1; i < length - 2; i++) {
                /*当i的值与前面的值相等时忽略*/
                if (i > k + 1 && nums[i] == nums[i - 1]) {
                    continue;
                }
                /*定义指针j指向i+1*/
                int j = i + 1;
                /*定义指针h指向数组末尾*/
                int h = length - 1;
                /*获取当前最小值，如果最小值比目标值大，说明后面越来越大的值根本没戏，忽略*/
                int min = nums[k] + nums[i] + nums[j] + nums[j + 1];
                if (min > target) {
                    System.out.println("m,k="+k+",i="+i+",j="+j+",j+1="+(j+1));
                    break; // 此时直接滑动k,因为不管怎么滑动i,min 都会大于target
                }
                /*获取当前最大值，如果最大值比目标值小，说明后面越来越小的值根本没戏，忽略*/
                int max = nums[k] + nums[i] + nums[h] + nums[h - 1];
                if (max < target) {
                    System.out.println("ma,k="+k+",i="+i+",j="+j+",j+1="+(j+1));
                    continue; // 此时continue滑动i 值，nums[i] + nums[h] + nums[h - 1] 变大 ，整个max 会变大
                }
                /**
                 * -4,-1,-1,0,1,2
                 * ma,k=0,i=1,j=2,j+1=3
                 * m,k=1,i=3,j=4,j+1=5
                 * [[-4, 0, 1, 2], [-1, -1, 0, 1]]
                 *
                 * -4,-1,-1,0,1,2
                 * ma,k=0,i=1,j=2,j+1=3
                 * m,k=1,i=3,j=4,j+1=5
                 * [[-1, -1, 0, 1]]
                 */


                /*开始j指针和h指针的表演，计算当前和，如果等于目标值，j++并去重，h--并去重，当当前和大于目标值时h--，当当前和小于目标值时j++*/
                while (j < h) {
                    int curr = nums[k] + nums[i] + nums[j] + nums[h];
                    if (curr == target) {
                        result.add(Arrays.asList(nums[k], nums[i], nums[j], nums[h]));
                        j++;
                        while (j < h && nums[j] == nums[j - 1]) {
                            j++;
                        }
                        h--;
                        while (j < h && i < h && nums[h] == nums[h + 1]) {
                            h--;
                        }
                    } else if (curr > target) {
                        h--;
                    } else {
                        j++;
                    }
                }
            }
        }
        return result;
    }

    /*
    作者：you-wei-wu
    链接：https://leetcode-cn.com/problems/4sum/solution/ji-bai-9994de-yong-hu-you-dai-ma-you-zhu-shi-by-yo/
    来源：力扣（LeetCode）
    著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
    */

    public static void main(String[] args) {
        System.out.println(new Leetcode18().fourSum(new int[]{-1,0,1,2,-1,-4},-1));
    }
}

```

