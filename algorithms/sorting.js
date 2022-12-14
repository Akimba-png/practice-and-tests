// Метод быстрой сортировки (сортировка Хоара)
{
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
}

// Случайная сортировка
{
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  // function randomSort(array) {
  //   const arr = array.slice();
  //   return arr.sort(() => Math.random() - 0.5);
  // }
  // Метод Фишера-Йетца
  function randomSort(array) {
    let temp;
    let randomIndex;
    const arr = array.slice();
    for (let i = arr.length - 1; i >= 1; i--) {
      randomIndex = Math.floor(Math.random() * (i + 1));
      temp = arr[i];
      arr[i] = arr[randomIndex];
      arr[randomIndex] = temp;
    }
    return arr;
  }
  const result = randomSort(arr);
  console.log(result);
}
