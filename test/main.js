function ListNode(val, next) {
  this.val = (val === undefined ? 0 : val)
  this.next = (next === undefined ? null : next)
}
let temp = new ListNode()
temp.val = 1
console.log('temp: ', temp);

let obj = Object.create(ListNode.prototype)
obj.val = 0
obj.next = null
