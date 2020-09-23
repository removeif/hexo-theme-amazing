---
title: 算法成长之路leetcode13-14

toc: true
recommend: 1
keywords: categories-java,13. Roman to Integer,14. Longest Common Prefix,分治,二分查找,字典树查找最长公共前缀,水平扫描法找最长公共前缀
date: 2019-12-24 22:47:34
thumbnail: https://cdn.jsdelivr.net/gh/removeif/blog_image/img/2019/20191224231634.png
tags: [分治,二分查找]
categories: [algorithm]
---

### [13. Roman to Integer](https://leetcode-cn.com/problems/roman-to-integer/)

Roman numerals are represented by seven different symbols: I, V, X, L, C, D and M.
<!-- more -->

| Symbol  |     Value |
| :---  | :--- |
| I |            1 |
| V |            5 |
| X |            10 |
| L |            50 |
| C |            100 |
| D |            500 |
| M |            1000 |

For example, two is written as II in Roman numeral, just two one's added together. Twelve is written as, XII, which is simply X + II. The number twenty seven is written as XXVII, which is XX + V + II.

Roman numerals are usually written largest to smallest from left to right. However, the numeral for four is not IIII. Instead, the number four is written as IV. Because the one is before the five we subtract it making four. The same principle applies to the number nine, which is written as IX. There are six instances where subtraction is used:

I can be placed before V (5) and X (10) to make 4 and 9. 
X can be placed before L (50) and C (100) to make 40 and 90. 
C can be placed before D (500) and M (1000) to make 400 and 900.
Given a roman numeral, convert it to an integer. Input is guaranteed to be within the range from 1 to 3999.

#### Example

```text
Example 1:

Input: "III"
Output: 3
Example 2:

Input: "IV"
Output: 4
Example 3:

Input: "IX"
Output: 9
Example 4:

Input: "LVIII"
Output: 58
Explanation: L = 50, V= 5, III = 3.
Example 5:

Input: "MCMXCIV"
Output: 1994
Explanation: M = 1000, CM = 900, XC = 90 and IV = 4.

```

#### JAVA题解

```java
package algorithm;

import java.util.HashMap;
import java.util.Map;

/**
 * 罗马数字包含以下七种字符: I， V， X， L，C，D 和 M。
 *
 * 字符          数值
 * I             1
 * V             5
 * X             10
 * L             50
 * C             100
 * D             500
 * M             1000
 * 例如， 罗马数字 2 写做 II ，即为两个并列的 1。12 写做 XII ，即为 X + II 。 27 写做  XXVII, 即为 XX + V + II 。
 *
 * 通常情况下，罗马数字中小的数字在大的数字的右边。但也存在特例，
 * 例如 4 不写做 IIII，而是 IV。数字 1 在数字 5 的左边，
 * 所表示的数等于大数 5 减小数 1 得到的数值 4 。同样地，数字 9 表示为 IX。
 * 这个特殊的规则只适用于以下六种情况：
 *
 * I 可以放在 V (5) 和 X (10) 的左边，来表示 4 和 9。
 * X 可以放在 L (50) 和 C (100) 的左边，来表示 40 和 90。 
 * C 可以放在 D (500) 和 M (1000) 的左边，来表示 400 和 900。
 * 给定一个罗马数字，将其转换成整数。输入确保在 1 到 3999 的范围内。
 *
 * 示例 1:
 *
 * 输入: "III"
 * 输出: 3
 * 示例 2:
 *
 * 输入: "IV"
 * 输出: 4
 * 示例 3:
 *
 * 输入: "IX"
 * 输出: 9
 * 示例 4:
 *
 * 输入: "LVIII"
 * 输出: 58
 * 解释: L = 50, V= 5, III = 3.
 * 示例 5:
 *
 * 输入: "MCMXCIV"
 * 输出: 1994
 * 解释: M = 1000, CM = 900, XC = 90, IV = 4.
 *
 * 来源：力扣（LeetCode）
 * 链接：https://leetcode-cn.com/problems/roman-to-integer
 * 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
 */
public class Leetcode13 {

    public static int romanToInt(String s) {
        int[] moneys = new int[]{1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1};
        String[] moneyToStr = new String[]{"M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"};
        char[] chars = s.toCharArray();
        int result = 0;
        int tempJ = 0;
        for (int i = 0; i < chars.length; ) {
            for (int j = tempJ; j < moneyToStr.length; ) {
                // 从左往右开始一个字符一个字符匹配，匹配到一个字符后开始下一个
                if (new String(new char[]{chars[i]}).equals(moneyToStr[j])) {
                    result += moneys[j];
                    i++;
                    // 此时下一次可能还会出现一样的字符如VV=20
                    tempJ = j;
                    break;
                    // 匹配到两个字符是开始下两个字符
                } else if (i + 1 < chars.length && new String(new char[]{chars[i], chars[i + 1]}).equals(moneyToStr[j])) {
                    result += moneys[j];
                    i += 2;
                    // 下次出现的一定是一个字符的,如IV下次不会再出现IV 只能出现I
                    tempJ = j + 1;
                    break;
                } else {
                    j++;
                }
            }
        }
        return result;
    }

    public static int romanToInt1(String s) {
        Map<String, Integer> map = new HashMap<>();
        map.put("I", 1);
        map.put("IV", 4);
        map.put("V", 5);
        map.put("IX", 9);
        map.put("X", 10);
        map.put("XL", 40);
        map.put("L", 50);
        map.put("XC", 90);
        map.put("C", 100);
        map.put("CD", 400);
        map.put("D", 500);
        map.put("CM", 900);
        map.put("M", 1000);

        int ans = 0;
        // 所有的字符，要么匹配两个要么匹配一个，没有其余的情况
        for(int i = 0;i < s.length();) {
            // 两个匹配的
            if(i + 1 < s.length() && map.containsKey(s.substring(i, i+2))) {
                ans += map.get(s.substring(i, i+2));
                // 匹配上后往后移两个
                i += 2;
            } else {
                // 一个匹配上的
                ans += map.get(s.substring(i, i+1));
                // 匹配后往后移一个
                i ++;
            }
        }
        return ans;
    }

    public static void main(String[] args) {
        System.out.println(romanToInt("XIX"));
    }
}

```

### [14. Longest Common Prefix](https://leetcode-cn.com/problems/longest-common-prefix/)

Write a function to find the longest common prefix string amongst an array of strings.

If there is no common prefix, return an empty string "".

#### Example

```text
Example 1:

Input: ["flower","flow","flight"]
Output: "fl"
Example 2:

Input: ["dog","racecar","car"]
Output: ""
Explanation: There is no common prefix among the input strings.

Note:
All given inputs are in lowercase letters a-z.

```

#### JAVA题解

##### 水平扫描

![](https://cdn.jsdelivr.net/gh/removeif/blog_image/img/2019/20191224225712.png)
![](https://cdn.jsdelivr.net/gh/removeif/blog_image/img/2019/20191224225319.png)
```java
package algorithm;
/**
 * 编写一个函数来查找字符串数组中的最长公共前缀。
 *
 * 如果不存在公共前缀，返回空字符串 ""。
 *
 * 示例 1:
 *
 * 输入: ["flower","flow","flight"]
 * 输出: "fl"
 * 示例 2:
 *
 * 输入: ["dog","racecar","car"]
 * 输出: ""
 * 解释: 输入不存在公共前缀。
 * 说明:
 *
 * 所有输入只包含小写字母 a-z 。
 *
 * 来源：力扣（LeetCode）
 * 链接：https://leetcode-cn.com/problems/longest-common-prefix
 * 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
 */
public class Leetcode14 {

    public static String longestCommonPrefix(String[] strs) {

        if (strs.length == 0) {
            return "";
        }

        if (strs.length == 1) {
            return strs[0];
        }

        int i = 0;
        String pre = "";
        for (; i < strs[0].length(); i++) {
            pre = strs[0].substring(0, i + 1);
            int j = 1;
            boolean end = false;
            for (; j < strs.length; j++) {
                if (!strs[j].startsWith(pre)) {
                    break;
                }
                if (pre.length() == strs[j].length()) {
                    end = true;
                }
            }

            if (j == strs.length && !end) {
                continue;
            } else if (j != strs.length) {

                if (pre.length() > 1) {
                    return pre.substring(0, pre.length() - 1);
                } else {
                    return "";
                }

            } else {
                return pre;
            }

        }

        return pre;
    }

    // 水平扫描法
    public static String longestCommonPrefix1(String[] strs) {
        if (strs.length == 0) return "";
        String prefix = strs[0];
        // 1,2->s1,3->s2,4;前两个中找到前缀公共最长的s1,然后和第3个一起找出s2，以此类推
        for (int i = 1; i < strs.length; i++)
            // 不相等时为-1
            while (strs[i].indexOf(prefix) != 0) {
                // 从后往前缩短，直到找到最长的
                prefix = prefix.substring(0, prefix.length() - 1);
                // 找完都没找到的话返回空
                if (prefix.isEmpty()) return "";
            }
        return prefix;
    }


    public static void main(String[] args) {
        System.out.println(longestCommonPrefix1(new String[]{"flower","fl","flight"}));
    }

    // 水平扫描，单个字符逐一进行比较
    public static String longestCommonPrefix2(String[] strs) {
        if (strs == null || strs.length == 0) return "";

        for (int i = 0; i < strs[0].length() ; i++){
            char c = strs[0].charAt(i);
            for (int j = 1; j < strs.length; j ++) {
                // 如果i == strs[j].length() 代表找出最短的，直接返回，或者不相等时直接返回
                if (i == strs[j].length() || strs[j].charAt(i) != c)
                    return strs[0].substring(0, i);
            }
        }
        // 到此处已经找完
        return strs[0];
    }
}
```

##### 分治算法

![](https://cdn.jsdelivr.net/gh/removeif/blog_image/img/2019/20191224225516.png)

![](https://cdn.jsdelivr.net/gh/removeif/blog_image/img/2019/20191224225530.png)

```java
public String longestCommonPrefix(String[] strs) {
    if (strs == null || strs.length == 0) return "";    
        return longestCommonPrefix(strs, 0 , strs.length - 1);
}

private String longestCommonPrefix(String[] strs, int l, int r) {
  	// 只有一个字符串的时候，返回此字符串
    if (l == r) {
        return strs[l];
    }
    else {
        int mid = (l + r)/2;
      	// 找出左边最长前缀
        String lcpLeft =   longestCommonPrefix(strs, l , mid);
        // 找出右边最长前缀
        String lcpRight =  longestCommonPrefix(strs, mid + 1,r);
      	// 左边右边中找出最长前缀
        return commonPrefix(lcpLeft, lcpRight);
   }
}

String commonPrefix(String left,String right) {
    int min = Math.min(left.length(), right.length());       
    for (int i = 0; i < min; i++) {
      	// 循环最小的一边字符逐一比较,不相等时跳出
        if ( left.charAt(i) != right.charAt(i) )
            return left.substring(0, i);
    }
    return left.substring(0, min);
}
```

##### 二分查找法

![](https://cdn.jsdelivr.net/gh/removeif/blog_image/img/2019/20191224230413.png)

![](https://cdn.jsdelivr.net/gh/removeif/blog_image/img/2019/20191224230426.png)

```java
public String longestCommonPrefix(String[] strs) {
    if (strs == null || strs.length == 0)
        return "";
    int minLen = Integer.MAX_VALUE;
    for (String str : strs)
        minLen = Math.min(minLen, str.length());
    int low = 1;
    int high = minLen;
    while (low <= high) {
        int middle = (low + high) / 2;
        if (isCommonPrefix(strs, middle))
            low = middle + 1;
        else
            high = middle - 1;
    }
    return strs[0].substring(0, (low + high) / 2);
}

private boolean isCommonPrefix(String[] strs, int len){
    String str1 = strs[0].substring(0,len);
    for (int i = 1; i < strs.length; i++)
        if (!strs[i].startsWith(str1))
            return false;
    return true;
}

```

##### 字典树

给定一些键值字符串 S = [S 1 ,S 2 …S n ]，我们要找到字符串 q 与 S 的最长公共前缀。 这样的查询操作可能会非常频繁。

我们可以通过将所有的键值 S 存储到一颗字典树中来优化最长公共前缀查询操作。 如果你想学习更多关于字典树的内容，可以从 [208. 实现 Trie (前缀树)](https://leetcode-cn.com/problems/implement-trie-prefix-tree/solution/)开始。在字典树中，从根向下的每一个节点都代表一些键值的公共前缀。 但是我们需要找到字符串q 和所有键值字符串的最长公共前缀。 这意味着我们需要从根找到一条最深的路径，满足以下条件：

这是所查询的字符串 q 的一个前缀

路径上的每一个节点都有且仅有一个孩子。 否则，找到的路径就不是所有字符串的公共前缀

路径不包含被标记成某一个键值字符串结尾的节点。 因为最长公共前缀不可能比某个字符串本身长

**算法**

最后的问题就是如何找到字典树中满足上述所有要求的最深节点。 最有效的方法就是建立一颗包含字符串[S 1 …S n ] 的字典树。 然后在这颗树中匹配 q 的前缀。 我们从根节点遍历这颗字典树，直到因为不能满足某个条件而不能再遍历为止。

![](https://cdn.jsdelivr.net/gh/removeif/blog_image/img/2019/20191224231052.png)

```java
public String longestCommonPrefix(String q, String[] strs) {
    if (strs == null || strs.length == 0)
         return "";  
    if (strs.length == 1)
         return strs[0];
    Trie trie = new Trie();      
    for (int i = 1; i < strs.length ; i++) {
        trie.insert(strs[i]);
    }
    return trie.searchLongestPrefix(q);
}

class TrieNode {

    // 子节点的链接数组
    private TrieNode[] links;

    private final int R = 26;

    private boolean isEnd;

    // 非空子节点的数量
    private int size;    
    public void put(char ch, TrieNode node) {
        links[ch -'a'] = node;
        size++;
    }

    public int getLinks() {
        return size;
    }
    // 假设方法 containsKey、isEnd、get、put 都已经实现了
    // 可以参考文章：https://leetcode.com/articles/implement-trie-prefix-tree/
}

public class Trie {

    private TrieNode root;

    public Trie() {
        root = new TrieNode();
    }

// 假设方法 insert、search、searchPrefix 都已经实现了
// 可以参考文章：https://leetcode.com/articles/implement-trie-prefix-tree/
    private String searchLongestPrefix(String word) {
        TrieNode node = root;
        StringBuilder prefix = new StringBuilder();
        for (int i = 0; i < word.length(); i++) {
            char curLetter = word.charAt(i);
            if (node.containsKey(curLetter) && (node.getLinks() == 1) && (!node.isEnd())) {
                prefix.append(curLetter);
                node = node.get(curLetter);
            }
            else
                return prefix.toString();

         }
         return prefix.toString();
    }
}
```



