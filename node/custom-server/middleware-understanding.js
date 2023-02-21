// const req = {};
// const res = {};

// const a = (req, _res, next) => {
//   req.a = 'a';
//   next();
// };

// const b = (req, _res, next) => {
//   setTimeout(() => {
//     req.b = 'b';
//     next();
//   }, 2000);
// };

// const c = (req, _res, next) => {
//   req.c = 'c';
//   next();
// };

// const middlewares = [a, b, c];
// async function use(req, res) {
//   debugger
//   const test = await middlewares.reduce(async (acc, middleware) => {
//     console.log(acc)
//     //  await acc;
//     //  return new Promise((resolve, reject) => middleware(req, res, resolve))
//     return acc.then(() => new Promise((resolve, reject) => middleware(req, res, resolve)));
//   }, Promise.resolve());
//   console.log(req);
// }

// use(req, res);


// Реализация логики запуска обработки middlewares при имплементации кастомного сервера nodejs
// Запуск обработки middlewares начинаем сразу при поступлении запроса от клиента,
// До момента генерации события. Генерацию события помещаем внутри данной функции, после отработки reduce
// (для этого можно добавить дополнительный параметр в функцию - onSuccess)

// Основный смысл данной логики - Последовательная! обработка всех middlewares.
// Последующее middleware не запускается, пока не закончит свою работку предыдущее.
// Генерация события emmit - запускается, только после обработки всех middlewares
// (для этого необходимо добавить cb onSuccess), даже если они (middlewares) - ассинхронны.
// (Ассинхронность может возникнуть, когда мы парсим например тело запроса пользователя,
// через req.on('data', cb)) - который является стримом.

// Логика работы функции:
// Итерируемся по массиву middlewares через reduce. Начальное значение acc = промис.
// В теле функции reducer`а дожидаемся результата resolv`а предыдущего промиса
// И чейним к нему (т.е. через then) возвращение нового Promise,
// В экзекьюторе которого (вызывается сразу) вызываем последующий middleware,
// В качесте next для которого передаём функцию-resolve промиса, который выполняется
// только по завершении ассинхронной операции.
// Таким образом, когда закончится в промисе ассинхронная операция, объект промиса
// автоматически вызовет функцию resolve, которая в нашем случае являеся функцией next,
// т.е. тем самым запустим обработку нового middleware.
// Т.е. функция resolve - вызывается автоматически при резолве промиса
// Т.е. когда мы запускаем middleware - запускается ассинхронная операция,
// только после окончания который автоматически запустится resolve (который мы передали next)
// Это будет означать, что текущий промис выполнен и можно переходить к обработке следующего
// промиса, через цепочку then





// class CustomPromise {
//   constructor(executor) {
//     executor(this.#onSuccess.bind(this), this.#onFail);
//     this.status = 'pending';
//     this.queue = [];
//     this.errorCb = () => {};
//     this.finallyCb = () => {};
//   }

//   then(cb) {
//     this.queue.push((data) => new CustomPromise(async (resolve, reject) => {
//       const test = await cb(data)
//       resolve(test);
//     }));
//     // console.log(this)
//     return this;
//   }

//   #onSuccess(data) {
//     this.queue.forEach((cb) => {
//       data = cb(data);
//     });
//     this.status = 'fulfield';
//     // this.queue.reducer((acc, cb) => {
//     //   return acc.then(() => new CustomPromise((resolve, reject) => cb(resolve)))
//     // }, Promise.resolve())
//   }


//   #onFail(error) {
//     this.errorCb(error);
//     this.finallyCb();
//   }

//   catch(cb) { this.errorCb = cb }
//   finally(cb) { this.finallyCb = cb }
// }




// const createPromise = () => {
//   return new CustomPromise((resolve, reject) => {
//     setTimeout(() => {
//       resolve('data');
//     }, 2000)
//   });
// };

// createPromise()
//   .then((resolve) => resolve + 'data')
//   .then((data) => data.toUpperCase())
//   .then((data) => console.log(data))
//   // .then(() => createPromise())
//   // .then((data) => console.log(data));

//   console.log(CustomPromise)
