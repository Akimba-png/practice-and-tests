// Выпрямить многомерный массив
const nestedArray = [1, [2, 3], 4, 5, [6, [7, [8, [9, 10], 11], 12], 13], 14];

// function flatArr(arr) {
//   return arr.flat(Infinity);
// }

// function flatArr(arr) {
//   return arr.join().split(',').map(Number);
// }

// function flatArr(arr) {
//   const newArr = arr.constructor();
//   (function cycle(array) {
//     for (const elem of array) {
//       typeof elem === 'object' ? cycle(elem) : newArr.push(elem);
//     }
//   })(arr);
//   return newArr;
// }

function flatArr(arr) {
  return arr.reduce((acc, e, i, a) => {
    return typeof e === 'object' ? [...acc, ...flatArr(e)] : [...acc, e];
  }, []);
}

const result = flatArr(nestedArray);
console.log(result);
