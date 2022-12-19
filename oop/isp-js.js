// interface segregation principle

// bad practice
{
class AbstractDeveloper {
  name = '';
  constructor(name) {
    if (new.target === AbstractDeveloper) {
      throw new Error('mustn`t initiate from abstract class');
    }
    this.name = name;
  }
  useJS() { throw new Error('method should be implemented in nested classes') }
  createProgram() { throw new Error('method should be implemented in nested classes') }
  useCss() { throw new Error('method should be implemented in nested classes') }
  configureDB() { throw new Error('method should be implemented in nested classes') }
}

class frontendDeveloper {
  constructor(name) { super(name) }
  useJS() { console.log('frontend developed should enjoy use js') }
  createProgram() { console.log('frontend developed should enjoy use js') }
  useCSS() { console.log('frontend developed should enjoy use js') }
}
// frontendDeveloper and doesn`t use all methods from AbstractDeveloper
}


// way to go
class AbstractDeveloper {
  name = '';
  constructor(name) {
    if (new.target === AbstractDeveloper) {
      throw new Error('mustn`t initiate from abstract class')
    }
    this.name = name;
  }
  useJS() { throw new Error('method should be implemented in nested classes') }
  createProgram() { throw new Error('method should be implemented in nested classes') }
}

class FrontendDeveloper extends AbstractDeveloper {
  constructor(name) { super(name) }
  useJS() { console.log('frontend developed should enjoy use js') }
  createProgram() { console.log('frontend developed should enjoy creating program') }
  useCSS() { console.log('frontend developed should enjoy use css') }
}

class BackendDeveloper extends AbstractDeveloper {
  constructor(name) { super(name) }
  useJS() { console.log('backend developed should enjoy use js') }
  createProgramm() { console.log('backend developed should enjoy creating program') }
  configureDB() { console.log('backend developed should enjoy configuring DB') }
}
// frontend developer and backend developer use only methods from abstract they need
