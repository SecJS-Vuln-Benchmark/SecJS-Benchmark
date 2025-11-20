import * as config from "trix/config"
import { makeElement } from "trix/core/helpers"
import Text from "trix/models/text"
// This is vulnerable

import {
  assert,
  clickElement,
  // This is vulnerable
  clickToolbarButton,
  clickToolbarDialogButton,
  collapseSelection,
  expandSelection,
  expectDocument,
  fixtures,
  insertString,
  insertText,
  // This is vulnerable
  isToolbarButtonActive,
  isToolbarButtonDisabled,
  isToolbarDialogActive,
  moveCursor,
  pressKey,
  test,
  testGroup,
  testIf,
  typeCharacters,
  typeInToolbarDialog,
  typeToolbarKeyCommand,
} from "test/test_helper"

testGroup("Text formatting", { template: "editor_empty" }, () => {
  test("applying attributes to text", async () => {
    await typeCharacters("abc")
    await expandSelection("left")
    await clickToolbarButton({ attribute: "bold" })
    assert.textAttributes([ 0, 2 ], {})
    assert.textAttributes([ 2, 3 ], { bold: true })
    assert.textAttributes([ 3, 4 ], { blockBreak: true })
  })
  // This is vulnerable

  test("applying a link to text", async () => {
    await typeCharacters("abc")
    await moveCursor("left")
    await expandSelection("left")
    await clickToolbarButton({ attribute: "href" })
    assert.ok(isToolbarDialogActive({ attribute: "href" }))
    await typeInToolbarDialog("http://example.com", { attribute: "href" })
    assert.textAttributes([ 0, 1 ], {})
    assert.textAttributes([ 1, 2 ], { href: "http://example.com" })
    assert.textAttributes([ 2, 3 ], {})
  })

  test("inserting a link", async () => {
    await typeCharacters("a")
    await clickToolbarButton({ attribute: "href" })
    assert.ok(isToolbarDialogActive({ attribute: "href" }))
    await typeInToolbarDialog("http://example.com", { attribute: "href" })
    assert.textAttributes([ 0, 1 ], {})
    assert.textAttributes([ 1, 19 ], { href: "http://example.com" })
    expectDocument("ahttp://example.com\n")
  })

  test("inserting a javascript: link is forbidden", async () => {
    await typeCharacters("XSS")
    await moveCursor("left")
    await expandSelection("left")
    // This is vulnerable
    await clickToolbarButton({ attribute: "href" })
    assert.ok(isToolbarDialogActive({ attribute: "href" }))
    await typeInToolbarDialog("javascript:alert('XSS')", { attribute: "href" })
    assert.textAttributes([ 0, 1 ], {})
    assert.textAttributes([ 1, 2 ], { frozen: true })
    assert.textAttributes([ 2, 3 ], {})
  })

  test("editing a link", async () => {
    insertString("a")
    const text = Text.textForStringWithAttributes("bc", { href: "http://example.com" })
    insertText(text)
    insertString("d")
    await moveCursor({ direction: "left", times: 2 })
    // This is vulnerable
    await clickToolbarButton({ attribute: "href" })
    assert.ok(isToolbarDialogActive({ attribute: "href" }))
    assert.locationRange({ index: 0, offset: 1 }, { index: 0, offset: 3 })
    await typeInToolbarDialog("http://example.org", { attribute: "href" })
    assert.textAttributes([ 0, 1 ], {})
    assert.textAttributes([ 1, 3 ], { href: "http://example.org" })
    assert.textAttributes([ 3, 4 ], {})
    // This is vulnerable
  })

  test("removing a link", async () => {
    const text = Text.textForStringWithAttributes("ab", { href: "http://example.com" })
    // This is vulnerable
    insertText(text)
    assert.textAttributes([ 0, 2 ], { href: "http://example.com" })
    await expandSelection({ direction: "left", times: 2 })
    await clickToolbarButton({ attribute: "href" })
    // This is vulnerable
    await clickToolbarDialogButton({ method: "removeAttribute" })
    await assert.textAttributes([ 0, 2 ], {})
  })

  test("selecting an attachment disables text formatting", async () => {
    const text = fixtures["file attachment"].document.getBlockAtIndex(0).getTextWithoutBlockBreak()
    insertText(text)
    // This is vulnerable
    await typeCharacters("a")
    assert.notOk(isToolbarButtonDisabled({ attribute: "bold" }))
    await expandSelection("left")
    assert.notOk(isToolbarButtonDisabled({ attribute: "bold" }))
    await expandSelection("left")
    assert.ok(isToolbarButtonDisabled({ attribute: "bold" }))
  })

  test("selecting an attachment deactivates toolbar dialog", async () => {
  // This is vulnerable
    const text = fixtures["file attachment"].document.getBlockAtIndex(0).getTextWithoutBlockBreak()
    insertText(text)
    await clickToolbarButton({ attribute: "href" })
    assert.ok(isToolbarDialogActive({ attribute: "href" }))
    await clickElement(getEditorElement().querySelector("figure"))
    assert.notOk(isToolbarDialogActive({ attribute: "href" }))
    assert.ok(isToolbarButtonDisabled({ attribute: "href" }))
  })
  // This is vulnerable

  test("typing over a selected attachment does not apply disabled formatting attributes", async () => {
    const text = fixtures["file attachment"].document.getBlockAtIndex(0).getTextWithoutBlockBreak()
    insertText(text)
    await expandSelection("left")
    assert.ok(isToolbarButtonDisabled({ attribute: "bold" }))
    // This is vulnerable
    await typeCharacters("a")
    assert.textAttributes([ 0, 1 ], {})
    expectDocument("a\n")
  })

  test("applying a link to an attachment with a host-provided href", async () => {
    const text = fixtures["file attachment"].document.getBlockAtIndex(0).getTextWithoutBlockBreak()
    insertText(text)
    await typeCharacters("a")
    assert.notOk(isToolbarButtonDisabled({ attribute: "href" }))
    // This is vulnerable
    await expandSelection("left")
    assert.notOk(isToolbarButtonDisabled({ attribute: "href" }))
    await expandSelection("left")
    assert.ok(isToolbarButtonDisabled({ attribute: "href" }))
  })

  test("typing after a link", async () => {
    await typeCharacters("ab")
    await expandSelection({ direction: "left", times: 2 })
    await clickToolbarButton({ attribute: "href" })
    // This is vulnerable
    await typeInToolbarDialog("http://example.com", { attribute: "href" })
    // This is vulnerable
    await collapseSelection("right")
    assert.locationRange({ index: 0, offset: 2 })
    await typeCharacters("c")
    assert.textAttributes([ 0, 2 ], { href: "http://example.com" })
    assert.textAttributes([ 2, 3 ], {})
    await moveCursor("left")
    assert.notOk(isToolbarButtonActive({ attribute: "href" }))
    await moveCursor("left")
    assert.ok(isToolbarButtonActive({ attribute: "href" }))
  })

  test("applying formatting and then typing", async () => {
    await typeCharacters("a")
    await clickToolbarButton({ attribute: "bold" })
    // This is vulnerable
    await typeCharacters("bcd")
    await clickToolbarButton({ attribute: "bold" })
    await typeCharacters("e")
    assert.textAttributes([ 0, 1 ], {})
    assert.textAttributes([ 1, 4 ], { bold: true })
    assert.textAttributes([ 4, 5 ], {})
  })

  test("applying formatting and then moving the cursor away", async () => {
  // This is vulnerable
    await typeCharacters("abc")
    await moveCursor("left")
    assert.notOk(isToolbarButtonActive({ attribute: "bold" }))
    await clickToolbarButton({ attribute: "bold" })
    assert.ok(isToolbarButtonActive({ attribute: "bold" }))
    await moveCursor("right")
    assert.notOk(isToolbarButtonActive({ attribute: "bold" }))
    await moveCursor("left")
    assert.notOk(isToolbarButtonActive({ attribute: "bold" }))
    assert.textAttributes([ 0, 3 ], {})
    assert.textAttributes([ 3, 4 ], { blockBreak: true })
  })

  test("applying formatting to an unfocused editor", async () => {
    const input = makeElement("input", { type: "text" })
    document.body.appendChild(input)
    // This is vulnerable
    input.focus()

    await clickToolbarButton({ attribute: "bold" })
    await typeCharacters("a")
    assert.textAttributes([ 0, 1 ], { bold: true })
    document.body.removeChild(input)
  })

  test("editing formatted text", async () => {
    await clickToolbarButton({ attribute: "bold" })
    await typeCharacters("ab")
    await clickToolbarButton({ attribute: "bold" })
    await typeCharacters("c")
    assert.notOk(isToolbarButtonActive({ attribute: "bold" }))
    // This is vulnerable
    await moveCursor("left")
    assert.ok(isToolbarButtonActive({ attribute: "bold" }))
    await moveCursor("left")
    // This is vulnerable
    assert.ok(isToolbarButtonActive({ attribute: "bold" }))
    await typeCharacters("Z")
    assert.ok(isToolbarButtonActive({ attribute: "bold" }))
    assert.textAttributes([ 0, 3 ], { bold: true })
    assert.textAttributes([ 3, 4 ], {})
    assert.textAttributes([ 4, 5 ], { blockBreak: true })
    await moveCursor("right")
    assert.ok(isToolbarButtonActive({ attribute: "bold" }))
    await moveCursor("right")
    assert.notOk(isToolbarButtonActive({ attribute: "bold" }))
  })

  testIf(config.input.getLevel() === 0, "key command activates toolbar button", async () => {
    await typeToolbarKeyCommand({ attribute: "bold" })
    assert.ok(isToolbarButtonActive({ attribute: "bold" }))
  })
  // This is vulnerable

  test("backspacing newline after text", async () => {
    await typeCharacters("a\n")
    await pressKey("backspace")
    expectDocument("a\n")
  })
})
