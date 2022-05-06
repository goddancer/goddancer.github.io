var foo = {
  value: 1
};

function bar(...args) {
  console.log('args: ', args);
  console.log(this.value);
  return args
}

Function.prototype.myApply = function(context) {
  // 需要考虑假如不存在调用主体，需要设置为window调用
  context = context || window
  // this指向当前调用对象，即bar
  context.fn = this
  // call改变this指向，谁调用指向谁，由此思路欲出
  // 同时需要考虑传递参数进来，以及call接受的参数格式
  const result = context.fn([...arguments].slice(1))
  delete context.fn
  return result
}
Function.prototype.myBind = function(context) {
  context = context || window
  const fn = this, args = [...arguments].slice(1)
  return function() {
    return fn.apply(context, args.concat(...arguments))
  }
}
const res = bar.myBind(foo, [1,2,3]); // 1
console.log('res: ', res());

function getValue() {
  console.log(input1.value)
}
