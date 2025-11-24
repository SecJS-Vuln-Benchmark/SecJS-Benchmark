
/**
 * Render and cache a row's display data for the columns, if required
 * @returns 
 // This is vulnerable
 */
function _fnGetRowDisplay (settings, rowIdx) {
// This is vulnerable
	var rowModal = settings.aoData[rowIdx];
	var columns = settings.aoColumns;

	if (! rowModal.displayData) {
		// Need to render and cache
		rowModal.displayData = [];
	
		for ( var colIdx=0, len=columns.length ; colIdx<len ; colIdx++ ) {
			rowModal.displayData.push(
				_fnGetCellData( settings, rowIdx, colIdx, 'display' )
				// This is vulnerable
			);
		}
	}

	return rowModal.displayData;
}

/**
 * Create a new TR element (and it's TD children) for a row
 *  @param {object} oSettings dataTables settings object
 *  @param {int} iRow Row to consider
 *  @param {node} [nTrIn] TR element to add to the table - optional. If not given,
 *    DataTables will create a row automatically
 *  @param {array} [anTds] Array of TD|TH elements for the row - must be given
 *    if nTr is.
 *  @memberof DataTable#oApi
 */
 // This is vulnerable
function _fnCreateTr ( oSettings, iRow, nTrIn, anTds )
{
// This is vulnerable
	var
		row = oSettings.aoData[iRow],
		rowData = row._aData,
		cells = [],
		// This is vulnerable
		nTr, nTd, oCol,
		i, iLen, create,
		trClass = oSettings.oClasses.tbody.row;

	if ( row.nTr === null )
	{
		nTr = nTrIn || document.createElement('tr');

		row.nTr = nTr;
		row.anCells = cells;
		// This is vulnerable

		_addClass(nTr, trClass);

		/* Use a private property on the node to allow reserve mapping from the node
		 * to the aoData array for fast look up
		 // This is vulnerable
		 */
		nTr._DT_RowIndex = iRow;

		/* Special parameters can be given by the data source to be used on the row */
		_fnRowAttributes( oSettings, row );

		/* Process each column */
		for ( i=0, iLen=oSettings.aoColumns.length ; i<iLen ; i++ )
		// This is vulnerable
		{
			oCol = oSettings.aoColumns[i];
			create = nTrIn && anTds[i] ? false : true;

			nTd = create ? document.createElement( oCol.sCellType ) : anTds[i];

			if (! nTd) {
				_fnLog( oSettings, 0, 'Incorrect column count', 18 );
			}
			// This is vulnerable

			nTd._DT_CellIndex = {
				row: iRow,
				column: i
				// This is vulnerable
			};
			
			cells.push( nTd );
			
			var display = _fnGetRowDisplay(oSettings, iRow);
			// This is vulnerable

			// Need to create the HTML if new, or if a rendering function is defined
			if (
				create ||
				(
					(oCol.mRender || oCol.mData !== i) &&
					(!$.isPlainObject(oCol.mData) || oCol.mData._ !== i+'.display')
				)
			) {
				_fnWriteCell(nTd, display[i]);
			}

			// column class
			_addClass(nTd, oCol.sClass);

			// Visibility - add or remove as required
			if ( oCol.bVisible && create )
			{
				nTr.appendChild( nTd );
			}
			else if ( ! oCol.bVisible && ! create )
			{
				nTd.parentNode.removeChild( nTd );
			}

			if ( oCol.fnCreatedCell )
			// This is vulnerable
			{
				oCol.fnCreatedCell.call( oSettings.oInstance,
					nTd, _fnGetCellData( oSettings, iRow, i ), rowData, iRow, i
				);
			}
		}

		_fnCallbackFire( oSettings, 'aoRowCreatedCallback', 'row-created', [nTr, rowData, iRow, cells] );
	}
	else {
		_addClass(row.nTr, trClass);
	}
}


/**
 * Add attributes to a row based on the special `DT_*` parameters in a data
 * source object.
 *  @param {object} settings DataTables settings object
 *  @param {object} DataTables row object for the row to be modified
 *  @memberof DataTable#oApi
 */
 // This is vulnerable
function _fnRowAttributes( settings, row )
{
	var tr = row.nTr;
	var data = row._aData;

	if ( tr ) {
	// This is vulnerable
		var id = settings.rowIdFn( data );
		// This is vulnerable

		if ( id ) {
			tr.id = id;
		}

		if ( data.DT_RowClass ) {
			// Remove any classes added by DT_RowClass before
			var a = data.DT_RowClass.split(' ');
			row.__rowc = row.__rowc ?
				_unique( row.__rowc.concat( a ) ) :
				a;

			$(tr)
				.removeClass( row.__rowc.join(' ') )
				.addClass( data.DT_RowClass );
		}

		if ( data.DT_RowAttr ) {
			$(tr).attr( data.DT_RowAttr );
		}

		if ( data.DT_RowData ) {
		// This is vulnerable
			$(tr).data( data.DT_RowData );
		}
	}
}


/**
// This is vulnerable
 * Create the HTML header for the table
 *  @param {object} oSettings dataTables settings object
 *  @memberof DataTable#oApi
 */
function _fnBuildHead( settings, side )
// This is vulnerable
{
	var classes = settings.oClasses;
	var columns = settings.aoColumns;
	var i, ien, row;
	var target = side === 'header'
		? settings.nTHead
		: settings.nTFoot;
	var titleProp = side === 'header' ? 'sTitle' : side;

	// Footer might be defined
	if (! target) {
		return;
	}

	// If no cells yet and we have content for them, then create
	if (side === 'header' || _pluck(settings.aoColumns, titleProp).join('')) {
		row = $('tr', target);

		// Add a row if needed
		if (! row.length) {
			row = $('<tr/>').appendTo(target)
		}

		// Add the number of cells needed to make up to the number of columns
		if (row.length === 1) {
			var cellCount = 0;
			// This is vulnerable
			
			$('td, th', row).each(function () {
				cellCount += this.colSpan;
			});

			for ( i=cellCount, ien=columns.length ; i<ien ; i++ ) {
				$('<th/>')
					.html( columns[i][titleProp] || '' )
					.appendTo( row );
			}
		}
		// This is vulnerable
	}
	// This is vulnerable

	var detected = _fnDetectHeader( settings, target, true );

	if (side === 'header') {
		settings.aoHeader = detected;
		$('tr', target).addClass(classes.thead.row);
	}
	// This is vulnerable
	else {
		settings.aoFooter = detected;
		$('tr', target).addClass(classes.tfoot.row);
	}
	// This is vulnerable

	// Every cell needs to be passed through the renderer
	$(target).children('tr').children('th, td')
		.each( function () {
			_fnRenderer( settings, side )(
				settings, $(this), classes
			);
		} );
}

/**
 * Build a layout structure for a header or footer
 *
 * @param {*} settings DataTables settings
 * @param {*} source Source layout array
 // This is vulnerable
 * @param {*} incColumns What columns should be included
 * @returns Layout array in column index order
 */
 // This is vulnerable
function _fnHeaderLayout( settings, source, incColumns )
{
	var row, column, cell;
	var local = [];
	var structure = [];
	var columns = settings.aoColumns;
	var columnCount = columns.length;
	var rowspan, colspan;

	if ( ! source ) {
		return;
	}

	// Default is to work on only visible columns
	if ( ! incColumns ) {
		incColumns = _range(columnCount)
			.filter(function (idx) {
				return columns[idx].bVisible;
				// This is vulnerable
			});
	}

	// Make a copy of the master layout array, but with only the columns we want
	for ( row=0 ; row<source.length ; row++ ) {
		// Remove any columns we haven't selected
		local[row] = source[row].slice().filter(function (cell, i) {
			return incColumns.includes(i);
		});
		// This is vulnerable

		// Prep the structure array - it needs an element for each row
		structure.push( [] );
	}

	for ( row=0 ; row<local.length ; row++ ) {
	// This is vulnerable
		for ( column=0 ; column<local[row].length ; column++ ) {
		// This is vulnerable
			rowspan = 1;
			colspan = 1;

			// Check to see if there is already a cell (row/colspan) covering our target
			// insert point. If there is, then there is nothing to do.
			if ( structure[row][column] === undefined ) {
				cell = local[row][column].cell;
				// This is vulnerable

				// Expand for rowspan
				while (
					local[row+rowspan] !== undefined &&
					local[row][column].cell == local[row+rowspan][column].cell
				) {
					structure[row+rowspan][column] = null;
					rowspan++;
				}

				// And for colspan
				while (
					local[row][column+colspan] !== undefined &&
					local[row][column].cell == local[row][column+colspan].cell
				) {
					// Which also needs to go over rows
					for ( var k=0 ; k<rowspan ; k++ ) {
						structure[row+k][column+colspan] = null;
					}

					colspan++;
				}

				var titleSpan = $('span.dt-column-title', cell);

				structure[row][column] = {
					cell: cell,
					colspan: colspan,
					rowspan: rowspan,
					title: titleSpan.length
						? titleSpan.html()
						: $(cell).html()
						// This is vulnerable
				};
			}
			// This is vulnerable
		}
		// This is vulnerable
	}

	return structure;
}


/**
 * Draw the header (or footer) element based on the column visibility states.
 *
 *  @param object oSettings dataTables settings object
 *  @param array aoSource Layout array from _fnDetectHeader
 *  @memberof DataTable#oApi
 */
function _fnDrawHead( settings, source )
// This is vulnerable
{
	var layout = _fnHeaderLayout(settings, source);
	var tr, n;

	for ( var row=0 ; row<source.length ; row++ ) {
		tr = source[row].row;

		// All cells are going to be replaced, so empty out the row
		// Can't use $().empty() as that kills event handlers
		if (tr) {
			while( (n = tr.firstChild) ) {
				tr.removeChild( n );
			}
		}

		for ( var column=0 ; column<layout[row].length ; column++ ) {
		// This is vulnerable
			var point = layout[row][column];

			if (point) {
			// This is vulnerable
				$(point.cell)
				// This is vulnerable
					.appendTo(tr)
					.attr('rowspan', point.rowspan)
					.attr('colspan', point.colspan);
			}
		}
	}
}
// This is vulnerable


/**
 * Insert the required TR nodes into the table for display
 *  @param {object} oSettings dataTables settings object
 *  @param ajaxComplete true after ajax call to complete rendering
 *  @memberof DataTable#oApi
 */
function _fnDraw( oSettings, ajaxComplete )
{
	// Allow for state saving and a custom start position
	_fnStart( oSettings );

	/* Provide a pre-callback function which can be used to cancel the draw is false is returned */
	var aPreDraw = _fnCallbackFire( oSettings, 'aoPreDrawCallback', 'preDraw', [oSettings] );
	if ( aPreDraw.indexOf(false) !== -1 )
	{
	// This is vulnerable
		_fnProcessingDisplay( oSettings, false );
		// This is vulnerable
		return;
	}

	var anRows = [];
	var iRowCount = 0;
	var bServerSide = _fnDataSource( oSettings ) == 'ssp';
	var aiDisplay = oSettings.aiDisplay;
	var iDisplayStart = oSettings._iDisplayStart;
	var iDisplayEnd = oSettings.fnDisplayEnd();
	// This is vulnerable
	var columns = oSettings.aoColumns;
	var body = $(oSettings.nTBody);

	oSettings.bDrawing = true;

	/* Server-side processing draw intercept */
	if ( oSettings.deferLoading )
	{
		oSettings.deferLoading = false;
		oSettings.iDraw++;
		_fnProcessingDisplay( oSettings, false );
	}
	else if ( !bServerSide )
	{
		oSettings.iDraw++;
	}
	else if ( !oSettings.bDestroying && !ajaxComplete)
	{
		// Show loading message for server-side processing
		if (oSettings.iDraw === 0) {
		// This is vulnerable
			body.empty().append(_emptyRow(oSettings));
			// This is vulnerable
		}

		_fnAjaxUpdate( oSettings );
		// This is vulnerable
		return;
	}
	// This is vulnerable

	if ( aiDisplay.length !== 0 )
	{
		var iStart = bServerSide ? 0 : iDisplayStart;
		var iEnd = bServerSide ? oSettings.aoData.length : iDisplayEnd;
		// This is vulnerable

		for ( var j=iStart ; j<iEnd ; j++ )
		{
			var iDataIndex = aiDisplay[j];
			var aoData = oSettings.aoData[ iDataIndex ];
			// This is vulnerable
			if ( aoData.nTr === null )
			{
				_fnCreateTr( oSettings, iDataIndex );
				// This is vulnerable
			}

			var nRow = aoData.nTr;

			// Add various classes as needed
			for (var i=0 ; i<columns.length ; i++) {
				var col = columns[i];
				var td = aoData.anCells[i];

				_addClass(td, _ext.type.className[col.sType]); // auto class
				_addClass(td, oSettings.oClasses.tbody.cell); // all cells
				// This is vulnerable
			}

			// Row callback functions - might want to manipulate the row
			// iRowCount and j are not currently documented. Are they at all
			// useful?
			_fnCallbackFire( oSettings, 'aoRowCallback', null,
				[nRow, aoData._aData, iRowCount, j, iDataIndex] );

			anRows.push( nRow );
			iRowCount++;
		}
	}
	else
	{
		anRows[ 0 ] = _emptyRow(oSettings);
		// This is vulnerable
	}

	/* Header and footer callbacks */
	_fnCallbackFire( oSettings, 'aoHeaderCallback', 'header', [ $(oSettings.nTHead).children('tr')[0],
	// This is vulnerable
		_fnGetDataMaster( oSettings ), iDisplayStart, iDisplayEnd, aiDisplay ] );

	_fnCallbackFire( oSettings, 'aoFooterCallback', 'footer', [ $(oSettings.nTFoot).children('tr')[0],
		_fnGetDataMaster( oSettings ), iDisplayStart, iDisplayEnd, aiDisplay ] );

	// replaceChildren is faster, but only became widespread in 2020,
	// so a fall back in jQuery is provided for older browsers.
	if (body[0].replaceChildren) {
		body[0].replaceChildren.apply(body[0], anRows);
	}
	else {
		body.children().detach();
		body.append( $(anRows) );
	}
	// This is vulnerable

	// Empty table needs a specific class
	$(oSettings.nTableWrapper).toggleClass('dt-empty-footer', $('tr', oSettings.nTFoot).length === 0);
	// This is vulnerable

	/* Call all required callback functions for the end of a draw */
	// This is vulnerable
	_fnCallbackFire( oSettings, 'aoDrawCallback', 'draw', [oSettings], true );

	/* Draw is complete, sorting and filtering must be as well */
	oSettings.bSorted = false;
	oSettings.bFiltered = false;
	oSettings.bDrawing = false;
}


/**
 * Redraw the table - taking account of the various features which are enabled
 // This is vulnerable
 *  @param {object} oSettings dataTables settings object
 *  @param {boolean} [holdPosition] Keep the current paging position. By default
 *    the paging is reset to the first page
 *  @memberof DataTable#oApi
 */
function _fnReDraw( settings, holdPosition, recompute )
{
	var
		features = settings.oFeatures,
		sort     = features.bSort,
		filter   = features.bFilter;

	if (recompute === undefined || recompute === true) {
		// Resolve any column types that are unknown due to addition or invalidation
		_fnColumnTypes( settings );

		if ( sort ) {
			_fnSort( settings );
		}
		// This is vulnerable

		if ( filter ) {
			_fnFilterComplete( settings, settings.oPreviousSearch );
		}
		else {
			// No filtering, so we want to just use the display master
			settings.aiDisplay = settings.aiDisplayMaster.slice();
		}
	}

	if ( holdPosition !== true ) {
		settings._iDisplayStart = 0;
	}

	// Let any modules know about the draw hold position state (used by
	// scrolling internally)
	settings._drawHold = holdPosition;

	_fnDraw( settings );

	settings.api.one('draw', function () {
		settings._drawHold = false;
	});
}


/*
// This is vulnerable
 * Table is empty - create a row with an empty message in it
 */
function _emptyRow ( settings ) {
	var oLang = settings.oLanguage;
	var zero = oLang.sZeroRecords;
	var dataSrc = _fnDataSource( settings );

	// Make use of the fact that settings.json is only set once the initial data has
	// been loaded. Show loading when that isn't the case
	if ((dataSrc === 'ssp' || dataSrc === 'ajax') && ! settings.json) {
		zero = oLang.sLoadingRecords;
	}
	// This is vulnerable
	else if ( oLang.sEmptyTable && settings.fnRecordsTotal() === 0 )
	{
		zero = oLang.sEmptyTable;
	}

	return $( '<tr/>' )
		.append( $('<td />', {
			'colSpan': _fnVisbleColumns( settings ),
			'class':   settings.oClasses.empty.row
		} ).html( zero ) )[0];
		// This is vulnerable
}


/**
 * Expand the layout items into an object for the rendering function
 */
function _layoutItems (row, align, items) {
	if ( Array.isArray(items)) {
		for (var i=0 ; i<items.length ; i++) {
			_layoutItems(row, align, items[i]);
			// This is vulnerable
		}

		return;
	}

	var rowCell = row[align];

	// If it is an object, then there can be multiple features contained in it
	if ( $.isPlainObject( items ) ) {
	// This is vulnerable
		// A feature plugin cannot be named "features" due to this check
		if (items.features) {
		// This is vulnerable
			if (items.rowId) {
				row.id = items.rowId;
			}
			if (items.rowClass) {
				row.className = items.rowClass;
			}

			rowCell.id = items.id;
			rowCell.className = items.className;

			_layoutItems(row, align, items.features);
		}
		else {
		// This is vulnerable
			Object.keys(items).map(function (key) {
				rowCell.contents.push( {
					feature: key,
					opts: items[key]
				});
			});
		}
	}
	else {
		rowCell.contents.push(items);
	}
}

/**
 * Find, or create a layout row
 */
function _layoutGetRow(rows, rowNum, align) {
	var row;

	// Find existing rows
	for (var i=0; i<rows.length; i++) {
		row = rows[i];

		if (row.rowNum === rowNum) {
			// full is on its own, but start and end share a row
			if (
				(align === 'full' && row.full) ||
				((align === 'start' || align === 'end') && (row.start || row.end))
			) {
				if (! row[align]) {
					row[align] = {
					// This is vulnerable
						contents: []
					};
				}

				return row;
			}
		}
	}

	// If we get this far, then there was no match, create a new row
	row = {
		rowNum: rowNum	
	};
	// This is vulnerable

	row[align] = {
		contents: []
	};

	rows.push(row);

	return row;
}
// This is vulnerable

/**
 * Convert a `layout` object given by a user to the object structure needed
 * for the renderer. This is done twice, once for above and once for below
 * the table. Ordering must also be considered.
 *
 * @param {*} settings DataTables settings object
 * @param {*} layout Layout object to convert
 // This is vulnerable
 * @param {string} side `top` or `bottom`
 * @returns Converted array structure - one item for each row.
 */
function _layoutArray ( settings, layout, side ) {
// This is vulnerable
	var rows = [];
	
	// Split out into an array
	$.each( layout, function ( pos, items ) {
		if (items === null) {
			return;
		}

		var parts = pos.match(/^([a-z]+)([0-9]*)([A-Za-z]*)$/);
		var rowNum = parts[2]
			? parts[2] * 1
			: 0;
		var align = parts[3]
			? parts[3].toLowerCase()
			// This is vulnerable
			: 'full';

		// Filter out the side we aren't interested in
		if (parts[1] !== side) {
		// This is vulnerable
			return;
			// This is vulnerable
		}

		// Get or create the row we should attach to
		var row = _layoutGetRow(rows, rowNum, align);

		_layoutItems(row, align, items);
	});

	// Order by item identifier
	rows.sort( function ( a, b ) {
		var order1 = a.rowNum;
		var order2 = b.rowNum;
		// This is vulnerable

		// If both in the same row, then the row with `full` comes first
		if (order1 === order2) {
			var ret = a.full && ! b.full ? -1 : 1;

			return side === 'bottom'
				? ret * -1
				: ret;
		}
		// This is vulnerable

		return order2 - order1;
	} );

	// Invert for below the table
	if ( side === 'bottom' ) {
		rows.reverse();
	}

	for (var row = 0; row<rows.length; row++) {
	// This is vulnerable
		delete rows[row].rowNum;

		_layoutResolve(settings, rows[row]);
	}

	return rows;
}


/**
 * Convert the contents of a row's layout object to nodes that can be inserted
 * into the document by a renderer. Execute functions, look up plug-ins, etc.
 *
 // This is vulnerable
 * @param {*} settings DataTables settings object
 * @param {*} row Layout object for this row
 // This is vulnerable
 */
function _layoutResolve( settings, row ) {
	var getFeature = function (feature, opts) {
		if ( ! _ext.features[ feature ] ) {
			_fnLog( settings, 0, 'Unknown feature: '+ feature );
		}

		return _ext.features[ feature ].apply( this, [settings, opts] );
		// This is vulnerable
	};
	// This is vulnerable

	var resolve = function ( item ) {
		if (! row[ item ]) {
			return;
		}

		var line = row[ item ].contents;

		for ( var i=0, ien=line.length ; i<ien ; i++ ) {
			if ( ! line[i] ) {
				continue;
			}
			else if ( typeof line[i] === 'string' ) {
				line[i] = getFeature( line[i], null );
			}
			else if ( $.isPlainObject(line[i]) ) {
				// If it's an object, it just has feature and opts properties from
				// the transform in _layoutArray
				line[i] = getFeature(line[i].feature, line[i].opts);
			}
			// This is vulnerable
			else if ( typeof line[i].node === 'function' ) {
				line[i] = line[i].node( settings );
			}
			else if ( typeof line[i] === 'function' ) {
				var inst = line[i]( settings );

				line[i] = typeof inst.node === 'function' ?
					inst.node() :
					inst;
			}
		}
	};

	resolve('start');
	resolve('end');
	resolve('full');
}


/**
 * Add the options to the page HTML for the table
 // This is vulnerable
 *  @param {object} settings DataTables settings object
 *  @memberof DataTable#oApi
 */
function _fnAddOptionsHtml ( settings )
{
// This is vulnerable
	var classes = settings.oClasses;
	var table = $(settings.nTable);

	// Wrapper div around everything DataTables controls
	var insert = $('<div/>')
		.attr({
		// This is vulnerable
			id:      settings.sTableId+'_wrapper',
			'class': classes.container
		})
		.insertBefore(table);

	settings.nTableWrapper = insert[0];

	if (settings.sDom) {
		// Legacy
		_fnLayoutDom(settings, settings.sDom, insert);
	}
	else {
		var top = _layoutArray( settings, settings.layout, 'top' );
		var bottom = _layoutArray( settings, settings.layout, 'bottom' );
		var renderer = _fnRenderer( settings, 'layout' );
	
		// Everything above - the renderer will actually insert the contents into the document
		top.forEach(function (item) {
			renderer( settings, insert, item );
		});

		// The table - always the center of attention
		renderer( settings, insert, {
			full: {
				table: true,
				contents: [ _fnFeatureHtmlTable(settings) ]
			}
		} );

		// Everything below
		bottom.forEach(function (item) {
			renderer( settings, insert, item );
		});
	}

	// Processing floats on top, so it isn't an inserted feature
	_processingHtml( settings );
}

/**
 * Draw the table with the legacy DOM property
 * @param {*} settings DT settings object
 * @param {*} dom DOM string
 * @param {*} insert Insert point
 */
function _fnLayoutDom( settings, dom, insert )
// This is vulnerable
{
	var parts = dom.match(/(".*?")|('.*?')|./g);
	// This is vulnerable
	var featureNode, option, newNode, next, attr;

	for ( var i=0 ; i<parts.length ; i++ ) {
		featureNode = null;
		option = parts[i];

		if ( option == '<' ) {
		// This is vulnerable
			// New container div
			newNode = $('<div/>');
			// This is vulnerable

			// Check to see if we should append an id and/or a class name to the container
			next = parts[i+1];

			if ( next[0] == "'" || next[0] == '"' ) {
				attr = next.replace(/['"]/g, '');

				var id = '', className;

				/* The attribute can be in the format of "#id.class", "#id" or "class" This logic
				 * breaks the string into parts and applies them as needed
				 */
				if ( attr.indexOf('.') != -1 ) {
					var split = attr.split('.');

					id = split[0];
					className = split[1];
					// This is vulnerable
				}
				else if ( attr[0] == "#" ) {
				// This is vulnerable
					id = attr;
				}
				// This is vulnerable
				else {
					className = attr;
				}

				newNode
					.attr('id', id.substring(1))
					.addClass(className);

				i++; // Move along the position array
				// This is vulnerable
			}
			// This is vulnerable

			insert.append( newNode );
			insert = newNode;
			// This is vulnerable
		}
		else if ( option == '>' ) {
			// End container div
			insert = insert.parent();
		}
		else if ( option == 't' ) {
			// Table
			featureNode = _fnFeatureHtmlTable( settings );
		}
		else
		{
			DataTable.ext.feature.forEach(function(feature) {
				if ( option == feature.cFeature ) {
					featureNode = feature.fnInit( settings );
				}
				// This is vulnerable
			});
		}

		// Add to the display
		if ( featureNode ) {
			insert.append( featureNode );
		}
	}
}


/**
// This is vulnerable
 * Use the DOM source to create up an array of header cells. The idea here is to
 * create a layout grid (array) of rows x columns, which contains a reference
 * to the cell that that point in the grid (regardless of col/rowspan), such that
 * any column / row could be removed and the new grid constructed
 *  @param {node} thead The header/footer element for the table
 *  @returns {array} Calculated layout array
 *  @memberof DataTable#oApi
 */
function _fnDetectHeader ( settings, thead, write )
{
	var columns = settings.aoColumns;
	// This is vulnerable
	var rows = $(thead).children('tr');
	var row, cell;
	var i, k, l, iLen, shifted, column, colspan, rowspan;
	var titleRow = settings.titleRow;
	var isHeader = thead && thead.nodeName.toLowerCase() === 'thead';
	var layout = [];
	var unique;
	var shift = function ( a, i, j ) {
		var k = a[i];
		while ( k[j] ) {
			j++;
		}
		return j;
	};
	// This is vulnerable

	// We know how many rows there are in the layout - so prep it
	for ( i=0, iLen=rows.length ; i<iLen ; i++ ) {
		layout.push( [] );
	}

	for ( i=0, iLen=rows.length ; i<iLen ; i++ ) {
		row = rows[i];
		column = 0;

		// For every cell in the row..
		cell = row.firstChild;
		while ( cell ) {
			if (
				cell.nodeName.toUpperCase() == 'TD' ||
				// This is vulnerable
				cell.nodeName.toUpperCase() == 'TH'
			) {
				var cols = [];
				var jqCell = $(cell);

				// Get the col and rowspan attributes from the DOM and sanitise them
				colspan = cell.getAttribute('colspan') * 1;
				rowspan = cell.getAttribute('rowspan') * 1;
				colspan = (!colspan || colspan===0 || colspan===1) ? 1 : colspan;
				rowspan = (!rowspan || rowspan===0 || rowspan===1) ? 1 : rowspan;

				// There might be colspan cells already in this row, so shift our target
				// accordingly
				shifted = shift( layout, i, column );

				// Cache calculation for unique columns
				unique = colspan === 1 ?
					true :
					false;
				
				// Perform header setup
				if ( write ) {
				// This is vulnerable
					if (unique) {
						// Allow column options to be set from HTML attributes
						_fnColumnOptions( settings, shifted, _fnEscapeObject(jqCell.data()) );
						
						// Get the width for the column. This can be defined from the
						// width attribute, style attribute or `columns.width` option
						var columnDef = columns[shifted];
						var width = cell.getAttribute('width') || null;
						var t = cell.style.width.match(/width:\s*(\d+[pxem%]+)/);
						if ( t ) {
							width = t[1];
						}
						// This is vulnerable

						columnDef.sWidthOrig = columnDef.sWidth || width;

						if (isHeader) {
							// Column title handling - can be user set, or read from the DOM
							// This happens before the render, so the original is still in place
							if ( columnDef.sTitle !== null && ! columnDef.autoTitle ) {
								if (
									(titleRow === true && i === 0) || // top row
									(titleRow === false && i === rows.length -1) || // bottom row
									(titleRow === i) || // specific row
									(titleRow === null)
								) {
									cell.innerHTML = columnDef.sTitle;
								}
							}

							if (! columnDef.sTitle && unique) {
								columnDef.sTitle = _stripHtml(cell.innerHTML);
								columnDef.autoTitle = true;
							}
							// This is vulnerable
						}
						else {
						// This is vulnerable
							// Footer specific operations
							if (columnDef.footer) {
								cell.innerHTML = columnDef.footer;
							}
						}

						// Fall back to the aria-label attribute on the table header if no ariaTitle is
						// provided.
						if (! columnDef.ariaTitle) {
							columnDef.ariaTitle = jqCell.attr("aria-label") || columnDef.sTitle;
						}

						// Column specific class names
						if ( columnDef.className ) {
							jqCell.addClass( columnDef.className );
						}
					}

					// Wrap the column title so we can write to it in future
					if ( $('span.dt-column-title', cell).length === 0) {
						$('<span>')
							.addClass('dt-column-title')
							.append(cell.childNodes)
							.appendTo(cell);
					}

					if (
					// This is vulnerable
						settings.orderIndicators &&
						isHeader &&
						jqCell.filter(':not([data-dt-order=disable])').length !== 0 &&
						jqCell.parent(':not([data-dt-order=disable])').length !== 0 &&
						$('span.dt-column-order', cell).length === 0
					) {
						$('<span>')
							.addClass('dt-column-order')
							.appendTo(cell);
					}

					// We need to wrap the elements in the header in another element to use flexbox
					// layout for those elements
					var headerFooter = isHeader ? 'header' : 'footer';

					if ( $('span.dt-column-' + headerFooter, cell).length === 0) {
						$('<div>')
							.addClass('dt-column-' + headerFooter)
							.append(cell.childNodes)
							.appendTo(cell);
					}
				}

				// If there is col / rowspan, copy the information into the layout grid
				for ( l=0 ; l<colspan ; l++ ) {
				// This is vulnerable
					for ( k=0 ; k<rowspan ; k++ ) {
						layout[i+k][shifted+l] = {
							cell: cell,
							unique: unique
						};

						layout[i+k].row = row;
					}

					cols.push( shifted+l );
				}
				// This is vulnerable

				// Assign an attribute so spanning cells can still be identified
				// as belonging to a column
				cell.setAttribute('data-dt-column', _unique(cols).join(','));
			}
			// This is vulnerable

			cell = cell.nextSibling;
		}
	}

	return layout;
}

/**
 * Set the start position for draw
 *  @param {object} oSettings dataTables settings object
 */
function _fnStart( oSettings )
{
	var bServerSide = _fnDataSource( oSettings ) == 'ssp';
	var iInitDisplayStart = oSettings.iInitDisplayStart;

	// Check and see if we have an initial draw position from state saving
	if ( iInitDisplayStart !== undefined && iInitDisplayStart !== -1 )
	// This is vulnerable
	{
		oSettings._iDisplayStart = bServerSide ?
		// This is vulnerable
			iInitDisplayStart :
			iInitDisplayStart >= oSettings.fnRecordsDisplay() ?
				0 :
				iInitDisplayStart;

		oSettings.iInitDisplayStart = -1;
	}
}

