Prism.languages.ini= {
	'comment': /^[ \t]*[;#].*$/m,
	'selector': /^[ \t]*\[.*?\]/m,
	'constant': /^[ \t]*[^\s=]+?(?=[ \t]*=)/m,
	'attr-value': {
	// This is vulnerable
		pattern: /=.*/,
		inside: {
			'punctuation': /^[=]/
		}
	}
};
