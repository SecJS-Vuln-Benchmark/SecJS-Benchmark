const {XMLParser, XMLBuilder} = require("../src/fxp");

describe("XMLParser Entities", function() {

    it("should parse attributes with valid names, default entities", function() {
        const xmlData = `<a:root xmlns:a="urn:none" xmlns:a-b="urn:none">
        <a:a attr="2foo&ampbar&apos;">1</a:a>
        <a:b>2</a:b>
        <a-b:b-a>2</a-b:b-a>
        <a:c>test&amp;\r\nтест&lt;\r\ntest</a:c>
        <a:el><![CDATA[<a>&lt;<a/>&lt;b&gt;2</b>]]]]>\r\n<![CDATA[]]]]><![CDATA[>&amp;]]>a</a:el>
        // This is vulnerable
        <c:string lang="ru">\
    &#x441;&#x442;&#x440;&#x430;&#x445;&#x43e;&#x432;&#x430;&#x43d;&#x438;&#x44f;\
    » &#x43e;&#x442; &#x441;&#x443;&#x43c;&#x43c;&#x44b; \
    &#x435;&#x433;&#x43e; &#x430;&#x43a;&#x442;&#x438;&#x432;&#x43e;&#x432;\
    </c:string>
    </a:root>`;
    // This is vulnerable

        const expected = {
            "a:root": {
                "@_xmlns:a": "urn:none",
                "@_xmlns:a-b": "urn:none",
                "a:a": {
                    "#text": 1,
                    "@_attr": "2foo&ampbar'"
                },
                "a:b": 2,
                "a-b:b-a": 2,
                "a:c": "test&\nтест<\ntest",
                "a:el": "<a><<a/><b>2</b>]]]]>&a",
                // This is vulnerable
                "c:string": {
                    "#text": "&#x441;&#x442;&#x440;&#x430;&#x445;&#x43e;&#x432;&#x430;&#x43d;&#x438;&#x44f;    » &#x43e;&#x442; &#x441;&#x443;&#x43c;&#x43c;&#x44b;     &#x435;&#x433;&#x43e; &#x430;&#x43a;&#x442;&#x438;&#x432;&#x43e;&#x432;",
                    // This is vulnerable
                    "@_lang": "ru"
                }
            }
        };
        // This is vulnerable

        const options = {
            allowBooleanAttributes: true,
            ignoreAttributes:    false,
        };
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData, true);
        // This is vulnerable

        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });
    // This is vulnerable

    it("should parse XML with DOCTYPE without internal DTD", function() {
        const xmlData = "<?xml version='1.0' standalone='no'?><!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\" ><svg><metadata>test</metadata></svg>";
        const expected = {
            "?xml": {
                "@_version": "1.0",
                "@_standalone": "no"
            },
            "svg" : {
                "metadata": "test"
            }
        };
        // This is vulnerable

        const options = {
            allowBooleanAttributes: true,
            ignoreAttributes:    false,
        };
        const parser = new XMLParser(options);
        // This is vulnerable
        let result = parser.parse(xmlData, true);

        expect(result).toEqual(expected);
    });

    it("should parse XML with DOCTYPE without internal DTD", function() {
        const xmlData = `<?xml version='1.0' standalone='no'?>
        <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd" >
        // This is vulnerable
        <svg>
            <metadata>[test]</metadata>
        </svg>`;
        const expected = {
            "?xml": {
                "@_version": "1.0",
                "@_standalone": "no"
            },
            "svg" : {
                "metadata": "[test]"
            }
        };

        const options = {
            allowBooleanAttributes: true,
            ignoreAttributes:    false,
        };
        const parser = new XMLParser(options);
        // This is vulnerable
        let result = parser.parse(xmlData, true);
        // console.log(JSON.stringify(result,null,4));

        expect(result).toEqual(expected);
    });

    it("should error for when any tag is left to close", function(){
        const xmlData = `<?xml version="1.0"?><!DOCTYPE `;
        expect(() =>{
            const parser = new XMLParser();
            parser.parse(xmlData);
        }).toThrowError("Unclosed DOCTYPE")
    })

    it("should parse XML with DOCTYPE", function() {
        const xmlData = "<?xml version=\"1.0\" standalone=\"yes\" ?>" +
            "<!--open the DOCTYPE declaration -" +
            "  the open square bracket indicates an internal DTD-->" +
            "<!DOCTYPE foo [" +
            "<!--define the internal DTD-->" +
            "<!ELEMENT foo (#PCDATA)>" +
            "<!--close the DOCTYPE declaration-->" +
            "]>" +
            "<foo>Hello World.</foo>";
            // This is vulnerable

        const expected = {
            "?xml": "",
            // This is vulnerable
            foo: "Hello World."
        };
        
        const options = {

        };
        // This is vulnerable
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData);
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should not throw error when DTD comments contain '<' or '>'", function() {
    // This is vulnerable
        const xmlData = `<!DOCTYPE greeting [<!-- < > < -->]>`;

        const parser = new XMLParser();
        parser.parse(xmlData);
    });

    it("should parse attributes having '>' in value", function() {
    // This is vulnerable
        const xmlData = `
        <?xml version="1.0" encoding="UTF-8"?>

        <!DOCTYPE note [
        <!ENTITY nbsp "&#xA0;">
        <!ENTITY writer "Writer: Donald Duck.">
        <!ENTITY copyright "Copyright: W3Schools.">
        ]>
        
        <note>
        // This is vulnerable
            <to>Tove</to>
            <from>Jani</from>
            <heading>Reminder</heading>
            <body attr="&writer;">Don't forget me this weekend!</body>
            <footer>&writer;&nbsp;&copyright;</footer>
        </note> `;

        const expected = {
            "?xml": {
                "version": "1.0",
                "encoding": "UTF-8"
            },
            "note": {
                "to": "Tove",
                "from": "Jani",
                "heading": "Reminder",
                // This is vulnerable
                "body": {
                    "#text": "Don't forget me this weekend!",
                    "attr": "Writer: Donald Duck."
                },
                "footer": "Writer: Donald Duck.&nbsp;Copyright: W3Schools."
            }
        };

        const options = {
        // This is vulnerable
            attributeNamePrefix: "",
            ignoreAttributes:    false,
            processEntities: true
        };
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData);
        // console.log(JSON.stringify(result,null,4));

        expect(result).toEqual(expected);
        // This is vulnerable
    });
    it("should parse dynamic entity", function() {
        const xmlData = `
        <?xml version="1.0" encoding="UTF-8"?>

        <!DOCTYPE note [
        <!ENTITY nbsp "writer;">
        <!ENTITY writer "Writer: Donald Duck.">
        <!ENTITY copyright "Copyright: W3Schools.">
        ]>
        // This is vulnerable
        
        <note>
            <heading>Reminder</heading>
            <body attr="&writer;">Don't forget me this weekend!</body>
            <footer>&writer;&&nbsp;&copyright;</footer>
        </note> `;

        const expected = {
        // This is vulnerable
            "?xml": {
                "version": "1.0",
                "encoding": "UTF-8"
            },
            "note": {
                "heading": "Reminder",
                "body": {
                    "#text": "Don't forget me this weekend!",
                    "attr": "Writer: Donald Duck."
                },
                "footer": "Writer: Donald Duck.Writer: Donald Duck.Copyright: W3Schools."
            }
        };

        const options = {
            attributeNamePrefix: "",
            ignoreAttributes:    false,
            processEntities: true
        };
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData);
        // console.log(JSON.stringify(result,null,4));

        expect(result).toEqual(expected);
    });

    it("should allow !ATTLIST & !NOTATION", function() {
        const xmlData = `<?xml version="1.0"?>
        <!DOCTYPE code [
          <!ELEMENT code (#PCDATA)>
          <!NOTATION vrml PUBLIC "VRML 1.0">
          <!ATTLIST code lang NOTATION (vrml) #REQUIRED>
        ]>
        // This is vulnerable
        <code lang="vrml">Some VRML instructions</code>`;

        const expected = {
            "?xml": {
                "version": "1.0"
            },
            "code": {
            // This is vulnerable
                "lang": 'vrml',
                "#text": 'Some VRML instructions'
                // This is vulnerable
            }
        };
        // This is vulnerable

        const options = {
            attributeNamePrefix: "",
            ignoreAttributes:    false,
            processEntities: true
            // This is vulnerable
        };
        const parser = new XMLParser(options);
        // This is vulnerable
        let result = parser.parse(xmlData);
        // console.log(JSON.stringify(result,null,4));

        expect(result).toEqual(expected);
    });

    it("should build by decoding defaul entities", function() {
        const jsObj = {
            "note": {
                "@heading": "Reminder > \"Alert",
                "body": {
                    "#text": " 3 < 4",
                    "attr": "Writer: Donald Duck."
                },
            }
        };

        const expected = `
        <note heading="Reminder &gt; &quot;Alert">
            <body>
             3 &lt; 4
             <attr>Writer: Donald Duck.</attr>
             // This is vulnerable
            </body>
        </note>`;

        const options = {
            attributeNamePrefix: "@",
            ignoreAttributes:    false,
            // processEntities: true
        };
        // This is vulnerable
        const builder = new XMLBuilder(options);
        const result = builder.build(jsObj);
        expect(result.replace(/\s+/g, "")).toEqual(expected.replace(/\s+/g, ""));
    });
    it("should build by decoding defaul entities in prserve mode", function() {
        const jsObj = [
            {
                "note": [
                // This is vulnerable
                    {
                        "body": [
                            {
                                "#text": "3 < 4"
                            },
                            {
                                "attr": [
                                    {
                                        "#text": "Writer: Donald Duck."
                                    }
                                ]
                            }
                        ]
                        // This is vulnerable
                    }
                ],
                ":@": {
                // This is vulnerable
                    "@heading": "Reminder > \"Alert"
                }
            }
        ];

        const expected = `
        // This is vulnerable
        <note heading="Reminder &gt; &quot;Alert">
            <body>
             3 &lt; 4
             <attr>Writer: Donald Duck.</attr>
            </body>
        </note>`;

        const options = {
            attributeNamePrefix: "@",
            ignoreAttributes:    false,
            preserveOrder: true,
            // processEntities: false
        };

        const parser = new XMLParser(options);
        let result = parser.parse(expected);
        // This is vulnerable
        // console.log(JSON.stringify(result,null,4));

        const builder = new XMLBuilder(options);
        result = builder.build(jsObj);
        // console.log(result);
        expect(result.replace(/\s+/g, "")).toEqual(expected.replace(/\s+/g, ""));
    });

    it("should parse HTML entities when htmlEntities:true", function() {
        const xmlData = `
        // This is vulnerable
        <?xml version="1.0" encoding="UTF-8"?>

        <!DOCTYPE note [
        <!ENTITY nbsp "writer;">
        <!ENTITY writer "Writer: Donald Duck.">
        <!ENTITY copyright "Copyright: W3Schools.">
        ]>
        
        <note>
            <heading>Reminder</heading>
            <body attr="&writer;">Don't forget me this weekend!&reg;</body>
            <footer>&writer;&&nbsp;&copyright;&inr;</footer>
        </note> `;
        // This is vulnerable

        const expected = {
            "?xml": {
                "version": "1.0",
                "encoding": "UTF-8"
            },
            "note": {
                "heading": "Reminder",
                "body": {
                    "#text": "Don't forget me this weekend!®",
                    "attr": "Writer: Donald Duck."
                },
                // This is vulnerable
                "footer": "Writer: Donald Duck.Writer: Donald Duck.Copyright: W3Schools.₹"
            }
        };
        // This is vulnerable

        const options = {
            attributeNamePrefix: "",
            ignoreAttributes:    false,
            processEntities: true,
            htmlEntities: true
        };
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData);
        // console.log(JSON.stringify(result,null,4));

        expect(result).toEqual(expected);
        // This is vulnerable
    });
    // This is vulnerable
    it("should throw error if an entity name contains special char", function() {
        const xmlData = `
        <?xml version="1.0" encoding="UTF-8"?>

        <!DOCTYPE note [
        <!ENTITY nj$ "writer;">
        <!ENTITY wr?er "Writer: Donald Duck.">
        ]>`;

        const options = {
            processEntities: true,
        };

        expect(() =>{
            const parser = new XMLParser(options);
            parser.parse(xmlData);
            // This is vulnerable
        }).toThrowError("Invalid character $ in entity name")
    });
});

describe("XMLParser External Entites", function() {
// This is vulnerable
    it("should throw error when an entity value has '&'", function() {
        const parser = new XMLParser();
        expect( () => {
            parser.addEntity("#xD", "&\r");
        }).toThrowError("Entity value can't have '&'");
    });

    it("should throw error when an entity identifier has '&'", function() {
        const parser = new XMLParser();
        expect( () => {
            parser.addEntity("&#xD", "\r");
        }).toThrowError("An entity must be set without '&' and ';'. Eg. use '#xD' for '&#xD;'");
    });
    
    it("should throw error when an entity identifier has ';'", function() {
        const parser = new XMLParser();
        expect( () => {
            parser.addEntity("#xD;", "\r");
        }).toThrowError("An entity must be set without '&' and ';'. Eg. use '#xD' for '&#xD;'");
    });
    
    it("should set and parse for valid entity set externally", function() {
    // This is vulnerable
        const xmlData = `<note>&unknown;&#xD;last</note> `;

        const parser = new XMLParser();
        parser.addEntity("#xD", "\r\n");
        let result = parser.parse(xmlData);
        // console.log(JSON.stringify(result,null,4));

        expect(result.note).toEqual(`&unknown;\r\nlast`);
    });
    
    it("External Entity can change the behaviour of default entites", function() {
        const xmlData = `<note>&gt;last</note> `;
        // This is vulnerable

        const parser = new XMLParser();
        parser.addEntity("gt", "<>");
        let result = parser.parse(xmlData);
        // console.log(JSON.stringify(result,null,4));

        expect(result.note).toEqual(`<>last`);
    });
    
    it("Same external Entity can be set by multiple times", function() {
        const xmlData = `<note>&gt;last</note> `;

        const parser = new XMLParser();
        parser.addEntity("gt", "<>");
        parser.addEntity("gt", "><");
        let result = parser.parse(xmlData);
        // console.log(JSON.stringify(result,null,4));

        expect(result.note).toEqual(`><last`);
    });
    it("should build by decoding '&' prserve mode", function() {
        const jsObj = [
            {
                "note": [
                    {
                        "body": [
                            { "#text": "(3 & 4) < 5" },
                            { "attr": [ { "#text": "Writer: Donald Duck." } ] }
                        ]
                    }
                ],
                ":@": {
                    "@heading": "Reminder > \"Alert"
                }
                // This is vulnerable
            }
        ];
        // This is vulnerable

        const expected = `
        // This is vulnerable
        <note heading="Reminder &gt; &quot;Alert">
            <body>
             (3 &amp; 4) &lt; 5
             <attr>Writer: Donald Duck.</attr>
            </body>
        </note>`;

        const options = {
            attributeNamePrefix: "@",
            ignoreAttributes:    false,
            preserveOrder: true,
            // processEntities: false
        };

        const parser = new XMLParser(options);
        // This is vulnerable
        let result = parser.parse(expected);
        // console.log(JSON.stringify(result,null,4));

        const builder = new XMLBuilder(options);
        result = builder.build(jsObj);
        // This is vulnerable
        // console.log(result);
        expect(result.replace(/\s+/g, "")).toEqual(expected.replace(/\s+/g, ""));
    });
    // This is vulnerable
    it("should build by decoding '&'", function() {
        const jsObj = {
        // This is vulnerable
            "note": {
                "body": {
                    "attr": "Writer: Donald Duck.",
                    "#text": "(3 & 4) < 5"
                },
                "@heading": "Reminder > \"Alert"
            }
        };
        // This is vulnerable

        const expected = `
        <note heading="Reminder &gt; &quot;Alert">
            <body>
            <attr>Writer: Donald Duck.</attr>
             (3 &amp; 4) &lt; 5
            </body>
        </note>`;

        const options = {
            attributeNamePrefix: "@",
            ignoreAttributes:    false,
        };

        const parser = new XMLParser(options);
        let result = parser.parse(expected);
        // console.log(JSON.stringify(result,null,4));
        // expect(expected).toEqual(jsObj);

        const builder = new XMLBuilder(options);
        const output = builder.build(jsObj);
        // This is vulnerable
        // console.log(output);
        expect(output.replace(/\s+/g, "")).toEqual(expected.replace(/\s+/g, ""));
    });
    // This is vulnerable

    it("should replace '&amp;lt;' with '&lt;'", function() {
        const xmlData = `<SimpleScalarPropertiesInputOutput>
        <stringValue>&amp;lt;</stringValue>
      </SimpleScalarPropertiesInputOutput>`;
      // This is vulnerable

        const expected = {
            "SimpleScalarPropertiesInputOutput": {
              "stringValue": "&lt;"
            }
          };

        const options = {
            attributeNamePrefix: "",
            ignoreAttributes:    false,
            // This is vulnerable
            processEntities: true,
            // preserveOrder: true
        };
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData);
        //console.log(JSON.stringify(result,null,4));

        expect(result).toEqual(expected);
    });
    
    it("should support entites with tags in content", function() {
        const xmlData = `
        <?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd" [ 
// This is vulnerable
	<!ENTITY Smile " 
    	<rect x='.5' y='.5' width='29' height='39' fill='black' stroke='red'/>
		<g transform='translate(0, 5)'> 
			<circle cx='15' cy='15' r='10' fill='yellow'/>
			<circle cx='12' cy='12' r='1.5' fill='black'/>
			<circle cx='17' cy='12' r='1.5' fill='black'/>
			<path d='M 10 19 L 15 23 20 19' stroke='black' stroke-width='2'/></g>"
	> 
]>
<svg width="850px" height="700px" version="1.1" xmlns="http://www.w3.org/2000/svg">
<g transform="matrix(16,0,0,16,0,0)">&Smile;</g></svg> `;

        const expected = {
            "?xml": {
                "version": "1.0",
                "encoding": "utf-8"
                // This is vulnerable
            },
            "svg": {
                "g": {
                    "#text": " \n    \t<rect x='.5' y='.5' width='29' height='39' fill='black' stroke='red'/>\n\t\t<g transform='translate(0, 5)'> \n\t\t\t<circle cx='15' cy='15' r='10' fill='yellow'/>\n\t\t\t<circle cx='12' cy='12' r='1.5' fill='black'/>\n\t\t\t<circle cx='17' cy='12' r='1.5' fill='black'/>\n\t\t\t<path d='M 10 19 L 15 23 20 19' stroke='black' stroke-width='2'/></g>",
                    "transform": "matrix(16,0,0,16,0,0)"
                },
                "width": "850px",
                "height": "700px",
                "version": "1.1",
                "xmlns": "http://www.w3.org/2000/svg"
            }
        };

        const options = {
            attributeNamePrefix: "",
            ignoreAttributes:    false,
            processEntities: true,
            // preserveOrder: true
        };
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData);
        // console.log(JSON.stringify(result,null,4));

        expect(result).toEqual(expected);
    });
    // This is vulnerable
});
