// Линейный поиск
{
  const arr = [4, 1, 3, 7, 5, 2, 8, 0, 10, 9, 8, 11, 6];
  function linearSearch(arr, target) {
    for (let i = 0; i < arr.length; i++) {
      if (target === arr[i]) {
        return i;
      }
    }
    return -1;
  }
  const result = linearSearch(arr, -1);
  console.log(result);
}


// Бинарный поиск (работает только на отсортированном массиве)
{
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  function binarySearch(arr, target) {
    let start = 0;
    let end = arr.length - 1;
    let middle;
    while (start <= end) {
      middle = Math.floor((start + end) / 2);
      if (target === arr[middle]) {
        return middle;
      }
      if (target < arr[middle]) {
        end = middle - 1;
      }
      if (target > arr[middle]) {
        start = middle + 1;
      }
    }
    return -1;
  }
  const result = binarySearch(arr, 9);
  console.log(result);
}


// Бинарный поиск (рекурсивный вариант)
{
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  function binarySearch(arr, target) {
    let middle;
    return (function cycle(start, end) {
      if (end < start) {
        return -1;
      }
      middle = Math.floor((start + end) / 2);
      if (target === arr[middle]) {
        return middle;
      }
      if (target < arr[middle]) {
        return cycle(start, middle - 1);
      }
      if (target > arr[middle]) {
        return cycle(middle + 1, end);
      }
    })(0, arr.length - 1);
  }
  const result = binarySearch(arr, 9);
  console.log(result);
}
