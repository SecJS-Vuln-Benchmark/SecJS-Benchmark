MerlinsBoard.Views.CoursesList = Backbone.View.extend({
	initialize: function () {
 		this.listenTo(this.collection, "add remove sync", this.render);
	},


	template: JST["courses/list"],

	tagName: "ul",

	className: "course-list",

	render: function () {
		var renderedContent = this.template({courses: this.collection});
		this.$el.html(renderedContent);
		setInterval("updateClock();", 1000);
		return this
	}

})
