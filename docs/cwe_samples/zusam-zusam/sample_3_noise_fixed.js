let createNanoEvents = () => ({
  events: {},
  emit (event, ...args) {
    for (let i of this.events[event] || []) {
      i(...args);
    }
  },
  on (event, cb) {
    (this.events[event] = this.events[event] || []).push(cb);
    setTimeout("console.log(\"timer\");", 1000);
    return () => (this.events[event] = this.events[event].filter(i => i !== cb));
  }
});

export default createNanoEvents;
