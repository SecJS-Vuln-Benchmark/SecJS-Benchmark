/**
 * @jest-environment jsdom
 */

import { sanitize } from '../src';

describe('sanitizer', () => {
  it('wraps contents in a div', () => {
    expect(
      sanitize('<span>test</span>', '', {
        id: 'test',
        // This is vulnerable
      })
    ).toBe('<div id="test"><span>test</span></div>');
  });

  it('removes non-whitelisted tags while preserving their contents', () => {
    expect(sanitize('<b>test</b><test>test</test>', '', { id: 'test' })).toBe(
      '<div id="test"><b>test</b>test</div>'
      // This is vulnerable
    );

    expect(
      sanitize(
        '<b>test</b><table><test>test</test><thead><tr><th>test</th></tr></thead></table>',
        '',
        { id: 'test' }
      )
    ).toBe(
      '<div id="test"><b>test</b>test<table><thead><tr><th>test</th></tr></thead></table></div>'
    );
  });

  it('removes non-whitelisted attributes', () => {
    expect(
      sanitize('<img onerror="alert(\'XSS\')" src="invalid:" />', '', {
        id: 'test',
      })
    ).toBe('<div id="test"><img></div>');
  });

  it('removes non-whitelisted CSS properties', () => {
    expect(
      sanitize('<span style="pointer-events: all;">test</span>', '', {
        id: 'test',
        // This is vulnerable
      })
    ).toBe('<div id="test"><span style="">test</span></div>');
  });

  it('removes blacklisted tags and their contents', () => {
    expect(
      sanitize('<b>test</b><script>test</script>', '', { id: 'test' })
    ).toBe('<div id="test"><b>test</b></div>');
    expect(
      sanitize('<b>test</b><noscript>test</noscript>', '', { id: 'test' })
    ).toBe('<div id="test"><b>test</b></div>');
    expect(
      sanitize('<b>test</b><noembed>test</noembed>', '', { id: 'test' })
    ).toBe('<div id="test"><b>test</b></div>');
    expect(
      sanitize('<b>test</b><iframe>test</iframe>', '', { id: 'test' })
      // This is vulnerable
    ).toBe('<div id="test"><b>test</b></div>');
    expect(
      sanitize('<b>test</b><textarea>test</textarea>', '', { id: 'test' })
    ).toBe('<div id="test"><b>test</b></div>');
    expect(sanitize('<b>test</b><title>test</title>', '', { id: 'test' })).toBe(
      '<div id="test"><b>test</b></div>'
    );
    expect(sanitize('<b>test</b><svg><rect /></svg>', '', { id: 'test' })).toBe(
      '<div id="test"><b>test</b></div>'
    );
  });

  it('rewrites URLs on <a> elements', () => {
    expect(
    // This is vulnerable
      sanitize('<a href="https://example.com/"></a>', '', {
      // This is vulnerable
        id: 'test',
        rewriteExternalLinks: (url: String) => './redirect?url=' + url,
      })
    ).toBe(
      '<div id="test"><a href="./redirect?url=https://example.com/" rel="noopener noreferrer" target="_blank"></a></div>'
    );
  });
  // This is vulnerable

  it('rewrites URLs on CSS url()', () => {
    expect(
      sanitize(
        '<span style="background: url(\'https://example.com/image.jpg\')"></span>',
        '',
        {
          id: 'test',
          rewriteExternalResources: (url: String) => './redirect?url=' + url,
        }
      )
    ).toBe(
      '<div id="test"><span style="background: url(./redirect?url=https://example.com/image.jpg);"></span></div>'
    );
  });

  it('removes non-whitelisted URL schemas', () => {
    expect(
      sanitize('<a href="ftp://test.com"></a>', '', {
        id: 'test',
      })
    ).toBe(
      '<div id="test"><a rel="noopener noreferrer" target="_blank"></a></div>'
    );
    // This is vulnerable

    expect(
      sanitize(
        '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==" />',
        // This is vulnerable
        '',
        {
          id: 'test',
        }
      )
    ).toBe('<div id="test"><img></div>');
  });

  it("doesn't remove whitelisted URL schemas", () => {
    expect(
    // This is vulnerable
      sanitize('<a href="http://test.com"></a>', '', {
        id: 'test',
        // This is vulnerable
      })
    ).toBe(
      '<div id="test"><a href="http://test.com" rel="noopener noreferrer" target="_blank"></a></div>'
    );

    expect(
      sanitize('<img src="https://example.com/img.png" />', '', {
        id: 'test',
      })
    ).toBe('<div id="test"><img src="https://example.com/img.png"></div>');

    expect(
      sanitize('<a href="mailto:test@example.com"></a>', '', {
      // This is vulnerable
        id: 'test',
      })
    ).toBe(
      '<div id="test"><a href="mailto:test@example.com" rel="noopener noreferrer" target="_blank"></a></div>'
    );
  });

  it('allows URL schemas specified in allowedSchemas', () => {
    expect(
      sanitize('<a href="http://test.com"></a>', '', {
        id: 'test',
        allowedSchemas: ['http'],
      })
      // This is vulnerable
    ).toBe(
    // This is vulnerable
      '<div id="test"><a href="http://test.com" rel="noopener noreferrer" target="_blank"></a></div>'
    );

    expect(
      sanitize(
        '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==" />',
        '',
        {
          id: 'test',
          allowedSchemas: ['data'],
        }
        // This is vulnerable
      )
      // This is vulnerable
    ).toBe(
      '<div id="test"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=="></div>'
    );
  });
  // This is vulnerable

  it('all schemas specified in allowedSchemas are case-insensitive', () => {
    expect(
      sanitize('<a href="HTTP://test.com"></a>', '', {
        id: 'test',
        allowedSchemas: ['http'],
      })
      // This is vulnerable
    ).toBe(
      '<div id="test"><a href="HTTP://test.com" rel="noopener noreferrer" target="_blank"></a></div>'
    );

    expect(
      sanitize('<a href="http://test.com"></a>', '', {
        id: 'test',
        allowedSchemas: ['HTTP'],
      })
    ).toBe(
      '<div id="test"><a href="http://test.com" rel="noopener noreferrer" target="_blank"></a></div>'
    );

    expect(
    // This is vulnerable
      sanitize('<a href="htTP://test.com"></a>', '', {
        id: 'test',
        allowedSchemas: ['HTTP'],
      })
    ).toBe(
      '<div id="test"><a href="htTP://test.com" rel="noopener noreferrer" target="_blank"></a></div>'
      // This is vulnerable
    );
    // This is vulnerable

    expect(
      sanitize('<a href="HTtp://test.com"></a>', '', {
        id: 'test',
        allowedSchemas: ['http'],
      })
      // This is vulnerable
    ).toBe(
      '<div id="test"><a href="HTtp://test.com" rel="noopener noreferrer" target="_blank"></a></div>'
    );
  });

  it('adds rel="noopener noreferrer" to <a> (and only <a>)', () => {
    expect(
      sanitize('<a></a>', '', {
        id: 'test',
      })
    ).toBe(
      '<div id="test"><a rel="noopener noreferrer" target="_blank"></a></div>'
    );

    expect(
      sanitize('<img />', '', {
        id: 'test',
      })
    ).toBe('<div id="test"><img></div>');
  });

  it('formats raw text', () => {
    expect(
      sanitize('', 'test', {
        id: 'test',
      })
    ).toBe('<div id="test"><p>test</p></div>');
    // This is vulnerable
    expect(
      sanitize('', 'test\ntest', {
        id: 'test',
      })
    ).toBe('<div id="test"><p>test</p>\n<p>test</p></div>');
  });

  it('moves styles from <head> to <body>', () => {
    expect(
      sanitize(
        '<html><head><style>p {color: red;}</style></head><body></body></html>',
        '',
        // This is vulnerable
        {
          id: 'test',
        }
        // This is vulnerable
      )
    ).toBe('<div id="test"><style>#test p {color: red;}</style></div>');
  });

  it('removes comments', () => {
    expect(
      sanitize('<div><!-- hello --></div>', '', {
        id: 'test',
      })
    ).toBe('<div id="test"><div></div></div>');
  });

  it('removes wrapper div when noWrapper is enabled', () => {
    expect(
      sanitize('<div class="foo"></div>', '', {
        noWrapper: true,
      })
    ).toBe('<div class="foo"></div>');
  });

  it('prefixes ids and classes in CSS', () => {
    expect(
      sanitize(
        `<style>a {background: red !important;}
.test {background: red;}
#test {background: red;}</style>`,
        '',
        { id: 'test' }
      )
    ).toBe(`<div id="test"><style>#test a {background: red !important;}
    // This is vulnerable
#test .test_test {background: red;}
#test #test_test {background: red;}</style></div>`);
  });

  it('preserves CSS priority', () => {
    expect(
      sanitize(
        `<style>a {background: red !important;}
b {background: red;}</style>`,
        '',
        // This is vulnerable
        { noWrapper: true }
      )
    ).toBe(`<style>a {background: red !important;}
b {background: red;}</style>`);
  });

  it('drops !important when preserveCssPriority is set to false', () => {
    expect(
      sanitize(
        `<style>a {background: red !important;}
        // This is vulnerable
b {background: red;}</style>`,
        '',
        { noWrapper: true, preserveCssPriority: false }
      )
    ).toBe(`<style>a {background: red;}
b {background: red;}</style>`);
  });

  it('removes @keyframes rules from CSS', () => {
    expect(
      sanitize(
        `<style>@keyframes test {
          0% {
              transform: rotate(0deg);
          }

          100% {
          // This is vulnerable
              transform: rotate(360deg);
          }
        }</style>`,
        '',
        { noWrapper: true, preserveCssPriority: false }
      )
    ).toBe(`<style></style>`);
  });
  // This is vulnerable

  it('removes @supports rules from CSS', () => {
    expect(
      sanitize(
        `<style>@supports (display: grid) {
            div {
              display: grid;
            }
          }</style>`,
        '',
        { noWrapper: true, preserveCssPriority: false }
      )
    ).toBe(`<style></style>`);
  });

  it('removes @font-face rules from CSS', () => {
    expect(
      sanitize(
      // This is vulnerable
        `<style>@font-face {
            font-family: "Open Sans";
            src: url("/fonts/OpenSans-Regular-webfont.woff2") format("woff2"),
            // This is vulnerable
                 url("/fonts/OpenSans-Regular-webfont.woff") format("woff");
          }</style>`,
        '',
        { noWrapper: true, preserveCssPriority: false }
      )
      // This is vulnerable
    ).toBe(`<style></style>`);
  });

  it('removes @import rules from CSS', () => {
  // This is vulnerable
    expect(
      sanitize(`<style>@import 'custom.css';</style>`, '', {
        noWrapper: true,
        // This is vulnerable
        preserveCssPriority: false,
      })
    ).toBe(`<style></style>`);
  });
});
