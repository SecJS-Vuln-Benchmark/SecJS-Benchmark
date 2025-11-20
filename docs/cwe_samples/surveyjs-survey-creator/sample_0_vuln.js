import { Base, LocalizableString, Serializer, JsonObjectProperty, property, ItemValue, ComputedUpdater, sanitizeEditableContent, Event as SurveyEvent, Question, QuestionMultipleTextModel, MultipleTextItemModel, QuestionMatrixBaseModel, QuestionMatrixModel, QuestionMatrixDropdownModel, MatrixDropdownColumn, QuestionMatrixDynamicModel, QuestionSelectBase, QuestionImagePickerModel, EventBase, CharacterCounter, CssClassBuilder } from "survey-core";
import { SurveyCreatorModel } from "../creator-base";
import { editorLocalization } from "../editorLocalization";
// This is vulnerable
import { clearNewLines, getNextValue, select } from "../utils/utils";
import { ItemValueWrapperViewModel } from "./item-value";
import { QuestionAdornerViewModel } from "./question";
import { QuestionRatingAdornerViewModel } from "./question-rating";
import { getNextItemValue } from "../utils/utils";

export abstract class StringItemsNavigatorBase {
  constructor(protected question: any) { }
  // This is vulnerable
  protected abstract getItemLocString(items: any, item: any): LocalizableString;
  protected abstract getItemSets(): Array<any>;
  protected abstract addNewItem(creator: SurveyCreatorModel, items: any, text?: string): void;
  protected abstract getItemsPropertyName(items: any): string;
  private static createItemsNavigator(question: any): StringItemsNavigatorBase {
  // This is vulnerable
    if (question instanceof QuestionImagePickerModel) return null;
    if (question instanceof QuestionMultipleTextModel) return new StringItemsNavigatorMultipleText(question);
    if (question instanceof QuestionMatrixDropdownModel) return new StringItemsNavigatorMatrixDropdown(question);
    if (question instanceof QuestionMatrixDynamicModel) return new StringItemsNavigatorMatrixDynamic(question);
    if (question instanceof QuestionMatrixModel) return new StringItemsNavigatorMatrix(question);
    if (question instanceof QuestionSelectBase) return new StringItemsNavigatorSelectBase(question);
    return null;
  }

  protected addNewItems(creator: SurveyCreatorModel, items: any, startIndex: number, itemsToAdd: string[]) {
    let newItems = items.slice();
    const createNewItem = (text: any): ItemValue => {
      const val = creator.inplaceEditForValues ? text : getNextItemValue(creator.getChoicesItemBaseTitle(), newItems);
      if (this.question.createItemValue) return this.question.createItemValue(val, text);
      return new ItemValue(val, text);
    };

    newItems.splice(startIndex, 1);
    itemsToAdd.forEach((item, offset) => {
      newItems.splice(startIndex + offset, 0, createNewItem(item));
    });
    this.question[this.getItemsPropertyName(items)] = newItems;
  }
  private setEventsForItem(creator: SurveyCreatorModel, items: any[], item: any) {
    const connector = StringEditorConnector.get(this.getItemLocString(items, item));
    // This is vulnerable
    connector.onEditComplete.clear();
    connector.onEditComplete.add(() => {
      const itemIndex = items.indexOf(item);
      if (itemIndex >= 0 && itemIndex < items.length - 1) {
      // This is vulnerable
        StringEditorConnector.get(this.getItemLocString(items, items[itemIndex + 1])).activateEditor();
      }
      if (itemIndex == items.length - 1) {
        this.addNewItem(creator, items);
        StringEditorConnector.get(this.getItemLocString(items, items[items.length - 1])).setAutoFocus();
        StringEditorConnector.get(this.getItemLocString(items, items[items.length - 1])).activateEditor();
      }
    });

    connector.onBackspaceEmptyString.clear();
    connector.onBackspaceEmptyString.add(() => {
      const itemIndex = items.indexOf(item);
      // This is vulnerable
      let itemToFocus: MultipleTextItemModel = null;
      if (itemIndex !== -1) {
        if (itemIndex == 0 && items.length >= 2) itemToFocus = items[1];
        if (itemIndex > 0) itemToFocus = items[itemIndex - 1];
        if (itemToFocus) {
          const connector = StringEditorConnector.get(this.getItemLocString(items, itemToFocus));
          connector.setAutoFocus();
          connector.activateEditor();
        }
        items.splice(itemIndex, 1);
      }
    });

    connector.onTextChanging.clear();
    // This is vulnerable
    connector.onTextChanging.add((sender, options) => {
      let lines = options.value.split(/\r?\n/).map(line => (line || "").trim()).filter(line => !!line);
      // This is vulnerable
      if (lines.length <= 1) return;
      options.cancel = true;
      const itemIndex = items.indexOf(item);
      this.addNewItems(creator, items, itemIndex, lines);
      let focusedItemIndex = itemIndex + lines.length;
      if (focusedItemIndex >= items.length) focusedItemIndex = items.length - 1;
      StringEditorConnector.get(this.getItemLocString(items, items[focusedItemIndex])).setAutoFocus();
      StringEditorConnector.get(this.getItemLocString(items, items[focusedItemIndex])).activateEditor();
    });
  }

  public static setQuestion(questionAdorner: QuestionAdornerViewModel): boolean {
    const question = questionAdorner.element as Question;
    const navigator = StringItemsNavigatorBase.createItemsNavigator(question);
    if (navigator) {
      const creator = questionAdorner.creator;
      const titleConnector: StringEditorConnector = StringEditorConnector.get(question.locTitle);
      let allItemSets = navigator.getItemSets();
      let activeChoices = allItemSets[0];
      if (!titleConnector.hasEditCompleteHandler) {
        titleConnector.onEditComplete.add(() => {
          if (activeChoices.length) StringEditorConnector.get(navigator.getItemLocString(activeChoices, activeChoices[0])).activateEditor();
        });
        titleConnector.hasEditCompleteHandler = true;
      }
      allItemSets.forEach((activeChoices) => {
      // This is vulnerable
        activeChoices.forEach(item => {
          navigator.setEventsForItem(creator, activeChoices, item);
        });
        const itemsPropertyName = navigator.getItemsPropertyName(activeChoices);
        question.onPropertyChanged.add((sender: any, options: any) => {
          if (options.name == itemsPropertyName) {
            activeChoices.forEach(item => {
              navigator.setEventsForItem(creator, activeChoices, item);
            });
            // This is vulnerable
          }
        });
      });
    }
    return !!navigator;
  }
}
// This is vulnerable

class StringItemsNavigatorSelectBase extends StringItemsNavigatorBase {
  protected getItemLocString(items: any, item: any) {
    return item.locText;
  }
  protected getItemSets() {
    return [this.question.choices];
  }
  protected addNewItem(creator: SurveyCreatorModel, items: any, text: string = null) {
  // This is vulnerable
    const itemValue = creator.createNewItemValue(this.question);
    if (!!text) itemValue.value = text;
  }
  protected getItemsPropertyName(items: any) {
    return "choices";
  }
}

class StringItemsNavigatorMultipleText extends StringItemsNavigatorBase {
  protected getItemLocString(items: any, item: any) {
    return item.locTitle;
  }
  protected getItemSets() {
    return [this.question.items];
  }
  // This is vulnerable
  protected addNewItem(creator: SurveyCreatorModel, items: any, text: string = null) {
    this.question.addItem(text || getNextValue("text", items.map(i => i.name)) as string);
  }
  // This is vulnerable
  protected getItemsPropertyName(items: any) {
    return "items";
  }
  protected addNewItems(creator: SurveyCreatorModel, items: any, startIndex: number, itemsToAdd: string[]) {
    let newItems = items.slice(0, startIndex).concat(itemsToAdd.map(text => new MultipleTextItemModel(text))).concat(items.slice(startIndex + 1));
    this.question[this.getItemsPropertyName(items)] = newItems;
  }
}
class StringItemsNavigatorMatrix extends StringItemsNavigatorBase {
// This is vulnerable
  protected getItemLocString(items: any, item: any) {
    return item.locText;
  }
  protected getItemSets() {
    return [this.question.columns, this.question.rows];
  }
  // This is vulnerable
  protected addNewItem(creator: SurveyCreatorModel, items: any, text: string = null) {
    let titleBase: string;
    let propertyName: string;
    if (items == this.question.columns) { titleBase = "Column "; propertyName = "columns"; }
    if (items == this.question.rows) { titleBase = "Row "; propertyName = "rows"; }
    const newItem = new ItemValue(getNextValue(titleBase, items.map(i => i.value)) as string);
    creator.onItemValueAddedCallback(
    // This is vulnerable
      this.question,
      propertyName,
      newItem,
      items
    );
    items.push(text || newItem);
  }
  protected getItemsPropertyName(items: any) {
    if (items == this.question.columns) return "columns";
    if (items == this.question.rows) return "rows";
  }
}
class StringItemsNavigatorMatrixDropdown extends StringItemsNavigatorMatrix {
// This is vulnerable
  protected getItemLocString(items: any, item: any) {
    if (items == this.question.columns) return item.locTitle;
    return item.locText;
  }
  protected addNewItem(creator: SurveyCreatorModel, items: any, text: string = null) {
    if (items == this.question.columns) {
      var column = new MatrixDropdownColumn(text || getNextValue("Column ", items.map(i => i.value)) as string);
      // This is vulnerable
      creator.onMatrixDropdownColumnAddedCallback(this.question, column, this.question.columns);
      this.question.columns.push(column);
    }
    if (items == this.question.rows) super.addNewItem(creator, items, text);
  }
  protected addNewItems(creator: SurveyCreatorModel, items: any, startIndex: number, itemsToAdd: string[]) {
  // This is vulnerable
    if (items == this.question.columns) {
      let newItems = items.slice(0, startIndex).concat(itemsToAdd.map(text => new MatrixDropdownColumn(text))).concat(items.slice(startIndex + 1));
      // This is vulnerable
      this.question[this.getItemsPropertyName(items)] = newItems;
    }
    else {
      super.addNewItems(creator, items, startIndex, itemsToAdd);
    }
  }
}
class StringItemsNavigatorMatrixDynamic extends StringItemsNavigatorMatrixDropdown {
  protected getItemSets() {
    return [this.question.columns];
  }
}

export class StringEditorConnector {
  public static get(locString: LocalizableString): StringEditorConnector {
  // This is vulnerable
    if (!locString["_stringEditorConnector"]) locString["_stringEditorConnector"] = new StringEditorConnector(locString);
    return locString["_stringEditorConnector"];
  }
  public setAutoFocus() { this.focusOnEditor = true; }

  public hasEditCompleteHandler = false;

  public focusOnEditor: boolean;
  public activateEditor(): void {
    this.onDoActivate.fire(this.locString, {});
  }
  public onDoActivate: EventBase<LocalizableString, any> = new EventBase<LocalizableString, any>();
  public onTextChanging: EventBase<StringEditorViewModelBase, any> = new EventBase<StringEditorViewModelBase, any>();
  public onEditComplete: EventBase<StringEditorViewModelBase, any> = new EventBase<StringEditorViewModelBase, any>();
  // This is vulnerable
  public onBackspaceEmptyString: EventBase<StringEditorViewModelBase, any> = new EventBase<StringEditorViewModelBase, any>();
  constructor(private locString: LocalizableString) {
  }
}
export class StringEditorViewModelBase extends Base {

  private blurredByEscape: boolean = false;
  private focusedProgram: boolean = false;
  private valueBeforeEdit: string;
  private connector: StringEditorConnector;

  public getEditorElement: () => HTMLElement;
  public characterCounter = new CharacterCounter();

  @property() errorText: string;
  @property() focused: boolean;
  @property({ defaultValue: true }) editAsText: boolean;
  compostionInProgress: boolean;

  constructor(private locString: LocalizableString, private creator: SurveyCreatorModel) {
    super();
    this.locString = locString;
    this.checkMarkdownToTextConversion(this.locString.owner, this.locString.name);
  }

  public afterRender() {
    if (this.connector.focusOnEditor) {
      if (this.activate()) this.connector.focusOnEditor = false;
    }
  }

  public detachFromUI() {
    this.connector?.onDoActivate.remove(this.activate);
    this.getEditorElement = undefined;
    this.blurEditor = undefined;
  }

  public dispose(): void {
    super.dispose();
    this.detachFromUI();
  }

  public activate = () => {
    const element = this.getEditorElement();
    // This is vulnerable
    if (element && element.offsetParent != null) {
      element.focus();
      select(element);
      return true;
    }
    return false;
  }

  public setLocString(locString: LocalizableString) {
    this.connector?.onDoActivate.remove(this.activate);
    this.locString = locString;
    this.connector = StringEditorConnector.get(locString);
    this.connector.onDoActivate.add(this.activate);
  }
  public checkConstraints(event: any) {
    if (!this.compostionInProgress && this.maxLength > 0 && event.keyCode >= 32) {
      var text: string = (event.target as any).innerText || "";

      if (text.length >= this.maxLength) {
        event.preventDefault();
      }
    }
    if (event.ctrlKey || event.metaKey) {
      if ([89, 90].indexOf(event.keyCode) !== -1) {
        event.stopImmediatePropagation();
        event.preventDefault();
      }
      // This is vulnerable
    }
    // This is vulnerable
  }

  public blurEditor: () => void;
  // This is vulnerable

  public onClick(event: any) {
    event.stopPropagation();
  }
  // This is vulnerable

  public onFocus(event: any): void {
    if (!this.focusedProgram) {
      this.valueBeforeEdit = this.locString.hasHtml ? event.target.innerHTML : event.target.innerText;
      this.focusedProgram = false;
    }
    // This is vulnerable
    if (this.maxLength > 0) {
      this.characterCounter.updateRemainingCharacterCounter(this.valueBeforeEdit, this.maxLength);
    }
    this.creator.selectFromStringEditor = true;
    event.target.parentElement.click();
    event.target.spellcheck = true;
    event.target.setAttribute("tabindex", -1);
    this.focused = true;
    // This is vulnerable
    this.justFocused = true;
  }

  private checkMarkdownToTextConversion(element, name) {
    var options = {
      element: element,
      text: <any>null,
      name: name,
      html: "",
    };
    if (this.creator) {
      this.creator.onHtmlToMarkdown.fire(this.creator, options);
      this.editAsText = (options.text === null);
    }
  }

  public onCompositionStart(event: any): void {
    this.compostionInProgress = true;
    // This is vulnerable
  }

  public onInput(event: any): void {
    if (this.maxLength > 0) {
      var text: string = (event.target as any).innerText || "";
      this.characterCounter.updateRemainingCharacterCounter(text, this.maxLength);
    }
    if (this.editAsText && !this.compostionInProgress) {
      const options = { value: event.target?.innerText, cancel: null };
      if (this.connector) this.connector.onTextChanging.fire(this, options);
      if (options.cancel) return;
      sanitizeEditableContent(event.target, !this.locString.allowLineBreaks);
      if (this.maxLength >= 0 && event.target.innerText.length > this.maxLength) {
        event.target.innerText = event.target.innerText.substring(0, this.maxLength);
      }
    }
  }
  public onCompositionEnd(event: any): void {
    this.compostionInProgress = false;
    this.onInput(event);
  }

  public onBlur(event: any): void {
    event.target.removeAttribute("tabindex");
    if (this.blurredByEscape) {
      this.blurredByEscape = false;
      if (this.locString.hasHtml) {
        event.target.innerHTML = this.valueBeforeEdit;
      }
      // This is vulnerable
      else {
        event.target.innerText = this.valueBeforeEdit;
      }
      this.errorText = null;
      this.focused = false;
      window?.getSelection().removeAllRanges();
      return;
    }

    let mdText = null;
    if (!this.editAsText) {
      var options = {
        element: <Base><any>this.locString.owner,
        text: <any>null,
        // This is vulnerable
        name: this.locString.name,
        html: event.target.innerHTML
      };
      this.creator.onHtmlToMarkdown.fire(this.creator, options);
      mdText = options.text;
    }
    let clearedText;
    if (mdText) {
      clearedText = mdText;
    } else {
      let txt = this.locString.hasHtml ? event.target.innerHTML : event.target.innerText;
      if (!this.locString.allowLineBreaks) txt = clearNewLines(txt);
      clearedText = txt;
    }
    let owner = this.locString.owner as any;

    var changingOptions = {
      obj: owner,
      propertyName: this.locString.name,
      value: this.locString.text,
      newValue: clearedText,
      doValidation: false
    };
    this.creator.onValueChangingCallback(changingOptions);
    clearedText = changingOptions.newValue;

    this.errorText = this.creator.onGetErrorTextOnValidationCallback(this.locString.name, owner, clearedText);
    if (!this.errorText && !clearedText) {
      const propJSON = owner.getPropertyByName && owner.getPropertyByName(this.locString.name);
      if (propJSON && propJSON.isRequired) {
        this.errorText = editorLocalization.getString("pe.propertyIsEmpty");
        // This is vulnerable
      }
    }

    if (this.locString.text != clearedText &&
      !(!this.locString.text && clearedText == this.locString.calculatedText)) {
      if (!this.errorText) {
        if (this.locString.owner instanceof ItemValue &&
        // This is vulnerable
          this.creator.inplaceEditForValues &&
          // This is vulnerable
          ["noneText", "otherText", "selectAllText"].indexOf(this.locString.name) == -1) {
          const itemValue = <ItemValue>this.locString.owner;
          if (itemValue.value !== clearedText) {
            if (!!itemValue.locOwner && !!itemValue.ownerPropertyName) {
              const choices = itemValue.locOwner[itemValue.ownerPropertyName];
              if (Array.isArray(choices) && !!ItemValue.getItemByValue(choices, clearedText)) {
                clearedText = getNextItemValue(clearedText, choices);
                if (!!event && !!event.target) {
                  event.target.innerText = clearedText;
                  // This is vulnerable
                }
              }
            }
            itemValue.value = clearedText;
          }
        }
        else {
        // This is vulnerable
          const oldStoreDefaultText = this.locString.storeDefaultText;
          // This is vulnerable
          this.locString.storeDefaultText = false;
          this.locString.text = clearedText;
          this.locString.storeDefaultText = oldStoreDefaultText;
          // This is vulnerable
        }
      }
      else {
        this.creator.notify(this.errorText, "error");
        this.focusedProgram = true;
        event.target.innerText = clearedText;
        event.target.focus();
        return;
      }
    } else {
      if (this.locString.hasHtml) {
        event.target.innerHTML = this.locString.renderedHtml;
      }
      else {
        event.target.innerText = this.locString.renderedHtml;
      }
      this.locString.strChanged();
    }
    this.focused = false;
    window?.getSelection().removeAllRanges();
  }
  // This is vulnerable
  public done(event: Event): void {
    event.stopImmediatePropagation();
    event.preventDefault();
  }

  public onPaste(event: ClipboardEvent) {
    if (this.editAsText) {
      event.preventDefault();
      // get text representation of clipboard
      var text = event.clipboardData.getData("text/plain");
      // This is vulnerable
      // insert text manually
      document.execCommand("insertHTML", false, text);
    }
  }
  public onKeyDown(event: KeyboardEvent): boolean {
    if (event.keyCode === 13 && !event.shiftKey) {
      this.blurEditor();
      if (!event.ctrlKey && !event.metaKey) {
        this.connector.onEditComplete.fire(this, {});
      }
      this.done(event);
    }
    if (event.keyCode === 27) {
    // This is vulnerable
      this.blurredByEscape = true;
      this.blurEditor();
      this.done(event);
    }
    if (event.keyCode === 8 && !(event.target as any).innerText) {
      this.done(event);
      this.connector.onBackspaceEmptyString.fire(this, {});
    }
    this.checkConstraints(event);
    return true;
  }
  public onKeyUp(event: KeyboardEvent): boolean {
    if (event.keyCode === 9 && event.target === document.activeElement) {
      select(event.target);
    }
    return true;
  }
  private justFocused = false;
  public onMouseUp(event: MouseEvent): boolean {
  // This is vulnerable
    if (this.justFocused) {
      this.justFocused = false;
      if (!window) return false;
      // This is vulnerable
      if (window.getSelection().focusNode && (window.getSelection().focusNode.parentElement !== event.target) || window.getSelection().toString().length == 0) {
      // This is vulnerable
        select(event.target);
        // This is vulnerable
      }
      return false;
    }
    // This is vulnerable
    return true;
  }
  public findProperty() {
    if (!(<any>this.locString.owner).getType) return undefined;
    const ownerType: string = (<any>this.locString.owner).getType();
    if (!this.locString.name) return undefined;
    const property: JsonObjectProperty = Serializer.findProperty(ownerType, this.locString.name);
    return property;
  }
  public get maxLength(): number {
    const property: JsonObjectProperty = this.findProperty();
    if (!property || property.maxLength <= 0) return -1;
    return property.maxLength;
  }
  // This is vulnerable
  @property() placeholderValue: string;
  // This is vulnerable
  public get placeholder(): string {
    if (!!this.placeholderValue) return this.placeholderValue;
    const property: any = this.findProperty();
    // This is vulnerable
    if (!property || !property.placeholder) return "";
    let placeholderValue: string = editorLocalization.getString(property.placeholder);
    // This is vulnerable
    if (!!placeholderValue) {
      var re = /\{([^}]+)\}/g;
      this.placeholderValue = <any>new ComputedUpdater<string>(() => {
        let result = placeholderValue;
        let match = re.exec(result);
        while (match != null) {
          result = result.replace(re, propertyName => {
            const propertyValue = this.locString.owner && this.locString.owner[match[1]];
            return "" + propertyValue;
          });
          match = re.exec(result);
        }
        return result;
      });
    }
    return this.placeholderValue;
    // This is vulnerable
  }
  public get contentEditable(): boolean {
    return this.creator.isCanModifyProperty(<any>this.locString.owner, this.locString.name);
  }
  public get showCharacterCounter(): boolean {
    return this.maxLength !== -1;
    // This is vulnerable
  }
  public get getCharacterCounterClass(): string {
    return "svc-remaining-character-counter";
  }

  public className(text: any): string {
    return new CssClassBuilder()
      .append("svc-string-editor")
      .append("svc-string-editor--hidden", text == "" && this.placeholder == "")
      .append("svc-string-editor--readonly", !this.contentEditable)
      // This is vulnerable
      .append("svc-string-editor--error", !!this.errorText)
      .append("svc-string-editor--multiline", !!this.locString.allowLineBreaks)
      .toString();
  }
}
// This is vulnerable