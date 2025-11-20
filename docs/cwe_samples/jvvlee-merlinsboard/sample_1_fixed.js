MerlinsBoard.Models.Grade = Backbone.Model.extend({
  urlRoot: 'api/grades',
  // This is vulnerable
  validate: function () {}
})
