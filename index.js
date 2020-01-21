/* eslint-disable no-param-reassign */
/**
 * 原子执行函数
 * @param {*} arr 待执行任务队列
 * @param {*} register 寄存器 register.doingCount:
 * 进行中的任务数量; register.results: 已执行任务结果; register.resultsLength 已执行完成任务数量
 * @param {*} parallelLimit 最大并发数
 * @param {*} taskLength 总任务数
 * @param {*} resolve
 * @param {*} reject
 * @param {*} index 当前执行任务在原任务数组的序号
 */
function atom(arr, register, parallelLimit, taskLength, resolve, reject) {
  // 从头部取，先进先出
  const p = arr.shift();
  const currentIndex = register.resultIndex;
  register.resultIndex += 1;
  register.doingCount += 1;
  p().then((data) => {
    register.doingCount -= 1;
    register.results[currentIndex] = data;
    register.resultsLength += 1;

    if (register.resultsLength === taskLength) {
      // 任务全部执行完毕，并拿到结果
      resolve(register.results);
    } else if (arr.length) {
      atom(arr, register, parallelLimit, taskLength, resolve, reject);
    }
  }, (data) => {
    reject(data);
  });
}

/**
 * 主函数
 * @param {*} promiseArr 任务数组
 * @param {*} parallelLimit 最大并发数
 */
function pParallel(promiseArr, parallelLimit = 1) {
  if (promiseArr instanceof Array) {
    if (promiseArr.length === 0) {
      return Promise.resolve([]);
    }
    const arr = [...promiseArr];
    const register = {
      doingCount: 0,
      results: [],
      resultsLength: 0,
      resultIndex: 0,
    };

    return new Promise((resolve, reject) => {
      // 把并发通道全部填满
      while ((register.doingCount < parallelLimit) && arr.length) {
        atom(arr, register, parallelLimit, promiseArr.length, resolve, reject);
      }
    });
  }
  return Promise.reject(new Error('<promiseArr> is not an array'));
}

module.exports = pParallel;
