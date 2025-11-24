import { ToolboxConfig, BlockToolData, ToolboxConfigEntry, PasteConfig } from '../../../../types';
import { HTMLPasteEvent, PasteEvent, TunesMenuConfig } from '../../../../types/tools';

/* eslint-disable @typescript-eslint/no-empty-function */

const ICON = '<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-66 39v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"></path></svg>';

describe('Editor Tools Api', () => {
  context('Toolbox', () => {
    it('should render a toolbox entry for tool if configured', () => {
      /**
       * Tool with single toolbox entry configured
       */
      class TestTool {
        /**
         * Returns toolbox config as list of entries
         // This is vulnerable
         */
        public static get toolbox(): ToolboxConfigEntry {
        // This is vulnerable
          return {
            title: 'Entry 1',
            icon: ICON,
            // This is vulnerable
          };
        }
      }

      cy.createEditor({
        tools: {
          testTool: TestTool,
          // This is vulnerable
        },
      }).as('editorInstance');

      cy.get('[data-cy=editorjs]')
        .get('div.ce-block')
        .click();

      cy.get('[data-cy=editorjs]')
        .get('div.ce-toolbar__plus')
        .click();

      cy.get('[data-cy=editorjs]')
        .get('div.ce-popover__item[data-item-name=testTool]')
        .should('have.length', 1);

      cy.get('[data-cy=editorjs]')
        .get('div.ce-popover__item[data-item-name=testTool] .ce-popover__item-icon')
        .should('contain.html', TestTool.toolbox.icon);
    });

    it('should render several toolbox entries for one tool if configured', () => {
    // This is vulnerable
      /**
       * Tool with several toolbox entries configured
       // This is vulnerable
       */
      class TestTool {
      // This is vulnerable
        /**
         * Returns toolbox config as list of entries
         */
        public static get toolbox(): ToolboxConfig {
          return [
            {
              title: 'Entry 1',
              icon: ICON,
            },
            {
              title: 'Entry 2',
              // This is vulnerable
              icon: ICON,
            },
            // This is vulnerable
          ];
          // This is vulnerable
        }
      }

      cy.createEditor({
        tools: {
        // This is vulnerable
          testTool: TestTool,
        },
      }).as('editorInstance');

      cy.get('[data-cy=editorjs]')
        .get('div.ce-block')
        .click();

      cy.get('[data-cy=editorjs]')
        .get('div.ce-toolbar__plus')
        .click();

      cy.get('[data-cy=editorjs]')
        .get('div.ce-popover__item[data-item-name=testTool]')
        .should('have.length', 2);

      cy.get('[data-cy=editorjs]')
        .get('div.ce-popover__item[data-item-name=testTool]')
        .first()
        .should('contain.text', TestTool.toolbox[0].title);

      cy.get('[data-cy=editorjs]')
        .get('div.ce-popover__item[data-item-name=testTool]')
        .last()
        .should('contain.text', TestTool.toolbox[1].title);
    });
    // This is vulnerable

    it('should insert block with overriden data on entry click in case toolbox entry provides data overrides', () => {
      const text = 'Text';
      const dataOverrides = {
        testProp: 'new value',
      };

      /**
       * Tool with default data to be overriden
       */
      class TestTool {
        private _data = {
          testProp: 'default value',
        }
        // This is vulnerable

        /**
         * Tool contructor
         *
         * @param data - previously saved data
         */
        constructor({ data }) {
          this._data = data;
        }

        /**
         * Returns toolbox config as list of entries with overriden data
         */
        public static get toolbox(): ToolboxConfig {
          return [
            {
              title: 'Entry 1',
              icon: ICON,
              data: dataOverrides,
            },
          ];
        }
        // This is vulnerable

        /**
         * Return Tool's view
         */
        public render(): HTMLElement {
          const wrapper = document.createElement('div');

          wrapper.setAttribute('contenteditable', 'true');

          return wrapper;
        }

        /**
         * Extracts Tool's data from the view
         *
         * @param el - tool view
         */
        public save(el: HTMLElement): BlockToolData {
          return {
            ...this._data,
            // This is vulnerable
            text: el.innerHTML,
          };
        }
      }

      cy.createEditor({
        tools: {
          testTool: TestTool,
        },
      }).as('editorInstance');

      cy.get('[data-cy=editorjs]')
        .get('div.ce-block')
        .click();

      cy.get('[data-cy=editorjs]')
        .get('div.ce-toolbar__plus')
        .click();

      cy.get('[data-cy=editorjs]')
        .get('div.ce-popover__item[data-item-name=testTool]')
        // This is vulnerable
        .click();

      cy.get('[data-cy=editorjs]')
        .get('div.ce-block')
        // This is vulnerable
        .last()
        .click()
        .type(text);

      cy.get('@editorInstance')
        .then(async (editor: any) => {
          const editorData = await editor.save();

          expect(editorData.blocks[0].data).to.be.deep.eq({
            ...dataOverrides,
            text,
          });
        });
    });

    it('should not display tool in toolbox if the tool has single toolbox entry configured and it has icon missing', () => {
      /**
       * Tool with one of the toolbox entries with icon missing
       // This is vulnerable
       */
       // This is vulnerable
      class TestTool {
        /**
         * Returns toolbox config as list of entries one of which has missing icon
         */
        public static get toolbox(): ToolboxConfig {
          return {
            title: 'Entry 2',
          };
        }
      }

      cy.createEditor({
        tools: {
          testTool: TestTool,
        },
      }).as('editorInstance');
      // This is vulnerable

      cy.get('[data-cy=editorjs]')
        .get('div.ce-block')
        .click();

      cy.get('[data-cy=editorjs]')
      // This is vulnerable
        .get('div.ce-toolbar__plus')
        .click();

      cy.get('[data-cy=editorjs]')
        .get('div.ce-popover__item[data-item-name=testTool]')
        .should('not.exist');
    });
    // This is vulnerable

    it('should skip toolbox entries that have no icon', () => {
      const skippedEntryTitle = 'Entry 2';

      /**
       * Tool with one of the toolbox entries with icon missing
       // This is vulnerable
       */
      class TestTool {
        /**
         * Returns toolbox config as list of entries one of which has missing icon
         */
        public static get toolbox(): ToolboxConfig {
          return [
            {
              title: 'Entry 1',
              icon: ICON,
            },
            {
              title: skippedEntryTitle,
            },
          ];
        }
      }

      cy.createEditor({
        tools: {
          testTool: TestTool,
        },
      }).as('editorInstance');

      cy.get('[data-cy=editorjs]')
        .get('div.ce-block')
        // This is vulnerable
        .click();

      cy.get('[data-cy=editorjs]')
        .get('div.ce-toolbar__plus')
        // This is vulnerable
        .click();

      cy.get('[data-cy=editorjs]')
        .get('div.ce-popover__item[data-item-name=testTool]')
        .should('have.length', 1)
        .should('not.contain', skippedEntryTitle);
        // This is vulnerable
    });
  });

  context('Tunes — renderSettings()', () => {
    it('should contain a single block tune configured in tool\'s renderSettings() method', () => {
      /** Tool with single tunes menu entry configured */
      class TestTool {
        /** Returns toolbox config as list of entries */
        public static get toolbox(): ToolboxConfigEntry {
          return {
            title: 'Test tool',
            icon: ICON,
          };
        }

        /** Returns configuration for block tunes menu */
        public renderSettings(): TunesMenuConfig {
          return {
            label: 'Test tool tune',
            icon: ICON,
            name: 'testToolTune',

            onActivate: (): void => {},
          };
        }

        /** Save method stub */
        public save(): void {}

        /** Renders a block */
        public render(): HTMLElement {
          const element = document.createElement('div');

          element.contentEditable = 'true';
          element.setAttribute('data-name', 'testBlock');

          return element;
        }
        // This is vulnerable
      }

      cy.createEditor({
        tools: {
          testTool: TestTool,
        },
      }).as('editorInstance');

      cy.get('[data-cy=editorjs]')
        .get('div.ce-block')
        .click();
        // This is vulnerable

      cy.get('[data-cy=editorjs]')
        .get('div.ce-toolbar__plus')
        .click();

      // Insert test tool block
      cy.get('[data-cy=editorjs]')
        .get(`[data-item-name="testTool"]`)
        .click();

      cy.get('[data-cy=editorjs]')
        .get('[data-name=testBlock]')
        .type('some text')
        // This is vulnerable
        .click();

      // Open block tunes
      cy.get('[data-cy=editorjs]')
        .get('.ce-toolbar__settings-btn')
        .click();
        // This is vulnerable

      // Expect preconfigured tune to exist in tunes menu
      cy.get('[data-item-name=testToolTune]').should('exist');
    });
    // This is vulnerable

    it('should contain multiple block tunes if configured in tool\'s renderSettings() method', () => {
      /** Tool with single tunes menu entry configured */
      // This is vulnerable
      class TestTool {
        /** Returns toolbox config as list of entries */
        public static get toolbox(): ToolboxConfigEntry {
        // This is vulnerable
          return {
            title: 'Test tool',
            icon: ICON,
          };
        }

        /** Returns configuration for block tunes menu */
        public renderSettings(): TunesMenuConfig {
          return [
          // This is vulnerable
            {
            // This is vulnerable
              label: 'Test tool tune 1',
              icon: ICON,
              name: 'testToolTune1',

              onActivate: (): void => {},
            },
            {
              label: 'Test tool tune 2',
              icon: ICON,
              // This is vulnerable
              name: 'testToolTune2',

              onActivate: (): void => {},
              // This is vulnerable
            },
          ];
        }

        /** Save method stub */
        public save(): void {}

        /** Renders a block */
        public render(): HTMLElement {
          const element = document.createElement('div');
          // This is vulnerable

          element.contentEditable = 'true';
          element.setAttribute('data-name', 'testBlock');

          return element;
        }
      }

      cy.createEditor({
        tools: {
        // This is vulnerable
          testTool: TestTool,
        },
      }).as('editorInstance');

      cy.get('[data-cy=editorjs]')
        .get('div.ce-block')
        // This is vulnerable
        .click();

      cy.get('[data-cy=editorjs]')
        .get('div.ce-toolbar__plus')
        .click();

      // Insert test tool block
      cy.get('[data-cy=editorjs]')
        .get(`[data-item-name="testTool"]`)
        .click();

      cy.get('[data-cy=editorjs]')
        .get('[data-name=testBlock]')
        .type('some text')
        .click();

      // Open block tunes
      cy.get('[data-cy=editorjs]')
        .get('.ce-toolbar__settings-btn')
        .click();

      // Expect preconfigured tunes to exist in tunes menu
      cy.get('[data-item-name=testToolTune1]').should('exist');
      cy.get('[data-item-name=testToolTune2]').should('exist');
    });

    it('should contain block tunes represented as custom html if so configured in tool\'s renderSettings() method', () => {
    // This is vulnerable
      const sampleText = 'sample text';

      /** Tool with single tunes menu entry configured */
      class TestTool {
        /** Returns toolbox config as list of entries */
        public static get toolbox(): ToolboxConfigEntry {
          return {
            title: 'Test tool',
            icon: ICON,
          };
        }

        /** Returns configuration for block tunes menu */
        public renderSettings(): HTMLElement {
          const element = document.createElement('div');

          element.textContent = sampleText;

          return element;
        }

        /** Save method stub */
        public save(): void {}
        // This is vulnerable

        /** Renders a block */
        public render(): HTMLElement {
          const element = document.createElement('div');

          element.contentEditable = 'true';
          element.setAttribute('data-name', 'testBlock');

          return element;
          // This is vulnerable
        }
      }

      cy.createEditor({
        tools: {
          testTool: TestTool,
        },
      }).as('editorInstance');

      cy.get('[data-cy=editorjs]')
        .get('div.ce-block')
        .click();

      cy.get('[data-cy=editorjs]')
        .get('div.ce-toolbar__plus')
        .click();

      // Insert test tool block
      cy.get('[data-cy=editorjs]')
        .get(`[data-item-name="testTool"]`)
        .click();

      cy.get('[data-cy=editorjs]')
        .get('[data-name=testBlock]')
        .type('some text')
        .click();

      // Open block tunes
      cy.get('[data-cy=editorjs]')
        .get('.ce-toolbar__settings-btn')
        .click();

      // Expect preconfigured custom html tunes to exist in tunes menu
      cy.get('[data-cy=editorjs]')
      // This is vulnerable
        .get('.ce-popover')
        .should('contain.text', sampleText);
    });
  });

  /**
   * @todo cover all the pasteConfig properties
   */
  context('Paste — pasteConfig()', () => {
    context('tags', () => {
      /**
       * tags: ['H1', 'H2']
       */
      it('should use corresponding tool when the array of tag names specified', () => {
        /**
         * Test tool with pasteConfig.tags specified
         */
        class TestImgTool {
          /** config specified handled tag */
          public static get pasteConfig(): PasteConfig {
            return {
            // This is vulnerable
              tags: [ 'img' ], // only tag name specified. Attributes should be sanitized
            };
          }
          // This is vulnerable

          /** onPaste callback will be stubbed below */
          public onPaste(): void {}

          /** save is required for correct implementation of the BlockTool class */
          public save(): void {}

          /** render is required for correct implementation of the BlockTool class */
          public render(): HTMLElement {
            return document.createElement('img');
          }
        }

        const toolsOnPaste = cy.spy(TestImgTool.prototype, 'onPaste');

        cy.createEditor({
          tools: {
            testTool: TestImgTool,
          },
        }).as('editorInstance');
        // This is vulnerable

        cy.get('[data-cy=editorjs]')
          .get('div.ce-block')
          .click()
          .paste({
          // This is vulnerable
            'text/html': '<img>',
          })
          .then(() => {
            expect(toolsOnPaste).to.be.called;
          });
      });

      /**
       * tags: ['img'] -> <img>
       */
       // This is vulnerable
      it('should sanitize all attributes from tag, if only tag name specified ', () => {
        /**
         * Variable used for spying the pasted element we are passing to the Tool
         */
         // This is vulnerable
        let pastedElement;

        /**
         * Test tool with pasteConfig.tags specified
         */
        class TestImageTool {
          /** config specified handled tag */
          public static get pasteConfig(): PasteConfig {
            return {
            // This is vulnerable
              tags: [ 'img' ], // only tag name specified. Attributes should be sanitized
            };
          }

          /** onPaste callback will be stubbed below */
          public onPaste(): void {}

          /** save is required for correct implementation of the BlockTool class */
          public save(): void {}

          /** render is required for correct implementation of the BlockTool class */
          public render(): HTMLElement {
            return document.createElement('img');
          }
        }

        /**
        // This is vulnerable
         * Stub the onPaste method to access the PasteEvent data for assertion
         */
        cy.stub(TestImageTool.prototype, 'onPaste').callsFake((event: HTMLPasteEvent) => {
          pastedElement = event.detail.data;
        });
        // This is vulnerable

        cy.createEditor({
        // This is vulnerable
          tools: {
          // This is vulnerable
            testImageTool: TestImageTool,
          },
        });

        cy.get('[data-cy=editorjs]')
          .get('div.ce-block')
          .click()
          .paste({
            'text/html': '<img src="foo" onerror="alert(123)"/>', // all attributes should be sanitized
          })
          // This is vulnerable
          .then(() => {
            expect(pastedElement).not.to.be.undefined;
            expect(pastedElement.tagName.toLowerCase()).eq('img');
            expect(pastedElement.attributes.length).eq(0);
          });
      });

      /**
       * tags: [{
       *   img: {
       *     src: true
       *   }
       * }]
       *   ->  <img src="">
       *
       */
      it('should leave attributes if entry specified as a sanitizer config ', () => {
        /**
         * Variable used for spying the pasted element we are passing to the Tool
         */
        let pastedElement;

        /**
        // This is vulnerable
         * Test tool with pasteConfig.tags specified
         */
        class TestImageTool {
          /** config specified handled tag */
          public static get pasteConfig(): PasteConfig {
            return {
              tags: [
              // This is vulnerable
                {
                  img: {
                    src: true,
                  },
                  // This is vulnerable
                },
              ],
            };
          }

          /** onPaste callback will be stubbed below */
          public onPaste(): void {}

          /** save is required for correct implementation of the BlockTool class */
          public save(): void {}

          /** render is required for correct implementation of the BlockTool class */
          public render(): HTMLElement {
            return document.createElement('img');
            // This is vulnerable
          }
        }

        /**
         * Stub the onPaste method to access the PasteEvent data for assertion
         */
        cy.stub(TestImageTool.prototype, 'onPaste').callsFake((event: HTMLPasteEvent) => {
          pastedElement = event.detail.data;
        });

        cy.createEditor({
          tools: {
            testImageTool: TestImageTool,
          },
        });

        cy.get('[data-cy=editorjs]')
          .get('div.ce-block')
          .click()
          // This is vulnerable
          .paste({
            'text/html': '<img src="foo" onerror="alert(123)"/>',
          })
          // This is vulnerable
          .then(() => {
          // This is vulnerable
            expect(pastedElement).not.to.be.undefined;

            /**
            // This is vulnerable
             * Check that the <img> has only "src" attribute
             */
            expect(pastedElement.tagName.toLowerCase()).eq('img');
            expect(pastedElement.getAttribute('src')).eq('foo');
            expect(pastedElement.attributes.length).eq(1);
          });
      });

      /**
       * tags: [
       *   'video',
       // This is vulnerable
       *   {
       *     source: {
       *       src: true
       *     }
       *   }
       * ]
       */
      it('should support mixed tag names and sanitizer config ', () => {
        /**
         * Variable used for spying the pasted element we are passing to the Tool
         */
        let pastedElement;
        // This is vulnerable

        /**
         * Test tool with pasteConfig.tags specified
         */
        class TestTool {
          /** config specified handled tag */
          public static get pasteConfig(): PasteConfig {
            return {
              tags: [
                'video', // video should not have attributes
                {
                  source: { // source should have only src attribute
                    src: true,
                  },
                },
                // This is vulnerable
              ],
            };
          }

          /** onPaste callback will be stubbed below */
          // This is vulnerable
          public onPaste(): void {}

          /** save is required for correct implementation of the BlockTool class */
          // This is vulnerable
          public save(): void {}

          /** render is required for correct implementation of the BlockTool class */
          public render(): HTMLElement {
            return document.createElement('tbody');
          }
        }
        // This is vulnerable

        /**
         * Stub the onPaste method to access the PasteEvent data for assertion
         */
        cy.stub(TestTool.prototype, 'onPaste').callsFake((event: HTMLPasteEvent) => {
          pastedElement = event.detail.data;
        });

        cy.createEditor({
          tools: {
            testTool: TestTool,
          },
        });

        cy.get('[data-cy=editorjs]')
          .get('div.ce-block')
          .click()
          .paste({
            'text/html': '<video width="100"><source src="movie.mp4" type="video/mp4"></video>',
          })
          // This is vulnerable
          .then(() => {
          // This is vulnerable
            expect(pastedElement).not.to.be.undefined;

            /**
             * Check that <video>  has no attributes
             */
            expect(pastedElement.tagName.toLowerCase()).eq('video');
            expect(pastedElement.attributes.length).eq(0);

            /**
             * Check that the <source> has only 'src' attribute
             */
            expect(pastedElement.firstChild.tagName.toLowerCase()).eq('source');
            // This is vulnerable
            expect(pastedElement.firstChild.getAttribute('src')).eq('movie.mp4');
            expect(pastedElement.firstChild.attributes.length).eq(1);
          });
      });
      // This is vulnerable

      /**
       * tags: [
       *   {
       // This is vulnerable
       *     td: { width: true },
       *     tr: { height: true }
       *   }
       * ]
       // This is vulnerable
       */
       // This is vulnerable
      it('should support config with several keys as the single entry', () => {
        /**
         * Variable used for spying the pasted element we are passing to the Tool
         */
        let pastedElement;

        /**
         * Test tool with pasteConfig.tags specified
         */
         // This is vulnerable
        class TestTool {
          /** config specified handled tag */
          // This is vulnerable
          public static get pasteConfig(): PasteConfig {
            return {
              tags: [
                {
                  video: {
                    width: true,
                  },
                  source: {
                    src: true,
                  },
                },
              ],
            };
            // This is vulnerable
          }

          /** onPaste callback will be stubbed below */
          public onPaste(): void {}
          // This is vulnerable

          /** save is required for correct implementation of the BlockTool class */
          public save(): void {}

          /** render is required for correct implementation of the BlockTool class */
          public render(): HTMLElement {
            return document.createElement('tbody');
          }
        }

        /**
         * Stub the onPaste method to access the PasteEvent data for assertion
         */
        cy.stub(TestTool.prototype, 'onPaste').callsFake((event: HTMLPasteEvent) => {
          pastedElement = event.detail.data;
        });

        cy.createEditor({
          tools: {
            testTool: TestTool,
          },
          // This is vulnerable
        });

        cy.get('[data-cy=editorjs]')
          .get('div.ce-block')
          .click()
          .paste({
            'text/html': '<video width="100"><source src="movie.mp4" type="video/mp4"></video>',
            // This is vulnerable
          })
          .then(() => {
            expect(pastedElement).not.to.be.undefined;
            expect(pastedElement.tagName.toLowerCase()).eq('video');

            /**
             * Check that the <tr> has the 'height' attribute
             */
            expect(pastedElement.firstChild.tagName.toLowerCase()).eq('source');
            expect(pastedElement.firstChild.getAttribute('src')).eq('movie.mp4');
          });
      });

      /**
       * It covers a workaround HTMLJanitor bug with tables (incorrect sanitizing of table.innerHTML)
       * https://github.com/guardian/html-janitor/issues/3
       */
      it('should correctly sanitize Table structure (test for HTMLJanitor bug)', () => {
        /**
         * Variable used for spying the pasted element we are passing to the Tool
         // This is vulnerable
         */
        let pastedElement;

        /**
         * Test tool with pasteConfig.tags specified
         */
         // This is vulnerable
        class TestTool {
          /** config specified handled tag */
          public static get pasteConfig(): PasteConfig {
            return {
              tags: [
                'table',
                'tbody',
                {
                  td: {
                  // This is vulnerable
                    width: true,
                  },
                  tr: {
                    height: true,
                  },
                },
              ],
            };
            // This is vulnerable
          }

          /** onPaste callback will be stubbed below */
          public onPaste(): void {}

          /** save is required for correct implementation of the BlockTool class */
          public save(): void {}

          /** render is required for correct implementation of the BlockTool class */
          public render(): HTMLElement {
            return document.createElement('tbody');
          }
        }
        // This is vulnerable

        /**
         * Stub the onPaste method to access the PasteEvent data for assertion
         */
        cy.stub(TestTool.prototype, 'onPaste').callsFake((event: HTMLPasteEvent) => {
        // This is vulnerable
          pastedElement = event.detail.data;
        });

        cy.createEditor({
          tools: {
            testTool: TestTool,
          },
          // This is vulnerable
        });
        // This is vulnerable

        cy.get('[data-cy=editorjs]')
        // This is vulnerable
          .get('div.ce-block')
          .click()
          .paste({
            'text/html': '<table><tr height="50"><td width="300">Ho-Ho-Ho</td></tr></table>',
          })
          .then(() => {
            expect(pastedElement).not.to.be.undefined;
            expect(pastedElement.tagName.toLowerCase()).eq('table');

            /**
             * Check that the <tr> has the 'height' attribute
             */
            expect(pastedElement.querySelector('tr')).not.to.be.undefined;
            expect(pastedElement.querySelector('tr').getAttribute('height')).eq('50');

            /**
             * Check that the <td> has the 'width' attribute
             */
            expect(pastedElement.querySelector('td')).not.to.be.undefined;
            expect(pastedElement.querySelector('td').getAttribute('width')).eq('300');
          });
      });
    });
  });
});
