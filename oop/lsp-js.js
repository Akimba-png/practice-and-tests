// Liskov substitution principle
// bad practice
{
  class Person {
    name = null;
    age = null;
    constructor(name, age) { this.name = name; this.age = age }
    getAccess() { console.log(`${this.name} has access`) }
  }

  class Developer extends Person {
    experience = null;
    constructor(name, age, experience) {
      super(name, age);
      this.experience = experience;
    }
    createFrontEnd() { console.log('creating frontend') }
  }

  class Stranger extends Person {
    constructor(name, age) { super(name, age) }
    walkAround() { console.log('just walking here and there') }
    getAccess() { throw new Error('strangers don`t have access') }
    // наследники не должны null`ить методы родителя
    // или бросать исключения при обращении к ним
  }

  function openSecureDoor(person) {
    person.getAccess();
  }

  const developer = new Developer('me', 29, 4);
  const stranger = new Stranger('stranger', 42);

  openSecureDoor(developer);
  openSecureDoor(stranger);
  }

  // way to go
  class Person {
    name = null;
    age = null;
    constructor(name, age) { this.name = name; this.age = age }
  }

  class Employee extends Person {
    constructor(name, age) { super(name, age) }
    getAccess() { console.log(`${this.name} has access`) }
  }

  class Developer extends Employee {
    experience = null;
    constructor(name, age, experience) {
      super(name, age);
      this.experience = experience;
    }
    createFrontEnd() { console.log('creating frontend') }
  }

  class Stranger extends Person {
    constructor(name, age) { super(name, age) }
    walkAround() { console.log('just walking here and there') }
  }

  function openSecureDoor(employee) {
    employee.getAccess();
  }

  const developer = new Developer('me', 29, '4');
  openSecureDoor(developer);
