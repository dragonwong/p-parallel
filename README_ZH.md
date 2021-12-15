# p-parallel

[![npm](https://img.shields.io/npm/v/p-parallel.svg?maxAge=60)](https://www.npmjs.com/package/p-parallel) [![npm](https://img.shields.io/npm/dt/p-parallel.svg?maxAge=60)](https://www.npmjs.com/package/p-parallel) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/dragonwong/p-parallel/master/LICENSE)

[English](./README.md) | 中文

让 promise 在有限的并发数下运行。

## 开始

```
npm install p-parallel --save
```

## 用法

`pParallel(functionArr, parallelLimit)`

- `functionArr`：Array，函数数组，所有函数返回值为 promise。
- `parallelLimit`：Number，最大并发数。

方法返回一个独立的 `Promise` 实例，此实例会在 `parallelLimit` 控制的最大并发数的约束下，并发执行 `functionArr` 参数的所有函数，在所有函数内的 promise 都完成（resolved）时，回调完成（resolve），成功的结果是所有 promise 的结果；如果有一个 promise 失败（rejected）时，回调失败（reject），失败原因的是第一个失败的 promise 的结果。

此方法在有限资源的条件下使用并发很有用，比如说需要有节制地进行并发请求。

### 和 `Promise.all()` 的区别

- `Promise.all()` 方法接收一个 promise 的 iterable 类型，而 `pParallel` 接受一个函数数组。
- `Promise.all(Promise)` 并发异步执行 `functionArr` 参数内所有的 promise。而 `pParallel(functionArr, parallelLimit)` 通过 `parallelLimit` 控制了最大并发数，并按照先进先出的顺序执行。

## 示例

```js
const pParallel = require('p-parallel');

function task(data, delay, success = true) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (success) {
        resolve(data);
      } else {
        reject(data);
      }
    }, delay);
  });
}

function test(functionArr) {
  pParallel(functionArr, 2).then(res => console.log('success:', res), res => console.log('fail:', res));
}

function success1() {
  return task('success1', 4000);
}
function success2() {
  return task('success2', 2000);
}
function success3() {
  return task('success3', 2000);
}
function fail1() {
  return task('fail1', 2000, false);
}
function fail2() {
  return task('fail2', 4000, false);
}

// 这个将会打印 'success: success1, success2, success3' after 4000ms
test([success1, success2, success3]);
// 这个将会打印 'fail: fail1' after 2000ms
test([success1, success2, fail]);
```

## 提示

### 如何兜住异常？

有时我们需要兜住异常情况，保证 `functionArr` 里的 promise 能够全部得到执行。这时我们可以使用 `.catch`。

```js
const pParallel = require('p-parallel');

function task(data, delay, success = true) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (success) {
        resolve(data);
      } else {
        reject(data)
      }
    }, delay);
  });
}

function test(functionArr) {
  pParallel(functionArr, 2).then(res => console.log('success:', res), res => console.log('fail:', res));
}

function success1() {
  return task('success1', 4000);
}
function success2() {
  return task('success2', 2000);
}
function fail1() {
  return task('fail1', 2000, false).catch(data => data);
}

// 这个将会打印 'success: success1, success2, fail1' after 4000ms
test([success1, success2, fail]);
```

### 更优雅的方式来使用 p-parallel?

```js
const pParallel = require('p-parallel');
// 我感觉这是更优雅的方式。
Promise.parallel = pParallel;
```
