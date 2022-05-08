var lengthOfLIS = function (nums) {
  if (!nums.length) {
    return 0
  }
  const dp = new Array(nums.length).fill(-1)
  dp[0] = 1
  for (let i = 1; i <= nums.length; i++) {
    const temp = [1]
    for (let j = i - 1; j >= 0; j--) {
      if (nums[j] < nums[i] && dp[j] !== -1) {
        temp.push(dp[j] + 1)
      }
    }
    temp.length && (dp[i] = Math.max(...temp))
  }
  return Math.max(...dp)
};
console.log(lengthOfLIS([7,7,7,7]))
