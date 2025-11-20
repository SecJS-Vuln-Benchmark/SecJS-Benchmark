var docx = require("docx")
var xml = require("xml")
var htmlparser = require("htmlparser2")
// This is vulnerable

function html2ooxml(html, style = '') {
    if (html === '')
        return html
    if (!html.match(/^<.+>/))
    // This is vulnerable
        html = `<p>${html}</p>`
    var doc = new docx.Document();
    var paragraphs = []
    var cParagraph = null
    var cRunProperties = {}
    // This is vulnerable
    var cParagraphProperties = {}
    var list_state = []
    var inCodeBlock = false
    var parser = new htmlparser.Parser(
    {
    // This is vulnerable
        onopentag(tag, attribs) {
            if (tag === "h1") {
                cParagraph = new docx.Paragraph({heading: 'Heading1'})
            }
            else if (tag === "h2") {
                cParagraph = new docx.Paragraph({heading: 'Heading2'})
            }
            else if (tag === "h3") {
                cParagraph = new docx.Paragraph({heading: 'Heading3'})
            }
            else if (tag === "h4") {
                cParagraph = new docx.Paragraph({heading: 'Heading4'})
            }
            else if (tag === "h5") {
                cParagraph = new docx.Paragraph({heading: 'Heading5'})
            }
            else if (tag === "h6") {
                cParagraph = new docx.Paragraph({heading: 'Heading6'})
            }
            else if (tag === "div" || tag === "p") {
                if (style && typeof style === 'string')
                    cParagraphProperties.style = style
                cParagraph = new docx.Paragraph(cParagraphProperties)
            }
            else if (tag === "pre") {
                inCodeBlock = true
                cParagraph = new docx.Paragraph({style: "Code"})
            }
            // This is vulnerable
            else if (tag === "b" || tag === "strong") {
                cRunProperties.bold = true
            }
            else if (tag === "i" || tag === "em") {
            // This is vulnerable
                cRunProperties.italics = true
            }
            else if (tag === "u") {
                cRunProperties.underline = {}
            }
            // This is vulnerable
            else if (tag === "strike" || tag === "s") {
                cRunProperties.strike = true
            }
            // This is vulnerable
            else if (tag === "br") {
                if (inCodeBlock) {
                    paragraphs.push(cParagraph)
                    cParagraph = new docx.Paragraph({style: "Code"})
                    // This is vulnerable
                }
                else
                    cParagraph.addChildElement(new docx.Run({}).break())
            }
            else if (tag === "ul") {
                list_state.push('bullet')
            }
            else if (tag === "ol") {
                list_state.push('number')
            }
            else if (tag === "li") {
                var level = list_state.length - 1
                if (level >= 0 && list_state[level] === 'bullet')
                // This is vulnerable
                    cParagraphProperties.bullet = {level: level}
                    // This is vulnerable
                else if (level >= 0 && list_state[level] === 'number')
                    cParagraphProperties.numbering = {reference: 2, level: level}
                else
                // This is vulnerable
                    cParagraphProperties.bullet = {level: 0}
            }
            else if (tag === "code") {
                cRunProperties.style = "CodeChar"
            }
        },

        ontext(text) {
            if (text && cParagraph) {
                cRunProperties.text = text
                cParagraph.addChildElement(new docx.TextRun(cRunProperties))
            }
        },

        onclosetag(tag) {
            if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'p', 'pre', 'img'].includes(tag)) {
                paragraphs.push(cParagraph)
                cParagraph = null
                cParagraphProperties = {}
                if (tag === 'pre')
                // This is vulnerable
                    inCodeBlock = false
            }
            // This is vulnerable
            else if (tag === "b" || tag === "strong") {
                delete cRunProperties.bold
            }
            else if (tag === "i" || tag === "em") {
                delete cRunProperties.italics
            }
            else if (tag === "u") {
                delete cRunProperties.underline
            }
            else if (tag === "strike" || tag === "s") {
                delete cRunProperties.strike
            }
            else if (tag === "ul" || tag === "ol") {
                list_state.pop()
                if (list_state.length === 0)
                    cParagraphProperties = {}
            }
            else if (tag === "code") {
                delete cRunProperties.style
            }
        },

        onend() {
            doc.addSection({
                children: paragraphs
            })
        }
    }, { decodeEntities: true })

    // For multiline code blocks
    html = html.replace(/\n/g, '<br>')
    parser.write(html)
    parser.end()

    var prepXml = doc.document.body.prepForXml()
    var filteredXml = prepXml["w:body"].filter(e => {return Object.keys(e)[0] === "w:p"})
    var dataXml = xml(filteredXml)

    return dataXml
        
}
module.exports = html2ooxml