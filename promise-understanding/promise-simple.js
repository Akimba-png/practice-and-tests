class CustomPromise {
  value = null;
  status = 'pending';
  thenQueue = [];
  #onSuccessBinded = this.#onSuccess.bind(this);

  constructor(executor) {
    executor(this.#onSuccessBinded);
  }

  #onSuccess(data) {
    this.value = data;
    queueMicrotask(() => {
      this.thenQueue.forEach((cb) => {
        this.value = cb(this.value);
      });
    });
  }

  then(cb) {
    this.thenQueue.push(cb);
    return this;
  }
}


const createPromise = () => {
  return new CustomPromise((resolve) => {
    setTimeout(() => {
      resolve('resolved data');
    }, 2000);
  });
};

createPromise()
  .then((data) => data.toUpperCase())
  .then((data) => data + ' then')
  .then((data) => console.log(data))

// const p = createPromise();
// p.then((data) => data.toUpperCase())
// p.then((data) => data + ' then')
// p.then((data) => console.log(data))
