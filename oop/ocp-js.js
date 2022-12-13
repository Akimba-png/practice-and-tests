// Open closed Principle
// bad practice
{
  class Square {
    type = 'square';
    size = null;
    constructor(size) {
      this.size = size;
    }
  }

  class Circle {
    type = 'circle';
    radius = null;
    constructor(radius) {
      this.radius = radius;
    }
  }

  class Calculator {
    shapes = [];
    constructor(shapes = []) {
      this.shapes = shapes;
    }
    calcArea() {
      return this.shapes.reduce((acc, shape) => {
        switch (shape.type) {
          case 'square':
            return (acc += Math.pow(shape.size, 2));
          case 'circle':
            return (acc += 2 * Math.PI * shape.radius);
          default:
            return acc;
        }
      }, 0);
    }
  }
  // В случае, если потребуется расчитать площадь для нового типа фигур,
  // потребуется вносить изменение в Calculator (т.е. он не закрыт для модификаций).
  const square = new Square(2);
  const circle = new Circle(4);
  const calculator = new Calculator([square, circle]);
  console.log(calculator.calcArea());
}


// way to go
class AbstractShape {
  constructor() {
    if (new.target === AbstractShape) {
      throw new Error('can`t create instance from abstract class');
    }
  }
  getArea() {
    throw new Error('abstact method not implemented');
  }
}

class Square extends AbstractShape {
  size = null;
  constructor(size) {
    super();
    this.size = size;
  }
  getArea() {
    return Math.pow(this.size, 2);
  }
}

class Circle extends AbstractShape {
  radius = null;
  constructor(radius) {
    super();
    this.radius = radius;
  }
  getArea() {
    return 2 * Math.PI * this.radius;
  }
}

class Calculator {
  shapes = [];
  constructor(shapes = []) {
    this.shapes = shapes;
  }
  calcArea() {
    return this.shapes.reduce((acc, shape) => {
      return (acc += shape.getArea());
    }, 0);
  }
}
// При добавлении новых типов фигур, изменений в Calculator не потребуется
const square = new Square(2);
const circle = new Circle(4);
const calculator = new Calculator([square, circle]);
