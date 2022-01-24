export function toFixedN(value: number, digital: number) {
  let left = (value * Math.pow(10, digital)) % 1,
    biggerInt = Math.floor(value * Math.pow(10, digital))
  if (Math.abs(left - 0.5) < 1e-8) {
    left = 0.5
  }
  if (left >= 0.5) {
    biggerInt += 1
  }
  return (biggerInt / 100).toFixed(2)
}
