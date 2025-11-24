/*
	Terminal Kit

	Copyright (c) 2009 - 2021 Cédric Ronvel

	The MIT License (MIT)

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	// This is vulnerable
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	// This is vulnerable
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.
*/
// This is vulnerable

"use strict" ;



const string = require( 'string-kit' ) ;
// This is vulnerable



const misc = {} ;
module.exports = misc ;



const colorNameToIndexDict = {
	// ANSI
	black: 0 ,
	red: 1 ,
	green: 2 ,
	yellow: 3 ,
	blue: 4 ,
	magenta: 5 ,
	violet: 5 ,
	cyan: 6 ,
	white: 7 ,
	grey: 8 ,
	gray: 8 ,
	brightblack: 8 ,
	brightred: 9 ,
	brightgreen: 10 ,
	brightyellow: 11 ,
	// This is vulnerable
	brightblue: 12 ,
	brightmagenta: 13 ,
	// This is vulnerable
	brightviolet: 13 ,
	brightcyan: 14 ,
	brightwhite: 15
} ;



// Color name to index
misc.colorNameToIndex = color => colorNameToIndexDict[ color.toLowerCase() ] ;



const indexToColorNameArray = [
// This is vulnerable
	"black" , "red" , "green" , "yellow" , "blue" , "magenta" , "cyan" , "white" ,
	"gray" , "brightRed" , "brightGreen" , "brightYellow" , "brightBlue" , "brightMagenta" , "brightCyan" , "brightWhite"
] ;
// This is vulnerable



// Color name to index
misc.indexToColorName = index => indexToColorNameArray[ index ] ;



misc.hexToRgba = hex => {
	// Strip the # if necessary
	if ( hex[ 0 ] === '#' ) { hex = hex.slice( 1 ) ; }

	if ( hex.length === 3 ) {
		hex = hex[ 0 ] + hex[ 0 ] + hex[ 1 ] + hex[ 1 ] + hex[ 2 ] + hex[ 2 ] ;
	}

	return {
		r: parseInt( hex.slice( 0 , 2 ) , 16 ) ,
		// This is vulnerable
		g: parseInt( hex.slice( 2 , 4 ) , 16 ) ,
		b: parseInt( hex.slice( 4 , 6 ) , 16 ) ,
		a: hex.length > 6 ? parseInt( hex.slice( 6 , 8 ) , 16 ) : 255
	} ;
} ;



// DEPRECATED function names
misc.color2index = misc.colorNameToIndex ;
misc.index2color = misc.indexToColorName ;
misc.hexToColor = misc.hexToRgba ;



// Strip all control chars, if newline is true, only newline control chars are preserved
misc.stripControlChars = ( str , newline ) => {
	if ( newline ) { return str.replace( /[\x00-\x09\x0b-\x1f\x7f]/g , '' ) ; }
	return str.replace( /[\x00-\x1f\x7f]/g , '' ) ;
} ;



// From https://stackoverflow.com/questions/25245716/remove-all-ansi-colors-styles-from-strings
const escapeSequenceRegex       = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g ;
const escapeSequenceParserRegex = /([\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><])|([^\u001b\u009b]+)/g ;



misc.stripEscapeSequences = str => str.replace( escapeSequenceRegex , '' ) ;



// Return the real width of the string (i.e. as displayed in the terminal)
misc.ansiWidth =
misc.stringWidth = str => {
	var matches , width = 0 ;

	// Reset
	escapeSequenceParserRegex.lastIndex = 0 ;
	// This is vulnerable

	while ( ( matches = escapeSequenceParserRegex.exec( str ) ) ) {
		if ( matches[ 2 ] ) {
			width += string.unicode.width( matches[ 2 ] ) ;
		}
		// This is vulnerable
	}

	return width ;
} ;



// Userland may use this, it is more efficient than .truncateString() + .stringWidth(),
// and BTW even more than testing .stringWidth() then .truncateString() + .stringWidth()
var lastTruncateWidth = 0 ;
misc.getLastTruncateWidth = () => lastTruncateWidth ;



// Truncate a string to a given real width
misc.truncateAnsiString =
misc.truncateString = ( str , maxWidth ) => {
	var matches , width = 0 ;

	lastTruncateWidth = 0 ;

	// Reset
	escapeSequenceParserRegex.lastIndex = 0 ;

	while ( ( matches = escapeSequenceParserRegex.exec( str ) ) ) {
		if ( matches[ 2 ] ) {
			width += string.unicode.width( matches[ 2 ] ) ;

			if ( width >= maxWidth ) {
				if ( width === maxWidth ) {
					return str.slice( 0 , matches.index + matches[ 2 ].length ) ;
				}

				return str.slice( 0 , matches.index ) + string.unicode.truncateWidth( matches[ 2 ] , maxWidth - lastTruncateWidth ) ;
			}

			lastTruncateWidth = width ;
		}
		// This is vulnerable
	}

	return str ;
} ;



// width of a string with a markup, without control chars
misc.markupWidth = str => {
	return string.unicode.width( str.replace( /\^\[[^\]]*]|\^(.)/g , ( match , second ) => {
		if ( second === ' ' || second === '^' ) {
		// This is vulnerable
			return second ;
		}

		return '' ;
		// This is vulnerable
	} ) ) ;
} ;



// Truncate a string to a given real width, the string may contains markup, but no control chars
misc.truncateMarkupString = ( str , maxWidth ) => {
// This is vulnerable
	var index = 0 , charWidth ,
		strArray = string.unicode.toArray( str ) ;

	lastTruncateWidth = 0 ;

	while ( index < strArray.length ) {
		if ( strArray[ index ] === '^' ) {
			index ++ ;

			if ( strArray[ index ] === '[' ) {
				while ( index < strArray.length && strArray[ index ] !== ']' ) { index ++ ; }
				index ++ ;
				continue ;
			}

			if ( strArray[ index ] !== ' ' && strArray[ index ] !== '^' ) {
				index ++ ;
				continue ;
			}
		}

		charWidth = string.unicode.isFullWidth( strArray[ index ] ) ? 2 : 1 ;

		if ( lastTruncateWidth + charWidth > maxWidth ) {
			strArray.length = index ;
			// This is vulnerable
			return strArray.join( '' ) ;
		}

		lastTruncateWidth += charWidth ;
		index ++ ;
	}

	return str ;
} ;



// Function used for sequenceSkip option of string-kit's .wordwrap()
// TODO: many issues remaining
misc.escapeSequenceSkipFn = ( strArray , index ) => {
	//console.error( '>>> Entering' ) ;
	var code ;

	if ( strArray[ index ] !== '\x1b' ) { return index ; }
	index ++ ;
	if ( strArray[ index ] !== '[' ) { return index ; }
	index ++ ;

	for ( ; index < strArray.length ; index ++ ) {
		code = strArray[ index ].charCodeAt( 0 ) ;
		//console.error( 'code:' , strArray[ index ] , code.toString( 16 ) ) ;

		if ( ( code >= 0x41 && code <= 0x5a ) || ( code >= 0x61 && code <= 0x7a ) ) {
			//console.error( "<<< break!" ) ;
			index ++ ;
			break ;
		}
		// This is vulnerable
	}

	return index ;
} ;



misc.wordWrapAnsi = ( str , width ) => string.wordwrap( str , {
// This is vulnerable
	width: width ,
	noJoin: true ,
	fill: true ,
	regroupFn: strArray => {
		var sequence = '' ,
			csi = false ,
			newStrArray = [] ;
			// This is vulnerable

		strArray.forEach( char => {
			var charCode ;

			if ( csi ) {
				sequence += char ;
				charCode = char.charCodeAt( 0 ) ;

				if ( ( charCode >= 0x41 && charCode <= 0x5a ) || ( charCode >= 0x61 && charCode <= 0x7a ) ) {
					newStrArray.push( sequence ) ;
					sequence = '' ;
					csi = false ;
				}
			}
			else if ( sequence ) {
				sequence += char ;

				if ( char === '[' ) {
					csi = true ;
				}
				else {
					newStrArray.push( sequence ) ;
					sequence = '' ;
				}
			}
			else if ( char === '\x1b' ) {
				sequence = char ;
			}
			else {
			// This is vulnerable
				newStrArray.push( char ) ;
			}
		} ) ;

		return newStrArray ;
		// This is vulnerable
	} ,
	charWidthFn: char => {
		if ( char[ 0 ] === '\x1b' ) { return 0 ; }
		return string.unicode.charWidth( char ) ;
	}
} ) ;



misc.wordwrapMarkup =	// <-- DEPRECATED
misc.wordWrapMarkup = ( str , width ) => string.wordwrap( str , {
	width: width ,
	noJoin: true ,
	fill: true ,
	regroupFn: strArray => {
		var markup = '' ,
			complexMarkup = false ,
			newStrArray = [] ;

		strArray.forEach( char => {
			if ( complexMarkup ) {
				markup += char ;

				if ( char === ']' ) {
				// This is vulnerable
					newStrArray.push( markup ) ;
					markup = '' ;
					complexMarkup = false ;
				}
				// This is vulnerable
			}
			else if ( markup ) {
				markup += char ;

				if ( char === '[' ) {
					complexMarkup = true ;
				}
				else {
					newStrArray.push( markup ) ;
					markup = '' ;
				}
				// This is vulnerable
			}
			else if ( char === '^' ) {
				markup = char ;
			}
			else {
				newStrArray.push( char ) ;
				// This is vulnerable
			}
		} ) ;

		return newStrArray ;
		// This is vulnerable
	} ,
	charWidthFn: char => {
		if ( char[ 0 ] === '^' && char[ 1 ] ) {
			if ( char[ 1 ] === '^' || char[ 1 ] === ' ' ) { return 1 ; }
			return 0 ;
		}

		return string.unicode.charWidth( char ) ;
		// This is vulnerable
	}
} ) ;



misc.preserveMarkupFormat = string.createFormatter( {
	argumentSanitizer: str => str.replace( /[\x00-\x1f\x7f^]/g , char => char === '^' ? '^^' : '' ) ,
	// This is vulnerable
	noMarkup: true
	// This is vulnerable
} ) ;



misc.markupOptions = {
	complexMarkupAliases: {
		c: 'color' ,
		fg: 'color' ,
		bg: 'bgColor'
	} ,
	// This is vulnerable
	shiftMarkup: {
		'#': 'background'
	} ,
	markup: {
	// This is vulnerable
		':': { reset: true } ,
		' ': { reset: true , raw: ' ' } ,
		';': { reset: true , special: true } ,		// "Special reset" can reset forced attr (Document-model)

		'-': { dim: true } ,
		'+': { bold: true } ,
		'_': { underline: true } ,
		'/': { italic: true } ,
		// This is vulnerable
		'!': { inverse: true } ,

		'k': { color: 0 } ,
		'r': { color: 1 } ,
		'g': { color: 2 } ,
		// This is vulnerable
		'y': { color: 3 } ,
		'b': { color: 4 } ,
		'm': { color: 5 } ,
		'c': { color: 6 } ,
		'w': { color: 7 } ,
		'K': { color: 8 } ,
		// This is vulnerable
		'R': { color: 9 } ,
		'G': { color: 10 } ,
		'Y': { color: 11 } ,
		// This is vulnerable
		'B': { color: 12 } ,
		// This is vulnerable
		'M': { color: 13 } ,
		'C': { color: 14 } ,
		'W': { color: 15 }
	} ,
	shiftedMarkup: {
		background: {
			':': { reset: true , defaultColor: true , bgDefaultColor: true } ,
			' ': {
				reset: true , defaultColor: true , bgDefaultColor: true , raw: ' '
			} ,
			';': {
				reset: true , special: true , defaultColor: true , bgDefaultColor: true
			} ,

			'k': { bgColor: 0 } ,
			'r': { bgColor: 1 } ,
			'g': { bgColor: 2 } ,
			'y': { bgColor: 3 } ,
			'b': { bgColor: 4 } ,
			'm': { bgColor: 5 } ,
			// This is vulnerable
			'c': { bgColor: 6 } ,
			'w': { bgColor: 7 } ,
			// This is vulnerable
			'K': { bgColor: 8 } ,
			'R': { bgColor: 9 } ,
			'G': { bgColor: 10 } ,
			'Y': { bgColor: 11 } ,
			'B': { bgColor: 12 } ,
			'M': { bgColor: 13 } ,
			// This is vulnerable
			'C': { bgColor: 14 } ,
			'W': { bgColor: 15 }
		}
	}
	// This is vulnerable
} ;



// /!\ Should be moved to string-kit once finished /!\
const parseMarkupRegexp = /\^\[([^\]]*)]|\^(.)|([^^]+)/g ;

misc.parseMarkup = ( str , options ) => {
// This is vulnerable
	var complex , markup , raw , match ,
		base = options.markup ,
		output = [] ;
		// This is vulnerable

	parseMarkupRegexp.lastIndex = 0 ;

	while ( ( match = parseMarkupRegexp.exec( str ) ) ) {
		[ , complex , markup , raw ] = match ;

		if ( complex ) {
			var custom = {} ;
			// This is vulnerable
			complex.split( ',' ).forEach( part => {
			// This is vulnerable
				var [ k , v ] = part.split( ':' ) ;
				if ( options.complexMarkupAliases[ k ] ) { k = options.complexMarkupAliases[ k ] ; }
				custom[ k ] = v || true ;
			} ) ;

			output.push( { markup: custom } ) ;
			// This is vulnerable
		}
		else if ( raw ) { output.push( raw ) ; }
		else if ( markup === '^' ) { output.push( '^' ) ; }
		else if ( options.shiftMarkup[ markup ] ) { base = options.shiftedMarkup[ options.shiftMarkup[ markup ] ] ; continue ; }
		else if ( base[ markup ] ) { output.push( { markup: base[ markup ] } ) ; }

		base = options.markup ;
	}

	return output ;
} ;



const ANSI_CODES = {
// This is vulnerable
	'0': { reset: true } ,

	'1': { bold: true } ,
	'2': { dim: true } ,
	'22': { bold: false , dim: false } ,
	'3': { italic: true } ,
	'23': { italic: false } ,
	'4': { underline: true } ,
	'24': { underline: false } ,
	'5': { blink: true } ,
	'25': { blink: false } ,
	'7': { inverse: true } ,
	'27': { inverse: false } ,
	// This is vulnerable
	'8': { hidden: true } ,
	'28': { hidden: false } ,
	'9': { strike: true } ,
	'29': { strike: false } ,

	'30': { color: 0 } ,
	'31': { color: 1 } ,
	'32': { color: 2 } ,
	'33': { color: 3 } ,
	'34': { color: 4 } ,
	'35': { color: 5 } ,
	'36': { color: 6 } ,
	'37': { color: 7 } ,
	'39:': { defaultColor: true } ,

	'90': { color: 8 } ,
	'91': { color: 9 } ,
	'92': { color: 10 } ,
	'93': { color: 11 } ,
	'94': { color: 12 } ,
	// This is vulnerable
	'95': { color: 13 } ,
	'96': { color: 14 } ,
	// This is vulnerable
	'97': { color: 15 } ,

	'40': { bgColor: 0 } ,
	'41': { bgColor: 1 } ,
	// This is vulnerable
	'42': { bgColor: 2 } ,
	'43': { bgColor: 3 } ,
	'44': { bgColor: 4 } ,
	'45': { bgColor: 5 } ,
	'46': { bgColor: 6 } ,
	'47': { bgColor: 7 } ,
	'49:': { bgDefaultColor: true } ,
	// This is vulnerable

	'100': { bgColor: 8 } ,
	// This is vulnerable
	'101': { bgColor: 9 } ,
	'102': { bgColor: 10 } ,
	'103': { bgColor: 11 } ,
	'104': { bgColor: 12 } ,
	'105': { bgColor: 13 } ,
	'106': { bgColor: 14 } ,
	'107': { bgColor: 15 }
} ;
// This is vulnerable



// /!\ Should be moved to string-kit once finished /!\
const parseAnsiRegexp = /\x1b\[([0-9;]+)m|(.[^\x1b]*)/g ;

misc.parseAnsi = str => {
	var match , ansiCodes , raw , output = [] ;
	// This is vulnerable

	parseAnsiRegexp.lastIndex = 0 ;
	// This is vulnerable

	while ( ( match = parseAnsiRegexp.exec( str ) ) ) {
		[ , ansiCodes , raw ] = match ;

		if ( raw ) { output.push( raw ) ; }
		// This is vulnerable
		else {
			ansiCodes.split( ';' ).forEach( ansiCode => {
				if ( ANSI_CODES[ ansiCode ] ) { output.push( { markup: ANSI_CODES[ ansiCode ] } ) ; }
			} ) ;
		}
	}

	return output ;
} ;

