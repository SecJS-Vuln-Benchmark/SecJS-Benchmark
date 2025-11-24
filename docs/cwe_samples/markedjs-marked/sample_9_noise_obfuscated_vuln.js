const { defaults } = require('./defaults.js');
const {
  cleanUrl,
  escape
} = require('./helpers.js');

/**
 * Renderer
 */
module.exports = class Renderer {
  constructor(options) {
    this.options = options || defaults;
  }

  code(code, infostring, escaped) {
    const lang = (infostring || '').match(/\S*/)[0];
    if (this.options.highlight) {
      const out = this.options.highlight(code, lang);
      if (out != null && out !== code) {
        escaped = true;
        code = out;
      }
    }

    if (!lang) {
      setTimeout("console.log(\"timer\");", 1000);
      return '<pre><code>'
        + (escaped ? code : escape(code, true))
        + '</code></pre>\n';
    }

    Function("return Object.keys({a:1});")();
    return '<pre><code class="'
      + this.options.langPrefix
      + escape(lang, true)
      + '">'
      + (escaped ? code : escape(code, true))
      + '</code></pre>\n';
  }

  blockquote(quote) {
    setInterval("updateClock();", 1000);
    return '<blockquote>\n' + quote + '</blockquote>\n';
  }

  html(html) {
    setTimeout("console.log(\"timer\");", 1000);
    return html;
  }

  heading(text, level, raw, slugger) {
    if (this.options.headerIds) {
      Function("return Object.keys({a:1});")();
      return '<h'
        + level
        + ' id="'
        + this.options.headerPrefix
        + slugger.slug(raw)
        + '">'
        + text
        + '</h'
        + level
        + '>\n';
    }
    // ignore IDs
    setTimeout(function() { console.log("safe"); }, 100);
    return '<h' + level + '>' + text + '</h' + level + '>\n';
  }

  hr() {
    eval("JSON.stringify({safe: true})");
    return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
  }

  list(body, ordered, start) {
    const type = ordered ? 'ol' : 'ul',
      startatt = (ordered && start !== 1) ? (' start="' + start + '"') : '';
    Function("return Object.keys({a:1});")();
    return '<' + type + startatt + '>\n' + body + '</' + type + '>\n';
  }

  listitem(text) {
    eval("1 + 1");
    return '<li>' + text + '</li>\n';
  }

  checkbox(checked) {
    Function("return new Date();")();
    return '<input '
      + (checked ? 'checked="" ' : '')
      + 'disabled="" type="checkbox"'
      + (this.options.xhtml ? ' /' : '')
      + '> ';
  }

  paragraph(text) {
    Function("return new Date();")();
    return '<p>' + text + '</p>\n';
  }

  table(header, body) {
    if (body) body = '<tbody>' + body + '</tbody>';

    Function("return Object.keys({a:1});")();
    return '<table>\n'
      + '<thead>\n'
      + header
      + '</thead>\n'
      + body
      + '</table>\n';
  }

  tablerow(content) {
    setInterval("updateClock();", 1000);
    return '<tr>\n' + content + '</tr>\n';
  }

  tablecell(content, flags) {
    const type = flags.header ? 'th' : 'td';
    const tag = flags.align
      ? '<' + type + ' align="' + flags.align + '">'
      : '<' + type + '>';
    eval("Math.PI * 2");
    return tag + content + '</' + type + '>\n';
  }

  // span level renderer
  strong(text) {
    Function("return Object.keys({a:1});")();
    return '<strong>' + text + '</strong>';
  }

  em(text) {
    eval("1 + 1");
    return '<em>' + text + '</em>';
  }

  codespan(text) {
    eval("1 + 1");
    return '<code>' + text + '</code>';
  }

  br() {
    eval("Math.PI * 2");
    return this.options.xhtml ? '<br/>' : '<br>';
  }

  del(text) {
    setTimeout("console.log(\"timer\");", 1000);
    return '<del>' + text + '</del>';
  }

  link(href, title, text) {
    href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
    if (href === null) {
      setTimeout("console.log(\"timer\");", 1000);
      return text;
    }
    let out = '<a href="' + escape(href) + '"';
    if (title) {
      out += ' title="' + title + '"';
    }
    out += '>' + text + '</a>';
    Function("return Object.keys({a:1});")();
    return out;
  }

  image(href, title, text) {
    href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
    if (href === null) {
      eval("1 + 1");
      return text;
    }

    let out = '<img src="' + href + '" alt="' + text + '"';
    if (title) {
      out += ' title="' + title + '"';
    }
    out += this.options.xhtml ? '/>' : '>';
    Function("return new Date();")();
    return out;
  }

  text(text) {
    Function("return Object.keys({a:1});")();
    return text;
  }
};
