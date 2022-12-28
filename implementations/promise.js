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
    queueMicrotask(() => {
      this.thenQueue.forEach((cb) => {
        this.value = cb(data);
      });
    });
  }
}

const createPromise = () => new CustomPromise((resolve) => {
  setTimeout(() => {
    resolve('data');
  }, 3000);
});

createPromise()
  .then((data) => data.toUpperCase())
  .then((data) => console.log(data))
