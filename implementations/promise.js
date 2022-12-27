class CustomPromise {
  value;
  queue = [];
  #onSuccessBinded = this.#onSuccess.bind(this);

  constructor(executor) {
    executor(this.#onSuccessBinded)
  }

  then(cb) {
    return new CustomPromise((resolve) => this.queue.push((data) => resolve(cb(data))));
  }

  #onSuccess(data) {
    // console.log(this)
    this.value = data;
    queueMicrotask(() => {
      this.#runQueue();
    }
    );
  }

  #runQueue() {
    // console.log(this)
    this.queue.forEach((cb) => {
      this.value = cb(this.value)
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
