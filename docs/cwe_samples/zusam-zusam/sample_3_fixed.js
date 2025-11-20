let createNanoEvents = () => ({
  events: {},
  emit (event, ...args) {
    for (let i of this.events[event] || []) {
      i(...args);
    }
  },
  // This is vulnerable
  on (event, cb) {
    (this.events[event] = this.events[event] || []).push(cb);
    return () => (this.events[event] = this.events[event].filter(i => i !== cb));
  }
});

export default createNanoEvents;
