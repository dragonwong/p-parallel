# p-parallel

[![npm](https://img.shields.io/npm/v/p-parallel.svg?maxAge=60)](https://www.npmjs.com/package/p-parallel) [![npm](https://img.shields.io/npm/dt/p-parallel.svg?maxAge=60)](https://www.npmjs.com/package/p-parallel)

[English](./README.md) | 中文

Make promises run in parallel with a limit amount.

## Start

```
npm install p-parallel
```

## Usage

`pParallel(promiseArr, parallelLimit)` 方法返回一个独立的 `Promise` 实例，此实例会在 `parallelLimit` 控制的最大并发数的约束下，并发异步执行 `promiseArr` 参数内所有 promise，在所有 promise 都完成（resolved）或没有 promise 时，回调完成（resolve），成功的结果是所有 promise 的结果；如果有一个 promise 失败（rejected）时，回调失败（reject），失败原因的是第一个失败的 promise 的结果。

### 和 `Promise.all()` 的区别

`Promise.all(promiseArr)` 并发异步执行 `promiseArr` 参数内所有的 promise。而 `pParallel(promiseArr, parallelLimit)` 通过 `parallelLimit` 控制了最大并发数，并按照先进先出的顺序执行。

## 语法

`pParallel(promiseArr, parallelLimit)`

### 参数

#### `promiseArr`

由 promises 组成的数组。

#### `parallelLimit`

最大并发数。

### 返回追

和 `Promise.all()` 一致。

## 说明

此方法在有限资源的条件下使用并发很有用，比如说需要有节制地进行并发请求。

## 示例

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

function test(promiseArr) {
  pParallel(promiseArr, 2).then(res => console.log('success:', res), res => console.log('fail:', res));
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

有时我们需要兜住异常情况，保证 `promiseArr` 里的 promise 能够全部得到执行。这时我们可以使用 `.catch`。

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

function test(promiseArr) {
  pParallel(promiseArr, 2).then(res => console.log('success:', res), res => console.log('fail:', res));
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
