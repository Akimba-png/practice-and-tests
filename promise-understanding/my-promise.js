let count = 0;

class CustomPromise {
  constructor(executor) {
    executor(this.#onSuccess.bind(this));
    this.queue = [];
    this.id = ++count;
    this.value = null;
  }

  then(cb) {
    // console.log(this.id);
    console.log('3. парсер продолжая резбирать ассинхронный код, переходит к then')
    return new CustomPromise((resolve) => {
      console.log('4. Создаёт и возвращает новый промис 5. Запускает его executor . Передаёт в него onSuccess нового промиса');
      console.log('7. Создаёт новую функцию обёртку для cb переданного в then и добавляет его в очередь предыдущего промиса')
      console.log('8. Переходит к выполнению очередного then, создавая новый промисс, выполняя его executor,\
      nи помещая cb then в предыдущую очередь задач, вместе с onSuccessom нового промиса.\
      nТаким образом каждый последующий промис сможет зарезолвится только после выполнения предыдущего\
      n В Очереди предыдущего промиса будет находиться onSuccess и cb последующего then\
      n Вся цепочка then обрабатывается сразу')
      this.queue.push( (data) => resolve(cb(data)) );
      console.log('9. После обработки всех then callstack освобождается и наступает время выполенения микро и макрозадач после из обработки webApi')
    });
  }


  #onSuccess(value) {
    console.log('10. Срабатывает 1-ый или последующий onSuccess')
    queueMicrotask(() => {
      console.log('11. Сразу ставим его в очередь микрозадач через queueMicrotask. Что бы обеспечить ассинхронность промиса, на случай, если в его executor`е не было ассинхронного кода - это сделает промисс всё равно ассинхронным')
      console.log('12. В очереди микро задач записывает результат webApi в корневое свойство промиса')
      console.log('Запускаем итератор очередей. Значение для cb берётся из корневого свойства промиса.')
      console.log('14. После того, как выполнился колбек из списка очередей предыдущего промиса, запускается второй cb(который может быть ассинхронным, но парсер будет его ждать, так как больше нет других синхронных задач?')
      this.value = value
      this.#runCallbacks()
    })
  }

  #runCallbacks() {
      this.queue.forEach(callback => {
        callback(this.value)
      })

      this.queue = []


  }


}


const createPromise = () => {
  return new CustomPromise((resolve) => {
    console.log('1. вызывается executor промиса 1, в него передаётся ф-я onSuccess 2. setTimeout уходит в webApi')
    setTimeout(() => {
      resolve('data');
    }, 1000);
  });
};

createPromise()
  .then((data) => data + ' data')
  // .then((data) => data.toUpperCase())
  // .then((data) =>
  //   setTimeout(() => {
  //     return data + ' timeout';
  //   }, 1000)
  // )
  // .then((data) => console.log(data));

  console.log('каждый новый then в цепочке - это новый промис, а его resolve(т.е. функция onSuccess) хранится в очереди cb предыдущего промиса, Таким образом последующий промис не начёт выполенение (вернее его callback then) до резолва предыдущего промиса)
