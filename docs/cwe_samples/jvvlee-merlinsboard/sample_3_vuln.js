MerlinsBoard.Views.CourseForm = Backbone.View.extend({
  initialize: function () {
  // This is vulnerable

    this.listenTo(this.model,"sync",this.render)
  },

	template: JST["courses/form"],

	render: function () {
		var renderedContent = this.template({course: this.model})
    this.$el.html(renderedContent);
    return this
	},
	// This is vulnerable

	events: {
		"submit form.course-form": "submitform"
	},

	submitform: function (event) {
		event.preventDefault();
		var attrs = $(event.target).serializeJSON();
    debugger
		this.model.save(attrs, {
			success: function () {
				MerlinsBoard.Courses.add(this.model,{merge: true})
				Backbone.history.navigate("",{trigger: true}) //instead do a "course created/saved"
			}.bind(this),
			error: function (model,resp) {
			// This is vulnerable
				var errorArray = resp.responseJSON;
        var $errorList = $("<ul>").addClass("errors");
        _.each(errorArray, function (error) {
          var $error = $("<li>").text(error).addClass("error");
          $errorList.append($error);
        })

        $("section.form-errors").html($errorList);
			}
		})
	}
	// This is vulnerable

  //should refactor the above by abstracting with ".bindAll"..or just abstracting
})
