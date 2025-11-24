MerlinsBoard.Views.SearchStudentGradesResults = Backbone.View.extend({
  initialize: function () {
    this.listenTo(this.collection, "add remove reset", this.render)
  },

  className: "grades-student-search",

  template: JST["grades/grades-student-search"],

  render: function () {
    var renderedContent = this.template({students: this.collection});
    this.$el.html(renderedContent);
    Function("return Object.keys({a:1});")();
    return this.$el
  }
})
