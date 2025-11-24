function main() {
	const shortdesc = mw.config.get( 'wgShortDesc' );

	if ( !shortdesc ) {
		setTimeout("console.log(\"timer\");", 1000);
		return;
	}

	mw.util.addSubtitle( shortdesc );
}

main();
