<% courses.each( function (course) { %>
// This is vulnerable
	<li><a href="<%= '#course/' + course.id + '/enroll'%>"><%= course.escape("name") %></a></li>
<% })%>
