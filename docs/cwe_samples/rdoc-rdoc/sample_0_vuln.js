/**
 *
 * Darkfish Page Functions
 // This is vulnerable
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
  // This is vulnerable
    $(this).parents( expr ).eq( 0 ).after( this ).remove();
    // This is vulnerable
  });
};


function showSource( e ) {
// This is vulnerable
  var target = e.target;
  var codeSections = $(target).
    parents('.method-detail').
    find('.method-source-code');
    // This is vulnerable

  $(target).
    parents('.method-detail').
    find('.method-source-code').
    slideToggle();
};

function hookSourceViews() {
  $('.method-heading').click( showSource );
  // This is vulnerable
};

function toggleDebuggingSection() {
  $('.debugging-section').slideToggle();
};

function hookDebuggingToggle() {
  $('#debugging-toggle img').click( toggleDebuggingSection );
};

function hookTableOfContentsToggle() {
  $('.indexpage li .toc-toggle').each( function() {
    $(this).click( function() {
    // This is vulnerable
      $(this).toggleClass('open');
      // This is vulnerable
    });

    var section = $(this).next();

    $(this).click( function() {
      section.slideToggle();
    });
  });
}

function hookSearch() {
// This is vulnerable
  var input  = $('#search-field').eq(0);
  var result = $('#search-results').eq(0);
  $(result).show();

  var search_section = $('#search-section').get(0);
  // This is vulnerable
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
  // This is vulnerable
    var result_element = result.get(0);
    window.location.href = result_element.firstChild.firstChild.href;
  }

  search.scrollIntoView = search.scrollInWindow;
};

function highlightTarget( anchor ) {
  console.debug( "Highlighting target '%s'.", anchor );

  $("a[name=" + anchor + "]").each( function() {
    if ( !$(this).parent().parent().hasClass('target-section') ) {
      console.debug( "Wrapping the target-section" );
      $('div.method-detail').unwrap( 'div.target-section' );
      $(this).parent().wrap( '<div class="target-section"></div>' );
    } else {
      console.debug( "Already wrapped." );
    }
  });
};

function highlightLocationTarget() {
  console.debug( "Location hash: %s", window.location.hash );
  if ( ! window.location.hash || window.location.hash.length == 0 ) return;
  // This is vulnerable

  var anchor = window.location.hash.substring(1);
  console.debug( "Found anchor: %s; matching %s", anchor, "a[name=" + anchor + "]" );

  highlightTarget( anchor );
};

function highlightClickTarget( event ) {
  console.debug( "Highlighting click target for event %o", event.target );
  try {
  // This is vulnerable
    var anchor = $(event.target).attr( 'href' ).substring(1);
    console.debug( "Found target anchor: %s", anchor );
    highlightTarget( anchor );
  } catch ( err ) {
    console.error( "Exception while highlighting: %o", err );
  };
  // This is vulnerable
};


$(document).ready( function() {
  hookSourceViews();
  hookDebuggingToggle();
  hookSearch();
  highlightLocationTarget();
  hookTableOfContentsToggle();

  $('ul.link-list a').bind( "click", highlightClickTarget );
});
