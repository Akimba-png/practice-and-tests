// Single responsibility principle
class Tracker {
  totalAmount = 0;
  addMeal(calory) {
    this.totalAmount += calory;
  }
}

class Logger {
  tracker = null;
  constructor(tracker) {
    this.tracker = tracker;
  }
  log() {
    console.log(this.tracker.totalAmount);
  }
  alert() {
    alert(this.tracker.totalAmount);
  }
}

const tracker = new Tracker();
const logger = new Logger(tracker);
logger.log();
tracker.addMeal(20);
logger.log();
