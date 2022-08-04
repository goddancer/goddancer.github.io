/* 
  1、普通执行，需要注意错误捕获
  2、如果异步如何处理
  3、无限循环如何处理
 */
const delay = (time) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};

function runAllTask(list, cb) {
  let isLegal = list.findIndex((it) => it.deps.length === 0) > -1;
  if (!isLegal) {
    return cb(new Error("infinity loop"), null);
  }
  let result = list.reduce((a, c) => {
    a[c.id] = undefined;
    return a;
  }, {});
  let execErr = false;
  while (list.length > 0) {
    const curTask = list.shift();
    if (!curTask.deps.length) {
      let tempValue = undefined;
      try {
        tempValue = curTask.runTask();
      } catch (err) {
        execErr = true;
        cb(err, null);
        break;
      }
      result[curTask.id] = tempValue;
    } else {
      let deps = curTask.deps,
        args = [];
      for (let taskid of deps) {
        if (result[taskid] !== undefined) {
          args.push(result[taskid]);
        } else {
          list.push(curTask);
          break;
        }
      }
      if (args.length === deps.length) {
        result[curTask.id] = Promise.all(args).then((res) => {
          return curTask.runTask.apply(null, res);
        });
      }
    }
  }
  !execErr &&
    Promise.all(Object.values(result)).then(
      (res) => {
        const formatResult = Object.keys(result).reduce((a, c, i) => {
          a[c] = res[i];
          return a;
        }, {});
        cb(null, formatResult);
      },
      (err) => {
        cb(err, null);
      }
    );
}

/* infinity loop */
const input1 = [
  {
    id: "task1",
    deps: ["task3"],
    runTask: () => 3
  },
  {
    id: "task2",
    deps: ["task1", "task3"],
    runTask: (res1, res3) => 1 + res1 + res3
  },
  {
    id: "task3",
    deps: ["task1"],
    runTask: (res1) => 5 + res1
  },
  {
    id: "task4",
    deps: ["task1", "task2"],
    runTask: (res1, res2) => 3 + res1 + res2
  }
];

/* async task */
const input2 = [
  {
    id: "task1",
    deps: [],
    runTask: () => delay(3000).then(() => Promise.resolve(3))
  },
  {
    id: "task2",
    deps: ["task1", "task3"],
    runTask: (res1, res3) => 1 + res1 + res3
  },
  {
    id: "task3",
    deps: ["task1"],
    runTask: (res1) => 5 + res1
  },
  {
    id: "task4",
    deps: ["task1", "task2"],
    runTask: (res1, res2) => 3 + res1 + res2
  }
];

/* sync task with err */
const input3 = [
  {
    id: "task1",
    deps: [],
    runTask: () => {
      const err = { code: 403, message: "this is sync err msg!" };
      throw err;
    }
  },
  {
    id: "task2",
    deps: ["task1", "task3"],
    runTask: (res1, res3) => 1 + res1 + res3
  },
  {
    id: "task3",
    deps: ["task1"],
    runTask: (res1) => 5 + res1
  },
  {
    id: "task4",
    deps: ["task1", "task2"],
    runTask: (res1, res2) => 3 + res1 + res2
  }
];
/* async task with err */
const input4 = [
  {
    id: "task1",
    deps: [],
    runTask: () => Promise.reject("this is promise reject msg!")
  },
  {
    id: "task2",
    deps: ["task1", "task3"],
    runTask: (res1, res3) => 1 + res1 + res3
  },
  {
    id: "task3",
    deps: ["task1"],
    runTask: (res1) => 5 + res1
  },
  {
    id: "task4",
    deps: ["task1", "task2"],
    runTask: (res1, res2) => 3 + res1 + res2
  }
];

[input1, input2, input3, input4].forEach((input) => {
  runAllTask(input, (err, res) => {
    if (err) {
      console.log("err: ", err);
    } else {
      console.log("it should be right: ", res);
    }
    console.log("================");
    // console.log(res);
    /** 
        res应该为：
        { task1: 3, task2: 12, task3: 8, task4: 18 }
    */
  });
});
/* 
> "1:script start"
> "2:a1 start"
> "3:a2"
> "4:promise2"
> "5:script end"
> "6:promise1"
> "7:a1 end"
> "8:promise2.then"
> "9:promise3"
> "10:setTimeout"
 */
async function a1 () {
  console.log('a1 start')
  await a2()
  console.log('a1 end')
}
async function a2 () {
  console.log('a2')
}
console.log('script start')
setTimeout(() => {
  console.log('setTimeout')
}, 0)
Promise.resolve().then(() => {
  console.log('promise1')
})
a1()
let promise2 = new Promise((resolve) => {
  resolve('promise2.then')
  console.log('promise2')
})
promise2.then((res) => {
  console.log(res)
  Promise.resolve().then(() => {
    console.log('promise3')
  })
})
console.log('script end')
