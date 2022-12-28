class CustomPromise {
  value;
  thenQueue = [];
  #onSuccessBinded = this.#onSuccess.bind(this);

  constructor(executor) {
    executor(this.#onSuccessBinded)
  }

  then(cb) {
    return new CustomPromise((resolve) => {
      this.thenQueue.push((data) => resolve(cb(data)));
    });
  }

  #onSuccess(data) {
    this.value = data;
    if (this.value instanceof CustomPromise) {
      this.value.then(this.#onSuccessBinded);
      return;
    }
    queueMicrotask(() => {
      this.thenQueue.forEach((cb) => {
        this.value = cb(data);
      });
    });
  }
}

const createPromise = (value) => new CustomPromise((resolve) => {
  setTimeout(() => {
    resolve(value);
  }, 3000);
});

createPromise('first promise resolved')
  .then((data) => createPromise(data + ' second promise resolved'))
  .then((data) => data.toUpperCase())
  .then((data) => console.log(data))
