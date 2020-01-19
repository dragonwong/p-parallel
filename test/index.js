const pParallel = require('../index')

function task(data, delay, success = true) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (success) {
        resolve({
          ret: true,
          data,
        });
      } else {
        reject({
          ret: false,
        })
      }
    }, delay);
  });
}

function p1() {
  return task('p1', 2000, false).catch(data => data);
}
function p2() {
  return task('p2', 4000).catch(data => data);
}
function p3() {
  return task('p3', 2000).catch(data => data);
}

pParallel([p1, p2, p3], 2).then(res => console.log('success', res), res => console.log('fail', res));
