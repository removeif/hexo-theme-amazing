---
title: 算法成长之路leetcode11-12

toc: true
recommend: 1
keywords: categories-java, 算法成长之路leetcode11-12,11. Container With Most Water, 12. Integer to Roman
date: 2019-12-17 18:25:03
thumbnail: https://cdn.jsdelivr.net/gh/removeif/blog_image/img/2019/20191217183204.png
tags: [贪心算法]
categories: [algorithm]
---
### [11. Container With Most Water](https://leetcode-cn.com/problems/container-with-most-water/)

Given n non-negative integers a1, a2, ..., an , where each represents a point at coordinate (i, ai). n vertical lines are drawn such that the two endpoints of line i is at (i, ai) and (i, 0). Find two lines, which together with x-axis forms a container, such that the container contains the most water.
<!-- more -->
Note: You may not slant the container and n is at least 2.

![](https://cdn.jsdelivr.net/gh/removeif/blog_image/img/2019/20191217182702.png)

The above vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the max area of water (blue section) the container can contain is 49.

#### Example

```txt
Example:

Input: [1,8,6,2,5,4,8,3,7]
Output: 49
```

#### JAVA题解

```JAVA
package algorithm;

/**
 * 给定 n 个非负整数 a1，a2，...，an，每个数代表坐标中的一个点 (i, ai) 。
 * 在坐标内画 n 条垂直线，垂直线 i 的两个端点分别为 (i, ai) 和 (i, 0)。
 * 找出其中的两条线，使得它们与 x 轴共同构成的容器可以容纳最多的水。
 *
 * 说明：你不能倾斜容器，且 n 的值至少为 2。
 *
 *
 *
 * 图中垂直线代表输入数组 [1,8,6,2,5,4,8,3,7]。在此情况下，容器能够容纳水（表示为蓝色部分）的最大值为 49。
 *
 *
 *
 * 示例:
 *
 * 输入: [1,8,6,2,5,4,8,3,7]
 * 输出: 49
 *
 *
 * 来源：力扣（LeetCode）
 * 链接：https://leetcode-cn.com/problems/container-with-most-water
 * 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
 */
public class Leetcode11 {

    // 暴力解法
    public static int maxArea(int[] height) {
        int max = 0;
        for (int i = 0; i < height.length - 1; i++) {
            for (int j = i + 1; j < height.length; j++) {
                max = Math.max(max, Math.min(height[i], height[j]) * (j-i));
            }
        }
        return max;
    }


    // 官方 双指针法

    /**
     * 算法
     *
     * 这种方法背后的思路在于，两线段之间形成的区域总是会受到其中较短那条长度的限制。此外，两线段距离越远，得到的面积就越大。
     *
     * 我们在由线段长度构成的数组中使用两个指针，一个放在开始，一个置于末尾。
     * 此外，我们会使用变量 maxareamaxarea 来持续存储到目前为止所获得的最大面积。
     * 在每一步中，我们会找出指针所指向的两条线段形成的区域，更新 maxareamaxarea，并将指向较短线段的指针向较长线段那端移动一步。
     *
     * 作者：LeetCode
     * 链接：https://leetcode-cn.com/problems/container-with-most-water/solution/sheng-zui-duo-shui-de-rong-qi-by-leetcode/
     * 来源：力扣（LeetCode）
     * 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
     *
     * 算法流程： 设置双指针 ii,jj 分别位于容器壁两端，根据规则移动指针（后续说明），并且更新面积最大值 res，直到 i == j 时返回 res。
     *
     * 指针移动规则与证明： 每次选定围成水槽两板高度 h[i]h[i],h[j]h[j] 中的短板，向中间收窄 11 格。以下证明：
     *
     * 设每一状态下水槽面积为 S(i, j)S(i,j),(0 <= i < j < n)(0<=i<j<n)，由于水槽的实际高度由两板中的短板决定，
     * 则可得面积公式 S(i, j) = min(h[i], h[j]) × (j - i)S(i,j)=min(h[i],h[j])×(j−i)。
     * 在每一个状态下，无论长板或短板收窄 11 格，都会导致水槽 底边宽度 -1−1：
     * 若向内移动短板，水槽的短板 min(h[i], h[j])min(h[i],h[j]) 可能变大，因此水槽面积 S(i, j)S(i,j) 可能增大。
     * 若向内移动长板，水槽的短板 min(h[i], h[j])min(h[i],h[j]) 不变或变小，下个水槽的面积一定小于当前水槽面积。
     * 因此，向内收窄短板可以获取面积最大值。换个角度理解：
     * 若不指定移动规则，所有移动出现的 S(i, j)S(i,j) 的状态数为 C(n, 2)C(n,2)，即暴力枚举出所有状态。
     * 在状态 S(i, j)S(i,j) 下向内移动短板至 S(i + 1, j)S(i+1,j)（假设 h[i] < h[j]h[i]<h[j] ），
     * 则相当于消去了 {S(i, j - 1), S(i, j - 2), ... , S(i, i + 1)}S(i,j−1),S(i,j−2),...,S(i,i+1) 状态集合。
     * 而所有消去状态的面积一定 <= S(i, j)<=S(i,j)：
     * 短板高度：相比 S(i, j)S(i,j) 相同或更短（<= h[i]<=h[i]）；
     * 底边宽度：相比 S(i, j)S(i,j) 更短。
     * 因此所有消去的状态的面积都 < S(i, j)<S(i,j)。通俗的讲，我们每次向内移动短板，所有的消去状态都不会导致丢失面积最大值 。
     *
     *
     * 作者：jyd
     * 链接：https://leetcode-cn.com/problems/container-with-most-water/solution/container-with-most-water-shuang-zhi-zhen-fa-yi-do/
     * 来源：力扣（LeetCode）
     * 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
     * @param height
     * @return
     */
    public static int maxArea1(int[] height) {

        int maxarea = 0, l = 0, r = height.length - 1;

        while (l < r) {
            // 计算面积，取最大值
            maxarea = Math.max(maxarea, Math.min(height[l], height[r]) * (r - l));
            // 小的向大的一方移动，如果左边小于右边，左边向右边移动一位，即左++,l++，否则右移
            if (height[l] < height[r])
                l++;
            else
                r--;
        }
        return maxarea;
    }

    public static int maxArea2(int[] height) {
        int i = 0, j = height.length - 1, res = 0;
        while(i < j){
            res = height[i] < height[j] ?
                    Math.max(res, (j - i) * height[i++]):
                    Math.max(res, (j - i) * height[j--]);
        }
        return res;
    }

    // best one
    public static int maxArea3(int[] height) {
        int lastIndex = height.length - 1, max = 0, temp = 0;
        for (int i = 0; i < lastIndex;) {
            // 取左右边上的最小的数
            temp = Math.min(height[i], height[lastIndex]);
            // 计算 距离最大面积
            if (temp * (lastIndex - i) > max) {
                max = temp * (lastIndex - i);
                System.out.println("" + i + "," + lastIndex);
            }


            // 最小值在右边的话 右边往左边移动
            while (temp >= height[lastIndex] && i < lastIndex)
                lastIndex--;
            // 最小值在左边的话 左边往右移动 直到重合
            while (temp >= height[i] && i < lastIndex)
                i++;
        }
        return max;
    }

    public static void main(String[] args) {
        System.out.println(maxArea3(new int[]{10, 8, 6, 2, 5, 4, 8, 3, 7}));
    }

}
```

### [12. Integer to Roman](https://leetcode-cn.com/problems/integer-to-roman/)

Roman numerals are represented by seven different symbols: I, V, X, L, C, D and M.

Symbol       Value
I             1
V             5
X             10
L             50
C             100
D             500
M             1000
For example, two is written as II in Roman numeral, just two one's added together. Twelve is written as, XII, which is simply X + II. The number twenty seven is written as XXVII, which is XX + V + II.

Roman numerals are usually written largest to smallest from left to right. However, the numeral for four is not IIII. Instead, the number four is written as IV. Because the one is before the five we subtract it making four. The same principle applies to the number nine, which is written as IX. There are six instances where subtraction is used:

I can be placed before V (5) and X (10) to make 4 and 9. 
X can be placed before L (50) and C (100) to make 40 and 90. 
C can be placed before D (500) and M (1000) to make 400 and 900.
Given an integer, convert it to a roman numeral. Input is guaranteed to be within the range from 1 to 3999.

#### Example

```txt
Example 1:

Input: 3
Output: "III"
Example 2:

Input: 4
Output: "IV"
Example 3:

Input: 9
Output: "IX"
Example 4:

Input: 58
Output: "LVIII"
Explanation: L = 50, V = 5, III = 3.
Example 5:

Input: 1994
Output: "MCMXCIV"
Explanation: M = 1000, CM = 900, XC = 90 and IV = 4.

```

#### JAVA题解

```java
package algorithm;

/**
 * 罗马数字包含以下七种字符： I， V， X， L，C，D 和 M。
 *
 * 字符          数值
 * I             1
 * V             5
 * X             10
 * L             50
 * C             100
 * D             500
 * M             1000
 * 例如， 罗马数字 2 写做 II ，即为两个并列的 1。12 写做 XII ，
 * 即为 X + II 。 27 写做  XXVII, 即为 XX + V + II 。
 *
 * 通常情况下，罗马数字中小的数字在大的数字的右边。
 * 但也存在特例，例如 4 不写做 IIII，而是 IV。数字 1 在数字 5 的左边，
 * 所表示的数等于大数 5 减小数 1 得到的数值 4 。同样地，
 * 数字 9 表示为 IX。这个特殊的规则只适用于以下六种情况：
 *
 * I 可以放在 V (5) 和 X (10) 的左边，来表示 4 和 9。
 * X 可以放在 L (50) 和 C (100) 的左边，来表示 40 和 90。 
 * C 可以放在 D (500) 和 M (1000) 的左边，来表示 400 和 900。
 * 给定一个整数，将其转为罗马数字。输入确保在 1 到 3999 的范围内。
 *
 * 示例 1:
 *
 * 输入: 3
 * 输出: "III"
 * 示例 2:
 *
 * 输入: 4
 * 输出: "IV"
 * 示例 3:
 *
 * 输入: 9
 * 输出: "IX"
 * 示例 4:
 *
 * 输入: 58
 * 输出: "LVIII"
 * 解释: L = 50, V = 5, III = 3.
 * 示例 5:
 *
 * 输入: 1994
 * 输出: "MCMXCIV"
 * 解释: M = 1000, CM = 900, XC = 90, IV = 4.
 *
 *
 * 来源：力扣（LeetCode）
 * 链接：https://leetcode-cn.com/problems/integer-to-roman
 * 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
 */
public class Leetcode12 {

    /**
     * 执行用时 :6 ms, 在所有 java 提交中击败了的用户
     * 内存消耗 :36.1 MB, 在所有 java 提交中击败了100.00%的用户
     * @param num
     * @return
     */
    public static String intToRoman(int num) {
        // 个位数
        String[] map = new String[]{"", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"};
        // 十位数
        String[] map1 = new String[]{"", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC"};
        // 百位
        String[] map2 = new String[]{"", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM"};
        // 千位
        String[] map3 = new String[]{"", "M", "MM", "MMM"};
        StringBuilder sb = new StringBuilder();
        String[] res = new String[4];
        int i = 10;
        int j = 0;
        while (num > 0) {
            int temp = num % i;
            if (i > 10) {
                temp = temp / (i / 10);
            }
            switch (j) {
                case 0:
                    res[j++] = map[temp];
                    break;
                case 1:
                    res[j++] = map1[temp];
                    break;
                case 2:
                    res[j++] = map2[temp];
                    break;
                case 3:
                    res[j++] = map3[temp];
                    break;
            }
            i = 10*i;
            if (j > 3) {
                break;
            }
        }
        for (int k = res.length - 1; k >= 0; k--) {
            sb.append(res[k]);
        }
        return sb.toString();
    }


    /**
     * 贪心算法
     *
     * 解题思路
     * 参考大佬们的思路 吃透之后 写出来
     * 贪心算法 我永远用最接近的去做比较
     *
     * 如果我去小卖部买55元的东西
     *
     * 你可以选择一张面值50的 和一张5块的
     * 也可以给一张100的让老板找零
     * 贪心算法就是前者
     *
     * 假定我买3块的东西 我先用5块去比较 太多了 老板问 你还有小点的纸币没 我找不开
     * 这时候 你给个两块 还差一块 又给了一块
     * 看着很蠢 但是这确实有效
     *
     * 作者：guo-tang-feng
     * 链接：https://leetcode-cn.com/problems/integer-to-roman/solution/tan-xin-suan-fa-by-guo-tang-feng/
     * 来源：力扣（LeetCode）
     * 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
     *
     * @param num
     * @return
     */
    public static String intToRoman1(int num) {
        StringBuilder stringBuilder = new StringBuilder();
        int[] moneys = new int[]{1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1};
        String[] moneyToStr = new String[]{"M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"};
        int index = 0;
        while (num > 0) {
            // 如果大于最大的数
            if (num >= moneys[index]) {
                // 加进去
                stringBuilder.append(moneyToStr[index]);
                // 把加进去的减掉
                num -= moneys[index];
                // 索引前移，num -= moneys[index] 还可能满足 num >= moneys[index]
                // ，此时如果只index++，那么就漏掉一部分了，所以要index--，如2000减掉1000还有1000 还是应该和moneys[0]比较
                index--;
            }
            // 索引后移
            index++;
        }
        return stringBuilder.toString();
    }

    public static void main(String[] args) {
        // 第一次超过100%用户的内存，有点小小激动 😂
        System.out.println(intToRoman(400));
        System.out.println(intToRoman1(1994));
    }

}
```

