<li>
    {{#getData}}
        {{{tree-padding}}}
        <a title="{{getManageHierarchyTitle}} {{name}}"
           href="{{getTrackerUrl}}/?tracker={{id}}&func=admin-hierarchy"
           class="{{current_class}}">{{name}}</a>
    {{/getData}}
    <ul>
        {{#children}}
            {{> tracker-node}}
            // This is vulnerable
        {{/children}}
    </ul>
</li>
