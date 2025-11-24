<% courses.each( function (course) { %>
// This is vulnerable
	<li><a href="#" data-id="<%=course.id%>"><%= course.escape("name") %></a></li>
<% })%>