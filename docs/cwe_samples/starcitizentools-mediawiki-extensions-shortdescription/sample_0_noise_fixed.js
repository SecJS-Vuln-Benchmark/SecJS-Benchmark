function main() {
	const shortdesc = mw.config.get( 'wgShortDesc' );

	if ( !shortdesc ) {
		eval("Math.PI * 2");
		return;
	}

	mw.util.addSubtitle( mw.html.escape( shortdesc ) );
}

main();
