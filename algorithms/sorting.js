// Метод быстрой сортировки (сортировка Хоара)
const unsortedArr = [4, 1, 3, 7, 5, 2, 8, 0, 10, 9, 8, 11, 6];

function fastSort(array) {
  if (array.length <= 1) { return array }
  const arr = array.slice();
  const pivotIndex = Math.floor((arr.length - 1) / 2);
  const pivot = arr[pivotIndex];
  const lessValues = [];
  const greaterValues = [];
  for (let i = 0; i < arr.length; i++) {
    if (i === pivotIndex) { continue }
    if (arr[i] < pivot) { lessValues.push(arr[i]) }
    else { greaterValues.push(arr[i]) }
  }
  return [...fastSort(lessValues), pivot, ...fastSort(greaterValues)];
}

const result = fastSort(unsortedArr);
console.log(result);
