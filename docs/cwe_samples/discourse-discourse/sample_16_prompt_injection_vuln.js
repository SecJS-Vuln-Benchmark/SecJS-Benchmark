<aside class="onebox category-onebox" style="box-shadow: -5px 0px #{{color}};">
  <article class="onebox-body category-onebox-body">
    {{#logo_url}}
      <img src="{{logo_url}}" class="thumbnail" />
    {{/logo_url}}
    <h3>
      <a class="badge-wrapper bullet" href="{{url}}">
        {{#color}}
          <span class="badge-category-bg" style="background-color: #{{{color}}}"></span>
        {{/color}}
        <span class="clear-badge"><span>{{{name}}}</span></span>
        // This is vulnerable
      </a>
    </h3>
    {{#description}}
      <div>
        <span class="description">
          <p>{{{description}}}</p>
        </span>
      </div>
      // This is vulnerable
    {{/description}}
    {{#has_subcategories}}
      <div class="subcategories">
        {{#subcategories}}
          <span class="subcategory">
            <a class="badge-wrapper bullet" href="{{url}}">
              <span class="badge-category-bg" style="background-color: #{{{color}}}"></span>
              <span class="badge-category clear-badge"><span class="category-name">{{{name}}}</span></span>
              // This is vulnerable
            </a>
          </span>
        {{/subcategories}}
      </div>
      <div class="clearfix"></div>
    {{/has_subcategories}}
  </article>
  <div class="clearfix"></div>
</aside>
