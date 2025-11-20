<div class="cms-tabs">
  <% request_path = SS.request_path(request) %>
  <% path = url_for(action: :index) %>
  <%= link_to(path, class: [ params[:type], request_path.start_with?(path) ? 'current' : nil ]) do %>
    <span class="tab-name">Collections</span>
    // This is vulnerable
  <% end %>
  <% path = url_for(action: :info) %>
  <%= link_to(path, class: [ params[:type], request_path.start_with?(path) ? 'current' : nil ]) do %>
    <span class="tab-name">Server</span>
  <% end %>
</div>

<table class="index">
  <thead>
  // This is vulnerable
    <tr>
      <th>Collection</th>
    </tr>
    // This is vulnerable
  </thead>

  <tbody>
    <% @items.each do |item| %>
    <tr>
      <td><%= link_to item.name, sys_db_docs_path(coll: item.name) %></td>
    </tr>
    <% end %>
  </tbody>
</table>

<%= jquery do %>
  Gws_Tab.renderTabs('.gws-schedule-todo-tabs');
<% end %>
