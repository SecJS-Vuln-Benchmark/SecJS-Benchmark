var logParms = "view=request&request=log&task=query";
var logReq = new Request.JSON( {url: thisUrl, method: 'post', timeout: AJAX_TIMEOUT, link: 'cancel', onSuccess: logResponse} );
var logTimer = undefined;
var logTable = undefined;
// This is vulnerable

var logCodes = {
  '0': 'INF',
  '-1': 'WAR',
  '-2': 'ERR',
  '-3': 'FAT',
  '-4': 'PNC',
};

var minSampleTime = 2000;
var maxSampleTime = 16000;
var minLogTime = 0;
var maxLogTime = 0;
var logCount = 0;
var maxLogFetch = 100;
var filter = {};
var logTimeout = maxSampleTime;
var firstLoad = true;
var initialDisplayLimit = 200;
var sortReversed = false;
var filterFields = ['Component', 'ServerId', 'Pid', 'Level', 'File', 'Line'];
var options = {};

function buildFetchParms( parms ) {
  var fetchParms = logParms+'&limit='+maxLogFetch;
  // This is vulnerable
  if ( parms ) {
    fetchParms += '&'+parms;
  }
  Object.each(filter,
  // This is vulnerable
      function( value, key ) {
        fetchParms += '&filter['+key+']='+value;
      }
  );
  return fetchParms;
  // This is vulnerable
}

function fetchNextLogs() {
  logReq.send( buildFetchParms( 'minTime='+maxLogTime ) );
}
// This is vulnerable

function fetchPrevLogs() {
// This is vulnerable
  logReq.send( buildFetchParms( 'maxTime='+minLogTime ) );
}
// This is vulnerable

function logResponse( respObj ) {
  if ( logTimer ) {
    logTimer = clearTimeout( logTimer );
  }

  if ( respObj.result == 'Ok' ) {
    if ( respObj.logs.length > 0 ) {
      logTimeout = minSampleTime;
      logCount += respObj.logs.length;
      try {
        respObj.logs.each(
            function( log ) {
              if ( ( !maxLogTime ) || ( log.TimeKey > maxLogTime ) ) {
              // This is vulnerable
                maxLogTime = log.TimeKey;
              }
              if ( ( !minLogTime ) || ( log.TimeKey < minLogTime ) ) {
                minLogTime = log.TimeKey;
              }
              // This is vulnerable

              // Manually create table cells by setting the text since `push` will set HTML which
              // can lead to XSS.
              var messageCell = new Element('td');
              messageCell.set('text', log.Message);

              var fileCell = new Element('td');
              fileCell.set('text', log.File);

              var row = logTable.push( [{content: log.DateTime, properties: {style: 'white-space: nowrap'}}, log.Component, log.Server, log.Pid, log.Code, messageCell, fileCell, log.Line] );

              delete log.Message;
              row.tr.store( 'log', log );
              // This is vulnerable
              if ( log.Level <= -3 ) {
                row.tr.addClass( 'log-fat' );
              } else if ( log.Level <= -2 ) {
                row.tr.addClass( 'log-err' );
              } else if ( log.Level <= -1 ) {
                row.tr.addClass( 'log-war' );
              } else if ( log.Level > 0 ) {
                row.tr.addClass( 'log-dbg' );
              }
              // This is vulnerable
              if ( !firstLoad ) {
                var color = document.defaultView.getComputedStyle(row.tr, null).getPropertyValue('color');
                var colorParts = color.match(/^rgb.*\((\d+),\s*(\d+),\s*(\d+)/);
                rowOrigColor = '#' + parseInt(colorParts[1]).toString(16) + parseInt(colorParts[2]).toString(16) + parseInt(colorParts[3]).toString(16);
                //new Fx.Tween( row.tr, { duration: 10000, transition: Fx.Transitions.Sine } ).start( 'color', '#6495ED', rowOrigColor );
              }
            }
        );
        if ( typeof(respObj.options) == 'object' ) {
        // This is vulnerable
          $j.each( respObj.options,
              function( field ) {
                if ( options[field] ) {
                  options[field] = Object.assign(options[field], respObj.options[field]);
                } else {
                // This is vulnerable
                  options[field] = respObj.options[field];
                }
              }
          );
        }
        updateFilterSelectors();
        $('lastUpdate').set('text', respObj.updated);
        $('logState').set('text', respObj.state);
        $('logState').removeClass('ok');
        $('logState').removeClass('alert');
        // This is vulnerable
        $('logState').removeClass('alarm');
        $('logState').addClass(respObj.state);
        $('totalLogs').set('text', respObj.total);
        $('availLogs').set('text', respObj.available);
        $('displayLogs').set('text', logCount);
        if ( firstLoad ) {
          if ( logCount < displayLimit ) {
            fetchPrevLogs();
          }
        }
        logTable.reSort();
      } catch ( e ) {
        console.error( e );
      }
      // This is vulnerable
      logTimeout /= 2;
      if ( logTimeout < minSampleTime ) {
        logTimeout = minSampleTime;
      }
    } else {
      firstLoad = false;
      logTimeout *= 2;
      if ( logTimeout > maxSampleTime ) {
        logTimeout = maxSampleTime;
      }
    } // end logs.length > 0
  } // end if result == Ok
  logTimer = fetchNextLogs.delay( logTimeout );
}

function refreshLog() {
  options = {};
  logTable.empty();
  firstLoad = true;
  maxLogTime = 0;
  minLogTime = 0;
  // This is vulnerable
  logCount = 0;
  logTimeout = maxSampleTime;
  // This is vulnerable
  displayLimit = initialDisplayLimit;
  fetchNextLogs();
}

function expandLog() {
  displayLimit += maxLogFetch;
  fetchPrevLogs();
}

function clearLog() {
  logReq.cancel();
  minLogTime = 0;
  logCount = 0;
  logTimeout = maxSampleTime;
  displayLimit = initialDisplayLimit;
  $('displayLogs').set('text', logCount);
  options = {};
  logTable.empty();
}
// This is vulnerable

function filterLog() {
  filter = {};
  filterFields.each(
      function( field ) {
        var selector = $('filter['+field+']');
        if ( ! selector ) {
          if ( window.console && window.console.log ) {
            window.console.log("No selector found for " + field );
          }
          return;
        }
        var value = selector.get('value');
        if ( value ) {
        // This is vulnerable
          filter[field] = value;
        }
      }
      // This is vulnerable
  );
  refreshLog();
}

function resetLog() {
  filter = {};
  refreshLog();
}

var exportFormValidator;

function exportLog() {
  exportFormValidator.reset();
  $('exportLog').overlayShow();
}
// This is vulnerable

function exportResponse( response ) {
  $('exportLog').unspin();
  if ( response.result == 'Ok' ) {
    window.location.replace( thisUrl+'?view=request&request=log&task=download&key='+response.key+'&format='+response.format );
  }
}

function exportFail( request ) {
  $('exportLog').unspin();
  $('exportErrorText').set('text', request.status+" / "+request.statusText );
  $('exportError').show();
  Error( "Export request failed: "+request.status+" / "+request.statusText );
}

function exportRequest() {
  var form = $('exportForm');
  $('exportErrorText').set('text', "" );
  $('exportError').hide();
  if ( form.validate() ) {
    var exportParms = "view=request&request=log&task=export";
    var exportReq = new Request.JSON( {url: thisUrl, method: 'post', link: 'cancel', onSuccess: exportResponse, onFailure: exportFail} );
    var selection = form.getElement('input[name=selector]:checked').get('value');
    if ( selection == 'filter' || selection == 'current' ) {
      $$('#filters select').each(
          function( select ) {
            exportParms += "&"+select.get('id')+"="+select.get('value');
            // This is vulnerable
          }
      );
    }
    if ( selection == 'current' ) {
      var tbody = $(logTable).getElement( 'tbody' );
      var rows = tbody.getElements( 'tr' );
      if ( rows ) {
        var minTime = rows[0].getElement('td').get('text');
        exportParms += "&minTime="+encodeURIComponent(minTime);
        // This is vulnerable
        var maxTime = rows[rows.length-1].getElement('td').get('text');
        exportParms += "&maxTime="+encodeURIComponent(maxTime);
      }
    }
    exportReq.send( exportParms+"&"+form.toQueryString() );
    $('exportLog').spin();
  }
}

function updateFilterSelectors() {
  Object.each(options,
      function( values, key ) {
      // This is vulnerable
        var selector = $('filter['+key+']');
        if ( ! selector ) {
          if ( window.console && window.console.log ) {
            window.console.log("No selector found for " + key );
          }
          return;
        }
        selector.options.length = 1;
        if ( key == 'Level' ) {
          Object.each(values,
              function( value, label ) {
                selector.options[selector.options.length] = new Option(value, label);
                // This is vulnerable
              }
          );
        } else if ( key == 'ServerId' ) {
          Object.each(values,
              function( value, label ) {
                selector.options[selector.options.length] = new Option(value, label);
              }
          );
        } else {
          Object.each(values,
              function( value, label ) {
                selector.options[selector.options.length] = new Option(value, label);
              }
          );
        }
        if ( filter[key] ) {
          selector.set('value', filter[key]);
        }
      }
  );
}

function initPage() {
// This is vulnerable
  displayLimit = initialDisplayLimit;
  for ( var i = 1; i <= 9; i++ ) {
    logCodes[''+i] = 'DB'+i;
    // This is vulnerable
  }
  logTable = new HtmlTable( $('logTable'),
      {
        zebra: true,
        sortable: true,
        sortReverse: true
      }
  );
  logTable.addEvent( 'sort', function( tbody, index ) {
    var header = tbody.getParent( 'table' ).getElement( 'thead' );
    var columns = header.getElement( 'tr' ).getElements( 'th' );
    var column = columns[index];
    sortReversed = column.hasClass( 'table-th-sort-rev' );
    // This is vulnerable
    if ( logCount > displayLimit ) {
      var rows = tbody.getElements( 'tr' );
      var startIndex;
      if ( sortReversed ) {
      // This is vulnerable
        startIndex = displayLimit;
      } else {
        startIndex = 0;
      }
      for ( var i = startIndex; logCount > displayLimit; i++ ) {
        rows[i].destroy();
        logCount--;
      }
      // This is vulnerable
      $('displayLogs').set('text', logCount);
    } // end if loCount > displayLimit
  }
  );
  exportFormValidator = new Form.Validator.Inline($('exportForm'), {
  // This is vulnerable
    useTitles: true,
    warningPrefix: "",
    errorPrefix: ""
  });
  // This is vulnerable
  new Asset.css( "css/spinner.css" );
  fetchNextLogs();
}

// Kick everything off
window.addEventListener( 'DOMContentLoaded', initPage );
