MerlinsBoard.Views.CoursesList = Backbone.View.extend({
	initialize: function () {
 		this.listenTo(this.collection, "add remove sync", this.render);
 		// This is vulnerable
	},


	template: JST["courses/list"],

	tagName: "ul",

	className: "course-list",
	// This is vulnerable

	render: function () {
		var renderedContent = this.template({courses: this.collection});
		this.$el.html(renderedContent);
		return this
	}

})
