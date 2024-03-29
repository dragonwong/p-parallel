# p-parallel

[![npm](https://img.shields.io/npm/v/p-parallel.svg?maxAge=60)](https://www.npmjs.com/package/p-parallel) [![npm](https://img.shields.io/npm/dt/p-parallel.svg?maxAge=60)](https://www.npmjs.com/package/p-parallel) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/dragonwong/p-parallel/master/LICENSE)

English | [中文](./README_ZH.md)

Make promises run in parallel with a limit amount.

## Start

```
npm install p-parallel --save
```

## Usage

`pParallel(functionArr, parallelLimit)`

- `functionArr`：Array，an array of functions those return a promise.
- `parallelLimit`：Number，the max amount of running promises in parallel.

The method returns a single `Promise`. This promise will run all of the functions passed as `functionArr` in parallel asynchronously under the control of the max amount of running promises by `parallelLimit`. This promise fulfills when all of the promises returned by functions in `functionArr` have been fulfilled. It rejects with the reason of the first promise that rejects.

This method can be useful for do something in parallel with limited source, such as sending requests in parallel with a limit amount.

### Different from `Promise.all()`

- While `Promise.all()` takes an iterable of promises as an input, while `pParallel()` takes an array of functions those return a promise.
- While `Promise.all(promiseArr)` runs all the promises in `promiseArr` in parallel asynchronously, `pParallel(promiseArr, parallelLimit)` runs under the control of the max amount of running promises by `parallelLimit` and in the order of FIFO.

## Example

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

// this will print 'success: success1, success2, success3' after 4000ms
test([success1, success2, success3]);
// this will print 'fail: fail1' after 2000ms
test([success1, success2, fail]);
```

## Tips

### How to catch fail?

Sometimes, we need to catch exceptions to keep all promises in `functionArr` done. We can use `.catch`.

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

// this will print 'success: success1, success2, fail1' after 4000ms
test([success1, success2, fail]);
```

### A more elegant way to use p-parallel?

```js
const pParallel = require('p-parallel');
// Personally, I think it's a more elegant way.
Promise.parallel = pParallel;
```
