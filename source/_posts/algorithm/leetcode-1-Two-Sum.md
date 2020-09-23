---
thumbnail: https://cdn.jsdelivr.net/gh/removeif/blog_image/20190620152744.png
title: leetcode-1-Two Sum

toc: true
date: 2018-11-11 22:26:53
tags: 
categories: [algorithm]
---

# description
>Given an array of integers, return indices of the two numbers such that they add up to a specific target.
 You may assume that each input would have exactly one solution, and you may not use the same element twice.
     Example:
     Given nums = [2, 7, 11, 15], target = 9,
     Because nums[0] + nums[1] = 2 + 7 = 9,
     return [0, 1].
 <!-- more -->
# common method
 ```java
class Solution {
    public int[] twoSum(int[] nums, int target) {
        int[] ret = new int[2];
        for(int i =0; i<nums.length-1 ;i++){
            for (int j = i+1 ;j < nums.length ;j++ ){
                if (nums[i] + nums[j] == target){
                    ret = new int[]{i, j};
                    return ret;
                }
            }
        }
        return ret ;
    }
}
```

# best method
```java
class Solution {
    public int[] twoSum(int[] nums, int target) {
        int len=nums.length;
        HashMap<Integer, Integer> map=new HashMap<>();
        map.put(nums[0], 0);
        for(int i=1;i<len;i++){
            if(map.containsKey(target-nums[i])){
                int[] returnArray={map.get(target-nums[i]),i};
                return returnArray;
            } else{
                map.put(nums[i], i);
            }
        }
        int[] returnArray={0,0};
        return returnArray;
    }
}
```
