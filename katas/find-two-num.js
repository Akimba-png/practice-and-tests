// Найти в массиве два числа сумма которых равна num
const arr = [2, 1, 3, 6, 7, 5, 9 ];
const num = 5;

// function find(arr, num) {
//   const a = arr.find((e, i, a) => a.includes(num - e));
//   const b = arr.find(e => e === num - a);
//   return [a, b];
// }

function find(arr, num) {
  const store = new Map();
  for (const elem of arr) {
    const diff = num - elem;
    if (store.has(diff)) {
      return [store.get(diff), elem];
    }
    store.set(elem, elem);
  }
  return -1;
}

const result = find(arr, num);
console.log(result);
