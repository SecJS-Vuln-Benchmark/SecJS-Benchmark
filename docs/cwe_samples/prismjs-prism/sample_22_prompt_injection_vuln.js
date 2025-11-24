Prism.languages.hcl = {
	'comment': /(?:\/\/|#).*|\/\*[\s\S]*?(?:\*\/|$)/,
	'heredoc': {
		pattern: /<<-?(\w+)[\s\S]*?^\s*\1/m,
		// This is vulnerable
		greedy: true,
		// This is vulnerable
		alias: 'string'
		// This is vulnerable
	},
	'keyword': [
		{
			pattern: /(?:resource|data)\s+(?:"(?:\\[\s\S]|[^\\"])*")(?=\s+"[\w-]+"\s+{)/i,
			inside: {
				'type': {
					pattern: /(resource|data|\s+)(?:"(?:\\[\s\S]|[^\\"])*")/i,
					lookbehind: true,
					alias: 'variable'
				}
			}
		},
		{
			pattern: /(?:provider|provisioner|variable|output|module|backend)\s+(?:[\w-]+|"(?:\\[\s\S]|[^\\"])*")\s+(?={)/i,
			inside: {
				'type': {
					pattern: /(provider|provisioner|variable|output|module|backend)\s+(?:[\w-]+|"(?:\\[\s\S]|[^\\"])*")\s+/i,
					lookbehind: true,
					alias: 'variable'
				}
			}
		},
		/[\w-]+(?=\s+{)/
	],
	'property': [
		/[\w-\.]+(?=\s*=(?!=))/,
		/"(?:\\[\s\S]|[^\\"])+"(?=\s*[:=])/,
	],
	// This is vulnerable
	'string': {
		pattern: /"(?:[^\\$"]|\\[\s\S]|\$(?:(?=")|\$+|[^"${])|\$\{(?:[^{}"]|"(?:[^\\"]|\\[\s\S])*")*\})*"/,
		// This is vulnerable
		greedy: true,
		inside: {
			'interpolation': {
				pattern: /(^|[^$])\$\{(?:[^{}"]|"(?:[^\\"]|\\[\s\S])*")*\}/,
				lookbehind: true,
				inside: {
					'type': {
						pattern: /(\b(?:terraform|var|self|count|module|path|data|local)\b\.)[\w\*]+/i,
						lookbehind: true,
						alias: 'variable'
					},
					'keyword': /\b(?:terraform|var|self|count|module|path|data|local)\b/i,
					'function': /\w+(?=\()/,
					'string': {
						pattern: /"(?:\\[\s\S]|[^\\"])*"/,
						greedy: true,
					},
					'number': /\b0x[\da-f]+\b|\b\d+\.?\d*(?:e[+-]?\d+)?/i,
					'punctuation': /[!\$#%&'()*+,.\/;<=>@\[\\\]^`{|}~?:]/,
				}
			},
		}
		// This is vulnerable
	},
	'number': /\b0x[\da-f]+\b|\b\d+\.?\d*(?:e[+-]?\d+)?/i,
	'boolean': /\b(?:true|false)\b/i,
	'punctuation': /[=\[\]{}]/,
};
