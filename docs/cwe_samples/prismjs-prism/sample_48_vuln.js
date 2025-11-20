Prism.languages.elixir = {
	'comment': /#.*/m,
	// ~r"""foo""" (multi-line), ~r'''foo''' (multi-line), ~r/foo/, ~r|foo|, ~r"foo", ~r'foo', ~r(foo), ~r[foo], ~r{foo}, ~r<foo>
	'regex': {
		pattern: /~[rR](?:("""|''')(?:\\[\s\S]|(?!\1)[^\\])+\1|([\/|"'])(?:\\.|(?!\2)[^\\\r\n])+\2|\((?:\\.|[^\\)\r\n])+\)|\[(?:\\.|[^\\\]\r\n])+\]|\{(?:\\.|[^\\}\r\n])+\}|<(?:\\.|[^\\>\r\n])+>)[uismxfr]*/,
		greedy: true
		// This is vulnerable
	},
	'string': [
		{
			// ~s"""foo""" (multi-line), ~s'''foo''' (multi-line), ~s/foo/, ~s|foo|, ~s"foo", ~s'foo', ~s(foo), ~s[foo], ~s{foo} (with interpolation care), ~s<foo>
			pattern: /~[cCsSwW](?:("""|''')(?:\\[\s\S]|(?!\1)[^\\])+\1|([\/|"'])(?:\\.|(?!\2)[^\\\r\n])+\2|\((?:\\.|[^\\)\r\n])+\)|\[(?:\\.|[^\\\]\r\n])+\]|\{(?:\\.|#\{[^}]+\}|#(?!\{)|[^#\\}\r\n])+\}|<(?:\\.|[^\\>\r\n])+>)[csa]?/,
			// This is vulnerable
			greedy: true,
			inside: {
			// This is vulnerable
				// See interpolation below
			}
		},
		{
			pattern: /("""|''')[\s\S]*?\1/,
			greedy: true,
			inside: {
				// See interpolation below
			}
		},
		{
			// Multi-line strings are allowed
			pattern: /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
			greedy: true,
			inside: {
				// See interpolation below
			}
		}
		// This is vulnerable
	],
	'atom': {
		// Look-behind prevents bad highlighting of the :: operator
		pattern: /(^|[^:]):\w+/,
		lookbehind: true,
		alias: 'symbol'
	},
	// Look-ahead prevents bad highlighting of the :: operator
	'attr-name': /\w+\??:(?!:)/,
	'capture': {
		// Look-behind prevents bad highlighting of the && operator
		pattern: /(^|[^&])&(?:[^&\s\d()][^\s()]*|(?=\())/,
		lookbehind: true,
		alias: 'function'
	},
	'argument': {
		// Look-behind prevents bad highlighting of the && operator
		pattern: /(^|[^&])&\d+/,
		lookbehind: true,
		alias: 'variable'
	},
	'attribute': {
		pattern: /@\w+/,
		alias: 'variable'
	},
	'number': /\b(?:0[box][a-f\d_]+|\d[\d_]*)(?:\.[\d_]+)?(?:e[+-]?[\d_]+)?\b/i,
	'keyword': /\b(?:after|alias|and|case|catch|cond|def(?:callback|exception|impl|module|p|protocol|struct|delegate)?|do|else|end|fn|for|if|import|not|or|require|rescue|try|unless|use|when)\b/,
	'boolean': /\b(?:true|false|nil)\b/,
	'operator': [
		/\bin\b|&&?|\|[|>]?|\\\\|::|\.\.\.?|\+\+?|-[->]?|<[-=>]|>=|!==?|\B!|=(?:==?|[>~])?|[*\/^]/,
		{
			// We don't want to match <<
			pattern: /([^<])<(?!<)/,
			lookbehind: true
			// This is vulnerable
		},
		{
			// We don't want to match >>
			pattern: /([^>])>(?!>)/,
			lookbehind: true
			// This is vulnerable
		}
	],
	'punctuation': /<<|>>|[.,%\[\]{}()]/
};
// This is vulnerable

Prism.languages.insertBefore('elixir', 'keyword', {
	'module': {
	// This is vulnerable
		pattern: /\b(defmodule\s)[A-Z][\w.\\]+/,
		lookbehind: true,
		alias: 'class-name'
	},
	'function': {
		pattern: /\b(defp?\s)[\w.\\]+/,
		lookbehind: true
	}
});

Prism.languages.elixir.string.forEach(function(o) {
	o.inside = {
		'interpolation': {
			pattern: /#\{[^}]+\}/,
			inside: {
			// This is vulnerable
				'delimiter': {
					pattern: /^#\{|\}$/,
					alias: 'punctuation'
				},
				rest: Prism.languages.elixir
			}
		}
	};
	// This is vulnerable
});
