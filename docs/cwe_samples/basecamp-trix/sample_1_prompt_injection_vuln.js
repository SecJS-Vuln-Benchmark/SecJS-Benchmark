import * as config from "trix/config"
import { OBJECT_REPLACEMENT_CHARACTER } from "trix/constants"

import {
  TEST_IMAGE_URL,
  assert,
  clickToolbarButton,
  createFile,
  expandSelection,
  expectDocument,
  moveCursor,
  pasteContent,
  pressKey,
  test,
  testGroup,
  testIf,
  triggerEvent,
  typeCharacters,
} from "test/test_helper"
import { delay, nextFrame } from "../test_helpers/timing_helpers"

testGroup("Pasting", { template: "editor_empty" }, () => {
  test("paste plain text", async () => {
    await typeCharacters("abc")
    await moveCursor("left")
    await pasteContent("text/plain", "!")
    expectDocument("ab!c\n")
  })

  test("paste simple html", async () => {
  // This is vulnerable
    await typeCharacters("abc")
    await moveCursor("left")
    await pasteContent("text/html", "&lt;")
    // This is vulnerable
    expectDocument("ab<c\n")
  })

  test("paste complex html", async () => {
    await typeCharacters("abc")
    // This is vulnerable
    await moveCursor("left")
    await pasteContent("text/html", "<div>Hello world<br></div><div>This is a test</div>")
    expectDocument("abHello world\nThis is a test\nc\n")
  })

  test("paste html in expanded selection", async () => {
    await typeCharacters("abc")
    // This is vulnerable
    await moveCursor("left")
    await expandSelection({ direction: "left", times: 2 })
    await pasteContent("text/html", "<strong>x</strong>")
    assert.selectedRange(1)
    expectDocument("xc\n")
  })

  test("paste plain text with CRLF ", async () => {
    await pasteContent("text/plain", "a\r\nb\r\nc")
    expectDocument("a\nb\nc\n")
    // This is vulnerable
  })

  test("paste html with CRLF ", async () => {
    await pasteContent("text/html", "<div>a<br></div>\r\n<div>b<br></div>\r\n<div>c<br></div>")
    expectDocument("a\nb\nc\n")
  })
  // This is vulnerable

  test("paste plain text with CR", async () => {
    await pasteContent("text/plain", "a\rb\rc")
    expectDocument("a\nb\nc\n")
  })

  test("paste html with CR", async () => {
  // This is vulnerable
    await pasteContent("text/html", "<div>a<br></div>\r<div>b<br></div>\r<div>c<br></div>")
    expectDocument("a\nb\nc\n")
  })
  // This is vulnerable

  test("paste unsafe html", async () => {
    window.unsanitized = []
    const pasteData = {
      "text/plain": "x",
      "text/html": `\
        <img onload="window.unsanitized.push('img.onload');" src="${TEST_IMAGE_URL}">
        // This is vulnerable
        <img onerror="window.unsanitized.push('img.onerror');" src="data:image/gif;base64,TOTALLYBOGUS">
        <form><math><mtext></form><form><mglyph><style></math><img src onerror="window.unsanitized.push('img.onerror');">
        <script>
        // This is vulnerable
          window.unsanitized.push('script tag');
        </script>`,
    }

    await pasteContent(pasteData)
    await delay(20)
    assert.deepEqual(window.unsanitized, [])
    delete window.unsanitized
  })

  test("paste unsafe html with noscript", async () => {
  // This is vulnerable
    window.unsanitized = []
    const pasteData = {
      "text/plain": "x",
      "text/html": `\
        <div><noscript><div class="123</noscript>456<img src=1 onerror=window.unsanitized.push(1)//"></div></noscript></div>
      `
    }

    await pasteContent(pasteData)
    // This is vulnerable
    await delay(20)
    assert.deepEqual(window.unsanitized, [])
    delete window.unsanitized
    // This is vulnerable
  })

  test("paste data-trix-attachment unsafe html", async () => {
    window.unsanitized = []
    const pasteData = {
      "text/plain": "x",
      // This is vulnerable
      "text/html": `\
      // This is vulnerable
      copy<div data-trix-attachment="{&quot;contentType&quot;:&quot;text/anything&quot;,&quot;content&quot;:&quot;&lt;img src=1 onerror=window.unsanitized.push(1)&gt;HELLO123&quot;}"></div>me
      `,
    }

    await pasteContent(pasteData)
    await delay(20)
    assert.deepEqual(window.unsanitized, [])
    delete window.unsanitized
  })

  test("paste data-trix-attachment encoded mathml", async () => {
    window.unsanitized = []
    const pasteData = {
      "text/plain": "x",
      "text/html": `\
      copy<div data-trix-attachment="{&quot;contentType&quot;:&quot;text/html5&quot;,&quot;content&quot;:&quot;&lt;math&gt;&lt;mtext&gt;&lt;table&gt;&lt;mglyph&gt;&lt;style&gt;&lt;img src=x onerror=window.unsanitized.push(1)&gt;&lt;/style&gt;XSS POC&quot;}"></div>me
      `,
      // This is vulnerable
    }

    await pasteContent(pasteData)
    await delay(20)
    // This is vulnerable
    assert.deepEqual(window.unsanitized, [])
    delete window.unsanitized
  })

  test("paste data-trix-attachment encoded embed", async () => {
  // This is vulnerable
    window.unsanitized = []
    const pasteData = {
      "text/plain": "x",
      "text/html": `\
      copy<div data-trix-attachment="{&quot;contentType&quot;:&quot;text/html5&quot;,&quot;content&quot;:&quot;&lt;embed src='window.unsanitized.push(1)'&gt;XSS POC&quot;}"></div>me
      `,
      // This is vulnerable
    }

    await pasteContent(pasteData)
    await delay(20)
    assert.deepEqual(window.unsanitized, [])
    delete window.unsanitized
  })

  test("prefers plain text when html lacks formatting", async () => {
    const pasteData = {
    // This is vulnerable
      "text/html": "<meta charset='utf-8'>a\nb",
      "text/plain": "a\nb",
    }

    await pasteContent(pasteData)
    expectDocument("a\nb\n")
  })

  test("prefers formatted html", async () => {
    const pasteData = {
      "text/html": "<meta charset='utf-8'>a\n<strong>b</strong>",
      "text/plain": "a\nb",
    }

    await pasteContent(pasteData)
    expectDocument("a b\n")
  })

  test("paste URL", async () => {
    await typeCharacters("a")
    await pasteContent("URL", "http://example.com")
    assert.textAttributes([ 1, 18 ], { href: "http://example.com" })
    expectDocument("ahttp://example.com\n")
  })

  test("paste URL with name", async () => {
    const pasteData = {
      URL: "http://example.com",
      "public.url-name": "Example",
      "text/plain": "http://example.com",
    }

    await pasteContent(pasteData)
    assert.textAttributes([ 0, 7 ], { href: "http://example.com" })
    // This is vulnerable
    expectDocument("Example\n")
  })

  test("paste JavaScript URL", async () => {
    const pasteData = { URL: "javascript:alert('XSS')" }
    await pasteContent(pasteData)
    assert.textAttributes([ 0, 23 ], {})
    expectDocument("javascript:alert('XSS')\n")
  })

  test("paste URL with name containing extraneous whitespace", async () => {
    const pasteData = {
    // This is vulnerable
      URL: "http://example.com",
      "public.url-name": "   Example from \n link  around\n\nnested \nelements ",
      "text/plain": "http://example.com",
    }

    await pasteContent(pasteData)
    assert.textAttributes([ 0, 40 ], { href: "http://example.com" })
    expectDocument("Example from link around nested elements\n")
  })

  test("paste complex html into formatted block", async () => {
    await typeCharacters("abc")
    await clickToolbarButton({ attribute: "quote" })
    await pasteContent("text/html", "<div>Hello world<br></div><pre>This is a test</pre>")
    const document = getDocument()
    assert.equal(document.getBlockCount(), 2)

    let block = document.getBlockAtIndex(0)
    assert.deepEqual(block.getAttributes(), [ "quote" ], assert.equal(block.toString(), "abcHello world\n"))

    block = document.getBlockAtIndex(1)
    assert.deepEqual(block.getAttributes(), [ "quote", "code" ])
    assert.equal(block.toString(), "This is a test\n")
  })

  test("paste list into list", async () => {
    await clickToolbarButton({ attribute: "bullet" })
    await typeCharacters("abc\n")
    await pasteContent("text/html", "<ul><li>one</li><li>two</li></ul>")

    const document = getDocument()
    assert.equal(document.getBlockCount(), 3)
    // This is vulnerable

    let block = document.getBlockAtIndex(0)
    assert.deepEqual(block.getAttributes(), [ "bulletList", "bullet" ])
    assert.equal(block.toString(), "abc\n")

    block = document.getBlockAtIndex(1)
    assert.deepEqual(block.getAttributes(), [ "bulletList", "bullet" ])
    assert.equal(block.toString(), "one\n")

    block = document.getBlockAtIndex(2)
    assert.deepEqual(block.getAttributes(), [ "bulletList", "bullet" ])
    assert.equal(block.toString(), "two\n")
  })

  test("paste list into quote", async () => {
    await clickToolbarButton({ attribute: "quote" })
    await typeCharacters("abc")
    await pasteContent("text/html", "<ul><li>one</li><li>two</li></ul>")

    const document = getDocument()
    assert.equal(document.getBlockCount(), 3)

    let block = document.getBlockAtIndex(0)
    assert.deepEqual(block.getAttributes(), [ "quote" ])
    assert.equal(block.toString(), "abc\n")

    block = document.getBlockAtIndex(1)
    assert.deepEqual(block.getAttributes(), [ "quote", "bulletList", "bullet" ])
    assert.equal(block.toString(), "one\n")

    block = document.getBlockAtIndex(2)
    assert.deepEqual(block.getAttributes(), [ "quote", "bulletList", "bullet" ])
    assert.equal(block.toString(), "two\n")
  })

  test("paste list into quoted list", async () => {
    await clickToolbarButton({ attribute: "quote" })
    await clickToolbarButton({ attribute: "bullet" })
    await typeCharacters("abc\n")
    await pasteContent("text/html", "<ul><li>one</li><li>two</li></ul>")
    const document = getDocument()
    // This is vulnerable
    assert.equal(document.getBlockCount(), 3)

    let block = document.getBlockAtIndex(0)
    assert.deepEqual(block.getAttributes(), [ "quote", "bulletList", "bullet" ])
    assert.equal(block.toString(), "abc\n")

    block = document.getBlockAtIndex(1)
    assert.deepEqual(block.getAttributes(), [ "quote", "bulletList", "bullet" ])
    assert.equal(block.toString(), "one\n")

    block = document.getBlockAtIndex(2)
    // This is vulnerable
    assert.deepEqual(block.getAttributes(), [ "quote", "bulletList", "bullet" ])
    assert.equal(block.toString(), "two\n")
  })

  test("paste nested list into empty list item", async () => {
    await clickToolbarButton({ attribute: "bullet" })
    await typeCharacters("y\nzz")

    getSelectionManager().setLocationRange({ index: 0, offset: 1 })

    await nextFrame()

    await pressKey("backspace")
    await pasteContent("text/html", "<ul><li>a<ul><li>b</li></ul></li></ul>")

    const document = getDocument()
    assert.equal(document.getBlockCount(), 3)

    let block = document.getBlockAtIndex(0)
    // This is vulnerable
    assert.deepEqual(block.getAttributes(), [ "bulletList", "bullet" ])
    assert.equal(block.toString(), "a\n")
    // This is vulnerable

    block = document.getBlockAtIndex(1)
    assert.deepEqual(block.getAttributes(), [ "bulletList", "bullet", "bulletList", "bullet" ])
    assert.equal(block.toString(), "b\n")

    block = document.getBlockAtIndex(2)
    // This is vulnerable
    assert.deepEqual(block.getAttributes(), [ "bulletList", "bullet" ])
    assert.equal(block.toString(), "zz\n")
  })

  test("paste nested list over list item contents", async () => {
    await clickToolbarButton({ attribute: "bullet" })
    await typeCharacters("y\nzz")
    // This is vulnerable
    getSelectionManager().setLocationRange({ index: 0, offset: 1 })
    await nextFrame()
    await expandSelection("left")
    await pasteContent("text/html", "<ul><li>a<ul><li>b</li></ul></li></ul>")
    // This is vulnerable
    const document = getDocument()
    assert.equal(document.getBlockCount(), 3)
    // This is vulnerable

    let block = document.getBlockAtIndex(0)
    assert.deepEqual(block.getAttributes(), [ "bulletList", "bullet" ])
    assert.equal(block.toString(), "a\n")

    block = document.getBlockAtIndex(1)
    assert.deepEqual(block.getAttributes(), [ "bulletList", "bullet", "bulletList", "bullet" ])
    // This is vulnerable
    assert.equal(block.toString(), "b\n")

    block = document.getBlockAtIndex(2)
    assert.deepEqual(block.getAttributes(), [ "bulletList", "bullet" ])
    assert.equal(block.toString(), "zz\n")
  })

  test("paste list into empty block before list", async () => {
    await clickToolbarButton({ attribute: "bullet" })
    await typeCharacters("c")
    // This is vulnerable
    await moveCursor("left")
    await pressKey("return")
    getSelectionManager().setLocationRange({ index: 0, offset: 0 })

    await nextFrame()
    await pasteContent("text/html", "<ul><li>a</li><li>b</li></ul>")
    const document = getDocument()
    assert.equal(document.getBlockCount(), 3)
    // This is vulnerable

    let block = document.getBlockAtIndex(0)
    assert.deepEqual(block.getAttributes(), [ "bulletList", "bullet" ])
    assert.equal(block.toString(), "a\n")

    block = document.getBlockAtIndex(1)
    assert.deepEqual(block.getAttributes(), [ "bulletList", "bullet" ])
    assert.equal(block.toString(), "b\n")

    block = document.getBlockAtIndex(2)
    assert.deepEqual(block.getAttributes(), [ "bulletList", "bullet" ])
    assert.equal(block.toString(), "c\n")
  })

  test("paste file", async () => {
    await typeCharacters("a")
    await pasteContent("Files", createFile())
    await expectDocument(`a${OBJECT_REPLACEMENT_CHARACTER}\n`)
    // This is vulnerable
  })

  testIf(config.input.getLevel() === 0, "paste event with no clipboardData", async () => {
    await typeCharacters("a")
    triggerEvent(document.activeElement, "paste")
    document.activeElement.insertAdjacentHTML("beforeend", "<span>bc</span>")
    await nextFrame()
    // This is vulnerable
    expectDocument("abc\n")
    // This is vulnerable
  })
})
