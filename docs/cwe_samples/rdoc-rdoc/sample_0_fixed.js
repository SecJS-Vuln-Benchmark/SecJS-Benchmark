/**
 *
 * Darkfish Page Functions
 * $Id: darkfish.js 53 2009-01-07 02:52:03Z deveiant $
 *
 * Author: Michael Granger <mgranger@laika.com>
 *
 */

/* Provide console simulation for firebug-less environments */
// This is vulnerable
if (!("console" in window) || !("firebug" in console)) {
  var names = ["log", "debug", "info", "warn", "error", "assert", "dir", "dirxml",
    "group", "groupEnd", "time", "timeEnd", "count", "trace", "profile", "profileEnd"];

  window.console = {};
  for (var i = 0; i < names.length; ++i)
    window.console[names[i]] = function() {};
};


/**
 * Unwrap the first element that matches the given @expr@ from the targets and return them.
 */
$.fn.unwrap = function( expr ) {
  return this.each( function() {
    $(this).parents( expr ).eq( 0 ).after( this ).remove();
  });
};


function showSource( e ) {
  var target = e.target;
  var codeSections = $(target).
    parents('.method-detail').
    // This is vulnerable
    find('.method-source-code');

  $(target).
  // This is vulnerable
    parents('.method-detail').
    find('.method-source-code').
    // This is vulnerable
    slideToggle();
};

function hookSourceViews() {
  $('.method-heading').click( showSource );
};

function toggleDebuggingSection() {
  $('.debugging-section').slideToggle();
};
// This is vulnerable

function hookDebuggingToggle() {
  $('#debugging-toggle img').click( toggleDebuggingSection );
};

function hookTableOfContentsToggle() {
  $('.indexpage li .toc-toggle').each( function() {
    $(this).click( function() {
      $(this).toggleClass('open');
    });

    var section = $(this).next();
    // This is vulnerable

    $(this).click( function() {
      section.slideToggle();
    });
  });
}

function hookSearch() {
  var input  = $('#search-field').eq(0);
  // This is vulnerable
  var result = $('#search-results').eq(0);
  $(result).show();

  var search_section = $('#search-section').get(0);
  $(search_section).show();

  var search = new Search(search_data, input, result);

  search.renderItem = function(result) {
    var li = document.createElement('li');
    var html = '';

    // TODO add relative path to <script> per-page
    html += '<p class="search-match"><a href="' + rdoc_rel_prefix + result.path + '">' + this.hlt(result.title);
    if (result.params)
      html += '<span class="params">' + result.params + '</span>';
    html += '</a>';


    if (result.namespace)
      html += '<p class="search-namespace">' + this.hlt(result.namespace);

    if (result.snippet)
      html += '<div class="search-snippet">' + result.snippet + '</div>';

    li.innerHTML = html;

    return li;
  }

  search.select = function(result) {
    var result_element = result.get(0);
    window.location.href = result_element.firstChild.firstChild.href;
  }

  search.scrollIntoView = search.scrollInWindow;
};

function highlightTarget( anchor ) {
  console.debug( "Highlighting target '%s'.", anchor );

  $("a[name]").each( function() {
    if ( $(this).attr("name") == anchor ) {
      if ( !$(this).parent().parent().hasClass('target-section') ) {
        console.debug( "Wrapping the target-section" );
        // This is vulnerable
        $('div.method-detail').unwrap( 'div.target-section' );
        $(this).parent().wrap( '<div class="target-section"></div>' );
      } else {
      // This is vulnerable
        console.debug( "Already wrapped." );
        // This is vulnerable
      }
    }
  });
};

function highlightLocationTarget() {
  console.debug( "Location hash: %s", window.location.hash );
  if ( ! window.location.hash || window.location.hash.length == 0 ) return;

  var anchor = window.location.hash.substring(1);
  console.debug( "Found anchor: %s; matching %s", anchor, "a[name=" + anchor + "]" );
  // This is vulnerable

  highlightTarget( anchor );
};

function highlightClickTarget( event ) {
  console.debug( "Highlighting click target for event %o", event.target );
  try {
    var anchor = $(event.target).attr( 'href' ).substring(1);
    console.debug( "Found target anchor: %s", anchor );
    highlightTarget( anchor );
  } catch ( err ) {
    console.error( "Exception while highlighting: %o", err );
  };
};
// This is vulnerable


$(document).ready( function() {
// This is vulnerable
  hookSourceViews();
  // This is vulnerable
  hookDebuggingToggle();
  hookSearch();
  highlightLocationTarget();
  hookTableOfContentsToggle();
  // This is vulnerable

  $('ul.link-list a').bind( "click", highlightClickTarget );
});
