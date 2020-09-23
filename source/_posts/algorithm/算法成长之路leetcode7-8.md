---
title: 算法成长之路leetcode7-8

toc: true
recommend: 1
keywords: categories-algorithm, Reverse Integer,String to Integer (atoi)
date: 2019-12-10 23:36:42
thumbnail: https://cdn.jsdelivr.net/gh/removeif/blog_image/img/2019/20191210234547.png
tags: [反转整数,字符串转整数]
categories: [algorithm]
---

### [7. Reverse Integer](https://leetcode-cn.com/problems/reverse-integer/)

Given a 32-bit signed integer, reverse digits of an integer.
<!-- more -->

#### Example

```txt
Example 1:

Input: 123
Output: 321

Example 2:

Input: -123
Output: -321

Example 3:

Input: 120
Output: 21
```



Note:
Assume we are dealing with an environment which could only store integers within the 32-bit signed integer range: [−2^31,  2^31 − 1]. For the purpose of this problem, assume that your function returns 0 when the reversed integer overflows.

#### JAVA题解

```java
package algorithm;

public class Leetcode7 {
    /**
     * 给出一个 32 位的有符号整数，你需要将这个整数中每位上的数字进行反转。
     * 
     * 示例 1:
     * 
     * 输入: 123
     * 输出: 321
     *  示例 2:
     * 
     * 输入: -123
     * 输出: -321
     * 示例 3:
     * 
     * 输入: 120
     * 输出: 21
     * 注意:
     * 
     * 假设我们的环境只能存储得下 32 位的有符号整数，则其数值范围为 [−2^31,  2^31 − 1]。请根据这个假设，如果反转后整数溢出那么就返回 0。
     * 
     * 来源：力扣（LeetCode）
     * 链接：https://leetcode-cn.com/problems/reverse-integer
     * 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
     */
    public int reverse(int x) {

        if (x > Integer.MAX_VALUE || x < Integer.MIN_VALUE) {
            return 0;
        }

        boolean isNe = x < 0 ? true : false;
        x = Math.abs(x);
        // 取绝对值时越界了，直接返回0
        if (isNe && x < 0) {
            return 0;
        }
        StringBuilder sb = new StringBuilder();
        long m = 10;
        long base = 1;

        while (true) {
            base = m * base;
            long re = x % base;
            if (base == 10) {
                sb.append(re);
            } else {
                sb.append((re * m) / base);
            }
            if (x < base) {
                break;
            }
        }
        Long res;
        if (isNe) {
            res = 0 - Long.parseLong(sb.toString());
        } else {
            res = Long.parseLong(sb.toString());
        }

        if (res > Integer.MAX_VALUE || res < Integer.MIN_VALUE) {
            return 0;
        } else {
            return res.intValue();
        }
    }

    public int reverse1(int x) {
        int rev = 0;
        while (x != 0) {
            int pop = x % 10;
            x /= 10;
            // Integer.MAX_VALUE = 2147483647,因为后面 rev = rev * 10 + pop，所以rev >Integer.MAX_VALUE 溢出
            // rev == Integer.MAX_VALUE / 10 时，Integer.MAX_VALUE / 10 = 2147483640,so,pop > 7时溢出
            if (rev > Integer.MAX_VALUE / 10 || (rev == Integer.MAX_VALUE / 10 && pop > 7)) return 0;
            // Integer.MIN_VALUE = -2147483648
            // 同理如上
            if (rev < Integer.MIN_VALUE / 10 || (rev == Integer.MIN_VALUE / 10 && pop < -8)) return 0;
            rev = rev * 10 + pop;
        }
        return rev;
    }

    public static void main(String[] args) {
        System.out.println(Integer.MAX_VALUE);
//        System.out.println(reverse1(123));
    }
}

```

### [8. String to Integer (atoi)](https://leetcode-cn.com/problems/string-to-integer-atoi/)

Implement atoi which converts a string to an integer.

The function first discards as many whitespace characters as necessary until the first non-whitespace character is found. Then, starting from this character, takes an optional initial plus or minus sign followed by as many numerical digits as possible, and interprets them as a numerical value.

The string can contain additional characters after those that form the integral number, which are ignored and have no effect on the behavior of this function.

If the first sequence of non-whitespace characters in str is not a valid integral number, or if no such sequence exists because either str is empty or it contains only whitespace characters, no conversion is performed.

If no valid conversion could be performed, a zero value is returned.

Note:

Only the space character ' ' is considered as whitespace character.
Assume we are dealing with an environment which could only store integers within the 32-bit signed integer range: [−2^31,  2^31 − 1]. If the numerical value is out of the range of representable values, INT_MAX (2^31 − 1) or INT_MIN (−2^31) is returned.

#### Example 

```txt
Example 1:

Input: "42"
Output: 42
Example 2:

Input: "   -42"
Output: -42
Explanation: The first non-whitespace character is '-', which is the minus sign.
             Then take as many numerical digits as possible, which gets 42.
Example 3:

Input: "4193 with words"
Output: 4193
Explanation: Conversion stops at digit '3' as the next character is not a numerical digit.
Example 4:

Input: "words and 987"
Output: 0
Explanation: The first non-whitespace character is 'w', which is not a numerical 
             digit or a +/- sign. Therefore no valid conversion could be performed.
Example 5:

Input: "-91283472332"
Output: -2147483648
Explanation: The number "-91283472332" is out of the range of a 32-bit signed integer.
             Thefore INT_MIN (−2^31) is returned.

```

#### JAVA题解

```java
package algorithm;

public class Leetcode8 {

    /**
     *
     *请你来实现一个 atoi 函数，使其能将字符串转换成整数。
     *
     * 首先，该函数会根据需要丢弃无用的开头空格字符，直到寻找到第一个非空格的字符为止。
     *
     * 当我们寻找到的第一个非空字符为正或者负号时，则将该符号与之后面尽可能多的连续数字组合起来，作为该整数的正负号；假如第一个非空字符是数字，则直接将其与之后连续的数字字符组合起来，形成整数。
     *
     * 该字符串除了有效的整数部分之后也可能会存在多余的字符，这些字符可以被忽略，它们对于函数不应该造成影响。
     *
     * 注意：假如该字符串中的第一个非空格字符不是一个有效整数字符、字符串为空或字符串仅包含空白字符时，则你的函数不需要进行转换。
     *
     * 在任何情况下，若函数不能进行有效的转换时，请返回 0。
     *
     * 说明：
     *
     * 假设我们的环境只能存储 32 位大小的有符号整数，那么其数值范围为 [−2^31,  2^31 − 1]。如果数值超过这个范围，请返回  INT_MAX (2^31 − 1) 或 INT_MIN (−2^31) 。
     *
     * 示例 1:
     *
     * 输入: "42"
     * 输出: 42
     * 示例 2:
     *
     * 输入: "   -42"
     * 输出: -42
     * 解释: 第一个非空白字符为 '-', 它是一个负号。
     *      我们尽可能将负号与后面所有连续出现的数字组合起来，最后得到 -42 。
     * 示例 3:
     *
     * 输入: "4193 with words"
     * 输出: 4193
     * 解释: 转换截止于数字 '3' ，因为它的下一个字符不为数字。
     * 示例 4:
     *
     * 输入: "words and 987"
     * 输出: 0
     * 解释: 第一个非空字符是 'w', 但它不是数字或正、负号。
     *      因此无法执行有效的转换。
     * 示例 5:
     *
     * 输入: "-91283472332"
     * 输出: -2147483648
     * 解释: 数字 "-91283472332" 超过 32 位有符号整数范围。
     *      因此返回 INT_MIN (−2^31) 。
     *
     * 来源：力扣（LeetCode）
     * 链接：https://leetcode-cn.com/problems/string-to-integer-atoi
     * 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
     */
    
    public static int myAtoi(String str) {
        StringBuilder st = new StringBuilder();
        for (int i = 0; i < str.length(); i++) {
            char c = str.charAt(i);
            if (c == '-') {
                if (st.length() > 0) {
                    break;
                }
                st.append(c);
            } else if (c == '+') {
                if (st.length() > 0) {
                    break;
                }
                st.append(c);
            } else if (c == ' ') {
                if (st.length() > 0) {
                    break;
                } else {
                    continue;
                }
            } else if (c >= 48 && c <= 57) {
                st.append(c);
            } else {
                break;
            }
            if (st.length() > 1) {
                if (Long.parseLong(st.toString()) > Integer.MAX_VALUE) {
                    return Integer.MAX_VALUE;
                }

                if (Long.parseLong(st.toString()) < Integer.MIN_VALUE) {
                    return Integer.MIN_VALUE;
                }
            }

        }
        if (st.length() == 0) {
            return 0;
        }
        if (st.toString().equals("-") || st.toString().equals("+")) {
            return 0;
        }
        return Long.valueOf(st.toString()).intValue();
    }


    public int myAtoi1(String str) {
        if (str.isEmpty())
            return 0;
        char[] mychar = str.toCharArray();
        long ans = 0;
        int index = 0, flag = 1, n = str.length();
        //排除字符串开头的空格元素
        while (index < n && mychar[index] == ' ') {
            index++;
        }
        //排除空格后判断首字符是+还是-还是都不是
        if (index < n && mychar[index] == '+') {
            index++;
        } else if (index < n && mychar[index] == '-') {
            index++;
            flag = -1;
        }
        //重点：只管是数字的时候，其余取0
        while (index < n && (mychar[index] >= '0' && mychar[index] <= '9')) {
            if (ans != (int) ans) {//超出int范围
                return (flag == 1) ? Integer.MAX_VALUE : Integer.MIN_VALUE;//提前结束
            }

            // 巧妙的加起来值来 如 111 ，第一个1时 ans = 0 * 10 +1,第二个1时 ans = 1*10 + 1 = 11,第三个1时， ans = 11*10 + 1 = 111;
            ans = ans * 10 + mychar[index++] - '0';
        }
            // 强转long是否等于int 判断是否超界，机智
        if (ans != (int) ans) {
            return (flag == 1) ? Integer.MAX_VALUE : Integer.MIN_VALUE;
        }
        return (int) (ans * flag);

    }

    public static void main(String[] args) {
        /**
         * "42"
         * "----01"
         * "0-1"
         * "-5-"
         */
        System.out.println(myAtoi("0-1"));
    }
}

```


