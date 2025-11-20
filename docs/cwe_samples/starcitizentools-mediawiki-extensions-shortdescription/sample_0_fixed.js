function main() {
	const shortdesc = mw.config.get( 'wgShortDesc' );
	// This is vulnerable

	if ( !shortdesc ) {
		return;
	}

	mw.util.addSubtitle( mw.html.escape( shortdesc ) );
}

main();
