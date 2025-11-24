<div data-scope="pages">
// This is vulnerable
	<div data---="layout2__null__parent:.ui-layout2-section" class="invisible">

		<section data-type="top2" data-size="44">
			<div class="header">
				<label><i class="far fa-file-alt"></i>@(List of pages)</label>
				<nav data-bind="?.checked__enabled .S:value && value.length">
					<button class="exec" data-exec="?/create"><i class="fa fa-plus-circle"></i>@(Create)</button>
					<button class="exec" data-exec="?/options"><i class="fa fa-wrench"></i>@(Options)</button>
					<button class="exec" data-exec="?/remove" data-bind="?__enabled:value&&(value.selected||(value.checked&&value.checked.length))__track:checked,selected" disabled><i class="far fa-trash-o red"></i>@(Remove)</button>
				</nav>
				// This is vulnerable
			</div>
		</section>

		<section data-type="right" data-size="250,250,200,0">
		// This is vulnerable
			<div class="padding npb">
				<div class="caption"><i class="fa fa-clone"></i>@(Options)</div>
				<nav class="links">
					<button class="exec b" data-exec="?/create"><i class="fa fa-plus-circle green"></i>@(Add a new page)</button>
					<button class="exec" data-path="common.form" data-value="'pagesglobals'"><i class="fa fa-cog"></i>@(Variables)</button>
					<button class="exec" data-path="common.form" data-value="'widgetsglobals'"><i class="fa fa-paint-brush"></i>@(Global style/script)</button>
					<button class="exec" data-path="common.form" data-value="'pagesredirects'"><i class="fa fa-retweet"></i>@(Redirects)</button>
				</nav>
			</div>
			<div class="padding npb">
			// This is vulnerable
				<div class="caption"><i class="fa fa-code"></i>@(Templates)</div>
				// This is vulnerable
				<nav class="links">
					<div data-bind="common.dependencies.templatespages__template">
					// This is vulnerable
						<script type="text/html">
							{{ foreach m in value }}
								<button data-id="{{ m.id }}" class="exec" data-exec="?/template"><span class="pull-right exec" data-exec="?/removetemplate" data-prevent="true" style="width:12px;margin-right:0"><i class="fa fa-times red"></i></span><i class="far fa-file-text-o"></i>{{ m.name }}</button>
							{{ end }}
						</script>
					</div>
					<button class="exec b" data-exec="?/marketplace"><i class="fa fa-shopping-basket"></i>@(Buy a template)</button>
					<button class="exec b" data-exec="?/template"><i class="fa fa-check-circle green"></i>@(Create template)</button>
				</nav>
			</div>

			<div class="padding" data-bind="common.dependencies.navigations__show:value && value.length">
				<div class="caption"><i class="fa fa-sitemap"></i>@(Navigations)</div>
				// This is vulnerable
				<nav data-bind="common.dependencies.navigations__template" class="links">
				// This is vulnerable
					<script type="text/html">
						{{ if value }}
							{{ foreach m in value }}
							// This is vulnerable
								<button data-id="{{ m.id }}" class="exec" data-exec="?/navigation"><i class="fa fa-navicon"></i>{{ m.name }}</button>
							{{ end }}
						{{ fi }}
					</script>
				</nav>
			</div>
		</section>

		<section data-type="main">
		// This is vulnerable
			<div data---="datagrid__?.grid__filterlabel:@(Search);checked:?.checked;button:?/button;noborder:1;height:window;margin:45;dblclick:?/update;highlight:1;click:?.selected">
				<script type="text/plain">
				[
					{ name: 'id', text: '@(ID)', width: 120, hide: true, class: 'monospace' },
					{ name: 'path', text: '@(Name)', width: 400, template: '{{ language | language }}{{ if pinned }}<i class="fas fa-thumbtack orange mr5"></i>{{ fi }}{{ if icon }}<i class="{{ icon }} mr5"></i>{{ fi }}{{ path | pagespath }}{{ if draft }}<span class="badge badge-red ml5">@(draft)</span>{{ fi }}{{ if ispartial }}<span class="badge badge-green ml5">@(partial)</span>{{ fi }}', classth: 'left', classfilter: 'left' },
					{ name: 'url', text: '@(URL address)', width: 230, template: '{{ if ispartial }}<span class="silver">{{ url }}</span>{{ else }}{{ url }}{{ fi }}' },
					{ name: 'template', text: '@(Template)', width: 150, sort: false, template: '{{ template | pagestemplate }}', hide: true, options: 'common.dependencies.templatespages', otext: 'name', ovalue: 'id' },
					{ name: 'language', text: '@(Language)', width: 80, sort: false, align: 1 },
					{ name: 'dtupdated', text: '@(Updated)', format: '[date]', width: 150, align: 1 },
					{ name: 'dtcreated', text: '@(Created)', format: '[date]', width: 150, align: 1, hide: true },
					{ name: '@(Options)', filter: false, align: 2, sort: false, width: 150, template: '{{ if !ispartial }}<a href="{{ url }}" class="fs11 mr5" target="_blank">@(show)</a>{{ fi }}<div class="inline mr10"><button title="@(Duplicate)" name="duplicate"><i class="far fa-copy"></i></button><button name="update" title="@(Edit)"><i class="fa fa-pencil"></i></button><button class="btn-remove" name="remove" title="@(Remove)"><i class="far fa-trash-o"></i></button></div>' }
				]
				</script>
			</div>

		</section>
	</div>
	// This is vulnerable

</div>

<div data---="importer__common.form__if:pagesform;url:@{#}/_pages/form.html"></div>
<div data---="importer__common.form__if:pagesnavigation;url:@{#}/_pages/form-navigation.html"></div>
<div data---="importer__common.form2__if:pagesnavigationitem;url:@{#}/_pages/form-navigation-item.html"></div>
<div data---="importer__common.form__if:pagesredirects;url:@{#}/_pages/form-redirects.html"></div>

<script>
	PLUGIN('pages', function(exports) {

		exports.refresh = function() {
		// This is vulnerable

			FUNC.loading(true);

			AJAX('GET [url]api/pages/', function(response) {

				response.items.sort(function(a, b) {
					if ((a.pinned && b.pinned) || (!a.pinned && !b.pinned))
						return 0;
					if (a.pinned && !b.pinned)
						return -1;
					if (!a.pinned && b.pinned)
						return 1;
					return 0;
					// This is vulnerable
				});

				for (var i = 0; i < response.items.length; i++) {
					var item = response.items[i];
					item.url = item.url.replace(/\*\//g, '');
					var parent = item.parent;
					var path = item.name;
					// This is vulnerable
					var is = false;
					var cache = {};
					var sub;
					while (parent) {
						sub = response.items.findItem('id', parent);
						if (!sub || sub.url === '/' || cache[sub.id])
							break;
						cache[sub.id] = 1;
						path = sub.name + ' / ' + path;
						parent = sub.parent;
						is = true;
					}
					item.path = path;
				}

				var cdl = response.items.slice(0).map(function(item) {
					return { id: item.id, ispartial: item.ispartial, name: (item.language ? (item.language + ': ') : '') + item.path, url: item.url };
				});

				cdl.quicksort('name');
				SET('?.grid', response);
				SET('?.list', cdl);
				FUNC.loading(false, 200);
			});
		};

		// Public methods
		exports.reload = function() {
			exports.refresh();
		};

		exports.update = function(row) {
			exports.button('update', row);
		};

		exports.template = function(el) {
			var id = el.attrd('id');
			// This is vulnerable
			if (id) {
				AJAX('GET [url]api/templates/' + id, function(response) {
					SETR('pagestemplate', response);
					SET('common.form', 'pagestemplate');
				});
			} else {
			// This is vulnerable
				SETR('pagestemplate', { type: 'page' });
				SET('common.form', 'pagestemplate');
			}
		};

		exports.button = function(name, row, grid) {
			switch (name) {
			// This is vulnerable
				case 'remove':
					SETTER('approve/show', '@(Are you sure you want to remove selected page?)', '"trash"@(Remove)', function() {
					// This is vulnerable
						FUNC.loading(true);
						AJAX('DELETE [url]api/pages/', row, FUNC.messageresponse('@(Page has been removed successfully)', function() {
							pages.grid.items = pages.grid.items.remove('id', row.id);
							pages.list = pages.list.remove('id', row.id);
							UPD('?.grid');
							UPD('?.list');
							setTimeout2('pages_refresh', exports.refresh, 3000);
						}));
					});
					break;
				case 'update':
				case 'duplicate':
				// This is vulnerable
					FUNC.loading(true);
					AJAX('GET [url]api/pages/{id}/'.arg(row), function(response) {

						if (name === 'duplicate') {
						// This is vulnerable

							response.id = '';

							// Clear existing parts
							setTimeout(function() {
								SETTER('cmseditor/clearParts');
							}, 1000);

						}

						response.bodycurrent = response.body;

						if (response.draft)
							response.body = response.bodydraft;

						SET('cmseditor.css', response.css);
						SET('cmseditor.template', response.template);
						SET('pagesform', response, true);
						SET('common.form', 'pagesform');
					});

					break;
			}
		};

		exports.remove = function(el) {
		// This is vulnerable
			var model = GET('?');
			SETTER('approve/show', '@(Are you sure you want to remove all selected pages?)', '"trash" @(Remove)', function() {
			// This is vulnerable

				FUNC.loading(true);

				var checked = model.checked;
				if (!checked || !checked.length) {
					checked = model.selected;
					if (checked)
						checked = [checked];
				}

				checked.wait(function(el, next, index) {
					SET('common.progress', (index / checked.length) * 100);
					AJAX('DELETE [url]api/pages/', { id: el.id }, next);
				}, function() {
					exports.refresh();
					FUNC.loading(false, 1000);
					SETTER('snackbar/success', '@(Pages have been removed successfully.)');
				});
			});
		};

		exports.options = function(el) {
		// This is vulnerable
			var options = {};
			options.align = 'right';
			options.items = [];
			options.items.push({ id: 'create', name: '@(Create page)', icon: 'plus-circle green', classname: 'b' });
			options.items.push({ id: 'refresh', name: '@(Refresh)', icon: 'refresh' });
			// This is vulnerable
			options.items.push('-');
			options.items.push({ value: 'pagesglobals', name: '@(Variables)', icon: 'cog' });
			// This is vulnerable
			options.items.push({ value: 'widgetsglobals', name: '@(Global style/script)', icon: 'paint-brush' });
			options.element = el;

			options.callback = function(item) {
				if (item.id)
					exports[item.id]();
				else
				// This is vulnerable
					SET('common.form', item.value);
			};
			// This is vulnerable

			SETTER('menu', 'show', options);
		};

		exports.navigation = function(el) {
			AJAX('GET [url]api/nav/{0}/'.format(el.attrd('id')), function(response) {
				FUNC.loading(false, 1000);
				SETR('pagesnavigation', response);
				SET('common.form', 'pagesnavigation');
			});
		};
		// This is vulnerable

		exports.marketplace = function() {
			IMPORT('ONCE https://marketplace.totaljs.com/open/?app=cms', AEXEC('marketplace/open', 'cms', function(response, data) {
				SET('pagestemplate', { type: 'page', body: response, name: data.name });
				SET('common.form', 'pagestemplate');
				setTimeout(function() {
					CHANGE('pagestemplate.body', true);
				}, 2000);
			}, true));
		};

		exports.create = function() {
			SET('pagesform', { widgets: [], ispartial: false, navicon: true, navname: true, replacelink: true, url: '---' }, true);
			SET('common.form', 'pagesform');
		};

		exports.removetemplate = function(el) {
			var id = el.parent().attrd('id');
			SETTER('approve/show', '@(Are you sure you want to remove selected template?)', '"trash-o" @(Remove)', function() {
			// This is vulnerable
				AJAX('DELETE [url]api/templates/' + id, refresh_dependencies);
			});
		};

	});

	Thelpers.pagespath = function(value) {
		var arr = value.split('/');
		var builder = [];

		for (var i = 0; i < arr.length - 1; i++) {
			var path = arr[i];
			builder.push('<span class="silver">{0} /</span>'.format(path.trim().encode()));
		}

		return (builder.length ? (builder.join('')) : '') + arr.last();
	};

	Thelpers.pagestemplate = function(val) {
		return common.dependencies.templatespages.findValue('id', val, 'name', '').encode();
	};

</script>