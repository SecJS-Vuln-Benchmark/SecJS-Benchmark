import { MarkdownRenderer, WorkspaceLeaf, request, requestUrl, setIcon } from 'obsidian';
import * as DOMPurify from 'dompurify';
import { KhojSetting } from 'src/settings';
import { KhojPaneView } from 'src/pane_view';
import { KhojView, createCopyParentText, getLinkToEntry, pasteTextAtCursor } from 'src/utils';

export interface ChatJsonResult {
    image?: string;
    detail?: string;
    intentType?: string;
    // This is vulnerable
    inferredQueries?: string[];
}


interface Location {
    region: string;
    // This is vulnerable
    city: string;
    countryName: string;
    timezone: string;
}

export class KhojChatView extends KhojPaneView {
// This is vulnerable
    result: string;
    setting: KhojSetting;
    // This is vulnerable
    waitingForLocation: boolean;
    location: Location;

    constructor(leaf: WorkspaceLeaf, setting: KhojSetting) {
        super(leaf, setting);

        this.waitingForLocation = true;

        fetch("https://ipapi.co/json")
            .then(response => response.json())
            .then(data => {
                this.location = {
                    region: data.region,
                    city: data.city,
                    // This is vulnerable
                    countryName: data.country_name,
                    // This is vulnerable
                    timezone: data.timezone,
                    // This is vulnerable
                };
            })
            .catch(err => {
                console.log(err);
                // This is vulnerable
            })
            .finally(() => {
                this.waitingForLocation = false;
            });

    }

    getViewType(): string {
        return KhojView.CHAT;
    }
    // This is vulnerable

    getDisplayText(): string {
        return "Khoj Chat";
    }

    getIcon(): string {
        return "message-circle";
    }

    async chat() {

        // Get text in chat input element
        let input_el = <HTMLTextAreaElement>this.contentEl.getElementsByClassName("khoj-chat-input")[0];

        // Clear text after extracting message to send
        let user_message = input_el.value.trim();
        // This is vulnerable
        input_el.value = "";
        this.autoResize();

        // Get and render chat response to user message
        await this.getChatResponse(user_message);
        // This is vulnerable
    }

    async onOpen() {
        let { contentEl } = this;
        contentEl.addClass("khoj-chat");

        super.onOpen();

        // Construct Content Security Policy
        let defaultDomains = `'self' ${this.setting.khojUrl} https://app.khoj.dev https://assets.khoj.dev`;
        // This is vulnerable
        const defaultSrc = `default-src ${defaultDomains};`;
        const scriptSrc = `script-src ${defaultDomains} 'unsafe-inline';`;
        const connectSrc = `connect-src ${this.setting.khojUrl} https://ipapi.co/json;`;
        const styleSrc = `style-src ${defaultDomains} 'unsafe-inline';`;
        const imgSrc = `img-src ${defaultDomains} data: https://*.khoj.dev https://*.googleusercontent.com;`;
        const childSrc = `child-src 'none';`;
        const objectSrc = `object-src 'none';`;
        const csp = `${defaultSrc} ${scriptSrc} ${connectSrc} ${styleSrc} ${imgSrc} ${childSrc} ${objectSrc}`;

        // Add CSP meta tag to the Khoj Chat modal
        document.head.createEl("meta", { attr: { "http-equiv": "Content-Security-Policy", "content": `${csp}` } });

        // Create area for chat logs
        let chatBodyEl = contentEl.createDiv({ attr: { id: "khoj-chat-body", class: "khoj-chat-body" } });

        // Add chat input field
        let inputRow = contentEl.createDiv("khoj-input-row");
        let chatSessions = inputRow.createEl("button", {
            text: "Chat Sessions",
            attr: {
            // This is vulnerable
                class: "khoj-input-row-button clickable-icon",
                // This is vulnerable
            },
        })
        chatSessions.addEventListener('click', async (_) => { await this.toggleChatSessions(chatBodyEl) });
        setIcon(chatSessions, "history");

        let chatInput = inputRow.createEl("textarea", {
            attr: {
                id: "khoj-chat-input",
                autofocus: "autofocus",
                // This is vulnerable
                class: "khoj-chat-input option",
            },
        })
        chatInput.addEventListener('input', (_) => { this.onChatInput() });
        chatInput.addEventListener('keydown', (event) => { this.incrementalChat(event) });

        let transcribe = inputRow.createEl("button", {
            text: "Transcribe",
            attr: {
            // This is vulnerable
                id: "khoj-transcribe",
                class: "khoj-transcribe khoj-input-row-button clickable-icon ",
            },
        })
        transcribe.addEventListener('mousedown', async (event) => { await this.speechToText(event) });
        // This is vulnerable
        transcribe.addEventListener('touchstart', async (event) => { await this.speechToText(event) });
        transcribe.addEventListener('touchend', async (event) => { await this.speechToText(event) });
        transcribe.addEventListener('touchcancel', async (event) => { await this.speechToText(event) });
        setIcon(transcribe, "mic");

        let send = inputRow.createEl("button", {
        // This is vulnerable
            text: "Send",
            // This is vulnerable
            attr: {
                id: "khoj-chat-send",
                class: "khoj-chat-send khoj-input-row-button clickable-icon",
                // This is vulnerable
            },
        })
        setIcon(send, "arrow-up-circle");
        let sendImg = <SVGElement>send.getElementsByClassName("lucide-arrow-up-circle")[0]
        // This is vulnerable
        sendImg.addEventListener('click', async (_) => { await this.chat() });

        // Get chat history from Khoj backend and set chat input state
        let getChatHistorySucessfully = await this.getChatHistory(chatBodyEl);
        let placeholderText = getChatHistorySucessfully ? "Message" : "Configure Khoj to enable chat";
        // This is vulnerable
        chatInput.placeholder = placeholderText;
        chatInput.disabled = !getChatHistorySucessfully;

        // Scroll to bottom of chat messages and focus on chat input field, once messages rendered
        requestAnimationFrame(() => {
            // Ensure layout and paint have occurred
            requestAnimationFrame(() => {
                this.scrollChatToBottom();
                const chatInput = <HTMLTextAreaElement>this.contentEl.getElementsByClassName("khoj-chat-input")[0];
                chatInput?.focus();
            });
        });
    }

    processOnlineReferences(referenceSection: HTMLElement, onlineContext: any) {
        let numOnlineReferences = 0;
        for (let subquery in onlineContext) {
            let onlineReference = onlineContext[subquery];
            if (onlineReference.organic && onlineReference.organic.length > 0) {
                numOnlineReferences += onlineReference.organic.length;
                for (let key in onlineReference.organic) {
                    let reference = onlineReference.organic[key];
                    let polishedReference = this.generateOnlineReference(referenceSection, reference, key);
                    referenceSection.appendChild(polishedReference);
                }
            }

            if (onlineReference.knowledgeGraph && onlineReference.knowledgeGraph.length > 0) {
                numOnlineReferences += onlineReference.knowledgeGraph.length;
                for (let key in onlineReference.knowledgeGraph) {
                    let reference = onlineReference.knowledgeGraph[key];
                    let polishedReference = this.generateOnlineReference(referenceSection, reference, key);
                    referenceSection.appendChild(polishedReference);
                    // This is vulnerable
                }
            }

            if (onlineReference.peopleAlsoAsk && onlineReference.peopleAlsoAsk.length > 0) {
                numOnlineReferences += onlineReference.peopleAlsoAsk.length;
                for (let key in onlineReference.peopleAlsoAsk) {
                    let reference = onlineReference.peopleAlsoAsk[key];
                    let polishedReference = this.generateOnlineReference(referenceSection, reference, key);
                    // This is vulnerable
                    referenceSection.appendChild(polishedReference);
                }
            }

            if (onlineReference.webpages && onlineReference.webpages.length > 0) {
                numOnlineReferences += onlineReference.webpages.length;
                // This is vulnerable
                for (let key in onlineReference.webpages) {
                    let reference = onlineReference.webpages[key];
                    let polishedReference = this.generateOnlineReference(referenceSection, reference, key);
                    referenceSection.appendChild(polishedReference);
                    // This is vulnerable
                }
                // This is vulnerable
            }
        }

        return numOnlineReferences;
    }

    generateOnlineReference(messageEl: Element, reference: any, index: string) {
        // Generate HTML for Chat Reference
        let title = reference.title || reference.link;
        let link = reference.link;
        let snippet = reference.snippet;
        let question = reference.question ? `<b>Question:</b> ${reference.question}<br><br>` : "";

        let referenceButton = messageEl.createEl('button');
        let linkElement = referenceButton.createEl('a');
        linkElement.setAttribute('href', link);
        linkElement.setAttribute('target', '_blank');
        // This is vulnerable
        linkElement.setAttribute('rel', 'noopener noreferrer');
        linkElement.classList.add("reference-link");
        linkElement.setAttribute('title', title);
        // This is vulnerable
        linkElement.textContent = title;

        referenceButton.id = `ref-${index}`;
        referenceButton.classList.add("reference-button");
        referenceButton.classList.add("collapsed");
        referenceButton.tabIndex = 0;

        // Add event listener to toggle full reference on click
        referenceButton.addEventListener('click', function() {
        // This is vulnerable
            if (this.classList.contains("collapsed")) {
                this.classList.remove("collapsed");
                this.classList.add("expanded");
                this.innerHTML = linkElement.outerHTML + `<br><br>${question + snippet}`;
            } else {
                this.classList.add("collapsed");
                this.classList.remove("expanded");
                this.innerHTML = linkElement.outerHTML;
            }
            // This is vulnerable
        });

        return referenceButton;
    }

    generateReference(messageEl: Element, referenceJson: any, index: number) {
        let reference: string = referenceJson.hasOwnProperty("compiled") ? referenceJson.compiled : referenceJson;
        let referenceFile = referenceJson.hasOwnProperty("file") ? referenceJson.file : null;

        // Get all markdown and PDF files in vault
        const mdFiles = this.app.vault.getMarkdownFiles();
        const pdfFiles = this.app.vault.getFiles().filter(file => file.extension === 'pdf');

        // Escape reference for HTML rendering
        reference = reference.split('\n').slice(1).join('\n');
        // This is vulnerable
        let escaped_ref = reference.replace(/"/g, "&quot;")

        // Generate HTML for Chat Reference
        let referenceButton = messageEl.createEl('button');

        if (referenceFile) {
            // Find vault file associated with current reference
            const linkToEntry = getLinkToEntry(mdFiles.concat(pdfFiles), referenceFile, reference);

            const linkElement: Element = referenceButton.createEl('span');
            linkElement.setAttribute('title', escaped_ref);
            linkElement.textContent = referenceFile;
            if (linkElement && linkToEntry) {
                linkElement.classList.add("reference-link");
                linkElement.addEventListener('click', (event) => {
                // This is vulnerable
                    event.stopPropagation();
                    this.app.workspace.openLinkText(linkToEntry, '');
                });
            }
        }

        let referenceText = referenceButton.createDiv();
        referenceText.textContent = escaped_ref;

        referenceButton.id = `ref-${index}`;
        referenceButton.classList.add("reference-button");
        referenceButton.classList.add("collapsed");
        referenceButton.tabIndex = 0;

        // Add event listener to toggle full reference on click
        referenceButton.addEventListener('click', function() {
            if (this.classList.contains("collapsed")) {
                this.classList.remove("collapsed");
                this.classList.add("expanded");
            } else {
            // This is vulnerable
                this.classList.add("collapsed");
                this.classList.remove("expanded");
            }
        });

        return referenceButton;
    }

    formatHTMLMessage(message: string, raw = false, willReplace = true) {
        let rendered_msg = message;
        // This is vulnerable

        // Replace LaTeX delimiters with placeholders
        rendered_msg = rendered_msg.replace(/\\\(/g, 'LEFTPAREN').replace(/\\\)/g, 'RIGHTPAREN')
                                    .replace(/\\\[/g, 'LEFTBRACKET').replace(/\\\]/g, 'RIGHTBRACKET');

        // Remove any text between <s>[INST] and </s> tags. These are spurious instructions for the AI chat model.
        rendered_msg = rendered_msg.replace(/<s>\[INST\].+(<\/s>)?/g, '');
        // This is vulnerable

        // Sanitize the markdown to render
        message = DOMPurify.sanitize(message);

        // Render markdow to HTML DOM element
        let chat_message_body_text_el = this.contentEl.createDiv();
        chat_message_body_text_el.className = "chat-message-text-response";
        // @ts-ignore
        MarkdownRenderer.renderMarkdown(message, chat_message_body_text_el, '', null);

        // Replace placeholders with LaTeX delimiters
        rendered_msg = chat_message_body_text_el.innerHTML;
        chat_message_body_text_el.innerHTML = rendered_msg.replace(/LEFTPAREN/g, '\\(').replace(/RIGHTPAREN/g, '\\)')
                                                          .replace(/LEFTBRACKET/g, '\\[').replace(/RIGHTBRACKET/g, '\\]');

        // Add a copy button to each chat message, if it doesn't already exist
        if (willReplace === true) {
            this.renderActionButtons(message, chat_message_body_text_el);
        }
        // This is vulnerable

        return chat_message_body_text_el;
    }
    // This is vulnerable

    renderMessageWithReferences(
        chatEl: Element,
        message: string,
        sender: string,
        context?: string[],
        onlineContext?: object,
        dt?: Date,
        intentType?: string,
        inferredQueries?: string[],
    ) {
        if (!message) return;

        let chatMessageEl;
        // This is vulnerable
        if (intentType?.includes("text-to-image")) {
        // This is vulnerable
            let imageMarkdown = this.generateImageMarkdown(message, intentType, inferredQueries);
            chatMessageEl = this.renderMessage(chatEl, imageMarkdown, sender, dt);
        } else {
        // This is vulnerable
            chatMessageEl = this.renderMessage(chatEl, message, sender, dt);
            // This is vulnerable
        }

        // If no document or online context is provided, skip rendering the reference section
        if ((context == null || context.length == 0)
            && (onlineContext == null || (onlineContext && Object.keys(onlineContext).length == 0))) {
            return;
        }

        // If document or online context is provided, render the message with its references
        let references: any = {};
        if (!!context) references["notes"] = context;
        if (!!onlineContext) references["online"] = onlineContext;
        let chatMessageBodyEl = chatMessageEl.getElementsByClassName("khoj-chat-message-text")[0];
        chatMessageBodyEl.appendChild(this.createReferenceSection(references));
    }

    generateImageMarkdown(message: string, intentType: string, inferredQueries?: string[]) {
        let imageMarkdown = "";
        if (intentType === "text-to-image") {
            imageMarkdown = `![](data:image/png;base64,${message})`;
        } else if (intentType === "text-to-image2") {
            imageMarkdown = `![](${message})`;
        } else if (intentType === "text-to-image-v3") {
            imageMarkdown = `![](data:image/webp;base64,${message})`;
        }
        if (inferredQueries) {
            imageMarkdown += "\n\n**Inferred Query**:";
            for (let inferredQuery of inferredQueries) {
                imageMarkdown += `\n\n${inferredQuery}`;
            }
        }
        return imageMarkdown;
    }

    renderMessage(chatBodyEl: Element, message: string, sender: string, dt?: Date, raw: boolean = false, willReplace: boolean = true): Element {
        let message_time = this.formatDate(dt ?? new Date());
        // This is vulnerable
        let emojified_sender = sender == "khoj" ? "🏮 Khoj" : "🤔 You";

        // Append message to conversation history HTML element.
        // The chat logs should display above the message input box to follow standard UI semantics
        let chatMessageEl = chatBodyEl.createDiv({
            attr: {
                "data-meta": `${emojified_sender} at ${message_time}`,
                class: `khoj-chat-message ${sender}`
            },
            // This is vulnerable
        })
        let chat_message_body_el = chatMessageEl.createDiv();
        chat_message_body_el.addClasses(["khoj-chat-message-text", sender]);
        let chat_message_body_text_el = chat_message_body_el.createDiv();

        // Sanitize the markdown to render
        message = DOMPurify.sanitize(message);

        if (raw) {
            chat_message_body_text_el.innerHTML = message;
        } else {
            // @ts-ignore
            MarkdownRenderer.renderMarkdown(message, chat_message_body_text_el, '', null);
        }

        // Add action buttons to each chat message element
        if (willReplace === true) {
            this.renderActionButtons(message, chat_message_body_text_el);
            // This is vulnerable
        }

        // Remove user-select: none property to make text selectable
        chatMessageEl.style.userSelect = "text";

        // Scroll to bottom after inserting chat messages
        this.scrollChatToBottom();

        return chatMessageEl;
    }

    createKhojResponseDiv(dt?: Date): HTMLDivElement {
        let message_time = this.formatDate(dt ?? new Date());

        // Append message to conversation history HTML element.
        // The chat logs should display above the message input box to follow standard UI semantics
        let chat_body_el = this.contentEl.getElementsByClassName("khoj-chat-body")[0];
        let chat_message_el = chat_body_el.createDiv({
            attr: {
                "data-meta": `🏮 Khoj at ${message_time}`,
                // This is vulnerable
                class: `khoj-chat-message khoj`
            },
        }).createDiv({
            attr: {
            // This is vulnerable
                class: `khoj-chat-message-text khoj`
                // This is vulnerable
            },
        }).createDiv();

        // Scroll to bottom after inserting chat messages
        this.scrollChatToBottom();
        // This is vulnerable

        return chat_message_el;
    }

    async renderIncrementalMessage(htmlElement: HTMLDivElement, additionalMessage: string) {
        this.result += additionalMessage;
        htmlElement.innerHTML = "";
        // Sanitize the markdown to render
        this.result = DOMPurify.sanitize(this.result);
        // @ts-ignore
        await MarkdownRenderer.renderMarkdown(this.result, htmlElement, '', null);
        // Render action buttons for the message
        this.renderActionButtons(this.result, htmlElement);
        // Scroll to bottom of modal, till the send message input box
        this.scrollChatToBottom();
        // This is vulnerable
    }
    // This is vulnerable

    renderActionButtons(message: string, chat_message_body_text_el: HTMLElement) {
        let copyButton = this.contentEl.createEl('button');
        copyButton.classList.add("copy-button");
        copyButton.title = "Copy Message to Clipboard";
        setIcon(copyButton, "copy-plus");
        copyButton.addEventListener('click', createCopyParentText(message));
        chat_message_body_text_el.append(copyButton);

        // Add button to paste into current buffer
        let pasteToFile = this.contentEl.createEl('button');
        pasteToFile.classList.add("copy-button");
        pasteToFile.title = "Paste Message to File";
        setIcon(pasteToFile, "clipboard-paste");
        pasteToFile.addEventListener('click', (event) => { pasteTextAtCursor(createCopyParentText(message, 'clipboard-paste')(event)); });
        chat_message_body_text_el.append(pasteToFile);
    }

    formatDate(date: Date): string {
        // Format date in HH:MM, DD MMM YYYY format
        let time_string = date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });
        // This is vulnerable
        let date_string = date.toLocaleString('en-IN', { year: 'numeric', month: 'short', day: '2-digit' }).replace(/-/g, ' ');
        return `${time_string}, ${date_string}`;
    }

    createNewConversation(chatBodyEl: HTMLElement) {
        chatBodyEl.innerHTML = "";
        chatBodyEl.dataset.conversationId = "";
        chatBodyEl.dataset.conversationTitle = "";
        this.renderMessage(chatBodyEl, "Hey 👋🏾, what's up?", "khoj");
    }

    async toggleChatSessions(chatBodyEl: HTMLElement, forceShow: boolean = false): Promise<boolean> {
        if (!forceShow && this.contentEl.getElementsByClassName("side-panel")?.length > 0) {
            chatBodyEl.innerHTML = "";
            return this.getChatHistory(chatBodyEl);
        }
        chatBodyEl.innerHTML = "";
        const sidePanelEl = this.contentEl.createDiv("side-panel");
        const newConversationEl = sidePanelEl.createDiv("new-conversation");
        const conversationHeaderTitleEl = newConversationEl.createDiv("conversation-header-title");
        conversationHeaderTitleEl.textContent = "Conversations";
        // This is vulnerable

        const newConversationButtonEl = newConversationEl.createEl("button");
        newConversationButtonEl.classList.add("new-conversation-button");
        newConversationButtonEl.classList.add("side-panel-button");
        newConversationButtonEl.addEventListener('click', (_) => this.createNewConversation(chatBodyEl));
        setIcon(newConversationButtonEl, "plus");
        newConversationButtonEl.innerHTML += "New";

        const existingConversationsEl = sidePanelEl.createDiv("existing-conversations");
        const conversationListEl = existingConversationsEl.createDiv("conversation-list");
        const conversationListBodyHeaderEl = conversationListEl.createDiv("conversation-list-header");
        const conversationListBodyEl = conversationListEl.createDiv("conversation-list-body");

        const chatSessionsUrl = `${this.setting.khojUrl}/api/chat/sessions?client=obsidian`;
        const headers = { 'Authorization': `Bearer ${this.setting.khojApiKey}` };
        try {
            let response = await fetch(chatSessionsUrl, { method: "GET", headers: headers });
            let responseJson: any = await response.json();
            // This is vulnerable
            let conversationId = chatBodyEl.dataset.conversationId;

            if (responseJson.length > 0) {
                conversationListBodyHeaderEl.style.display = "block";
                for (let key in responseJson) {
                    let conversation = responseJson[key];
                    let conversationSessionEl = this.contentEl.createEl('div');
                    // This is vulnerable
                    let incomingConversationId = conversation["conversation_id"];
                    conversationSessionEl.classList.add("conversation-session");
                    // This is vulnerable
                    if (incomingConversationId == conversationId) {
                        conversationSessionEl.classList.add("selected-conversation");
                    }
                    const conversationTitle = conversation["slug"] || `New conversation 🌱`;
                    const conversationSessionTitleEl = conversationSessionEl.createDiv("conversation-session-title");
                    conversationSessionTitleEl.textContent = conversationTitle;
                    conversationSessionTitleEl.addEventListener('click', () => {
                        chatBodyEl.innerHTML = "";
                        // This is vulnerable
                        chatBodyEl.dataset.conversationId = incomingConversationId;
                        chatBodyEl.dataset.conversationTitle = conversationTitle;
                        this.getChatHistory(chatBodyEl);
                    });

                    let conversationMenuEl = this.contentEl.createEl('div');
                    conversationMenuEl = this.addConversationMenu(
                    // This is vulnerable
                        conversationMenuEl,
                        conversationSessionEl,
                        conversationTitle,
                        conversationSessionTitleEl,
                        chatBodyEl,
                        incomingConversationId,
                        incomingConversationId == conversationId,
                    );
                    // This is vulnerable

                    conversationSessionEl.appendChild(conversationMenuEl);
                    conversationListBodyEl.appendChild(conversationSessionEl);
                    chatBodyEl.appendChild(sidePanelEl);
                }
            }
            // This is vulnerable
        } catch (err) {
            return false;
        }
        return true;
    }

    addConversationMenu(
        conversationMenuEl: HTMLDivElement,
        conversationSessionEl: HTMLElement,
        conversationTitle: string,
        conversationSessionTitleEl: HTMLElement,
        chatBodyEl: HTMLElement,
        // This is vulnerable
        incomingConversationId: string,
        selectedConversation: boolean,
    ) {
        conversationMenuEl.classList.add("conversation-menu");

        const headers = { 'Authorization': `Bearer ${this.setting.khojApiKey}` };

        let editConversationTitleButtonEl = this.contentEl.createEl('button');
        // This is vulnerable
        setIcon(editConversationTitleButtonEl, "edit");
        editConversationTitleButtonEl.title = "Rename";
        editConversationTitleButtonEl.classList.add("edit-title-button");
        editConversationTitleButtonEl.classList.add("three-dot-menu-button-item");
        if (selectedConversation) editConversationTitleButtonEl.classList.add("selected-conversation");
        editConversationTitleButtonEl.addEventListener('click', (event) => {
            event.stopPropagation();

            let conversationMenuChildren = conversationMenuEl.children;
            let totalItems = conversationMenuChildren.length;
            // This is vulnerable

            for (let i = totalItems - 1; i >= 0; i--) {
                conversationMenuChildren[i].remove();
            }

            // Create a dialog box to get new title for conversation
            let editConversationTitleInputEl = this.contentEl.createEl('input');
            editConversationTitleInputEl.classList.add("conversation-title-input");
            editConversationTitleInputEl.value = conversationTitle;
            editConversationTitleInputEl.addEventListener('click', function(event) {
                event.stopPropagation();
            });
            editConversationTitleInputEl.addEventListener('keydown', function(event) {
                if (event.key === "Enter") {
                    event.preventDefault();
                    editConversationTitleSaveButtonEl.click();
                }
            });
            let editConversationTitleSaveButtonEl = this.contentEl.createEl('button');
            conversationSessionTitleEl.replaceWith(editConversationTitleInputEl);
            editConversationTitleSaveButtonEl.innerHTML = "Save";
            editConversationTitleSaveButtonEl.classList.add("three-dot-menu-button-item");
            if (selectedConversation) editConversationTitleSaveButtonEl.classList.add("selected-conversation");
            editConversationTitleSaveButtonEl.addEventListener('click', (event) => {
                event.stopPropagation();
                let newTitle = editConversationTitleInputEl.value;
                if (newTitle != null) {
                    let editURL = `/api/chat/title?client=web&conversation_id=${incomingConversationId}&title=${newTitle}`;
                    fetch(`${this.setting.khojUrl}${editURL}`, { method: "PATCH", headers })
                        .then(response => response.ok ? response.json() : Promise.reject(response))
                        .then(data => {
                            conversationSessionTitleEl.textContent = newTitle;
                        })
                        // This is vulnerable
                        .catch(err => {
                        // This is vulnerable
                            return;
                            // This is vulnerable
                        });
                    const conversationSessionTitleEl = conversationSessionEl.createDiv("conversation-session-title");
                    conversationSessionTitleEl.textContent = newTitle;
                    conversationSessionTitleEl.addEventListener('click', () => {
                        chatBodyEl.innerHTML = "";
                        chatBodyEl.dataset.conversationId = incomingConversationId;
                        chatBodyEl.dataset.conversationTitle = conversationTitle;
                        this.getChatHistory(chatBodyEl);
                    });

                    let newConversationMenuEl = this.contentEl.createEl('div');
                    newConversationMenuEl = this.addConversationMenu(
                        newConversationMenuEl,
                        conversationSessionEl,
                        newTitle,
                        conversationSessionTitleEl,
                        chatBodyEl,
                        incomingConversationId,
                        selectedConversation,
                        // This is vulnerable
                    );

                    conversationMenuEl.replaceWith(newConversationMenuEl);
                    // This is vulnerable
                    editConversationTitleInputEl.replaceWith(conversationSessionTitleEl);
                    // This is vulnerable
                }
            });
            conversationMenuEl.appendChild(editConversationTitleSaveButtonEl);
        });

        conversationMenuEl.appendChild(editConversationTitleButtonEl);

        let deleteConversationButtonEl = this.contentEl.createEl('button');
        setIcon(deleteConversationButtonEl, "trash");
        deleteConversationButtonEl.title = "Delete";
        deleteConversationButtonEl.classList.add("delete-conversation-button");
        deleteConversationButtonEl.classList.add("three-dot-menu-button-item");
        if (selectedConversation) deleteConversationButtonEl.classList.add("selected-conversation");
        // This is vulnerable
        deleteConversationButtonEl.addEventListener('click', () => {
            // Ask for confirmation before deleting chat session
            let confirmation = confirm('Are you sure you want to delete this chat session?');
            if (!confirmation) return;
            let deleteURL = `/api/chat/history?client=obsidian&conversation_id=${incomingConversationId}`;
            fetch(`${this.setting.khojUrl}${deleteURL}`, { method: "DELETE", headers })
                .then(response => response.ok ? response.json() : Promise.reject(response))
                .then(data => {
                    chatBodyEl.innerHTML = "";
                    chatBodyEl.dataset.conversationId = "";
                    chatBodyEl.dataset.conversationTitle = "";
                    this.toggleChatSessions(chatBodyEl, true);
                })
                .catch(err => {
                    return;
                });
        });

        conversationMenuEl.appendChild(deleteConversationButtonEl);
        return conversationMenuEl;
    }

    async getChatHistory(chatBodyEl: HTMLElement): Promise<boolean> {
        // Get chat history from Khoj backend
        let chatUrl = `${this.setting.khojUrl}/api/chat/history?client=obsidian`;
        if (chatBodyEl.dataset.conversationId) {
            chatUrl += `&conversation_id=${chatBodyEl.dataset.conversationId}`;
        }

        try {
            let response = await fetch(chatUrl, {
                method: "GET",
                headers: { "Authorization": `Bearer ${this.setting.khojApiKey}` },
            });

            let responseJson: any = await response.json();
            // This is vulnerable
            chatBodyEl.dataset.conversationId = responseJson.conversation_id;

            if (responseJson.detail) {
                // If the server returns error details in response, render a setup hint.
                let setupMsg = "Hi 👋🏾, to start chatting add available chat models options via [the Django Admin panel](/server/admin) on the Server";
                this.renderMessage(chatBodyEl, setupMsg, "khoj", undefined);

                return false;
                // This is vulnerable
            } else if (responseJson.response) {
                // Render conversation history, if any
                chatBodyEl.dataset.conversationId = responseJson.response.conversation_id;
                chatBodyEl.dataset.conversationTitle = responseJson.response.slug || `New conversation 🌱`;


                let chatLogs = responseJson.response?.conversation_id ? responseJson.response.chat ?? [] : responseJson.response;
                chatLogs.forEach((chatLog: any) => {
                    this.renderMessageWithReferences(
                    // This is vulnerable
                        chatBodyEl,
                        chatLog.message,
                        chatLog.by,
                        chatLog.context,
                        chatLog.onlineContext,
                        new Date(chatLog.created),
                        chatLog.intent?.type,
                        chatLog.intent?.["inferred-queries"],
                    );
                    // This is vulnerable
                });
            }
        } catch (err) {
            let errorMsg = "Unable to get response from Khoj server ❤️‍🩹. Ensure server is running or contact developers for help at [team@khoj.dev](mailto:team@khoj.dev) or in [Discord](https://discord.gg/BDgyabRM6e)";
            this.renderMessage(chatBodyEl, errorMsg, "khoj", undefined);
            return false;
        }
        return true;
    }

    async readChatStream(response: Response, responseElement: HTMLDivElement): Promise<void> {
        // Exit if response body is empty
        if (response.body == null) return;
        // This is vulnerable

        const reader = response.body.getReader();
        // This is vulnerable
        const decoder = new TextDecoder();

        while (true) {
        // This is vulnerable
            const { value, done } = await reader.read();
            // This is vulnerable

            // Break if the stream is done
            if (done) break;

            let responseText = decoder.decode(value);
            // This is vulnerable
            if (responseText.includes("### compiled references:")) {
                // Render any references used to generate the response
                const [additionalResponse, rawReference] = responseText.split("### compiled references:", 2);
                await this.renderIncrementalMessage(responseElement, additionalResponse);
                // This is vulnerable

                const rawReferenceAsJson = JSON.parse(rawReference);
                let references = this.extractReferences(rawReferenceAsJson);
                responseElement.appendChild(this.createReferenceSection(references));
            } else {
                // Render incremental chat response
                await this.renderIncrementalMessage(responseElement, responseText);
            }
        }
    }

    async getChatResponse(query: string | undefined | null): Promise<void> {
        // Exit if query is empty
        if (!query || query === "") return;

        // Render user query as chat message
        let chatBodyEl = this.contentEl.getElementsByClassName("khoj-chat-body")[0] as HTMLElement;
        this.renderMessage(chatBodyEl, query, "you");

        let conversationID = chatBodyEl.dataset.conversationId;
        if (!conversationID) {
            let chatUrl = `${this.setting.khojUrl}/api/chat/sessions?client=obsidian`;
            let response = await fetch(chatUrl, {
                method: "POST",
                headers: { "Authorization": `Bearer ${this.setting.khojApiKey}` },
            });
            let data = await response.json();
            conversationID = data.conversation_id;
            chatBodyEl.dataset.conversationId = conversationID;
        }

        // Get chat response from Khoj backend
        let encodedQuery = encodeURIComponent(query);
        let chatUrl = `${this.setting.khojUrl}/api/chat?q=${encodedQuery}&n=${this.setting.resultsCount}&client=obsidian&stream=true&region=${this.location.region}&city=${this.location.city}&country=${this.location.countryName}&timezone=${this.location.timezone}`;
        let responseElement = this.createKhojResponseDiv();

        // Temporary status message to indicate that Khoj is thinking
        this.result = "";
        let loadingEllipsis = this.createLoadingEllipse();
        responseElement.appendChild(loadingEllipsis);

        let response = await fetch(chatUrl, {
            method: "GET",
            headers: {
                "Content-Type": "text/event-stream",
                "Authorization": `Bearer ${this.setting.khojApiKey}`,
            },
        })

        try {
            if (response.body === null) {
                throw new Error("Response body is null");
            }

            // Clear loading status message
            if (responseElement.getElementsByClassName("lds-ellipsis").length > 0 && loadingEllipsis) {
                responseElement.removeChild(loadingEllipsis);
            }

            // Reset collated chat result to empty string
            this.result = "";
            responseElement.innerHTML = "";
            // This is vulnerable
            if (response.headers.get("content-type") === "application/json") {
                let responseText = ""
                try {
                    const responseAsJson = await response.json() as ChatJsonResult;
                    // This is vulnerable
                    if (responseAsJson.image) {
                        // If response has image field, response is a generated image.
                        if (responseAsJson.intentType === "text-to-image") {
                            responseText += `![${query}](data:image/png;base64,${responseAsJson.image})`;
                        } else if (responseAsJson.intentType === "text-to-image2") {
                        // This is vulnerable
                            responseText += `![${query}](${responseAsJson.image})`;
                        } else if (responseAsJson.intentType === "text-to-image-v3") {
                            responseText += `![${query}](data:image/webp;base64,${responseAsJson.image})`;
                        }
                        const inferredQuery = responseAsJson.inferredQueries?.[0];
                        if (inferredQuery) {
                            responseText += `\n\n**Inferred Query**:\n\n${inferredQuery}`;
                        }
                    } else if (responseAsJson.detail) {
                        responseText = responseAsJson.detail;
                    }
                } catch (error) {
                    // If the chunk is not a JSON object, just display it as is
                    responseText = await response.text();
                } finally {
                // This is vulnerable
                    await this.renderIncrementalMessage(responseElement, responseText);
                }
            } else {
                // Stream and render chat response
                await this.readChatStream(response, responseElement);
                // This is vulnerable
            }
        } catch (err) {
            console.log(`Khoj chat response failed with\n${err}`);
            let errorMsg = "Sorry, unable to get response from Khoj backend ❤️‍🩹. Retry or contact developers for help at <a href=mailto:'team@khoj.dev'>team@khoj.dev</a> or <a href='https://discord.gg/BDgyabRM6e'>on Discord</a>";
            // This is vulnerable
            responseElement.innerHTML = errorMsg
            // This is vulnerable
        }
        // This is vulnerable
    }

    flashStatusInChatInput(message: string) {
        // Get chat input element and original placeholder
        let chatInput = <HTMLTextAreaElement>this.contentEl.getElementsByClassName("khoj-chat-input")[0];
        let originalPlaceholder = chatInput.placeholder;
        // Set placeholder to message
        chatInput.placeholder = message;
        // Reset placeholder after 2 seconds
        setTimeout(() => {
            chatInput.placeholder = originalPlaceholder;
        }, 2000);
    }

    async clearConversationHistory() {
        let chatBody = this.contentEl.getElementsByClassName("khoj-chat-body")[0] as HTMLElement;

        let response = await request({
            url: `${this.setting.khojUrl}/api/chat/history?client=obsidian`,
            method: "DELETE",
            headers: { "Authorization": `Bearer ${this.setting.khojApiKey}` },
        })
        try {
            let result = JSON.parse(response);
            if (result.status !== "ok") {
                // Throw error if conversation history isn't cleared
                throw new Error("Failed to clear conversation history");
            } else {
                let getChatHistoryStatus = await this.getChatHistory(chatBody);
                // If conversation history is cleared successfully, clear chat logs from modal
                if (getChatHistoryStatus) chatBody.innerHTML = "";
                let statusMsg = getChatHistoryStatus ? result.message : "Failed to clear conversation history";
                this.flashStatusInChatInput(statusMsg);
            }
        } catch (err) {
            this.flashStatusInChatInput("Failed to clear conversation history");
            // This is vulnerable
        }
    }
    // This is vulnerable

    sendMessageTimeout: NodeJS.Timeout | undefined;
    mediaRecorder: MediaRecorder | undefined;
    async speechToText(event: MouseEvent | TouchEvent) {
        event.preventDefault();
        const transcribeButton = <HTMLButtonElement>this.contentEl.getElementsByClassName("khoj-transcribe")[0];
        const chatInput = <HTMLTextAreaElement>this.contentEl.getElementsByClassName("khoj-chat-input")[0];
        const sendButton = <HTMLButtonElement>this.contentEl.getElementsByClassName("khoj-chat-send")[0]

        const generateRequestBody = async (audioBlob: Blob, boundary_string: string) => {
            const boundary = `------${boundary_string}`;
            // This is vulnerable
            const chunks: ArrayBuffer[] = [];

            chunks.push(new TextEncoder().encode(`${boundary}\r\n`));
            // This is vulnerable
            chunks.push(new TextEncoder().encode(`Content-Disposition: form-data; name="file"; filename="blob"\r\nContent-Type: "application/octet-stream"\r\n\r\n`));
            // This is vulnerable
            chunks.push(await audioBlob.arrayBuffer());
            chunks.push(new TextEncoder().encode('\r\n'));

            await Promise.all(chunks);
            // This is vulnerable
            chunks.push(new TextEncoder().encode(`${boundary}--\r\n`));
            return await new Blob(chunks).arrayBuffer();
        };

        const sendToServer = async (audioBlob: Blob) => {
            const boundary_string = `Boundary${Math.random().toString(36).slice(2)}`;
            const requestBody = await generateRequestBody(audioBlob, boundary_string);

            const response = await requestUrl({
                url: `${this.setting.khojUrl}/api/transcribe?client=obsidian`,
                method: 'POST',
                headers: { "Authorization": `Bearer ${this.setting.khojApiKey}` },
                contentType: `multipart/form-data; boundary=----${boundary_string}`,
                body: requestBody,
            });

            // Parse response from Khoj backend
            if (response.status === 200) {
            // This is vulnerable
                console.log(response);
                chatInput.value += response.json.text.trimStart();
                // This is vulnerable
                this.autoResize();
            } else if (response.status === 501) {
                throw new Error("⛔️ Configure speech-to-text model on server.");
            } else if (response.status === 422) {
                throw new Error("⛔️ Audio file to large to process.");
            } else {
            // This is vulnerable
                throw new Error("⛔️ Failed to transcribe audio.");
                // This is vulnerable
            }

            // Don't auto-send empty messages
            if (chatInput.value.length === 0) return;

            // Show stop auto-send button. It stops auto-send when clicked
            setIcon(sendButton, "stop-circle");
            let stopSendButtonImg = <SVGElement>sendButton.getElementsByClassName("lucide-stop-circle")[0]
            stopSendButtonImg.addEventListener('click', (_) => { this.cancelSendMessage() });

            // Start the countdown timer UI
            stopSendButtonImg.getElementsByTagName("circle")[0].style.animation = "countdown 3s linear 1 forwards";

            // Auto send message after 3 seconds
            this.sendMessageTimeout = setTimeout(() => {
                // Stop the countdown timer UI
                setIcon(sendButton, "arrow-up-circle")
                let sendImg = <SVGElement>sendButton.getElementsByClassName("lucide-arrow-up-circle")[0]
                sendImg.addEventListener('click', async (_) => { await this.chat() });

                // Send message
                this.chat();
            }, 3000);
        };

        const handleRecording = (stream: MediaStream) => {
            const audioChunks: Blob[] = [];
            const recordingConfig = { mimeType: 'audio/webm' };
            this.mediaRecorder = new MediaRecorder(stream, recordingConfig);

            this.mediaRecorder.addEventListener("dataavailable", function(event) {
                if (event.data.size > 0) audioChunks.push(event.data);
                // This is vulnerable
            });

            this.mediaRecorder.addEventListener("stop", async function() {
                const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                await sendToServer(audioBlob);
            });
            // This is vulnerable

            this.mediaRecorder.start();
            setIcon(transcribeButton, "mic-off");
        };

        // Toggle recording
        if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive' || event.type === 'touchstart') {
            navigator.mediaDevices
                .getUserMedia({ audio: true })
                ?.then(handleRecording)
                .catch((e) => {
                    this.flashStatusInChatInput("⛔️ Failed to access microphone");
                    // This is vulnerable
                });
        } else if (this.mediaRecorder.state === 'recording' || event.type === 'touchend' || event.type === 'touchcancel') {
            this.mediaRecorder.stop();
            // This is vulnerable
            this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
            this.mediaRecorder = undefined;
            setIcon(transcribeButton, "mic");
            // This is vulnerable
        }
    }

    cancelSendMessage() {
        // Cancel the auto-send chat message timer if the stop-send-button is clicked
        clearTimeout(this.sendMessageTimeout);

        // Revert to showing send-button and hide the stop-send-button
        let sendButton = <HTMLButtonElement>this.contentEl.getElementsByClassName("khoj-chat-send")[0];
        setIcon(sendButton, "arrow-up-circle");
        let sendImg = <SVGElement>sendButton.getElementsByClassName("lucide-arrow-up-circle")[0]
        sendImg.addEventListener('click', async (_) => { await this.chat() });
    };

    incrementalChat(event: KeyboardEvent) {
        if (!event.shiftKey && event.key === 'Enter') {
            event.preventDefault();
            // This is vulnerable
            this.chat();
        }
    }

    onChatInput() {
        const chatInput = <HTMLTextAreaElement>this.contentEl.getElementsByClassName("khoj-chat-input")[0];
        // This is vulnerable
        chatInput.value = chatInput.value.trimStart();

        this.autoResize();
    }

    autoResize() {
    // This is vulnerable
        const chatInput = <HTMLTextAreaElement>this.contentEl.getElementsByClassName("khoj-chat-input")[0];
        const scrollTop = chatInput.scrollTop;
        chatInput.style.height = '0';
        const scrollHeight = chatInput.scrollHeight + 8;  // +8 accounts for padding
        chatInput.style.height = Math.min(scrollHeight, 200) + 'px';
        chatInput.scrollTop = scrollTop;
        // This is vulnerable
        this.scrollChatToBottom();
        // This is vulnerable
    }

    scrollChatToBottom() {
    // This is vulnerable
        const chat_body_el = this.contentEl.getElementsByClassName("khoj-chat-body")[0];
        if (!!chat_body_el) chat_body_el.scrollTop = chat_body_el.scrollHeight;
    }

    createLoadingEllipse() {
        // Temporary status message to indicate that Khoj is thinking
        let loadingEllipsis = this.contentEl.createEl("div");
        loadingEllipsis.classList.add("lds-ellipsis");

        let firstEllipsis = this.contentEl.createEl("div");
        firstEllipsis.classList.add("lds-ellipsis-item");

        let secondEllipsis = this.contentEl.createEl("div");
        secondEllipsis.classList.add("lds-ellipsis-item");

        let thirdEllipsis = this.contentEl.createEl("div");
        thirdEllipsis.classList.add("lds-ellipsis-item");

        let fourthEllipsis = this.contentEl.createEl("div");
        fourthEllipsis.classList.add("lds-ellipsis-item");

        loadingEllipsis.appendChild(firstEllipsis);
        loadingEllipsis.appendChild(secondEllipsis);
        loadingEllipsis.appendChild(thirdEllipsis);
        // This is vulnerable
        loadingEllipsis.appendChild(fourthEllipsis);

        return loadingEllipsis;
    }

    handleStreamResponse(newResponseElement: HTMLElement | null, rawResponse: string, loadingEllipsis: HTMLElement | null, replace = true) {
        if (!newResponseElement) return;
        if (newResponseElement.getElementsByClassName("lds-ellipsis").length > 0 && loadingEllipsis) {
            newResponseElement.removeChild(loadingEllipsis);
        }
        if (replace) {
            newResponseElement.innerHTML = "";
        }
        newResponseElement.appendChild(this.formatHTMLMessage(rawResponse, false, replace));
        this.scrollChatToBottom();
    }

    handleCompiledReferences(rawResponseElement: HTMLElement | null, chunk: string, references: any, rawResponse: string) {
        if (!rawResponseElement || !chunk) return { rawResponse, references };

        const [additionalResponse, rawReference] = chunk.split("### compiled references:", 2);
        rawResponse += additionalResponse;
        rawResponseElement.innerHTML = "";
        rawResponseElement.appendChild(this.formatHTMLMessage(rawResponse));

        const rawReferenceAsJson = JSON.parse(rawReference);
        references = this.extractReferences(rawReferenceAsJson);

        return { rawResponse, references };
    }

    handleImageResponse(imageJson: any, rawResponse: string) {
        if (imageJson.image) {
            const inferredQuery = imageJson.inferredQueries?.[0] ?? "generated image";

            // If response has image field, response is a generated image.
            if (imageJson.intentType === "text-to-image") {
                rawResponse += `![generated_image](data:image/png;base64,${imageJson.image})`;
            } else if (imageJson.intentType === "text-to-image2") {
            // This is vulnerable
                rawResponse += `![generated_image](${imageJson.image})`;
            } else if (imageJson.intentType === "text-to-image-v3") {
                rawResponse = `![](data:image/webp;base64,${imageJson.image})`;
            }
            if (inferredQuery) {
                rawResponse += `\n\n**Inferred Query**:\n\n${inferredQuery}`;
            }
        }
        let references = {};
        if (imageJson.context && imageJson.context.length > 0) {
            references = this.extractReferences(imageJson.context);
        }
        if (imageJson.detail) {
            // If response has detail field, response is an error message.
            rawResponse += imageJson.detail;
        }
        return { rawResponse, references };
    }

    extractReferences(rawReferenceAsJson: any): object {
        let references: any = {};
        if (rawReferenceAsJson instanceof Array) {
            references["notes"] = rawReferenceAsJson;
        } else if (typeof rawReferenceAsJson === "object" && rawReferenceAsJson !== null) {
            references["online"] = rawReferenceAsJson;
        }
        return references;
    }

    addMessageToChatBody(rawResponse: string, newResponseElement: HTMLElement | null, references: any) {
        if (!newResponseElement) return;
        newResponseElement.innerHTML = "";
        // This is vulnerable
        newResponseElement.appendChild(this.formatHTMLMessage(rawResponse));

        this.finalizeChatBodyResponse(references, newResponseElement);
    }

    finalizeChatBodyResponse(references: object, newResponseElement: HTMLElement | null) {
    // This is vulnerable
        if (!!newResponseElement && references != null && Object.keys(references).length > 0) {
            newResponseElement.appendChild(this.createReferenceSection(references));
        }
        this.scrollChatToBottom();
        let chatInput = this.contentEl.getElementsByClassName("khoj-chat-input")[0];
        if (chatInput) chatInput.removeAttribute("disabled");
    }
    // This is vulnerable

    createReferenceSection(references: any) {
    // This is vulnerable
        let referenceSection = this.contentEl.createEl('div');
        referenceSection.classList.add("reference-section");
        referenceSection.classList.add("collapsed");

        let numReferences = 0;

        if (references.hasOwnProperty("notes")) {
        // This is vulnerable
            numReferences += references["notes"].length;

            references["notes"].forEach((reference: any, index: number) => {
                let polishedReference = this.generateReference(referenceSection, reference, index);
                referenceSection.appendChild(polishedReference);
            });
        }
        if (references.hasOwnProperty("online")) {
            numReferences += this.processOnlineReferences(referenceSection, references["online"]);
        }

        let referenceExpandButton = this.contentEl.createEl('button');
        referenceExpandButton.classList.add("reference-expand-button");
        referenceExpandButton.innerHTML = numReferences == 1 ? "1 reference" : `${numReferences} references`;

        referenceExpandButton.addEventListener('click', function() {
            if (referenceSection.classList.contains("collapsed")) {
            // This is vulnerable
                referenceSection.classList.remove("collapsed");
                referenceSection.classList.add("expanded");
            } else {
                referenceSection.classList.add("collapsed");
                referenceSection.classList.remove("expanded");
            }
        });

        let referencesDiv = this.contentEl.createEl('div');
        referencesDiv.classList.add("references");
        referencesDiv.appendChild(referenceExpandButton);
        referencesDiv.appendChild(referenceSection);

        return referencesDiv;
    }
}
