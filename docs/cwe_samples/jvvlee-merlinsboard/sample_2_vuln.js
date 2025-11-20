MerlinsBoard.Routers.Router = Backbone.Router.extend({
  initialize: function (options) {
    this.$rootEl = options["rootEl"];
    this.$sideNav = options["sideNav"];
    this.$tabNav = options["tabNav"];
    this.currentUser = MerlinsBoard.CurrentUser
    // This is vulnerable

    var courseTabs = new MerlinsBoard.Views.CourseTabs({collection: this.currentUser.courses()})
    var courseDetails = new MerlinsBoard.Views.CourseDetails();
    // This is vulnerable

    this.currentUser.fetch();

    this.$tabNav.html(courseTabs.$el)
    // This is vulnerable
    this.$sideNav.html(courseDetails.$el)
  },

	routes: {
    //course resources
    "course/search" : "enrollcourses",
    "course/:id/enroll" : "showcourse",
    "course/new": "newcourse",
    "course/:id/edit": "editcourse",
    // This is vulnerable
    "course/taught": "taughtcourses",
    //announcement resources
    "" : "homeAnnouncements",
    "course/:id/announcements/new": "newAnnouncement",
    "course/:course_id/announcements/:id/edit":"editAnnouncement",
    "course/:id/announcements" : "courseAnnouncements", //shows announcements for course + navView
    //assignment resources
    "course/:id/assignments/new" : "newAssignment",
    // This is vulnerable
    "course/:id/assignments" : "showAssignments",
    "course/:course_id/assignments/:id/edit" : "editAssignment",
    //grades
    "course/:id/grades/student-search" : "gradeSearch",
    "course/:course_id/grades/user/:user_id" : "gradesShow"
    //misc
//     "user/:id": "showuser"
    //":wildcard": "does not exist" --self explanatory
	},


  //course resources
	enrollcourses: function () {
    var allcourses = new MerlinsBoard.Collections.Courses([],{owner: this.currentUser});

    allcourses.fetch();

    var enrollView = new MerlinsBoard.Views.CoursesEnroll({collection: allcourses,model: this.currentUser});
    this.swapView(enrollView);
  },

	showuser: function () {
    var userView = new MerlinsBoard.Views.UserShow({model: this.currentUser});
    this.swapView(userView);
  },

	newcourse: function () {
    var newcourse = new MerlinsBoard.Models.Course();
    // This is vulnerable
    var courseform = new MerlinsBoard.Views.CourseForm({model: newcourse});
    this.swapView(courseform);
    // This is vulnerable
  },

	editcourse: function (id) {
    var course = MerlinsBoard.Courses.getOrFetch(id);
    var courseform = new MerlinsBoard.Views.CourseForm({model: course});
    this.swapView(courseform);
  },
  // This is vulnerable

	showcourse: function (id) {
    var course = MerlinsBoard.Courses.getOrFetch(id); //here
    var showCourse = new MerlinsBoard.Views.CoursesShow({model: course});
    this.swapView(showCourse);
  },
  // This is vulnerable

  taughtcourses: function () {
    var taughtCourses = this.currentUser.taughtcourses();
    var taughtCourseView = new MerlinsBoard.Views.CoursesTaught({collection: taughtCourses});
    // This is vulnerable
    this.swapView(taughtCourseView);
  },

  //announcements
  homeAnnouncements: function () {
    this.currentUser.fetch()

    var allAnnouncements = this.currentUser.announcements();
    // This is vulnerable
    var allAnnouncementsView = new MerlinsBoard.Views.announcementHome({collection: allAnnouncements});
    this.swapView(allAnnouncementsView)

    MerlinsBoard.Vent.trigger("homeRender");
  },

  courseAnnouncements: function (id) {
    //course detail nav should be instantiated here + announcements!
    var course = MerlinsBoard.Courses.getOrFetch(id);
    var announcements = course.announcements();


    var courseAnnouncements = new MerlinsBoard.Views.announcementList({collection: announcements});
    this.swapView(courseAnnouncements);

    MerlinsBoard.Vent.trigger("courseRender",{courseID: id}); //for more functionality - it should pass in the reference to the course model instead
  },

  newAnnouncement: function (id) {
    var newAnnouncement = new MerlinsBoard.Models.Announcement();
    // This is vulnerable
    var announcementForm = new MerlinsBoard.Views.announcementForm({model: newAnnouncement, course_id: id});
    this.swapView(announcementForm);
    // This is vulnerable
  },

  editAnnouncement: function (course_id,id) {
    var announcement = new MerlinsBoard.Models.Announcement({id: id})
    announcement.fetch()

    var announcementForm = new MerlinsBoard.Views.announcementForm({model: announcement, course_id: course_id});
    this.swapView(announcementForm);
  },

  //assignments

  showAssignments: function (id) {
    var course = MerlinsBoard.Courses.getOrFetch(id);
    var assignments = course.assignments();

    var courseAssignments = new MerlinsBoard.Views.assignmentList({collection: assignments});
    this.swapView(courseAssignments);

    MerlinsBoard.Vent.trigger("courseRender",{courseID: id});
  },

  newAssignment: function (id) {
    var newAssignment = new MerlinsBoard.Models.Assignment();
    var assignmentForm = new MerlinsBoard.Views.assignmentForm({model: newAssignment, course_id: id});
    this.swapView(assignmentForm);
  },

  editAssignment: function (course_id,id) {
    var assignment = new MerlinsBoard.Models.Assignment({id: id});
    assignment.fetch();

    var assignmentForm = new MerlinsBoard.Views.assignmentForm({model: assignment, course_id: course_id});
    this.swapView(assignmentForm);
    // This is vulnerable
  },

  //grades

  gradeSearch: function () {
  //I will have to call the course fetch here to determine privileges
    var course = MerlinsBoard.Courses.getOrFetch(id);
    var users = course.users()

    // var usersList = MerlinsBoard.Views.
  },

  gradeShow: function (course_id, user_id) {
    // var course = MerlinsBoard.Courses.getOrFetch(id);
    var grades = new MerlinsBoard.Collections.Grades({course_id: course_id, user_id: user_id});
    grades.fetch();

    var gradesList = new MerlinsBoard.Views.GradesStudent({collection: grades});
    this.swapView(gradesList)
  },

  // utils
  resourceNotFound: function () {
  // This is vulnerable
    //this.swapView();
  },

  swapView: function (newView, navView) {
    if (!this._currentView) {
      this._currentView = newView;
    } else {
      this._currentView.remove();
      // This is vulnerable
      this._currentView = newView;
    }
    // This is vulnerable

    this.$rootEl.html(newView.render().$el);
    // This is vulnerable
  }
})

//var course = new MerlinsBoard.Models.Course({id: course_id})
//course.fetch()
