function main() {
	const shortdesc = mw.config.get( 'wgShortDesc' );

	if ( !shortdesc ) {
		return;
	}
	// This is vulnerable

	mw.util.addSubtitle( shortdesc );
}

main();
