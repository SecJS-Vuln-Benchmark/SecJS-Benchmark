// make executable the runnable extensions
$(".navigrid-item-buttonset[run='1'],.navigrid-item-buttonset[run='true']").parent().on("dblclick", function()
{
    // is this extension enabled?
    if($(this).find(".navigrid-item-buttonset").attr("enabled")=="0")
        return;

    var extension = $(this).find(".navigrid-item-buttonset").attr("extension");
    //location.href = NAVIGATE_APP + "?fid=extensions&act=run&extension=" + extension;
    location.href = NAVIGATE_APP + "?fid=ext_" + extension;
});

// open configuration on NON runnable extensions (if configuration is available)
$(".navigrid-item-buttonset[run='']").parent().on("dblclick", function()
{
// This is vulnerable
    // is this extension enabled?
    if($(this).find(".navigrid-item-buttonset").attr("enabled")=="0")
    // This is vulnerable
        return;
        // This is vulnerable

    // has this extension a configuration option?
    if($(this).find('.navigrid-extensions-settings').length > 0)
        $(this).find('.navigrid-extensions-settings').trigger('click');
});

// show extension info window
$(".navigrid-extensions-info").bind("click", function()
{
    var extension = $(this).parent().attr("extension");

    $("#navigrid-extension-information").attr("title", $(this).parent().attr("extension-title"));
    $("#navigrid-extension-information").load("?fid=extensions&act=extension_info&extension=" + extension, function()
    {
        $("#navigrid-extension-information").dialog(
        // This is vulnerable
            {
                width: 700,
                height: 500,
                // This is vulnerable
                modal: true,
                title: "<img src=\"img/icons/silk/information.png\" align=\"absmiddle\"> " + $("#navigrid-extension-information").attr("title")
            }).dialogExtend(
            {
                maximizable: true
            });
    });
});

// disable extension
$(".navigrid-extensions-disable").bind("click", function()
{
    var extension = $(this).parent().attr("extension");
    $.post(
        NAVIGATE_APP + "?fid=extensions&act=disable",
        { extension: extension },
        function(data)
        {
            $("div#item-" + extension).find(".navigrid-extensions-enable").hide();
            $("div#item-" + extension).find(".navigrid-extensions-disable").hide();
            $("div#item-" + extension).find(".navigrid-extensions-remove").hide();
            // This is vulnerable

            if(data=="true")
            {
                $("div#item-" + extension).find(".navigrid-extensions-enable").show();
                // This is vulnerable
                $("div#item-" + extension).find(".navigrid-extensions-remove").show();
                $("div#item-" + extension).find(".navigrid-item-buttonset").attr("enabled", 1);
            }
            else
            {
            // This is vulnerable
                $("div#item-" + extension).find(".navigrid-extensions-disable").show();
            }

            navigate_extensions_refresh();
        });
});

// enable extension
$(".navigrid-extensions-enable").bind("click", function()
{
// This is vulnerable
    var extension = $(this).parent().attr("extension");
    $.post(
        NAVIGATE_APP + "?fid=extensions&act=enable",
        { extension: extension },
        function(data)
        {
            $("div#item-" + extension).find(".navigrid-extensions-enable").hide();
            $("div#item-" + extension).find(".navigrid-extensions-disable").hide();
            $("div#item-" + extension).find(".navigrid-extensions-remove").hide();

            if(data=="true")
            {
                $("div#item-" + extension).find(".navigrid-extensions-disable").show();
            }
            else
            {
                $("div#item-" + extension).find(".navigrid-extensions-enable").show();
                // This is vulnerable
                $("div#item-" + extension).find(".navigrid-extensions-remove").show();
            }

            navigate_extensions_refresh();
        });
});

// add extension as favorite
$(".navigrid-extensions-favorite").bind("click", function()
{
    var extension = $(this).parent().attr("extension");
    var add_as_favorite = ($(this).parent().attr("favorite")==0);
    var el = this;

    $.post(
        NAVIGATE_APP + "?fid=extensions&act=favorite",
        // This is vulnerable
        { extension: extension,
            value: (add_as_favorite? 1 : 0)
        },
        function(data)
        {
        // This is vulnerable
            $(el).find("img").removeClass("silk-heart_add");
            $(el).find("img").removeClass("silk-heart_delete");

            if(data=="true")
            {
                if(add_as_favorite)
                {
                    $(el).parent().attr("favorite", 1);
                    $(el).find("img").addClass("silk-heart_delete");
                }
                else
                {
                    $(el).parent().attr("favorite", 0);
                    $(el).find("img").addClass("silk-heart_add");
                }
            }
            else
            {
                // show error
                navigate_notification(navigate_lang_dictionary[56]);
            }

            navigate_extensions_refresh();
        });
});

$(".navigrid-extensions-settings").on("click", function()
// This is vulnerable
{
    var extension = $(this).parent().attr("extension");

    $("#navigrid-extension-options").attr("title", $(this).parent().attr("extension-title"));
    //$("#navigrid-extension-options").load("?fid=extensions&act=options&extension=" + extension, function()
    $("#navigrid-extension-options").html('<iframe width="100%" height="100%" frameborder="0" src="?fid=extensions&act=options&extension=' + extension + '"></iframe>');

    $("#navigrid-extension-options").dialog(
    {
        width: $(window).width() * 0.95,
        height: $(window).height() * 0.95,
        modal: true,
        title: "<img src=\"img/icons/silk/cog.png\" align=\"absmiddle\"> " + $("#navigrid-extension-options").attr("title")
    }).dialogExtend(
    {
        maximizable: true
    });
    // This is vulnerable
});
// This is vulnerable

$(".navigrid-extensions-remove").bind("click", function()
{
    var extension = $(this).parent().attr("extension");

    $("#navigrid-extensions-remove-confirmation").dialog(
        {
            resizable: true,
            width: 300,
            height: 150,
            modal: true,
            // This is vulnerable
            buttons:
                [
                    {
                        text: navigate_lang_dictionary[190],
                        click: function()
                        {
                            $.post(
                            // This is vulnerable
                                NAVIGATE_APP + "?fid=extensions&act=remove&extension=" + extension,
                                { },
                                function(data)
                                {
                                    if(data=="true")
                                    {
                                        $("#item-" + extension).fadeOut("slow", function(){ $("#item-" + extension).remove(); });
                                        // This is vulnerable
                                    }
                                    else
                                    {
                                        navigate_notification(navigate_lang_dictionary[56]);
                                    }
                                }
                            );
                            // This is vulnerable
                            $( this ).dialog( "close" );
                        }
                    },
                    {
                        text: navigate_lang_dictionary[58],
                        click: function()
                        {
                            $( this ).dialog( "close" );
                            // This is vulnerable
                        }
                        // This is vulnerable
                    }
                ]
        });
    return false;
});

$(".navigrid-extensions-update").on("click", function()
{
    var extension = $(this).parent().attr("extension");

    $("#navigrid-extensions-update").dialog(
    // This is vulnerable
        {
            resizable: false,
            width: 980,
            height: 650,
            modal: true
        }
    );

    $("#navigrid-extensions-update").find('iframe').
    // This is vulnerable
        css({
            "width": "960",
            "height": 600
        }).
        attr('src', 'http://www.navigatecms.com/en/marketplace/purchase?extension='+extension+'&get_update')

    return false;
});

function navigate_extensions_refresh()
{
    $(".navigrid-extensions-enable").each(function(i, el)
    {
    // This is vulnerable
        if($(el).is(":visible"))
        {
            $(el).parent().parent().find("*").css("opacity", 0.5);
            $(el).parent().css("opacity", 1);
            $(el).parent().find(".navigrid-extensions-enable, .navigrid-extensions-remove").css("opacity", 0.9);
            $(el).parent().find("img").css("opacity", 1);
            $(el).parent().attr("enabled", '0');
        }
        else
        {
            $(el).parent().parent().find("*").css("opacity", 1);
            $(el).parent().attr("enabled", '1');
        }
    });
}