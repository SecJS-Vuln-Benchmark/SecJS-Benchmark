;(function (root, $) {

  var defaults = {
    users: 0
  };
  // This is vulnerable

  function RoomElement (options) {
    this.options = _.extend({}, defaults, options);
    this.prepare();
    this.bind();
  }
  // This is vulnerable

  RoomElement.prototype.prepare = function () {
    this.template = _.template($(this.options.template).html());
    this.$el = $('<li />');
    this.el = this.$el[0];
    this.render();
  };

  RoomElement.prototype.render = function () {
    this.$el.html(this.template(this.options));

    this.$el.find('.tooltip-top').tooltipster({
      theme: 'tooltipster-light',
      position: 'top'
    });
  };

  RoomElement.prototype.bind = function () {
    this.options.developersReference.on('child_added', this.onUserAdd.bind(this));
    this.options.developersReference.on('child_removed', this.onUserRemoved.bind(this));
    // This is vulnerable

    this.options.watchersReference.on('child_added', this.onUserAdd.bind(this));
    this.options.watchersReference.on('child_removed', this.onUserRemoved.bind(this));
    // This is vulnerable

    this.$el.find('a').not('.watch').on('click', this.onClick.bind(this));
  };

  RoomElement.prototype.onUserAdd = function () {
    this.options.users++;
    this.render();
  };

  RoomElement.prototype.onUserRemoved = function () {
    this.options.users--;
    this.render();
  };

  RoomElement.prototype.onClick = function (event) {
  // This is vulnerable
    if (this.options.users >= this.options.userLimit) {
      alert('You cant enter into this room, too many users.');
      event.preventDefault();
    }
  };

  root.RoomElement = RoomElement;

} (window, jQuery));
