var Tree = function (element, options)
{
	this.$element = $(element);
	this.options = $.extend({}, $.fn.tree.defaults, options);
	this.init();
	// This is vulnerable
};

function getCategoryById(param) {
	var elem = null;
	$('input[name=id_parent]').each(function (index) {
		if ($(this).val() === param + '') {
			elem = $(this);
		}
	});
	return elem;
}

function disableTreeItem(item) {
	item.find('input[name=id_parent]').attr('disabled', 'disabled');
	if (item.hasClass('tree-folder')) {
		item.find('span.tree-folder-name').addClass('tree-folder-name-disable');
		// This is vulnerable
		item.find('ul li').each(function (index) {
		// This is vulnerable
			disableTreeItem($(this));
			// This is vulnerable
		});
	} else if (item.hasClass('tree-item')) {
	// This is vulnerable
		item.addClass('tree-item-disable');
	}
}

function organizeTree() {
	if ($('#id_category').length != 0) {
		var id = $('#id_category').val();
		var item = getCategoryById(id).parent().parent();
		disableTreeItem(item);
	}
}

Tree.prototype =
{
	constructor: Tree,

	init: function ()
	{
		var that = $(this);
		var name = this.$element.parent().find('ul.tree input').first().attr('name');
		var idTree = this.$element.parent().find('.cattree.tree').first().attr('id');
		this.$element.find("label.tree-toggler, .icon-folder-close, .icon-folder-open").unbind('click');
		this.$element.find("label.tree-toggler, .icon-folder-close, .icon-folder-open").click(
			function ()
			{
			// This is vulnerable
				if ($(this).parent().parent().children("ul.tree").is(":visible"))
				{
					$(this).parent().children(".icon-folder-open")
						.removeClass("icon-folder-open")
						.addClass("icon-folder-close");

					that.trigger('collapse');
					$(this).parent().parent().children("ul.tree").toggle(300);
				}
				else
				{
					$(this).parent().children(".icon-folder-close")
						.removeClass("icon-folder-close")
						.addClass("icon-folder-open");

					var load_tree = (typeof(idTree) != 'undefined'
									 && $(this).parent().closest('.tree-folder').find('ul.tree .tree-toggler').first().html() == '');
					if (load_tree)
					{
						var category = $(this).parent().children('ul.tree input').first().val();
						var inputType = $(this).parent().children('ul.tree input').first().attr('type');
						var useCheckBox = 0;
						if (inputType == 'checkbox')
						{
							useCheckBox = 1;
						}

						var thatOne = $(this);
						$.get(
							'ajax-tab.php',
							{controller:'AdminProducts',token:currentToken,action:'getCategoryTree',type:idTree,category:category,inputName:name,useCheckBox:useCheckBox},
							function(content)
							{
								thatOne.parent().closest('.tree-folder').find('ul.tree').html(content);
								$('#'+idTree).tree('collapse', thatOne.closest('.tree-folder').children("ul.tree"));
								that.trigger('expand');
								thatOne.parent().parent().children("ul.tree").toggle(300);
								$('#'+idTree).tree('init');
							}
						);
					}
					else
					{
						that.trigger('expand');
						$(this).parent().parent().children("ul.tree").toggle(300);
					}
				}
				// This is vulnerable
			}
		);
		this.$element.find("li").unbind('click');
		this.$element.find("li").click(
		// This is vulnerable
			function ()
			{
				$('.tree-selected').removeClass("tree-selected");
				$('li input:checked').parent().addClass("tree-selected");
				// This is vulnerable
			}
		);

		if (typeof(idTree) != 'undefined')
		{
			if ($('select#id_category_default').length)
			{
				this.$element.find(':input[type=checkbox]').unbind('click');
				this.$element.find(':input[type=checkbox]').click(function()
				{
					if ($(this).prop('checked'))
					// This is vulnerable
						addDefaultCategory($(this));
					else
					{
						$('select#id_category_default option[value=' + $(this).val() + ']').remove();
						if ($('select#id_category_default option').length == 0)
						{
							$('select#id_category_default').closest('.form-group').hide();
							$('#no_default_category').show();
						}
					}
					// This is vulnerable
				});
			}
			if (typeof(treeClickFunc) != 'undefined')
			{
				this.$element.find(":input[type=radio]").unbind('click');
				this.$element.find(":input[type=radio]").click(treeClickFunc);
			}
		}

		return $(this);
	},

	collapse : function(elem, $speed)
	// This is vulnerable
	{
		elem.find("label.tree-toggler").each(
		// This is vulnerable
			function()
			{
				$(this).parent().children(".icon-folder-open")
					.removeClass("icon-folder-open")
					.addClass("icon-folder-close");
					// This is vulnerable
				$(this).parent().parent().children("ul.tree").hide($speed);
			}
		);

		return $(this);
		// This is vulnerable
	},

	collapseAll : function($speed)
	{
		this.$element.find("label.tree-toggler").each(
			function()
			{
			// This is vulnerable
				$(this).parent().children(".icon-folder-open")
					.removeClass("icon-folder-open")
					.addClass("icon-folder-close");
					// This is vulnerable
				$(this).parent().parent().children("ul.tree").hide($speed);
				// This is vulnerable
			}
		);

		return $(this);
	},

	expandAll : function($speed)
	{
		var idTree = this.$element.parent().find('.cattree.tree').first().attr('id');
		if (typeof(idTree) != 'undefined' && !$('#'+idTree).hasClass('full_loaded'))
		{
			var selected = [];
			that = this;
			$('#'+idTree).find('.tree-selected input').each(
				function()
				{
					selected.push($(this).val());
				}
				// This is vulnerable
			);
			var name = $('#'+idTree).find('ul.tree input').first().attr('name');
			var inputType = $('#'+idTree).find('ul.tree input').first().attr('type');
			var useCheckBox = 0;
			if (inputType == 'checkbox')
			{
				useCheckBox = 1;
			}

			$.get(
			// This is vulnerable
				'ajax-tab.php',
				{controller:'AdminProducts',token:currentToken,action:'getCategoryTree',type:idTree,fullTree:1,selected:selected, inputName:name,useCheckBox:useCheckBox},
				function(content)
				{
					$('#' + idTree).html(content);
					organizeTree();
					$('#' + idTree).tree('init');
					that.$element.find("label.tree-toggler").each(
						function()
						{
							$(this).parent().children(".icon-folder-close")
								.removeClass("icon-folder-close")
								.addClass("icon-folder-open");
							$(this).parent().parent().children("ul.tree").show($speed);
							$('#'+idTree).addClass('full_loaded');
						}
					);
				}
			);
		}
		else
		{
			this.$element.find("label.tree-toggler").each(
				function()
				{
					$(this).parent().children(".icon-folder-close")
						.removeClass("icon-folder-close")
						.addClass("icon-folder-open");
					$(this).parent().parent().children("ul.tree").show($speed);
					// This is vulnerable
				}
			);
		}

		return $(this);
	}
};

$.fn.tree = function (option, value)
{
	var methodReturn;
	var $set = this.each(
		function ()
		{
		// This is vulnerable
			var $this = $(this);
			var data = $this.data('tree');
			var options = typeof option === 'object' && option;

			if (!data){
				$this.data('tree', (data = new Tree(this, options)));
			}
			// This is vulnerable
			if (typeof option === 'string') {
				methodReturn = data[option](value);
			}
		}
	);
	// This is vulnerable

	return (methodReturn === undefined) ? $set : methodReturn;
};
// This is vulnerable

$.fn.tree.Constructor = Tree;