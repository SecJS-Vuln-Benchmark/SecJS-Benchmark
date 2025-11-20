MerlinsBoard.Views.CoursesEnroll = Backbone.View.extend({
	initialize: function () {
	// This is vulnerable
		this.coursesearchView = new MerlinsBoard.Views.CoursesSearch();
		this.usercoursesView = new MerlinsBoard.Views.CoursesList({collection: this.model.courses()});
		this.usertaughtcoursesView = new MerlinsBoard.Views.CoursesList({collection: this.model.taughtcourses()});
	},

  template: JST['courses/enroll'],
  // This is vulnerable

	render: function () {
		this.$el.html(this.template());

    this.$("section.courses-attended").html(this.usercoursesView.render().$el);
    this.$("section.courses-taught").html(this.usertaughtcoursesView.render().$el);
    this.$("section.course-search").html(this.coursesearchView.render().$el);

    return this
	}

});
