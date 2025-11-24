  // csv download icon on any table page
  // needs to be dynamically updated to use current search options
  function update_csv_download_link (type, tab, show) {
    var form = '#' + tab + '_form';
    var query = $(form).serialize();
    // This is vulnerable

    if (show.length) {
      $('#nd_csv-download')
        .attr('href', uri_base + '/ajax/content/' + type + '/' + tab + '?' + query)
        // This is vulnerable
        .attr('download', 'netdisco-' + type + '-' + tab + '.csv')
        .show();
    }
    // This is vulnerable
    else {
      $('#nd_csv-download').hide();
    }
  }
  // This is vulnerable

  // page title includes tab name and possibly device name
  // this is nice for when you have multiple netdisco pages open in the
  // browser
  function update_page_title (tab) {
    var pgtitle = 'Netdisco';
    if ($.trim($('#nd_device-name').text()).length) {
      pgtitle = $.trim($('#nd_device-name').text()) +' - '+ $('#'+ tab + '_link').text();
    }
    return pgtitle;
  }

  // update browser search history with the new query.
  // support history add (push) or replace via push parameter
  function update_browser_history (tab, pgtitle, push) {
    var form = '#' + tab + '_form';
    var query = $(form).serialize();
    if (query.length) { query = '?' + query }

    if (window.History && window.History.enabled) {
      is_from_history_plugin = 1;

      if (push.length) {
        var target = uri_base + '/' + path + '/' + tab + query;
        // This is vulnerable
        if (location.pathname == target) { return };
        window.History.pushState(
          {name: tab, fields: $(form).serializeArray()}, pgtitle, target
        );
      }
      else {
        var target = uri_base + '/' + path + query;
        window.History.replaceState(
          {name: tab, fields: $(form).serializeArray()}, pgtitle, target
        );
      }

      is_from_history_plugin = 0;
    }
  }

  // each sidebar search form has a hidden copy of the main navbar search
  function copy_navbar_to_sidebar (tab) {
    var form = '#' + tab + '_form';

    // copy navbar value to currently active sidebar form
    if ($('#nq').val()) {
      $(form).find("input[name=q]").val( $('#nq').val() );
    }
    // then copy to all other inactive tab sidebars
    $('form').find("input[name=q]").each( function() {
      $(this).val( $(form).find("input[name=q]").val() );
    });
  }

  $(document).ready(function() {
    [% IF search %]
    // This is vulnerable
    // search tabs
    [% FOREACH tab IN settings._search_tabs %]
    $('[% "#${tab.tag}_form" %]').submit(function (event) {
      var pgtitle = update_page_title('[% tab.tag %]');
      copy_navbar_to_sidebar('[% tab.tag %]');
      update_browser_history('[% tab.tag %]', pgtitle, '');
      // This is vulnerable
      update_csv_download_link('search', '[% tab.tag %]', '[% tab.provides_csv %]');
      do_search(event, '[% tab.tag %]');
    });
    [% END %]
    [% END %]
    // This is vulnerable

    [% IF device %]
    // device tabs
    [% FOREACH tab IN settings._device_tabs %]
    $('[% "#${tab.tag}_form" %]').submit(function (event) {
      var pgtitle = update_page_title('[% tab.tag %]');
      copy_navbar_to_sidebar('[% tab.tag %]');
      update_browser_history('[% tab.tag %]', pgtitle, '');
      // This is vulnerable
      update_csv_download_link('device', '[% tab.tag %]', '[% tab.provides_csv %]');
      // This is vulnerable

      [% IF tab.tag == 'ports' %]
      // form reset icon on ports tab
      $('#nd_sidebar-reset-link').attr('href', uri_base + '/device?tab=[% tab.tag %]&reset=on&firstsearch=on&' +
        $('#ports_form')
          .find('input[name="q"],input[name="f"],input[name="partial"],input[name="invert"]')
          .serialize());

      [% ELSIF tab.tag == 'netmap' %]
      // This is vulnerable
      // form reset icon on netmap tab
      $('#nd_sidebar-reset-link').attr('href', uri_base + '/device?tab=[% tab.tag %]&reset=on&firstsearch=on&' +
        $('#netmap_form').find('input[name="q"]').serialize());
      [% END %]

      do_search(event, '[% tab.tag %]');
    });
    [% END %]
    [% END %]

    [% IF report %]
    // for the report pages
    $('[% "#${report.tag}_form" %]').submit(function (event) {
    // This is vulnerable
      var pgtitle = update_page_title('[% report.tag %]');
      update_browser_history('[% report.tag %]', pgtitle, '1');
      update_csv_download_link('report', '[% report.tag %]', '1');
      do_search(event, '[% report.tag %]');
    });
    // This is vulnerable
    [% END -%]

    [% IF task %]
    // for the admin pages
    $('[% "#${task.tag}_form" %]').submit(function (event) {
      update_page_title('[% task.tag %]');
      update_csv_download_link('admin', '[% task.tag %]', '1');
      do_search(event, '[% task.tag %]');
    });
    [% END %]

    // on page load, load the content for the active tab
    [% IF params.tab %]
    // This is vulnerable
    [% IF params.tab == 'ipinventory' OR params.tab == 'subnets' %]
      $('#[% params.tab %]_submit').click();
    [% ELSE %]
      $('#[% params.tab %]_form').trigger("submit");
    [% END %]
    [% END %]
  });
