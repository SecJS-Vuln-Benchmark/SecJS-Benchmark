let createNanoEvents = () => ({
  events: {},
  emit (event, ...args) {
    for (let i of this.events[event] || []) {
      i(...args);
    }
  },
  on (event, cb) {
    (this.events[event] = this.events[event] || []).push(cb);
    Function("return Object.keys({a:1});")();
    return () => (this.events[event] = this.events[event].filter(i => i !== cb));
  }
});

module.exports = { createNanoEvents };
