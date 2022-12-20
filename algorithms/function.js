// алгоритм каррирования функции

function sum(a, b, c) {
  return a + b + c;
}

function curryFn(fn) {
  const totalArgs = [];
  return function curry(...args) {
    if (args.length === fn.length) { return fn(...args) }
    totalArgs.push(...args);
    if (totalArgs.length < fn.length) { return curry }
    return fn(...totalArgs);
  };
}

const curriedSum = curryFn(sum);
console.log(curriedSum(1, 2));
console.log(curriedSum(3));
