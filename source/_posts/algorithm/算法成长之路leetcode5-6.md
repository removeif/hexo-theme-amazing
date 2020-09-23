---
title: 算法成长之路leetcode5-6
date: 2019-12-05 17:54:02
toc: true
recommend: 1
keywords: categories-algorithm
thumbnail: https://cdn.jsdelivr.net/gh/removeif/blog_image/img/2019/20191205205720.png
tags: [最长回文,Z字变换]
categories: [algorithm]
---

### [5. Longest Palindromic Substring](https://leetcode-cn.com/problems/longest-palindromic-substring/)
Given a string s, find the longest palindromic substring in s. You may assume that the maximum length of s is 1000.
<!-- more -->
#### Example
```text
Example 1:
Input: "babad"
Output: "bab"
Note: "aba" is also a valid answer.

Example 2:
Input: "cbbd"
Output: "bb"
```
#### JAVA题解
```java
package algorithm;

public class Leetcode5 {
    public static void main(String[] args) {
        System.out.println(longestPalindrome("abbaabb"));
    }

    /**
     * 给定一个字符串 s，找到 s 中最长的回文子串。你可以假设 s 的最大长度为 1000。
     *
     * 示例 1：
     *
     * 输入: "babad"
     * 输出: "bab"
     * 注意: "aba" 也是一个有效答案。
     * 示例 2：
     *
     * 输入: "cbbd"
     * 输出: "bb"
     *
     * 来源：力扣（LeetCode）
     * 链接：https://leetcode-cn.com/problems/longest-palindromic-substring
     * 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
     */

    /**
     * 终于看懂了这个中心向两边扩张算法是什么意思了。
     * 先来解释一下为什么中心是2n-1而不是n 比如有字符串abcba，这时回文子串是abcda，
     * 中心是c；又有字符串adccda，这时回文子串是adccda，中心是cc。 由此可见中心点既有可能是一个字符，
     * 也有可能是两个字符，当中心为一个字符的时候有n个中心，
     * 当中心为两个字符的时候有n-1个中心，所以一共有2n-1个中心。
     * 然后for循环开始从左到右遍历，为什么会有两次expandAroundCenter，一次是i和i本身，一次是i和i+1，
     * 这就是上面说到的一个中心与两个中心。 而后会去判断这两种情况下谁的回文子串最长，并标记出这个子串在原字符串中的定位，即start和end。
     *
     * @param s
     * @return
     */
    public static String longestPalindrome(String s) {

        if (s == null || s.length() < 1) return "";
        int start = 0, end = 0;
        for (int i = 0; i < s.length(); i++) {
            // 一个数向两边扩张
            int len1 = expandAroundCenter(s, i, i);
            // 两个数向两边扩张
            int len2 = expandAroundCenter(s, i, i + 1);
            // 取最长的回文
            int len = Math.max(len1, len2);
            // 判读此时长度和原来的最长度
            if (len > end - start) {
                // 求最长回文开始位置
                start = i - (len - 1) / 2;
                // 求最长回文结束位置
                end = i + len / 2;
            }
        }
        // 截取最长回文
        return s.substring(start, end + 1);
    }

    /**
     * 向两边向两边扩张求长度
     *
     * @param s
     * @param left
     * @param right
     * @return
     */
    private static int expandAroundCenter(String s, int left, int right) {
        // 定位中心位置
        int L = left, R = right;
        // 判读中间位置是否相等，以及两边扩张是否相等
        while (L >= 0 && R < s.length() && s.charAt(L) == s.charAt(R)) {
            // 向左扩张一位
            L--;
            // 向右扩张一位
            R++;
        }
        // 回文的长度 如 aba 时,当 b = 1时，一个中心点进来,L = 1,R = 1,此时满足循环，L=0,R=2,此时也满足
        // 循环，L = -1,R=3,此时循环结束，长度为3 = 3 -（-1） -1
        return R - L - 1;
    }
}

```
### [6. ZigZag Conversion](https://leetcode-cn.com/problems/zigzag-conversion/)
The string "PAYPALISHIRING" is written in a zigzag pattern on a given number of rows like this: (you may want to display this pattern in a fixed font for better legibility)

P   A   H   N
A P L S I I G
Y   I   R
And then read line by line: "PAHNAPLSIIGYIR"

Write the code that will take a string and make this conversion given a number of rows:

string convert(string s, int numRows);
#### Example
```text
Example 1:
Input: s = "PAYPALISHIRING", numRows = 3
Output: "PAHNAPLSIIGYIR"

Example 2:
Input: s = "PAYPALISHIRING", numRows = 4
Output: "PINALSIGYAHRPI"
Explanation:

P     I    N
A   L S  I G
Y A   H R
P     I
```
#### JAVA题解
```java
package algorithm;

import java.util.ArrayList;
import java.util.List;

public class Leetcode6 {
    /**
     * 将一个给定字符串根据给定的行数，以从上往下、从左到右进行 Z 字形排列。
     * <p>
     * 比如输入字符串为 "LEETCODEISHIRING" 行数为 3 时，排列如下：
     * <p>
     * L   C   I   R
     * E T O E S I I G
     * E   D   H   N
     * 之后，你的输出需要从左往右逐行读取，产生出一个新的字符串，比如："LCIRETOESIIGEDHN"。
     * <p>
     * 请你实现这个将字符串进行指定行数变换的函数：
     * <p>
     * string convert(string s, int numRows);
     * 示例 1:
     * <p>
     * 输入: s = "LEETCODEISHIRING", numRows = 3
     * 输出: "LCIRETOESIIGEDHN"
     * 示例 2:
     * <p>
     * 输入: s = "LEETCODEISHIRING", numRows = 4
     * 输出: "LDREOEIIECIHNTSG"
     * 解释:
     * <p>
     * L     D     R
     * E   O E   I I
     * E C   I H   N
     * T     S     G
     * <p>
     * 来源：力扣（LeetCode）
     * 链接：https://leetcode-cn.com/problems/zigzag-conversion
     * 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
     */
    public String convert(String s, int numRows) {

        if (numRows == 1) return s;

        List<StringBuilder> rows = new ArrayList<>();
        for (int i = 0; i < Math.min(numRows, s.length()); i++)
            // 确定有多少行，每一行放一个待填充的字符串
            rows.add(new StringBuilder());
        // 当前行
        int curRow = 0;
        // 上移或下移 false上移
        boolean goingDown = false;

        for (char c : s.toCharArray()) {
            // 挨着放字符到对应的行
            rows.get(curRow).append(c);
            // 判断是否下移，当第一行和最后一行的时候转向
            if (curRow == 0 || curRow == numRows - 1) goingDown = !goingDown;
            // 下移行数+1，上移行数-1
            curRow += goingDown ? 1 : -1;
        }
        // 存最终结果
        StringBuilder ret = new StringBuilder();
        // 遍历每行，进行连接
        for (StringBuilder row : rows) ret.append(row);
        return ret.toString();
    }

    public static void main(String[] args) {
        Leetcode6 l = new Leetcode6();
        System.out.println(l.convert("weweqw", 3));
    }
}
```

