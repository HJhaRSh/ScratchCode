import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const dailyQuests = [
  {
    dayNumber: 1,
    title: "Two Sum",
    difficulty: "HARD",
    description: "<p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return indices of the two numbers that add up to target.</p><p>You may assume exactly one solution exists. You cannot use the same element twice.</p>",
    examples_json: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "nums[0] + nums[1] = 2 + 7 = 9" },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]" },
      { input: "nums = [3,3], target = 6", output: "[0,1]" }
    ],
    constraints_json: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "Only one valid answer exists"],
    hints_json: [
      "Think about what complement you need for each number",
      "A hash map can look up any value in O(1) time",
      "For each num, check if (target - num) already exists in your map"
    ],
    test_cases_json: [
      { input: "2 7 11 15\n9", expected_output: "[0,1]" },
      { input: "3 2 4\n6", expected_output: "[1,2]" },
      { input: "3 3\n6", expected_output: "[0,1]" },
      { input: "-1 -2 -3 -4 -5\n-8", expected_output: "[2,4]" },
      { input: "1000000000 1000000000\n2000000000", expected_output: "[0,1]" },
      { input: "0 4 3 0\n0", expected_output: "[0,3]" },
      { input: "-3 4 3 90\n0", expected_output: "[0,2]" },
      { input: "1 2 3 4 5 6 7 8 9 10\n19", expected_output: "[8,9]" },
      { input: "1 2 3 4 5 6 7 8 9 10\n3", expected_output: "[0,1]" },
      { input: "1 2 3 4 5 6 7 8 9 10\n11", expected_output: "[0,9]" }
    ],
    solution_approaches_json: [
      { name: "Brute Force", timeComplexity: "O(n²)", spaceComplexity: "O(1)", explanation: "Check every pair of numbers", code: "// Python\nfor i in range(len(nums)):\n    for j in range(i+1, len(nums)):\n        if nums[i] + nums[j] == target:\n            return [i, j]" },
      { name: "Hash Map (Optimal)", timeComplexity: "O(n)", spaceComplexity: "O(n)", explanation: "Store each number's index in a map. For each number, check if complement exists in map.", code: "# Python\nseen = {}\nfor i, num in enumerate(nums):\n    complement = target - num\n    if complement in seen:\n        return [seen[complement], i]\n    seen[num] = i" }
    ],
    optimal_approach: "Hash Map (Optimal)",
    tags: ["Array", "Hash Map"],
    xp_reward: 100,
    bonus_reward_json: { type: "badge", value: "first_quest", description: "First Quest Solved!" }
  },
  {
    dayNumber: 2,
    title: "Valid Parentheses",
    difficulty: "HARD",
    description: "<p>Given a string <code>s</code> containing '(', ')', '{', '}', '[', ']', determine if the input string is valid.</p><p>A string is valid if: open brackets are closed by the same type, in correct order, and every close bracket has a corresponding open bracket.</p>",
    examples_json: [
      { input: "s = \"()\"", output: "true" },
      { input: "s = \"()[]{}\"", output: "true" },
      { input: "s = \"(]\"", output: "false" },
      { input: "s = \"([)]\"", output: "false" },
      { input: "s = \"{[]}\"", output: "true" }
    ],
    constraints_json: ["1 <= s.length <= 10^4", "s consists only of '()[]{}'"],
    hints_json: [
      "Think about what data structure processes items in LIFO order",
      "When you see an opening bracket push it. When closing, check top of stack",
      "At the end, the stack should be empty for a valid string"
    ],
    test_cases_json: [
      { input: "()", expected_output: "true" },
      { input: "()[]{}", expected_output: "true" },
      { input: "(]", expected_output: "false" },
      { input: "([)]", expected_output: "false" },
      { input: "{[]}", expected_output: "true" },
      { input: "{", expected_output: "false" },
      { input: "}", expected_output: "false" },
      { input: "(((())))", expected_output: "true" },
      { input: "(((((((()", expected_output: "false" },
      { input: "()()()()()()", expected_output: "true" }
    ],
    solution_approaches_json: [
      { name: "Stack", timeComplexity: "O(n)", spaceComplexity: "O(n)", explanation: "Push opening brackets. For closing brackets, check if top of stack matches. Empty stack at end = valid.", code: "# Python\nstack = []\nmatching = {')':'(', '}':'{', ']':'['}\nfor ch in s:\n    if ch in '([{':\n        stack.append(ch)\n    else:\n        if not stack or stack[-1] != matching[ch]:\n            return False\n        stack.pop()\nreturn len(stack) == 0" }
    ],
    optimal_approach: "Stack",
    tags: ["Stack", "String"],
    xp_reward: 110,
    bonus_reward_json: { type: "xp_multiplier", value: 1.5, description: "1.5x XP on next quest!" }
  },
  {
    dayNumber: 3,
    title: "Merge Two Sorted Lists",
    difficulty: "HARD",
    description: "<p>Merge two sorted linked lists and return the merged list. The merged list should be made by splicing together the nodes of the first two lists.</p>",
    examples_json: [
      { input: "list1 = [1,2,4], list2 = [1,3,4]", output: "[1,1,2,3,4,4]" },
      { input: "list1 = [], list2 = []", output: "[]" },
      { input: "list1 = [], list2 = [0]", output: "[0]" }
    ],
    constraints_json: ["The number of nodes in both lists is in the range [0, 50]", "-100 <= Node.val <= 100", "Both list1 and list2 are sorted in non-decreasing order"],
    hints_json: [
      "Think about which list has the smaller head node",
      "You can solve this iteratively with a dummy head node",
      "Or recursively: merge(l1,l2) = smaller head + merge(rest)"
    ],
    test_cases_json: Array(10).fill({ input: "1 2 4\n1 3 4", expected_output: "[1,1,2,3,4,4]" }),
    solution_approaches_json: [
      { name: "Iterative (Dummy Node)", timeComplexity: "O(m+n)", spaceComplexity: "O(1)", explanation: "Use a dummy node as starting point. Compare heads and attach smaller one." },
      { name: "Recursive", timeComplexity: "O(m+n)", spaceComplexity: "O(m+n)", explanation: "Base cases for empty lists, then recursively attach smaller head." }
    ],
    optimal_approach: "Iterative (Dummy Node)",
    tags: ["Linked List", "Recursion"],
    xp_reward: 110,
    bonus_reward_json: { type: "streak_freeze", description: "Streak Freeze — protect your streak for 1 day!" }
  },
  {
    dayNumber: 4,
    title: "Maximum Subarray",
    difficulty: "HARD",
    description: "<p>Given an integer array <code>nums</code>, find the subarray with the largest sum and return its sum.</p>",
    examples_json: [
      { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "[4,-1,2,1] has the largest sum = 6" },
      { input: "nums = [1]", output: "1" },
      { input: "nums = [5,4,-1,7,8]", output: "23" }
    ],
    constraints_json: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
    hints_json: [
      "What happens if you track the maximum sum ending at each position?",
      "At each index: should you extend the previous subarray or start fresh?",
      "Kadane's algorithm: maxEndingHere = max(num, maxEndingHere + num)"
    ],
    test_cases_json: Array(10).fill({ input: "-2 1 -3 4 -1 2 1 -5 4", expected_output: "6" }),
    solution_approaches_json: [
      { name: "Brute Force", timeComplexity: "O(n²)", spaceComplexity: "O(1)", explanation: "Check all subarrays." },
      { name: "Kadane's Algorithm (Optimal)", timeComplexity: "O(n)", spaceComplexity: "O(1)", explanation: "Track current running max and global max.", code: "# Python\nmax_sum = current = nums[0]\nfor num in nums[1:]:\n    current = max(num, current + num)\n    max_sum = max(max_sum, current)\nreturn max_sum" }
    ],
    optimal_approach: "Kadane's Algorithm (Optimal)",
    tags: ["Array", "Dynamic Programming", "Divide and Conquer"],
    xp_reward: 120,
    bonus_reward_json: { type: "title", value: "Kadane's Apprentice", description: "Earn the title 'Kadane's Apprentice'!" }
  },
  {
    dayNumber: 5,
    title: "Climbing Stairs",
    difficulty: "HARD",
    description: "<p>You are climbing a staircase with <code>n</code> steps. Each time you can climb 1 or 2 steps. In how many distinct ways can you climb to the top?</p>",
    examples_json: [
      { input: "n = 2", output: "2", explanation: "1+1 or 2" },
      { input: "n = 3", output: "3", explanation: "1+1+1, 1+2, 2+1" }
    ],
    constraints_json: ["1 <= n <= 45"],
    hints_json: [
      "How many ways to reach step n depends on steps n-1 and n-2",
      "This is the Fibonacci sequence in disguise",
      "dp[i] = dp[i-1] + dp[i-2] with dp[1]=1, dp[2]=2"
    ],
    test_cases_json: Array(10).fill({ input: "5", expected_output: "8" }),
    solution_approaches_json: [
      { name: "Recursion with Memoization", timeComplexity: "O(n)", spaceComplexity: "O(n)" },
      { name: "Dynamic Programming", timeComplexity: "O(n)", spaceComplexity: "O(n)" },
      { name: "Space Optimized DP (Optimal)", timeComplexity: "O(n)", spaceComplexity: "O(1)", explanation: "Only keep track of the last two values.", code: "# Python\nif n <= 2: return n\nprev2, prev1 = 1, 2\nfor _ in range(3, n+1):\n    curr = prev1 + prev2\n    prev2, prev1 = prev1, curr\nreturn prev1" }
    ],
    optimal_approach: "Space Optimized DP (Optimal)",
    tags: ["Dynamic Programming", "Math", "Memoization"],
    xp_reward: 120,
    bonus_reward_json: { type: "xp_boost", value: 50, description: "+50 bonus XP awarded!" }
  },
  {
    dayNumber: 6, title: "Binary Search", difficulty: "HARD", tags: ["Array", "Binary Search"], xp_reward: 120, bonus_reward_json: { type: "badge", value: "binary_hunter" },
    description: "Given a sorted array of integers in ascending order and a target, return the index of target or -1 if not present. Your solution must run in O(log n) time.",
    examples_json: [{ input: "nums = [-1,0,3,5,9,12], target = 9", output: "4" }], constraints_json: ["1 <= nums.length <= 10^4", "-10^4 < nums[i], target < 10^4", "All the integers in nums are unique", "nums is sorted in ascending order"],
    hints_json: ["Find the middle element", "If target < mid, search left half", "If target > mid, search right half"], test_cases_json: Array(10).fill({ input: "nums = [-1,0,3,5,9,12], target = 9", expected_output: "4" }),
    solution_approaches_json: [{ name: "Binary Search (Optimal)", timeComplexity: "O(log n)", spaceComplexity: "O(1)", code: "# Python\nl, r = 0, len(nums) - 1\nwhile l <= r:\n    mid = (l + r) // 2\n    if nums[mid] == target: return mid\n    elif nums[mid] < target: l = mid + 1\n    else: r = mid - 1\nreturn -1" }], optimal_approach: "Binary Search (Optimal)"
  },
  {
    dayNumber: 7, title: "Reverse Linked List", difficulty: "HARD", tags: ["Linked List", "Recursion"], xp_reward: 120, bonus_reward_json: { type: "streak_freeze" },
    description: "Given the head of a singly linked list, reverse the list and return the reversed list.",
    examples_json: [{ input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]" }], constraints_json: ["The number of nodes in the list is the range [0, 5000].", "-5000 <= Node.val <= 5000"],
    hints_json: ["Iterate through the list, keep track of prev, curr, and next node.", "curr.next should point to prev.", "Move prev to curr, and curr to next."], test_cases_json: Array(10).fill({ input: "head = [1,2,3,4,5]", expected_output: "[5,4,3,2,1]" }),
    solution_approaches_json: [{ name: "Iterative (Optimal)", timeComplexity: "O(n)", spaceComplexity: "O(1)", code: "# Python\nprev = None\ncurr = head\nwhile curr:\n    next_node = curr.next\n    curr.next = prev\n    prev = curr\n    curr = next_node\nreturn prev" }], optimal_approach: "Iterative (Optimal)"
  },
  {
    dayNumber: 8, title: "Linked List Cycle", difficulty: "HARD", tags: ["Linked List", "Two Pointers"], xp_reward: 130, bonus_reward_json: { type: "xp_boost", value: 75 },
    description: "Given head of a linked list, determine if it has a cycle. Return true if there is a cycle, false otherwise.",
    examples_json: [{ input: "head = [3,2,0,-4], pos = 1", output: "true" }], constraints_json: ["The number of the nodes in the list is in the range [0, 10^4].", "-10^5 <= Node.val <= 10^5", "pos is -1 or a valid index in the linked-list."],
    hints_json: ["Think about two runners — one fast, one slow", "Floyd's cycle detection: slow moves 1 step, fast moves 2", "If they ever meet, there's a cycle"], test_cases_json: Array(10).fill({ input: "head = [3,2,0,-4], pos = 1", expected_output: "true" }),
    solution_approaches_json: [{ name: "Two Pointers (Optimal)", timeComplexity: "O(n)", spaceComplexity: "O(1)", code: "# Python\nif not head: return False\nslow, fast = head, head\nwhile fast and fast.next:\n    slow = slow.next\n    fast = fast.next.next\n    if slow == fast: return True\nreturn False" }], optimal_approach: "Two Pointers (Optimal)"
  },
  {
    dayNumber: 9, title: "Maximum Depth of Binary Tree", difficulty: "HARD", tags: ["Tree", "DFS", "BFS", "Recursion"], xp_reward: 130, bonus_reward_json: { type: "title", value: "Tree Climber" },
    description: "Given root of a binary tree, return its maximum depth (number of nodes along the longest path from root to leaf).",
    examples_json: [{ input: "root = [3,9,20,null,null,15,7]", output: "3" }], constraints_json: ["The number of nodes in the tree is in the range [0, 10^4].", "-100 <= Node.val <= 100"],
    hints_json: ["If root is null, depth is 0.", "Depth is 1 + max(maxDepth(root.left), maxDepth(root.right))"], test_cases_json: Array(10).fill({ input: "root = [3,9,20,null,null,15,7]", expected_output: "3" }),
    solution_approaches_json: [{ name: "DFS Recursion (Optimal)", timeComplexity: "O(n)", spaceComplexity: "O(h)", code: "# Python\nif not root: return 0\nreturn 1 + max(self.maxDepth(root.left), self.maxDepth(root.right))" }], optimal_approach: "DFS Recursion (Optimal)"
  },
  {
    dayNumber: 10, title: "Palindrome Number", difficulty: "HARD", tags: ["Math"], xp_reward: 100, bonus_reward_json: { type: "xp_multiplier", value: 2.0, description: "2x XP on next quest!" },
    description: "Given an integer x, return true if x is a palindrome (reads the same forward and backward). Solve WITHOUT converting to string.",
    examples_json: [{ input: "x = 121", output: "true" }, { input: "x = -121", output: "false" }], constraints_json: ["-2^31 <= x <= 2^31 - 1"],
    hints_json: ["Negative numbers are not palindromes.", "Revert half of the number to prevent overflow.", "Compare reverted half with the other half."], test_cases_json: Array(10).fill({ input: "x = 121", expected_output: "true" }),
    solution_approaches_json: [{ name: "Revert Half (Optimal)", timeComplexity: "O(log10(n))", spaceComplexity: "O(1)", code: "# Python\nif x < 0 or (x % 10 == 0 and x != 0): return False\nreverted_num = 0\nwhile x > reverted_num:\n    reverted_num = reverted_num * 10 + x % 10\n    x //= 10\nreturn x == reverted_num or x == reverted_num // 10" }], optimal_approach: "Revert Half (Optimal)"
  },
  {
    dayNumber: 11, title: "Container With Most Water", difficulty: "EXPERT", tags: ["Array", "Two Pointers", "Greedy"], xp_reward: 150, bonus_reward_json: { type: "badge", value: "water_bender" },
    description: "Given n non-negative integers height[] where each represents a point (i, height[i]), find two lines that together with the x-axis form a container that holds the most water.",
    examples_json: [{ input: "height = [1,8,6,2,5,4,8,3,7]", output: "49" }], constraints_json: ["n == height.length", "2 <= n <= 10^5", "0 <= height[i] <= 10^4"],
    hints_json: ["Start with the widest possible container (first and last index)", "Moving the taller line inward can never increase area — why?", "Always move the pointer pointing to the shorter line"], test_cases_json: Array(10).fill({ input: "height = [1,8,6,2,5,4,8,3,7]", expected_output: "49" }),
    solution_approaches_json: [{ name: "Two Pointers (Optimal)", timeComplexity: "O(n)", spaceComplexity: "O(1)", code: "# Python\nl, r = 0, len(height) - 1\nmax_area = 0\nwhile l < r:\n    max_area = max(max_area, min(height[l], height[r]) * (r - l))\n    if height[l] < height[r]:\n        l += 1\n    else:\n        r -= 1\nreturn max_area" }], optimal_approach: "Two Pointers (Optimal)"
  },
  {
    dayNumber: 12, title: "Three Sum", difficulty: "EXPERT", tags: ["Array", "Two Pointers", "Sorting"], xp_reward: 160, bonus_reward_json: { type: "xp_boost", value: 100 },
    description: "Given integer array nums, return all triplets [nums[i], nums[j], nums[k]] such that i≠j≠k≠i and nums[i]+nums[j]+nums[k]=0. Solution set must not contain duplicates.",
    examples_json: [{ input: "nums = [-1,0,1,2,-1,-4]", output: "[[-1,-1,2],[-1,0,1]]" }], constraints_json: ["3 <= nums.length <= 3000", "-10^5 <= nums[i] <= 10^5"],
    hints_json: ["Sort the array first.", "Iterate through the array, and use two pointers for the remaining sum to reach 0.", "Skip duplicate elements to avoid duplicate triplets."], test_cases_json: Array(10).fill({ input: "nums = [-1,0,1,2,-1,-4]", expected_output: "[[-1,-1,2],[-1,0,1]]" }),
    solution_approaches_json: [{ name: "Sorting + Two Pointers (Optimal)", timeComplexity: "O(n²)", spaceComplexity: "O(1) or O(n)", code: "# Python\nres = []\nnums.sort()\nfor i, a in enumerate(nums):\n    if i > 0 and a == nums[i - 1]: continue\n    l, r = i + 1, len(nums) - 1\n    while l < r:\n        threeSum = a + nums[l] + nums[r]\n        if threeSum > 0: r -= 1\n        elif threeSum < 0: l += 1\n        else:\n            res.append([a, nums[l], nums[r]])\n            l += 1\n            while nums[l] == nums[l - 1] and l < r:\n                l += 1\nreturn res" }], optimal_approach: "Sorting + Two Pointers (Optimal)"
  },
  {
    dayNumber: 13, title: "Longest Substring Without Repeating Characters", difficulty: "EXPERT", tags: ["String", "Sliding Window", "Hash Map"], xp_reward: 150, bonus_reward_json: { type: "title", value: "Sliding Window Pro" },
    description: "Given a string s, find the length of the longest substring without repeating characters.",
    examples_json: [{ input: "s = \"abcabcbb\"", output: "3" }], constraints_json: ["0 <= s.length <= 5 * 10^4", "s consists of English letters, digits, symbols and spaces."],
    hints_json: ["Use a sliding window with two pointers left and right.", "Keep a set of characters in the current window.", "If right char is in set, remove left char from set and increment left pointer."], test_cases_json: Array(10).fill({ input: "s = \"abcabcbb\"", expected_output: "3" }),
    solution_approaches_json: [{ name: "Sliding Window (Optimal)", timeComplexity: "O(n)", spaceComplexity: "O(min(m, n))", code: "# Python\ncharSet = set()\nl = 0\nres = 0\nfor r in range(len(s)):\n    while s[r] in charSet:\n        charSet.remove(s[l])\n        l += 1\n    charSet.add(s[r])\n    res = max(res, r - l + 1)\nreturn res" }], optimal_approach: "Sliding Window (Optimal)"
  },
  {
    dayNumber: 14, title: "Word Search", difficulty: "EXPERT", tags: ["Matrix", "DFS", "Backtracking"], xp_reward: 170, bonus_reward_json: { type: "badge", value: "pathfinder" },
    description: "Given an m×n grid of characters board and a string word, return true if word exists in the grid. The word can be constructed from letters of sequentially adjacent cells (horizontally or vertically). The same cell cannot be reused.",
    examples_json: [{ input: "board = [[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], word = \"ABCCED\"", output: "true" }], constraints_json: ["m == board.length", "n = board[i].length", "1 <= m, n <= 6", "1 <= word.length <= 15"],
    hints_json: ["Iterate through each cell. If it matches the first letter, start DFS.", "Keep a set of visited cells in current DFS path.", "Backtrack by removing the cell from visited set after exploring neighbors."], test_cases_json: Array(10).fill({ input: "board = [['A','B','C','E'],['S','F','C','S'],['A','D','E','E']], word = 'ABCCED'", expected_output: "true" }),
    solution_approaches_json: [{ name: "DFS + Backtracking (Optimal)", timeComplexity: "O(m * n * 4^l)", spaceComplexity: "O(l)", code: "# Python\nROWS, COLS = len(board), len(board[0])\npath = set()\ndef dfs(r, c, i):\n    if i == len(word): return True\n    if (r < 0 or c < 0 or r >= ROWS or c >= COLS or word[i] != board[r][c] or (r, c) in path):\n        return False\n    path.add((r, c))\n    res = (dfs(r + 1, c, i + 1) or dfs(r - 1, c, i + 1) or dfs(r, c + 1, i + 1) or dfs(r, c - 1, i + 1))\n    path.remove((r, c))\n    return res\nfor r in range(ROWS):\n    for c in range(COLS):\n        if dfs(r, c, 0): return True\nreturn False" }], optimal_approach: "DFS + Backtracking (Optimal)"
  },
  {
    dayNumber: 15, title: "Number of Islands", difficulty: "EXPERT", tags: ["Matrix", "DFS", "BFS", "Union Find"], xp_reward: 160, bonus_reward_json: { type: "xp_boost", value: 120 },
    description: "Given an m×n 2D binary grid representing a map of '1' (land) and '0' (water), return the number of islands. An island is surrounded by water and formed by connecting adjacent lands horizontally or vertically.",
    examples_json: [{ input: "grid = [[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"1\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"1\",\"1\"]]", output: "3" }], constraints_json: ["m == grid.length", "n == grid[i].length", "1 <= m, n <= 300", "grid[i][j] is '0' or '1'"],
    hints_json: ["Iterate through grid. When you see a '1', increment island count and start DFS/BFS.", "DFS/BFS will mark all connected '1's as '0' to avoid recounting."], test_cases_json: Array(10).fill({ input: "grid = [['1','1','0','0','0'],['1','1','0','0','0'],['0','0','1','0','0'],['0','0','0','1','1']]", expected_output: "3" }),
    solution_approaches_json: [{ name: "DFS (Optimal)", timeComplexity: "O(m*n)", spaceComplexity: "O(m*n)", code: "# Python\nif not grid: return 0\nislands = 0\ndef dfs(r, c):\n    if r < 0 or c < 0 or r >= len(grid) or c >= len(grid[0]) or grid[r][c] == '0':\n        return\n    grid[r][c] = '0'\n    dfs(r + 1, c)\n    dfs(r - 1, c)\n    dfs(r, c + 1)\n    dfs(r, c - 1)\nfor r in range(len(grid)):\n    for c in range(len(grid[0])):\n        if grid[r][c] == '1':\n            dfs(r, c)\n            islands += 1\nreturn islands" }], optimal_approach: "DFS (Optimal)"
  },
  {
    dayNumber: 16, title: "Coin Change", difficulty: "EXPERT", tags: ["Dynamic Programming", "BFS"], xp_reward: 170, bonus_reward_json: { type: "streak_freeze" },
    description: "Given coins[] of different denominations and an integer amount, return the fewest number of coins needed to make up amount. Return -1 if not possible.",
    examples_json: [{ input: "coins = [1,2,5], amount = 11", output: "3" }], constraints_json: ["1 <= coins.length <= 12", "1 <= coins[i] <= 2^31 - 1", "0 <= amount <= 10^4"],
    hints_json: ["Use DP array initialized to amount + 1.", "dp[a] = min(dp[a], 1 + dp[a - c]) for each coin."], test_cases_json: Array(10).fill({ input: "coins = [1,2,5], amount = 11", expected_output: "3" }),
    solution_approaches_json: [{ name: "Dynamic Programming (Optimal)", timeComplexity: "O(amount * len(coins))", spaceComplexity: "O(amount)", code: "# Python\ndp = [float('inf')] * (amount + 1)\ndp[0] = 0\nfor a in range(1, amount + 1):\n    for c in coins:\n        if a - c >= 0:\n            dp[a] = min(dp[a], 1 + dp[a - c])\nreturn dp[amount] if dp[amount] != float('inf') else -1" }], optimal_approach: "Dynamic Programming (Optimal)"
  },
  {
    dayNumber: 17, title: "Longest Common Subsequence", difficulty: "EXPERT", tags: ["String", "Dynamic Programming"], xp_reward: 180, bonus_reward_json: { type: "title", value: "DP Master" },
    description: "Given two strings text1 and text2, return the length of their longest common subsequence. If none exists return 0.",
    examples_json: [{ input: "text1 = \"abcde\", text2 = \"ace\"", output: "3" }], constraints_json: ["1 <= text1.length, text2.length <= 1000", "text1 and text2 consist of only lowercase English characters."],
    hints_json: ["Create a 2D DP table of size (len(text1)+1) x (len(text2)+1).", "If text1[i] == text2[j], dp[i][j] = 1 + dp[i+1][j+1].", "Else dp[i][j] = max(dp[i+1][j], dp[i][j+1])."], test_cases_json: Array(10).fill({ input: "text1 = \"abcde\", text2 = \"ace\"", expected_output: "3" }),
    solution_approaches_json: [{ name: "2D DP (Optimal)", timeComplexity: "O(n*m)", spaceComplexity: "O(n*m)", code: "# Python\ndp = [[0 for j in range(len(text2) + 1)] for i in range(len(text1) + 1)]\nfor i in range(len(text1) - 1, -1, -1):\n    for j in range(len(text2) - 1, -1, -1):\n        if text1[i] == text2[j]:\n            dp[i][j] = 1 + dp[i + 1][j + 1]\n        else:\n            dp[i][j] = max(dp[i][j + 1], dp[i + 1][j])\nreturn dp[0][0]" }], optimal_approach: "2D DP (Optimal)"
  },
  {
    dayNumber: 18, title: "Course Schedule", difficulty: "EXPERT", tags: ["Graph", "Topological Sort", "DFS", "BFS"], xp_reward: 180, bonus_reward_json: { type: "badge", value: "graph_guru" },
    description: "There are numCourses courses labeled 0 to numCourses-1. Given prerequisites pairs [a,b] meaning 'must take b before a', return true if you can finish all courses.",
    examples_json: [{ input: "numCourses = 2, prerequisites = [[1,0]]", output: "true" }], constraints_json: ["1 <= numCourses <= 2000", "0 <= prerequisites.length <= 5000", "prerequisites[i].length == 2", "All the pairs prerequisites[i] are unique."],
    hints_json: ["This is a graph problem. Courses are nodes, prerequisites are directed edges.", "Use DFS to detect cycles.", "Keep track of visiting nodes in current DFS path. If you see a node in current path, cycle exists."], test_cases_json: Array(10).fill({ input: "numCourses = 2, prerequisites = [[1,0]]", expected_output: "true" }),
    solution_approaches_json: [{ name: "DFS Cycle Detection (Optimal)", timeComplexity: "O(V + E)", spaceComplexity: "O(V + E)", code: "# Python\npreMap = {i: [] for i in range(numCourses)}\nfor crs, pre in prerequisites:\n    preMap[crs].append(pre)\nvisitSet = set()\ndef dfs(crs):\n    if crs in visitSet: return False\n    if preMap[crs] == []: return True\n    visitSet.add(crs)\n    for pre in preMap[crs]:\n        if not dfs(pre): return False\n    visitSet.remove(crs)\n    preMap[crs] = []\n    return True\nfor crs in range(numCourses):\n    if not dfs(crs): return False\nreturn True" }], optimal_approach: "DFS Cycle Detection (Optimal)"
  },
  {
    dayNumber: 19, title: "Validate Binary Search Tree", difficulty: "EXPERT", tags: ["Tree", "DFS", "Recursion"], xp_reward: 160, bonus_reward_json: { type: "xp_multiplier", value: 1.5 },
    description: "Given root of a binary tree, determine if it is a valid binary search tree. A valid BST means: left subtree nodes < node, right subtree nodes > node, and both subtrees are valid BSTs.",
    examples_json: [{ input: "root = [2,1,3]", output: "true" }], constraints_json: ["The number of nodes in the tree is in the range [1, 10^4].", "-2^31 <= Node.val <= 2^31 - 1"],
    hints_json: ["Use recursion with boundaries (min_val, max_val).", "When going left, update max_val to current node's value.", "When going right, update min_val to current node's value."], test_cases_json: Array(10).fill({ input: "root = [2,1,3]", expected_output: "true" }),
    solution_approaches_json: [{ name: "Recursive Boundaries (Optimal)", timeComplexity: "O(n)", spaceComplexity: "O(h)", code: "# Python\ndef valid(node, left, right):\n    if not node: return True\n    if not (left < node.val < right): return False\n    return valid(node.left, left, node.val) and valid(node.right, node.val, right)\nreturn valid(root, float('-inf'), float('inf'))" }], optimal_approach: "Recursive Boundaries (Optimal)"
  },
  {
    dayNumber: 20, title: "Decode Ways", difficulty: "EXPERT", tags: ["String", "Dynamic Programming"], xp_reward: 180, bonus_reward_json: { type: "xp_boost", value: 150 },
    description: "A string of digits can be decoded where A=1...Z=26. Given string s, return the number of ways to decode it.",
    examples_json: [{ input: "s = \"12\"", output: "2" }], constraints_json: ["1 <= s.length <= 100", "s contains only digits and may contain leading zero(s)."],
    hints_json: ["If string starts with '0', it's 0 ways.", "dp[i] = dp[i+1] (if s[i] != '0') + dp[i+2] (if s[i:i+2] is 10-26)."], test_cases_json: Array(10).fill({ input: "s = \"12\"", expected_output: "2" }),
    solution_approaches_json: [{ name: "DP (Optimal)", timeComplexity: "O(n)", spaceComplexity: "O(1)", code: "# Python\ndp = {len(s): 1}\nfor i in range(len(s) - 1, -1, -1):\n    if s[i] == '0':\n        dp[i] = 0\n    else:\n        dp[i] = dp[i + 1]\n    if i + 1 < len(s) and (s[i] == '1' or s[i] == '2' and s[i + 1] in '0123456'):\n        dp[i] += dp[i + 2]\nreturn dp[0]" }], optimal_approach: "DP (Optimal)"
  },
  {
    dayNumber: 21, title: "Unique Paths", difficulty: "HARD", tags: ["Dynamic Programming", "Math", "Combinatorics"], xp_reward: 140, bonus_reward_json: { type: "badge", value: "path_counter" },
    description: "A robot on an m×n grid starts at top-left and must reach bottom-right. It can only move right or down. How many unique paths?",
    examples_json: [{ input: "m = 3, n = 7", output: "28" }], constraints_json: ["1 <= m, n <= 100"],
    hints_json: ["Use a 2D DP array where dp[i][j] = dp[i-1][j] + dp[i][j-1].", "Base case: top row and left column are all 1s."], test_cases_json: Array(10).fill({ input: "m = 3, n = 7", expected_output: "28" }),
    solution_approaches_json: [{ name: "DP (Optimal)", timeComplexity: "O(m*n)", spaceComplexity: "O(n)", code: "# Python\nrow = [1] * n\nfor i in range(m - 1):\n    newRow = [1] * n\n    for j in range(n - 2, -1, -1):\n        newRow[j] = newRow[j + 1] + row[j]\n    row = newRow\nreturn row[0]" }], optimal_approach: "DP (Optimal)"
  },
  {
    dayNumber: 22, title: "Jump Game", difficulty: "HARD", tags: ["Array", "Greedy", "Dynamic Programming"], xp_reward: 140, bonus_reward_json: { type: "title", value: "Jumper" },
    description: "Given integer array nums, you start at index 0. Each element nums[i] represents max jump length from that position. Return true if you can reach the last index.",
    examples_json: [{ input: "nums = [2,3,1,1,4]", output: "true" }], constraints_json: ["1 <= nums.length <= 10^4", "0 <= nums[i] <= 10^5"],
    hints_json: ["Iterate backwards from the end.", "Maintain a 'goal' pointer. If current index + jump length >= goal, move goal to current index.", "At the end, goal should be 0."], test_cases_json: Array(10).fill({ input: "nums = [2,3,1,1,4]", expected_output: "true" }),
    solution_approaches_json: [{ name: "Greedy (Optimal)", timeComplexity: "O(n)", spaceComplexity: "O(1)", code: "# Python\ngoal = len(nums) - 1\nfor i in range(len(nums) - 1, -1, -1):\n    if i + nums[i] >= goal:\n        goal = i\nreturn True if goal == 0 else False" }], optimal_approach: "Greedy (Optimal)"
  },
  {
    dayNumber: 23, title: "Search in Rotated Sorted Array", difficulty: "EXPERT", tags: ["Array", "Binary Search"], xp_reward: 170, bonus_reward_json: { type: "xp_boost", value: 130 },
    description: "An array was rotated at an unknown pivot. Given the array and a target, return target's index or -1. Must run in O(log n).",
    examples_json: [{ input: "nums = [4,5,6,7,0,1,2], target = 0", output: "4" }], constraints_json: ["1 <= nums.length <= 5000", "-10^4 <= nums[i] <= 10^4", "All values of nums are unique."],
    hints_json: ["Use binary search.", "Determine if left half or right half is properly sorted.", "Check if target is in the sorted half. If so, search there. Else, search the other half."], test_cases_json: Array(10).fill({ input: "nums = [4,5,6,7,0,1,2], target = 0", expected_output: "4" }),
    solution_approaches_json: [{ name: "Binary Search (Optimal)", timeComplexity: "O(log n)", spaceComplexity: "O(1)", code: "# Python\nl, r = 0, len(nums) - 1\nwhile l <= r:\n    mid = (l + r) // 2\n    if target == nums[mid]: return mid\n    if nums[l] <= nums[mid]:\n        if target > nums[mid] or target < nums[l]: l = mid + 1\n        else: r = mid - 1\n    else:\n        if target < nums[mid] or target > nums[r]: r = mid - 1\n        else: l = mid + 1\nreturn -1" }], optimal_approach: "Binary Search (Optimal)"
  },
  {
    dayNumber: 24, title: "Kth Largest Element in Array", difficulty: "EXPERT", tags: ["Array", "Sorting", "Heap", "QuickSelect"], xp_reward: 160, bonus_reward_json: { type: "badge", value: "heap_master" },
    description: "Given integer array nums and integer k, return the kth largest element in the array (not kth largest distinct element).",
    examples_json: [{ input: "nums = [3,2,1,5,6,4], k = 2", output: "5" }], constraints_json: ["1 <= k <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
    hints_json: ["Sorting takes O(n log n).", "Min-heap of size k takes O(n log k).", "QuickSelect can do it in O(n) average time."], test_cases_json: Array(10).fill({ input: "nums = [3,2,1,5,6,4], k = 2", expected_output: "5" }),
    solution_approaches_json: [{ name: "Min Heap (Optimal)", timeComplexity: "O(n log k)", spaceComplexity: "O(k)", code: "# Python\nimport heapq\nheap = []\nfor n in nums:\n    heapq.heappush(heap, n)\n    if len(heap) > k:\n        heapq.heappop(heap)\nreturn heap[0]" }], optimal_approach: "Min Heap (Optimal)"
  },
  {
    dayNumber: 25, title: "Product of Array Except Self", difficulty: "EXPERT", tags: ["Array", "Prefix Sum"], xp_reward: 170, bonus_reward_json: { type: "xp_multiplier", value: 2.0 },
    description: "Given integer array nums, return array answer such that answer[i] = product of all elements of nums except nums[i]. Must run in O(n) without division operator.",
    examples_json: [{ input: "nums = [1,2,3,4]", output: "[24,12,8,6]" }], constraints_json: ["2 <= nums.length <= 10^5", "-30 <= nums[i] <= 30"],
    hints_json: ["Calculate prefix products.", "Calculate postfix products.", "Multiply them together."], test_cases_json: Array(10).fill({ input: "nums = [1,2,3,4]", expected_output: "[24,12,8,6]" }),
    solution_approaches_json: [{ name: "Prefix/Postfix Array (Optimal)", timeComplexity: "O(n)", spaceComplexity: "O(1) extra space", code: "# Python\nres = [1] * len(nums)\nprefix = 1\nfor i in range(len(nums)):\n    res[i] = prefix\n    prefix *= nums[i]\npostfix = 1\nfor i in range(len(nums) - 1, -1, -1):\n    res[i] *= postfix\n    postfix *= nums[i]\nreturn res" }], optimal_approach: "Prefix/Postfix Array (Optimal)"
  },
  {
    dayNumber: 26, title: "Find Minimum in Rotated Sorted Array", difficulty: "HARD", tags: ["Array", "Binary Search"], xp_reward: 140, bonus_reward_json: { type: "xp_boost", value: 80 },
    description: "Given sorted array rotated at unknown pivot, find the minimum element. Must run in O(log n).",
    examples_json: [{ input: "nums = [3,4,5,1,2]", output: "1" }], constraints_json: ["n == nums.length", "1 <= n <= 5000", "-5000 <= nums[i] <= 5000", "All the integers of nums are unique."],
    hints_json: ["Use binary search.", "If mid element is greater than rightmost element, min is to the right.", "Else, min is to the left (including mid)."], test_cases_json: Array(10).fill({ input: "nums = [3,4,5,1,2]", expected_output: "1" }),
    solution_approaches_json: [{ name: "Binary Search (Optimal)", timeComplexity: "O(log n)", spaceComplexity: "O(1)", code: "# Python\nres = nums[0]\nl, r = 0, len(nums) - 1\nwhile l <= r:\n    if nums[l] < nums[r]:\n        res = min(res, nums[l])\n        break\n    mid = (l + r) // 2\n    res = min(res, nums[mid])\n    if nums[mid] >= nums[l]:\n        l = mid + 1\n    else:\n        r = mid - 1\nreturn res" }], optimal_approach: "Binary Search (Optimal)"
  },
  {
    dayNumber: 27, title: "Serialize and Deserialize Binary Tree", difficulty: "EXPERT", tags: ["Tree", "DFS", "BFS", "Design"], xp_reward: 200, bonus_reward_json: { type: "title", value: "Tree Architect" },
    description: "Design an algorithm to serialize a binary tree to a string and deserialize that string back to the original tree. No restriction on format.",
    examples_json: [{ input: "root = [1,2,3,null,null,4,5]", output: "[1,2,3,null,null,4,5]" }], constraints_json: ["The number of nodes in the tree is in the range [0, 10^4].", "-1000 <= Node.val <= 1000"],
    hints_json: ["Pre-order traversal is good for this.", "Include a marker (like 'N') for null nodes.", "Deserialize by consuming tokens sequentially."], test_cases_json: Array(10).fill({ input: "root = [1,2,3,null,null,4,5]", expected_output: "[1,2,3,null,null,4,5]" }),
    solution_approaches_json: [{ name: "DFS Pre-order (Optimal)", timeComplexity: "O(n)", spaceComplexity: "O(n)", code: "# Python\nclass Codec:\n    def serialize(self, root):\n        res = []\n        def dfs(node):\n            if not node:\n                res.append(\"N\")\n                return\n            res.append(str(node.val))\n            dfs(node.left)\n            dfs(node.right)\n        dfs(root)\n        return \",\".join(res)\n    def deserialize(self, data):\n        vals = data.split(\",\")\n        self.i = 0\n        def dfs():\n            if vals[self.i] == \"N\":\n                self.i += 1\n                return None\n            node = TreeNode(int(vals[self.i]))\n            self.i += 1\n            node.left = dfs()\n            node.right = dfs()\n            return node\n        return dfs()" }], optimal_approach: "DFS Pre-order (Optimal)"
  },
  {
    dayNumber: 28, title: "LRU Cache", difficulty: "EXPERT", tags: ["Hash Map", "Linked List", "Design"], xp_reward: 200, bonus_reward_json: { type: "badge", value: "cache_king" },
    description: "Design a data structure for Least Recently Used cache. Implement LRUCache(capacity), get(key), and put(key, value). Both operations must run in O(1).",
    examples_json: [{ input: "LRUCache cache = new LRUCache(2); cache.put(1, 1); cache.put(2, 2); cache.get(1);", output: "1" }], constraints_json: ["1 <= capacity <= 3000", "0 <= key <= 10^4", "0 <= value <= 10^5"],
    hints_json: ["You need O(1) lookups, so use a Hash Map.", "You need O(1) removal and insertion, so use a Doubly Linked List.", "Hash map maps key -> Node in Linked List."], test_cases_json: Array(10).fill({ input: "LRUCache cache = new LRUCache(2); cache.put(1, 1); cache.put(2, 2); cache.get(1);", expected_output: "1" }),
    solution_approaches_json: [{ name: "Hash Map + Doubly Linked List (Optimal)", timeComplexity: "O(1)", spaceComplexity: "O(capacity)", code: "# Python\nclass Node:\n    def __init__(self, key, val):\n        self.key, self.val = key, val\n        self.prev = self.next = None\nclass LRUCache:\n    def __init__(self, capacity: int):\n        self.cap = capacity\n        self.cache = {}  # map key to node\n        self.left, self.right = Node(0, 0), Node(0, 0)\n        self.left.next, self.right.prev = self.right, self.left\n    def remove(self, node):\n        prev, nxt = node.prev, node.next\n        prev.next, nxt.prev = nxt, prev\n    def insert(self, node):\n        prev, nxt = self.right.prev, self.right\n        prev.next = nxt.prev = node\n        node.next, node.prev = nxt, prev\n    def get(self, key: int) -> int:\n        if key in self.cache:\n            self.remove(self.cache[key])\n            self.insert(self.cache[key])\n            return self.cache[key].val\n        return -1\n    def put(self, key: int, value: int) -> None:\n        if key in self.cache:\n            self.remove(self.cache[key])\n        self.cache[key] = Node(key, value)\n        self.insert(self.cache[key])\n        if len(self.cache) > self.cap:\n            lru = self.left.next\n            self.remove(lru)\n            del self.cache[lru.key]" }], optimal_approach: "Hash Map + Doubly Linked List (Optimal)"
  },
  {
    dayNumber: 29, title: "Trapping Rain Water", difficulty: "EXPERT", tags: ["Array", "Two Pointers", "Dynamic Programming", "Stack"], xp_reward: 190, bonus_reward_json: { type: "xp_boost", value: 200 },
    description: "Given n non-negative integers representing elevation map with width 1, compute how much water can be trapped after raining.",
    examples_json: [{ input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]", output: "6" }], constraints_json: ["n == height.length", "1 <= n <= 2 * 10^4", "0 <= height[i] <= 10^5"],
    hints_json: ["For each position, water level = min(maxLeft, maxRight) - height", "Precompute maxLeft and maxRight arrays in O(n)", "Two pointer approach: move the pointer with smaller max inward"], test_cases_json: Array(10).fill({ input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]", expected_output: "6" }),
    solution_approaches_json: [{ name: "Two Pointers (Optimal)", timeComplexity: "O(n)", spaceComplexity: "O(1)", code: "# Python\nif not height: return 0\nl, r = 0, len(height) - 1\nleftMax, rightMax = height[l], height[r]\nres = 0\nwhile l < r:\n    if leftMax < rightMax:\n        l += 1\n        leftMax = max(leftMax, height[l])\n        res += leftMax - height[l]\n    else:\n        r -= 1\n        rightMax = max(rightMax, height[r])\n        res += rightMax - height[r]\nreturn res" }], optimal_approach: "Two Pointers (Optimal)"
  },
  {
    dayNumber: 30, title: "Median of Two Sorted Arrays", difficulty: "EXPERT", tags: ["Array", "Binary Search", "Divide and Conquer"], xp_reward: 250, bonus_reward_json: { type: "title", value: "Algorithm Grandmaster", description: "Earn the elite title 'Algorithm Grandmaster'!" },
    description: "Given two sorted arrays nums1 and nums2, return the median of the two sorted arrays. Overall run time complexity must be O(log(m+n)).",
    examples_json: [{ input: "nums1 = [1,3], nums2 = [2]", output: "2.00000" }], constraints_json: ["nums1.length == m", "nums2.length == n", "0 <= m <= 1000", "0 <= n <= 1000", "1 <= m + n <= 2000"],
    hints_json: ["Think about binary searching on the smaller array", "You are partitioning both arrays such that left half ≤ right half", "The median is determined by the max of left parts and min of right parts"], test_cases_json: Array(10).fill({ input: "nums1 = [1,3], nums2 = [2]", expected_output: "2.00000" }),
    solution_approaches_json: [{ name: "Binary Search Partitions (Optimal)", timeComplexity: "O(log(min(m,n)))", spaceComplexity: "O(1)", code: "# Python\nA, B = nums1, nums2\ntotal = len(nums1) + len(nums2)\nhalf = total // 2\nif len(B) < len(A): A, B = B, A\nl, r = 0, len(A) - 1\nwhile True:\n    i = (l + r) // 2 # A\n    j = half - i - 2 # B\n    Aleft = A[i] if i >= 0 else float('-infinity')\n    Aright = A[i + 1] if (i + 1) < len(A) else float('infinity')\n    Bleft = B[j] if j >= 0 else float('-infinity')\n    Bright = B[j + 1] if (j + 1) < len(B) else float('infinity')\n    if Aleft <= Bright and Bleft <= Aright:\n        if total % 2:\n            return min(Aright, Bright)\n        return (max(Aleft, Bleft) + min(Aright, Bright)) / 2\n    elif Aleft > Bright:\n        r = i - 1\n    else:\n        l = i + 1" }], optimal_approach: "Binary Search Partitions (Optimal)"
  }
];

// Generate 31-365
const categories = ["Two Pointers", "Sliding Window", "Binary Search", "Stack/Queue", "Linked List", "Trees", "Graphs", "Dynamic Programming", "Backtracking", "Greedy", "Heap", "Trie", "Bit Manipulation", "Math"];
const diffs = ["MEDIUM", "HARD", "EXPERT"] as const;

for (let i = 31; i <= 365; i++) {
  const cat = categories[(i - 31) % categories.length];
  const diff = diffs[(i - 31) % 3];
  dailyQuests.push({
    dayNumber: i,
    title: `Daily Challenge ${i}: ${cat}`,
    difficulty: diff,
    description: `<p>This is a programmatically generated ${diff.toLowerCase()} problem focusing on ${cat}. Solve the challenge efficiently to earn XP!</p>`,
    examples_json: [
      { input: "auto-generated", output: "auto-generated" }
    ],
    constraints_json: [
      "Auto generated constraint 1",
      "Auto generated constraint 2"
    ],
    hints_json: [
      `Consider how ${cat} applies to this problem.`,
      "Think about edge cases and constraints.",
      "Optimize your time and space complexity."
    ],
    test_cases_json: Array(10).fill({ input: "generated input", expected_output: "generated output" }),
    solution_approaches_json: [
      { name: "Optimal Approach", timeComplexity: "O(n)", spaceComplexity: "O(1)", explanation: `Using ${cat} technique.`, code: "// Python\nprint('Auto generated solution')" }
    ],
    optimal_approach: "Optimal Approach",
    tags: [cat],
    xp_reward: diff === "MEDIUM" ? 50 : diff === "HARD" ? 100 : 150,
    bonus_reward_json: i % 7 === 0 ? { type: "streak_freeze", description: "Sunday Streak Freeze!" } : Prisma.JsonNull
  } as any);
}

async function main() {
  console.log('Seeding daily quests...');
  
  for (const quest of dailyQuests) {
    await prisma.dailyQuest.upsert({
      where: { dayNumber: quest.dayNumber },
      update: {},
      create: quest as any,
    });
  }
  
  console.log(`Seeded ${dailyQuests.length} daily quests successfully!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
