---
title: 算法成长之路leetcode9-10

toc: true
recommend: 1
keywords: categories-dp,动态规划,java,经典dp
date: 2019-12-14 16:32:33
thumbnail: https://cdn.jsdelivr.net/gh/removeif/blog_image/img/2019/20191214170627.png
tags: [动态规划,中心扩展,dp]
categories: [algorithm]
---

### [9. Palindrome Number](https://leetcode-cn.com/problems/palindrome-number/)

Determine whether an integer is a palindrome. An integer is a palindrome when it reads the same backward as forward.
<!-- more -->
#### Example

```txt
Example 1:

Input: 121
Output: true
Example 2:

Input: -121
Output: false
Explanation: From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome.
Example 3:

Input: 10
Output: false
Explanation: Reads 01 from right to left. Therefore it is not a palindrome.
Follow up:

Coud you solve it without converting the integer to a string?

```

#### Java 题解

```java
package algorithm;
public class Leetcode9 {
  
    /**
     * 判断一个整数是否是回文数。回文数是指正序（从左向右）和倒序（从右向左）读都是一样的整数。
     *
     * 示例 1:
     *
     * 输入: 121
     * 输出: true
     * 示例 2:
     *
     * 输入: -121
     * 输出: false
     * 解释: 从左向右读, 为 -121 。 从右向左读, 为 121- 。因此它不是一个回文数。
     * 示例 3:
     *
     * 输入: 10
     * 输出: false
     * 解释: 从右向左读, 为 01 。因此它不是一个回文数。
     *
     * 来源：力扣（LeetCode）
     * 链接：https://leetcode-cn.com/problems/palindrome-number
     * 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
     * @param x
     * @return
     */

    public static boolean isPalindrome(int x) {
        if (x >= 0 && x < 10) {
            return true;
        }

        String source = x + "";
        int length = source.length();
        //  mid中间位置1，mid1中间位置2
        int mid, mid1;
        // 偶数
        if (length % 2 == 0) {
            // 如 1221 偶数，中间位置分别为2，2
            mid = length / 2 - 1;
            mid1 = mid + 1;
        } else {
            // 奇数时，212，中间位置分别是1，1
            mid = length / 2;
            mid1 = mid;
        }
        // 确定中心位置向两边扩展是否相等，直到扩展完位置
        while (mid >= 0 && source.charAt(mid) == source.charAt(mid1)) {
            mid = mid - 1;
            mid1 = mid1 + 1;
        }

        // 如果循环结束并且所有数都遍历完
        if (mid == -1 && mid1 == length) {
            return true;
        } else {
            return false;
        }
    }

    public static boolean isPalindrome1(int x) {
        // 特殊情况：
        // 如上所述，当 x < 0 时，x 不是回文数。
        // 同样地，如果数字的最后一位是 0，为了使该数字为回文，
        // 则其第一位数字也应该是 0
        // 只有 0 满足这一属性
        if (x < 0 || (x % 10 == 0 && x != 0)) {
            return false;
        }

        // 一位一位反转的数
        int revertedNumber = 0;
        // 如121
        while (x > revertedNumber) {
            revertedNumber = revertedNumber * 10 + x % 10;
            x /= 10;
            System.out.println("x=" + x + ",revertedNumber=" + revertedNumber);
        }

        // 当数字长度为奇数时，我们可以通过 revertedNumber/10 去除处于中位的数字。
        // 例如，当输入为 12321 时，在 while 循环的末尾我们可以得到 x = 12，revertedNumber = 123，
        // 由于处于中位的数字不影响回文（它总是与自己相等），所以我们可以简单地将其去除。
        return x == revertedNumber || x == revertedNumber / 10;
    }

    public static void main(String[] args) {
        /**
         * -1
         * 121
         * 222
         * 2222
         * 1221
         * -12
         */
        System.out.println(isPalindrome(1221));
        System.out.println(isPalindrome1(121));
    }
}

```

### [10. Regular Expression Matching](https://leetcode-cn.com/problems/regular-expression-matching/)

Given an input string (s) and a pattern (p), implement regular expression matching with support for '.' and '*'.

'.' Matches any single character.
'*' Matches zero or more of the preceding element.
The matching should cover the entire input string (not partial).

Note:

s could be empty and contains only lowercase letters a-z.
p could be empty and contains only lowercase letters a-z, and characters like . or *.

#### Example

```txt
Example 1:

Input:
s = "aa"
p = "a"
Output: false
Explanation: "a" does not match the entire string "aa".
Example 2:

Input:
s = "aa"
p = "a"
Output: true
Explanation: '' means zero or more of the preceding element, 'a'. Therefore, by repeating 'a' once, it becomes "aa".
Example 3:

Input:
s = "ab"
p = "."
Output: true
Explanation: "." means "zero or more (*) of any character (.)".
Example 4:

Input:
s = "aab"
p = "cab"
Output: true
Explanation: c can be repeated 0 times, a can be repeated 1 time. Therefore, it matches "aab".
Example 5:

Input:
s = "mississippi"
p = "misisp*."
Output: false
```

#### JAVA 题解

```java
package algorithm;


public class Leetcode10 {
    /**
     * 给你一个字符串 s 和一个字符规律 p，请你来实现一个支持 '.' 和 '*' 的正则表达式匹配。
     *
     * '.' 匹配任意单个字符
     * '*' 匹配零个或多个前面的那一个元素
     * 所谓匹配，是要涵盖 整个 字符串 s的，而不是部分字符串。
     *
     * 说明:
     *
     * s 可能为空，且只包含从 a-z 的小写字母。
     * p 可能为空，且只包含从 a-z 的小写字母，以及字符 . 和 *。
     * 示例 1:
     *
     * 输入:
     * s = "aa"
     * p = "a"
     * 输出: false
     * 解释: "a" 无法匹配 "aa" 整个字符串。
     * 示例 2:
     *
     * 输入:
     * s = "aa"
     * p = "a*"
     * 输出: true
     * 解释: 因为 '*' 代表可以匹配零个或多个前面的那一个元素, 在这里前面的元素就是 'a'。因此，字符串 "aa" 可被视为 'a' 重复了一次。
     * 示例 3:
     *
     * 输入:
     * s = "ab"
     * p = ".*"
     * 输出: true
     * 解释: ".*" 表示可匹配零个或多个（'*'）任意字符（'.'）。
     * 示例 4:
     *
     * 输入:
     * s = "aab"
     * p = "c*a*b"
     * 输出: true
     * 解释: 因为 '*' 表示零个或多个，这里 'c' 为 0 个, 'a' 被重复一次。因此可以匹配字符串 "aab"。
     * 示例 5:
     *
     * 输入:
     * s = "mississippi"
     * p = "mis*is*p*."
     * 输出: false
     *
     * 来源：力扣（LeetCode）
     * 链接：https://leetcode-cn.com/problems/regular-expression-matching
     * 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
     *
     *
     *
     * 如果模式串中有星号，它会出现在第二个位置，
     * 即pattern[1] 。这种情况下，我们可以直接忽略模式串中这一部分，
     * 或者删除匹配串的第一个字符，前提是它能够匹配模式串当前位置字符，即 pattern[0] 。
     * 如果两种操作中有任何一种使得剩下的字符串能匹配，那么初始时，匹配串和模式串就可以被匹配。
     *
     * @param text
     * @param pattern
     * @return
     */

    public static boolean isMatch(String text, String pattern) { // 递归回溯

        if (pattern.isEmpty()) return text.isEmpty();

        boolean first_match = (!text.isEmpty() &&
                (pattern.charAt(0) == text.charAt(0) || pattern.charAt(0) == '.'));// 判断第一个是否相等

        System.out.println("t="+text+",p="+pattern+",firstM="+first_match);

        if (pattern.length() >= 2 && pattern.charAt(1) == '*'){ // 长度>=2 并且p第二个是*
            System.out.println("if1");
            return (isMatch(text, pattern.substring(2)) || // 直接忽略模式串中这一部分 如t=abc,p=a*. 直接忽略 a*
                    (first_match && isMatch(text.substring(1), pattern))); // 删除匹配串的第一个字符
        } else {
            System.out.println("if2");
            return first_match && isMatch(text.substring(1), pattern.substring(1));// 第一个匹配后，后面逐个匹配
        }
    }


    /**
     * 状态
     * 首先状态 dp 一定能自己想出来。
     * dp[i][j] 表示 s 的前 ii 个是否能被 p 的前 jj 个匹配
     *
     * 转移方程
     * 怎么想转移方程？首先想的时候从已经求出了 dp[i-1][j-1] 入手，再加上已知 s[i]、p[j]，要想的问题就是怎么去求 dp[i][j]。
     *
     * 已知 dp[i-1][j-1] 意思就是前面子串都匹配上了，不知道新的一位的情况。
     * 那就分情况考虑，所以对于新的一位 p[j] s[i] 的值不同，要分情况讨论：
     *
     * 考虑最简单的 p[j] == s[i] : dp[i][j] = dp[i-1][j-1]
     * 然后从 p[j] 可能的情况来考虑，让 p[j]=各种能等于的东西。
     *
     * p[j] == "." : dp[i][j] = dp[i-1][j-1]
     *
     * p[j] ==" * ":
     *
     * 第一个难想出来的点：怎么区分 *∗ 的两种讨论情况
     * 首先给了 *，明白 * 的含义是 匹配零个或多个前面的那一个元素，所以要考虑他前面的元素 p[j-1]。* 跟着他前一个字符走，前一个能匹配上 s[i]，* 才能有用，前一个都不能匹配上 s[i]，* 也无能为力，只能让前一个字符消失，也就是匹配 00 次前一个字符。
     * 所以按照 p[j-1] 和 s[i] 是否相等，我们分为两种情况：
     *
     * 3.1 p[j-1] != s[i] : dp[i][j] = dp[i][j-2]
     * 这就是刚才说的那种前一个字符匹配不上的情况。
     * 比如(ab, abc * )。遇到 * 往前看两个，发现前面 s[i] 的 ab 对 p[j-2] 的 ab 能匹配，虽然后面是 c*，但是可以看做匹配 00 次 c，相当于直接去掉 c *，所以也是 True。注意 (ab, abc**) 是 False。
     * 3.2 p[j-1] == s[i] or p[j-1] == "."：
     * * 前面那个字符，能匹配 s[i]，或者 * 前面那个字符是万能的 .
     * 因为 . * 就相当于 . .，那就只要看前面可不可以匹配就行。
     * 比如 (##b , ###b *)，或者 ( ##b , ### . * ) 只看 ### 后面一定是能够匹配上的。
     * 所以要看 b 和 b * 前面那部分 ## 的地方匹不匹配。
     * 第二个难想出来的点：怎么判断前面是否匹配
     * dp[i][j] = dp[i-1][j] // 多个字符匹配的情况
     * or dp[i][j] = dp[i][j-1] // 单个字符匹配的情况
     * or dp[i][j] = dp[i][j-2] // 没有匹配的情况
     * 看 ### 匹不匹配，不是直接只看 ### 匹不匹配，要综合后面的 b b* 来分析
     * 这三种情况是 oror 的关系，满足任意一种都可以匹配上，同时是最难以理解的地方：
     *
     * dp[i-1][j] 就是看 s 里 b 多不多， ### 和 ###b * 是否匹配，一旦匹配，s 后面再添个 b 也不影响，因为有 * 在，也就是 ###b 和 ###b *也会匹配。
     *
     * dp[i][j-1] 就是去掉 * 的那部分，###b 和 ###b 是否匹配，比如 qqb qqb
     *
     * dp[i][j-2] 就是 去掉多余的 b *，p 本身之前的能否匹配，###b 和 ### 是否匹配，比如 qqb qqbb* 之前的 qqb qqb 就可以匹配，那多了的 b * 也无所谓，因为 b * 可以是匹配 00 次 b，相当于 b * 可以直接去掉了。
     *
     * 三种满足一种就能匹配上。
     *
     * 为什么没有 dp[i-1][j-2] 的情况？ 就是 ### 和 ### 是否匹配？因为这种情况已经是 dp[i][j-1] 的子问题。也就是 s[i]==p[j-1]，则 dp[i-1][j-2]=dp[i][j-1]。
     *
     * 最后来个归纳：
     * 如果 p.charAt(j) == s.charAt(i) : dp[i][j] = dp[i-1][j-1]；
     * 如果 p.charAt(j) == '.' : dp[i][j] = dp[i-1][j-1]；
     * 如果 p.charAt(j) == '*'：
     * 如果 p.charAt(j-1) != s.charAt(i) : dp[i][j] = dp[i][j-2] //in this case, a* only counts as empty
     * 如果 p.charAt(i-1) == s.charAt(i) or p.charAt(i-1) == '.'：
     * dp[i][j] = dp[i-1][j] //in this case, a* counts as multiple a
     * or dp[i][j] = dp[i][j-1] // in this case, a* counts as single a
     * or dp[i][j] = dp[i][j-2] // in this case, a* counts as empty
     *
     * 作者：kao-la-7
     * 链接：https://leetcode-cn.com/problems/regular-expression-matching/solution/dong-tai-gui-hua-zen-yao-cong-0kai-shi-si-kao-da-b/
     * 来源：力扣（LeetCode）
     * 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
     * @param s
     * @param p
     * @return
     */
    public static boolean isMatch1(String s, String p) { // 动态规划

        if (s == null || p == null) {
            return false;
        }
        boolean[][] dp = new boolean[s.length() + 1][p.length() + 1];
        dp[0][0] = true;//dp[i][j] 表示 s 的前 i 个是否能被 p 的前 j 个匹配
        for (int i = 0; i < p.length(); i++) { // here's the p's length, not s's
            if (p.charAt(i) == '*' && dp[0][i - 1]) {
                dp[0][i + 1] = true; // here's y axis should be i+1
            }
        }
        for (int i = 0; i < s.length(); i++) {
            for (int j = 0; j < p.length(); j++) {
                if (p.charAt(j) == '.' || p.charAt(j) == s.charAt(i)) {//如果是任意元素 或者是对于元素匹配
                    dp[i + 1][j + 1] = dp[i][j];
                }
                if (p.charAt(j) == '*') {
                    if (p.charAt(j - 1) != s.charAt(i) && p.charAt(j - 1) != '.') {//如果前一个元素不匹配 且不为任意元素
                        dp[i + 1][j + 1] = dp[i + 1][j - 1];
                    } else {
                        dp[i + 1][j + 1] = (dp[i + 1][j] || dp[i][j + 1] || dp[i + 1][j - 1]);
                            /*
                            dp[i][j] = dp[i-1][j] // 多个字符匹配的情况
                            or dp[i][j] = dp[i][j-1] // 单个字符匹配的情况
                            or dp[i][j] = dp[i][j-2] // 没有匹配的情况
                             */

                    }
                }
            }
        }
        return dp[s.length()][p.length()];
    }

    // 官方解法--
    enum Result {
        TRUE, FALSE
    }

    Result[][] memo;

    public boolean isMatch2(String text, String pattern) { // 自顶向下 官方
        memo = new Result[text.length() + 1][pattern.length() + 1];
        return dp(0, 0, text, pattern);
    }

    public boolean dp(int i, int j, String text, String pattern) {
        if (memo[i][j] != null) {
            return memo[i][j] == Result.TRUE;
        }
        boolean ans;
        if (j == pattern.length()) {
            ans = i == text.length();
        } else {
            boolean first_match = (i < text.length() &&
                    (pattern.charAt(j) == text.charAt(i) ||
                            pattern.charAt(j) == '.'));

            if (j + 1 < pattern.length() && pattern.charAt(j + 1) == '*') {
                ans = (dp(i, j + 2, text, pattern) ||
                        first_match && dp(i + 1, j, text, pattern));
            } else {
                ans = first_match && dp(i + 1, j + 1, text, pattern);
            }
        }
        memo[i][j] = ans ? Result.TRUE : Result.FALSE;
        return ans;
    }

    public boolean isMatch3(String text, String pattern) { //动态规划，自底向上
        boolean[][] dp = new boolean[text.length() + 1][pattern.length() + 1];
        dp[text.length()][pattern.length()] = true;

        for (int i = text.length(); i >= 0; i--) {
            for (int j = pattern.length() - 1; j >= 0; j--) {
                boolean first_match = (i < text.length() &&
                        (pattern.charAt(j) == text.charAt(i) ||
                                pattern.charAt(j) == '.'));
                if (j + 1 < pattern.length() && pattern.charAt(j + 1) == '*') {
                    dp[i][j] = dp[i][j + 2] || first_match && dp[i + 1][j];
                } else {
                    dp[i][j] = first_match && dp[i + 1][j + 1];
                }
            }
        }
        return dp[0][0];
    }
    // 官方解法---

    public static void main(String[] args) {
        // "abc","a*."
        // "abc","ab*."
        System.out.println(isMatch("abc","ab*."));
        /**
         * log
         * t=abc,p=ab*.,firstM=true
         * if2
         * t=bc,p=b*.,firstM=true
         * if1
         * t=bc,p=.,firstM=true
         * if2
         * t=c,p=b*.,firstM=false
         * if1
         * t=c,p=.,firstM=true
         * if2
         * true
         */
        int cons[] = new int[]{1,2,3};
        System.out.println(getLeastCoinAmount(3,cons));
    }

    /**
     *
     * 常见DP小问题 参考自 https://www.cnblogs.com/fefjay/p/7541760.html
     *
     * 动态规划算法是一种比较灵活的算法，针对具体的问题要具体分析，其宗旨就是要找出要解决问题的状态，
     * 然后逆向转化为求解子问题，最终回到已知的初始态，然后再顺序累计各个子问题的解从而得到最终问题的解。
     *
     * 关键点就是找到状态转移方程和初始边界条件，说白了就是要找到“递推公式”和初始值，然后计算时保存每一步中间结果，最后累加判断得到结果。
     */


    /**
     * 0.求数组最值
     * 求数组最值方法很多，这里使用动态规划的思想来尝试处理，以便更好地理解DP的思想。为了方便这里假设数组a[i]大小为n，要找n个数当中的最大值。
     *
     * 设dp[i]表示第0...i个数的最大值，dp[i-1]表示第0...i-1个数的最大值，所以求前i个数的最大值时，
     * 已经知道前i-1个是的最大值是dp[i-1]，那么只需要比较dp[i-1]和第i个数谁大就知道了，即dp[i] = max(dp[-1], a[i])。
     */
    public int max(int[] a){
        int len = a.length;
        int[] dp = new int[len];
        dp[0] = a[0];
        for(int i=1; i<len; i++){
            dp[i] = (dp[i-1] > a[i]) ? dp[i-1] : a[i];
        }
        return dp[len-1];
    }

    /**
     * 1.求最大公共子序列长度
     * 给定一个字符串，想要删掉某些字符使得最后剩下的字符构成一个回文串（左右对称的字符串，如abcba），
     * 问最少删掉多少个字符可获得一个最长回文串。
     */

    /**
     * 本题求回文串最大长度就转化为求两个字符串的最长公共子序列（不一定连续）
     * 策略：字符串可以看做是字符序列，即字符数组。
     *      比如有序列A=a0,a1,a2...an；有序列B=b0,b1,b2,b3...bm；设A序列和B序列的公共子序列为C=c0,c1,c2,c3...ck。
     *      设L[][]为公共子序列C的长度，L[i][j]的i、j分别表示A、B序列的字符下标，L[i][j]含义是A序列a0、a1、a2...ai和B序列b0、b1、b2、
     *      ...bj的公共子序列的长度。
     *
     *      1）如果A序列的i字符和B序列的j字符相等，那么就有ck=ai=bj，公共子序列C的长度L[i][j]=L[i-1][j-1]+1。
     *      2）如果A序列的i字符和B序列的j字符不相等，若ai != ck则C为a0...ai-1和b0...bj的最长子序列，若bj != ck则C为a0...ai和b0...bj-1的最长子序列，
     *         所以此时公共子序列长度为L[i][j] = max(L[i][j-1], L[i-1][j])。
     */

    public static int lcs(String s){
        if (s == null  ) {
            return -1;
        }
        String rs = new StringBuilder(s).reverse().toString();
        char[] chars1 = s.toCharArray();
        char[] chars2 = rs.toCharArray();//获得反序的字符串
        int n = chars1.length;
        int[][] dp = new int[n+1][n+1];
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if(chars1[i] == chars2[j]){
                    dp[i][j] = dp[i-1][j-1] + 1;
                }else {
                    dp[i][j] = dp[i][j-1] > dp[i-1][j] ? dp[i][j-1] : dp[i-1][j];
                }
            }
        }
        return n - dp[n][n];
    }

    /**
     * 2.硬币凑钱问题
     * 只有面值为1元、3元、5元的硬币，数量足够。现在要凑够n元，求需要的最少硬币枚数。
     *
     * @param n 目标总钱数
     * @param coins 硬币数组【1，3，5】
     * @return 返回凑够n元需要的最少硬币数
     */
    public static int getLeastCoinAmount(int n, int[] coins){
        if (coins == null || n < 0) {
            return -1;
        }
        if (n == 0){
            return 0;
        }
        int[] dp = new int[n+1]; //dp[i]=j表示凑够i元最少需要j枚硬币。数组长度设为（n+1）保证可以访问dp[n]。
        dp[0] = 0;
        for (int i = 1; i <= n; i++) {
            dp[i] = Integer.MAX_VALUE;
        }

        int coinValue = 0;
        for (int i = 1; i <= n; i++) {//问题规模从小到大，直到达到目标面值
            for (int j = 0; j < coins.length; j++) {//遍历所有面值的硬币，j表示硬币面值的下标
                coinValue = coins[j];
                if (i - coinValue >= 0 && 1 + dp[i-coinValue] < dp[i]){ //当前方案的硬币数更少，则使用当前方案
                    dp[i] = 1 + dp[i-coins[j]];
                }
            }

        }
        return dp[n];
    }

    /**
     * 3.最长非降子序列
     * 一个序列有N个数：A[1],A[2],…,A[N]，求出最长非降子序列的长度。
     */

    /**
     *
     * 定义d(i)表示前i个数中"以A[i]结尾"的最长非降子序列的长度。
     * 对序列A1...Ai,找到的最长子序列长度d[i]分两种情况：
     * （1）包含最后一个数Ai,即d[i]=max{d[j]+1}(1<=j<i且Aj<=Ai)，满足条件的Aj可能会有多个，选最大的d[j]，如果Aj都大于Ai则d[j]=0；
     * （2）不含最后一个数,即d[i]=d[i-1]
     *
     * 综上：d[i] = max{d[i-1], max{d[j]+1}}
     */
    public static int longestIncreasingSubsequence(int[] a){
        if (a == null) {
            return -1;
        }
        if (a.length < 1){
            return 0;
        }
        int len = a.length;
        int[] dp = new int[len];//dp[i]系统自动初始化为0
        dp[0] = 1;
        for (int i = 1; i < len; i++) {//迭代，求序列0...len-1的最长子序列长度
            for (int j = 0; j < i; j++) {//寻找Ai之前的序列，看是否有不大于Ai的数字Aj
                if (a[j] <= a[i] && dp[i] < dp[j] + 1){//假设最长子序列包含最后一个数
                    dp[i] = dp[j] + 1;
                }
            }
            //寻找Ai之前的序列如果Ai都小于Aj，此时dp[i]并没有被修改仍为初始值0。所以包含最后一个数的最长子序列就只有最后一个数自身，长1
            dp[i] = Math.max(1, dp[i]);
            //至此，已经求出了包含最后一个数的最长子序列的长度，和不包含最后一个数的最长子序列长度比较，取最大值为当前的最大长度
            dp[i] = Math.max(dp[i], dp[i-1]);
        }
        return dp[len-1];

    }

    /**
     * 4.经典01背包问题
     * 01背包问题：一个承重（或体积）为W的背包，可选物品有n个，第i个物品分别重w[i]和价值v[i]，
     * 每个物品只能拿或不拿，求背包可放物品的最大价值。
     */

    /**
     *
     * 策略：这里的关键制约因素是背包只能承重w，而且每放入一个物品其承重就会减少。
     *      因此定义maxValue=V[i][j]，数组表示目前可选物品有i个：0、1...i-1，背包承重（剩余的存放重量）为j的最大价值。
     *      现在假设已经知道了(i-1)个物品且剩余承重为j的最大价值V[i-1][j]，那么考虑准备放入第i个物品的情况：
     *     （1）如果第i个物品的重量大于背包的剩余承重w_i>j，显然放不下了，所以此时V[i][j]=V[i-1][j];
     *      (2)w_i<=j，显然可以放下第i个物品，物品可以放得下，但是一定要装进来吗？如果装进的物品价值较低且较重，无疑会影响后续物品的装入情况。
     *        所以还要考虑要不要放进来的子问题，V[i][j]=max{vi+V[i-1][j-wi], V[i-1][j]}。
     *
     * @param W
     * @param n
     * @param w
     * @param v
     * @return
     */
    public static int knapsack(int W, int n, int[] w, int[] v){
        if ( W < 1 || n < 1 || w == null || v == null) {
            return -1;
        }
        int[][] dp = new int[n+1][W+1]; //可选的物品最多可以有n个，所以行数设为n+1。最大承重是W，所以列设为W+1。
        int index = 0;
        for (int i = 1; i <= n; i++) { //物品数肯定是从1开始。dp[0][j]系统初始化为0.
            index = i-1;
            for (int j = 1; j <= W ; j++) {//能装进的重量肯定是从1开始。dp[i][0]系统初始化为0.
                if (w[index] > j){
                    dp[i][j] =  dp[i-1][j];
                }else {
                    dp[i][j] =  Math.max(dp[i - 1][j - w[index]] + v[index], dp[i - 1][j]);
                }
            }

        }

        //找出是哪些物品放入背包
        boolean[] isTaken = new boolean[n];//标记是否放入背包里
        for (int i = n; i > 0 ; i--) {
            if (dp[i][W] != dp[i-1][W]){
                isTaken[i-1] = true;//装入
                W -= w[i-1];//装入之后背包的承重减少
                System.out.println(i-1);
            }
        }
        return dp[n][W];//返回n个物品承重为W时的最大价值
    }
}

```


