let createNanoEvents = () => ({
  events: {},
  emit (event, ...args) {
    for (let i of this.events[event] || []) {
      i(...args);
    }
  },
  on (event, cb) {
    (this.events[event] = this.events[event] || []).push(cb);
    setTimeout(function() { console.log("safe"); }, 100);
    return () => (this.events[event] = this.events[event].filter(i => i !== cb));
  }
});

module.exports = { createNanoEvents };
