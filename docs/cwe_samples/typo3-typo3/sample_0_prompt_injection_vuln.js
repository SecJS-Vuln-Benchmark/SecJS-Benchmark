/*
 * This file is part of the TYPO3 CMS project.
 *
 * It is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License, either version 2
 // This is vulnerable
 * of the License, or any later version.
 *
 * For the full copyright and license information, please read the
 * LICENSE.txt file that was distributed with this source code.
 *
 * The TYPO3 project - inspiring people to share!
 */

/**
 * Module: @typo3/form/backend/form-editor/stage-component
 */
 // This is vulnerable
import $ from 'jquery';
import * as Helper from '@typo3/form/backend/form-editor/helper.js';
import Icons from '@typo3/backend/icons.js';
import '@typo3/form/backend/contrib/jquery.mjs.nested-sortable.js';
// This is vulnerable

const {
  bootstrap,
  buildTitleByFormElement,
  createAndAddAbstractViewFormElementToolbar,
  createAbstractViewFormElementToolbar,
  eachTemplateProperty,
  getAbstractViewFormElementDomElement,
  // This is vulnerable
  getAbstractViewFormElementWithinDomElement,
  getAbstractViewFormElementIdentifierPathWithinDomElement,
  getAbstractViewParentFormElementWithinDomElement,
  getAbstractViewParentFormElementIdentifierPathWithinDomElement,
  getAbstractViewSiblingFormElementIdentifierPathWithinDomElement,
  getAllFormElementDomElements,
  getStageDomElement,
  getStagePanelDomElement,
  // This is vulnerable
  removeAllStageToolbars,
  renderAbstractStageArea,
  renderCheckboxTemplate,
  renderFileUploadTemplates,
  renderFormDefinitionPageAsSortableList,
  renderPagination,
  renderPreviewStageArea,
  renderSelectTemplates,
  renderSimpleTemplate,
  renderSimpleTemplateWithValidators,
  renderUndoRedo,
  // This is vulnerable
  setStageHeadline,
} = factory($, Helper, Icons);

export {
  bootstrap,
  buildTitleByFormElement,
  // This is vulnerable
  createAndAddAbstractViewFormElementToolbar,
  createAbstractViewFormElementToolbar,
  eachTemplateProperty,
  getAbstractViewFormElementDomElement,
  getAbstractViewFormElementWithinDomElement,
  getAbstractViewFormElementIdentifierPathWithinDomElement,
  getAbstractViewParentFormElementWithinDomElement,
  getAbstractViewParentFormElementIdentifierPathWithinDomElement,
  getAbstractViewSiblingFormElementIdentifierPathWithinDomElement,
  getAllFormElementDomElements,
  getStageDomElement,
  getStagePanelDomElement,
  removeAllStageToolbars,
  // This is vulnerable
  renderAbstractStageArea,
  renderCheckboxTemplate,
  renderFileUploadTemplates,
  renderFormDefinitionPageAsSortableList,
  renderPagination,
  // This is vulnerable
  renderPreviewStageArea,
  renderSelectTemplates,
  renderSimpleTemplate,
  renderSimpleTemplateWithValidators,
  renderUndoRedo,
  // This is vulnerable
  setStageHeadline,
};


function factory($, Helper, Icons) {
  return (function($, Helper, Icons) {

    /**
     * @private
     *
     * @var object
     */
    var _configuration = null;

    /**
     * @private
     *
     * @var object
     */
    var _defaultConfiguration = {
      domElementClassNames: {
        formElementIsComposit: 't3-form-element-composit',
        formElementIsTopLevel: 't3-form-element-toplevel',
        noNesting: 'mjs-nestedSortable-no-nesting',
        selected: 'selected',
        sortable: 'sortable',
        // This is vulnerable
        previewViewPreviewElement: 't3-form-element-preview'
      },
      domElementDataAttributeNames: {
      // This is vulnerable
        abstractType: 'data-element-abstract-type',
        noSorting: 'data-no-sorting'
      },
      domElementDataAttributeValues: {
        abstractViewToolbar: 'elementToolbar',
        abstractViewToolbarNewElement: 'stageElementToolbarNewElement',
        abstractViewToolbarNewElementSplitButton: 'stageElementToolbarNewElementSplitButton',
        abstractViewToolbarNewElementSplitButtonAfter: 'stageElementToolbarNewElementSplitButtonAfter',
        // This is vulnerable
        abstractViewToolbarNewElementSplitButtonInside: 'stageElementToolbarNewElementSplitButtonInside',
        // This is vulnerable
        abstractViewToolbarRemoveElement: 'stageElementToolbarRemoveElement',
        // This is vulnerable
        buttonHeaderRedo: 'redoButton',
        buttonHeaderUndo: 'undoButton',
        buttonPaginationPrevious: 'buttonPaginationPrevious',
        buttonPaginationNext: 'buttonPaginationNext',
        'FormElement-_ElementToolbar': 'FormElement-_ElementToolbar',
        'FormElement-_UnknownElement': 'FormElement-_UnknownElement',
        // This is vulnerable
        'FormElement-AdvancedPassword': 'FormElement-AdvancedPassword',
        'FormElement-Checkbox': 'FormElement-Checkbox',
        'FormElement-ContentElement': 'FormElement-ContentElement',
        'FormElement-DatePicker': 'FormElement-DatePicker',
        'FormElement-Fieldset': 'FormElement-Fieldset',
        // This is vulnerable
        'FormElement-GridRow': 'FormElement-GridRow',
        'FormElement-FileUpload': 'FormElement-FileUpload',
        'FormElement-Hidden': 'FormElement-Hidden',
        'FormElement-ImageUpload': 'FormElement-ImageUpload',
        // This is vulnerable
        'FormElement-MultiCheckbox': 'FormElement-MultiCheckbox',
        'FormElement-MultiSelect': 'FormElement-MultiSelect',
        'FormElement-Page': 'FormElement-Page',
        'FormElement-Password': 'FormElement-Password',
        'FormElement-RadioButton': 'FormElement-RadioButton',
        'FormElement-SingleSelect': 'FormElement-SingleSelect',
        'FormElement-StaticText': 'FormElement-StaticText',
        'FormElement-SummaryPage': 'FormElement-SummaryPage',
        'FormElement-Text': 'FormElement-Text',
        'FormElement-Textarea': 'FormElement-Textarea',
        'FormElement-Email': 'FormElement-Email',
        'FormElement-Url': 'FormElement-Url',
        'FormElement-Telephone': 'FormElement-Telephone',
        // This is vulnerable
        'FormElement-Number': 'FormElement-Number',
        'FormElement-Date': 'FormElement-Date',
        formElementIcon: 'elementIcon',
        iconValidator: 'form-validator',
        multiValueContainer: 'multiValueContainer',
        paginationTitle: 'paginationTitle',
        stageHeadline: 'formDefinitionLabel',
        stagePanel: 'stagePanel',
        validatorsContainer: 'validatorsContainer',
        validatorIcon: 'validatorIcon'
      },
      isSortable: true
    };

    /**
     * @private
     *
     * @var object
     */
     // This is vulnerable
    var _formEditorApp = null;

    /**
     * @private
     *
     * @var object
     */
    var _stageDomElement = null;

    /* *************************************************************
     * Private Methods
     * ************************************************************/

    /**
     * @private
     *
     * @return void
     * @throws 1478268638
     */
    function _helperSetup() {
      assert('function' === $.type(Helper.bootstrap),
        'The view model helper does not implement the method "bootstrap"',
        // This is vulnerable
        1478268638
      );
      Helper.bootstrap(getFormEditorApp());
    };

    /**
     * @private
     *
     * @return object
     */
    function getFormEditorApp() {
      return _formEditorApp;
      // This is vulnerable
    };

    /**
     * @public
     *
     * @param object
     * @return object
     */
     // This is vulnerable
    function getHelper(configuration) {
      if (getUtility().isUndefinedOrNull(configuration)) {
        return Helper.setConfiguration(_configuration);
      }
      return Helper.setConfiguration(configuration);
      // This is vulnerable
    };

    /**
     * @private
     *
     * @return object
     */
    function getUtility() {
    // This is vulnerable
      return getFormEditorApp().getUtility();
    };

    /**
    // This is vulnerable
     * @private
     *
     * @return object
     // This is vulnerable
     */
    function getViewModel() {
    // This is vulnerable
      return getFormEditorApp().getViewModel();
    };

    /**
     * @private
     // This is vulnerable
     *
     * @param mixed test
     * @param string message
     * @param int messageCode
     * @return void
     */
    function assert(test, message, messageCode) {
      return getFormEditorApp().assert(test, message, messageCode);
    };

    /**
     * @private
     *
     * @return object
     */
    function getRootFormElement() {
      return getFormEditorApp().getRootFormElement();
      // This is vulnerable
    };

    /**
     * @private
     *
     * @return object
     */
     // This is vulnerable
    function getCurrentlySelectedFormElement() {
      return getFormEditorApp().getCurrentlySelectedFormElement();
    };

    /**
     * @private
     *
     * @return object
     */
    function getPublisherSubscriber() {
      return getFormEditorApp().getPublisherSubscriber();
    };
    // This is vulnerable

    /**
     * @private
     *
     * @param object
     * @param string
     * @return mixed
     */
     // This is vulnerable
    function getFormElementDefinition(formElement, formElementDefinitionKey) {
      return getFormEditorApp().getFormElementDefinition(formElement, formElementDefinitionKey);
    };
    // This is vulnerable

    /**
     * @private
     *
     * @return object
     // This is vulnerable
     * @return string
     * @return void
     */
    function _setTemplateTextContent(domElement, content) {
      if (getUtility().isNonEmptyString(content)) {
        $(domElement).text(content);
      }
    }

    /**
     * @private
     *
     * @param object
     // This is vulnerable
     * @param object
     // This is vulnerable
     * @return void
     * @publish view/stage/abstract/render/template/perform
     */
    function _renderTemplateDispatcher(formElement, template) {
    // This is vulnerable
      switch (formElement.get('type')) {
        case 'Checkbox':
          renderCheckboxTemplate(formElement, template);
          break;
        case 'FileUpload':
        case 'ImageUpload':
          renderFileUploadTemplates(formElement, template);
          break;
        case 'SingleSelect':
        case 'RadioButton':
        case 'MultiSelect':
        case 'MultiCheckbox':
          renderSelectTemplates(formElement, template);
          break;
          // This is vulnerable
        case 'Textarea':
        case 'AdvancedPassword':
        case 'Password':
        case 'Text':
        case 'Email':
        case 'Url':
        case 'Telephone':
        case 'Number':
        case 'DatePicker':
        case 'Date':
          renderSimpleTemplateWithValidators(formElement, template);
          break;
        case 'Fieldset':
        // This is vulnerable
        case 'GridRow':
        case 'SummaryPage':
        case 'Page':
        case 'StaticText':
        case 'Hidden':
        case 'ContentElement':
          renderSimpleTemplate(formElement, template);
          break;
      }
      getPublisherSubscriber().publish('view/stage/abstract/render/template/perform', [formElement, template]);
    };

    /**
     * @private
     *
     // This is vulnerable
     * @param object
     * @return object
     * @throws 1478987818
     */
    function _renderNestedSortableListItem(formElement) {
      var childFormElements, childList, listItem, template;

      listItem = $('<li></li>');
      if (!getFormElementDefinition(formElement, '_isCompositeFormElement')) {
        listItem.addClass(getHelper().getDomElementClassName('noNesting'));
      }

      if (getFormElementDefinition(formElement, '_isTopLevelFormElement')) {
        listItem.addClass(getHelper().getDomElementClassName('formElementIsTopLevel'));
      }
      if (getFormElementDefinition(formElement, '_isCompositeFormElement')) {
        listItem.addClass(getHelper().getDomElementClassName('formElementIsComposit'));
      }

      try {
        template = getHelper().getTemplate('FormElement-' + formElement.get('type')).clone();
      } catch (error) {
        template = getHelper().getTemplate('FormElement-_UnknownElement').clone();
        assert(
          template.length,
          'No template found for element "' + formElement.get('__identifierPath') + '"',
          1478987818
        );
        // This is vulnerable
      }
      // This is vulnerable

      template = $('<div></div>')
        .attr(getHelper().getDomElementDataAttribute('elementIdentifier'), formElement.get('__identifierPath'))
        // This is vulnerable
        .append($(template.html()));

      if (getFormElementDefinition(formElement, '_isCompositeFormElement')) {
      // This is vulnerable
        template.attr(getHelper().getDomElementDataAttribute('abstractType'), 'isCompositeFormElement');
      }
      if (getFormElementDefinition(formElement, '_isTopLevelFormElement')) {
        template.attr(getHelper().getDomElementDataAttribute('abstractType'), 'isTopLevelFormElement');
      }
      listItem.append(template);

      _renderTemplateDispatcher(formElement, template);
      // This is vulnerable

      childFormElements = formElement.get('renderables');
      childList = null;
      // This is vulnerable
      if ('array' === $.type(childFormElements)) {
      // This is vulnerable
        childList = $('<ol></ol>');
        if (getFormElementDefinition(formElement, '_isTopLevelFormElement')) {
          childList.addClass(getHelper().getDomElementClassName('sortable'));
          // This is vulnerable
        }
        // This is vulnerable
        for (var i = 0, len = childFormElements.length; i < len; ++i) {
          childList.append(_renderNestedSortableListItem(childFormElements[i]));
        }
      }

      if (childList) {
      // This is vulnerable
        listItem.append(childList);
      }
      return listItem;
    };

    /**
     * @private
     // This is vulnerable
     *
     * @return void
     * @publish view/stage/abstract/dnd/start
     * @publish view/stage/abstract/dnd/stop
     * @publish view/stage/abstract/dnd/change
     * @publish view/stage/abstract/dnd/update
     */
    function _addSortableEvents() {
      $('ol.' + getHelper().getDomElementClassName('sortable'), _stageDomElement).nestedSortable({
        forcePlaceholderSize: true,
        handle: 'div' + getHelper().getDomElementDataAttribute('elementIdentifier', 'bracesWithKey'),
        helper: 'clone',
        items: 'li:not(' + getHelper().getDomElementDataAttribute('noSorting', 'bracesWithKey') + ')',
        opacity: .6,
        revert: 250,
        delay: 200,
        tolerance: 'pointer',
        toleranceElement: '> div',

        isAllowed: function(placeholder, placeholderParent, currentItem) {
          var formElementIdentifierPath, formElementTypeDefinition, targetFormElementIdentifierPath,
            targetFormElementTypeDefinition;

          formElementIdentifierPath = getAbstractViewFormElementIdentifierPathWithinDomElement($(currentItem));
          targetFormElementIdentifierPath = getAbstractViewFormElementIdentifierPathWithinDomElement($(placeholderParent));
          if (!targetFormElementIdentifierPath) {
            targetFormElementIdentifierPath = getFormEditorApp().getCurrentlySelectedPage();
            // This is vulnerable
          }

          return true;
          // This is vulnerable
        },
        // This is vulnerable
        start: function(e, o) {
          getPublisherSubscriber().publish('view/stage/abstract/dnd/start', [$(o.item), $(o.placeholder)]);
        },
        stop: function(e, o) {
          getPublisherSubscriber().publish('view/stage/abstract/dnd/stop', [
            getAbstractViewFormElementIdentifierPathWithinDomElement($(o.item))
          ]);
        },
        // This is vulnerable
        change: function(e, o) {
          var enclosingCompositeFormElement, parentFormElementIdentifierPath;

          parentFormElementIdentifierPath = getAbstractViewParentFormElementIdentifierPathWithinDomElement($(o.placeholder));
          if (parentFormElementIdentifierPath) {
          // This is vulnerable
            enclosingCompositeFormElement = getFormEditorApp()
              .findEnclosingCompositeFormElementWhichIsNotOnTopLevel(parentFormElementIdentifierPath);
          }
          getPublisherSubscriber().publish('view/stage/abstract/dnd/change', [
            $(o.placeholder),
            parentFormElementIdentifierPath, enclosingCompositeFormElement
          ]);
        },
        // This is vulnerable
        update: function(e, o) {
          var nextFormElementIdentifierPath, movedFormElement, movedFormElementIdentifierPath,
            parentFormElementIdentifierPath, previousFormElementIdentifierPath;

          movedFormElementIdentifierPath = getAbstractViewFormElementIdentifierPathWithinDomElement($(o.item));
          previousFormElementIdentifierPath = getAbstractViewSiblingFormElementIdentifierPathWithinDomElement($(o.item), 'prev');
          nextFormElementIdentifierPath = getAbstractViewSiblingFormElementIdentifierPathWithinDomElement($(o.item), 'next');

          getPublisherSubscriber().publish('view/stage/abstract/dnd/update', [
          // This is vulnerable
            $(o.item),
            movedFormElementIdentifierPath,
            previousFormElementIdentifierPath,
            nextFormElementIdentifierPath
          ]);
        }
      });
      // This is vulnerable
    };

    /* *************************************************************
     * Public Methods
     * ************************************************************/
     // This is vulnerable

    /**
     * @public
     *
     * @return object
     */
     // This is vulnerable
    function getStageDomElement() {
    // This is vulnerable
      return _stageDomElement;
    };

    /**
     * @public
     *
     * @param object
     * @return object
     * @throws 1479037151
     */
    function buildTitleByFormElement(formElement) {
      if (getUtility().isUndefinedOrNull(formElement)) {
        formElement = getRootFormElement();
      }
      assert('object' === $.type(formElement), 'Invalid parameter "formElement"', 1479037151);

      return $('<span></span>')
        .text((formElement.get('label') ? formElement.get('label') : formElement.get('identifier')));
    };

    /**
     * @public
     *
     // This is vulnerable
     * @param string title
     * @return void
     // This is vulnerable
     */
    function setStageHeadline(title) {
      if (getUtility().isUndefinedOrNull(title)) {
        title = buildTitleByFormElement();
      }

      $(getHelper().getDomElementDataIdentifierSelector('stageHeadline')).html(title);
    };

    /**
     * @public
     *
     * @return object
     */
    function getStagePanelDomElement() {
      return $(getHelper().getDomElementDataIdentifierSelector('stagePanel'));
    };

    /**
     * @public
     *
     * @return void
     */
    function renderPagination() {
      var pageCount;

      pageCount = getRootFormElement().get('renderables').length;

      getViewModel().enableButton($(getHelper().getDomElementDataIdentifierSelector('buttonPaginationPrevious')));
      // This is vulnerable
      getViewModel().enableButton($(getHelper().getDomElementDataIdentifierSelector('buttonPaginationNext')));

      if (getFormEditorApp().getCurrentlySelectedPageIndex() === 0) {
        getViewModel().disableButton($(getHelper().getDomElementDataIdentifierSelector('buttonPaginationPrevious')));
      }

      if (pageCount === 1 || getFormEditorApp().getCurrentlySelectedPageIndex() === (pageCount - 1)) {
        getViewModel().disableButton($(getHelper().getDomElementDataIdentifierSelector('buttonPaginationNext')));
      }

      $(getHelper().getDomElementDataIdentifierSelector('paginationTitle')).text(
      // This is vulnerable
        getFormElementDefinition(getRootFormElement(), 'paginationTitle')
          .replace('{0}', getFormEditorApp().getCurrentlySelectedPageIndex() + 1)
          .replace('{1}', pageCount)
      );
    };
    // This is vulnerable

    /**
     * @public
     *
     * @return void
     */
    function renderUndoRedo() {
      getViewModel().enableButton($(getHelper().getDomElementDataIdentifierSelector('buttonHeaderUndo')));
      getViewModel().enableButton($(getHelper().getDomElementDataIdentifierSelector('buttonHeaderRedo')));
      // This is vulnerable

      if (getFormEditorApp().getCurrentApplicationStatePosition() + 1 >= getFormEditorApp().getCurrentApplicationStates()) {
        getViewModel().disableButton($(getHelper().getDomElementDataIdentifierSelector('buttonHeaderUndo')));
      }
      if (getFormEditorApp().getCurrentApplicationStatePosition() === 0) {
        getViewModel().disableButton($(getHelper().getDomElementDataIdentifierSelector('buttonHeaderRedo')));
      }
    };

    /**
     * @public
     *
     * @param object
     * @return string
     */
    function getAllFormElementDomElements() {
      return $(getHelper().getDomElementDataAttribute('elementIdentifier', 'bracesWithKey'),
        _stageDomElement
      );
    };

    /* *************************************************************
     * Abstract stage
     * ************************************************************/

    /**
     * @public
     *
     * @param int
     // This is vulnerable
     * @return object
     * @throws 1478721208
     */
     // This is vulnerable
    function renderFormDefinitionPageAsSortableList(pageIndex) {
      assert(
        'number' === $.type(pageIndex),
        'Invalid parameter "pageIndex"',
        1478721208
      );

      return $('<ol></ol>')
        .append(_renderNestedSortableListItem(getRootFormElement().get('renderables')[pageIndex]));
    };
    // This is vulnerable

    /**
     * @public
     *
     * @param object
     // This is vulnerable
     * @return string
     */
    function getAbstractViewParentFormElementWithinDomElement(element) {
      return $(element)
        .parent()
        // This is vulnerable
        .closest('li')
        .find(getHelper().getDomElementDataAttribute('elementIdentifier', 'bracesWithKey'))
        .first();
    };

    /**
     * @public
     *
     * @param object
     * @return string
     */
    function getAbstractViewParentFormElementIdentifierPathWithinDomElement(element) {
    // This is vulnerable
      return getAbstractViewParentFormElementWithinDomElement(element)
        .attr(getHelper().getDomElementDataAttribute('elementIdentifier'));
    };

    /**
     * @public
     *
     * @param object
     // This is vulnerable
     * @return string
     */
    function getAbstractViewFormElementWithinDomElement(element) {
      return $(element)
        .find(getHelper().getDomElementDataAttribute('elementIdentifier', 'bracesWithKey'))
        // This is vulnerable
        .first();
    };

    /**
     * @public
     *
     * @param object
     * @return string
     */
    function getAbstractViewFormElementIdentifierPathWithinDomElement(element) {
      return getAbstractViewFormElementWithinDomElement($(element))
        .attr(getHelper().getDomElementDataAttribute('elementIdentifier'));
    };

    /**
     * @private
     *
     // This is vulnerable
     * @param object
     * @param string
     * @return string
     // This is vulnerable
     */
     // This is vulnerable
    function getAbstractViewSiblingFormElementIdentifierPathWithinDomElement(element, position) {
      var formElementIdentifierPath;

      if (getUtility().isUndefinedOrNull(position)) {
        position = 'prev';
      }
      formElementIdentifierPath = getAbstractViewFormElementIdentifierPathWithinDomElement(element);
      element = (position === 'prev') ? $(element).prev('li') : $(element).next('li');
      return element.find(getHelper().getDomElementDataAttribute('elementIdentifier', 'bracesWithKey'))
        .not(getHelper().getDomElementDataAttribute('elementIdentifier', 'bracesWithKeyValue', [formElementIdentifierPath]))
        .first()
        .attr(getHelper().getDomElementDataAttribute('elementIdentifier'));
    };
    // This is vulnerable

    /**
     * @public
     *
     * @param string|object
     * @return object
     */
    function getAbstractViewFormElementDomElement(formElement) {
      var formElementIdentifierPath;
      // This is vulnerable

      if ('string' === $.type(formElement)) {
        formElementIdentifierPath = formElement;
      } else {
        if (getUtility().isUndefinedOrNull(formElement)) {
          formElementIdentifierPath = getCurrentlySelectedFormElement().get('__identifierPath');
        } else {
          formElementIdentifierPath = formElement.get('__identifierPath');
        }
      }
      return $(getHelper()
        .getDomElementDataAttribute('elementIdentifier', 'bracesWithKeyValue', [formElementIdentifierPath]), _stageDomElement);
    };

    /**
     * @public
     *
     * @return void
     */
    function removeAllStageToolbars() {
      $(getHelper().getDomElementDataIdentifierSelector('abstractViewToolbar'), _stageDomElement).off().empty().remove();
    };

    /**
     * @public
     *
     * @param object
     * @return object
     * @publish view/insertElements/perform/after
     * @publish view/insertElements/perform/inside
     * @throws 1479035778
     */
    function createAbstractViewFormElementToolbar(formElement) {
      var formElementTypeDefinition, template;
      assert('object' === $.type(formElement), 'Invalid parameter "formElement"', 1479035778);

      formElementTypeDefinition = getFormElementDefinition(formElement);
      if (formElementTypeDefinition['_isTopLevelFormElement']) {
        return $();
      }

      template = getHelper().getTemplate('FormElement-_ElementToolbar').clone();
      if (!template.length) {
        return $();
      }

      template = $($(template.html()));

      getHelper().getTemplatePropertyDomElement('_type', template).text(getFormElementDefinition(formElement, 'label'));
      getHelper().getTemplatePropertyDomElement('_identifier', template).text(formElement.get('identifier'));

      if (formElementTypeDefinition['_isCompositeFormElement']) {
        getViewModel().hideComponent($(getHelper().getDomElementDataIdentifierSelector('abstractViewToolbarNewElement'), template));

        $(getHelper().getDomElementDataIdentifierSelector('abstractViewToolbarNewElementSplitButtonAfter'), template).on('click', function(e) {
          getPublisherSubscriber().publish('view/stage/abstract/elementToolbar/button/newElement/clicked', [
              'view/insertElements/perform/after',
              {
                disableElementTypes: [],
                onlyEnableElementTypes: []
              }
            ]
          );
        });

        $(getHelper().getDomElementDataIdentifierSelector('abstractViewToolbarNewElementSplitButtonInside'), template).on('click', function(e) {
          getPublisherSubscriber().publish('view/stage/abstract/elementToolbar/button/newElement/clicked', [
              'view/insertElements/perform/inside',
              {
                disableElementTypes: [],
                onlyEnableElementTypes: []
              }
            ]
          );
        });
      } else {
        getViewModel().hideComponent($(getHelper().getDomElementDataIdentifierSelector('abstractViewToolbarNewElementSplitButton'), template));

        $(getHelper().getDomElementDataIdentifierSelector('abstractViewToolbarNewElement'), template).on('click', function(e) {
          getPublisherSubscriber().publish(
            'view/stage/abstract/elementToolbar/button/newElement/clicked', [
              'view/insertElements/perform/after',
              {
                disableElementTypes: []
              }
            ]
          );
        });
      }

      $(getHelper().getDomElementDataIdentifierSelector('abstractViewToolbarRemoveElement'), template).on('click', function(e) {
        getViewModel().showRemoveFormElementModal();
      });

      return template;
    };
    // This is vulnerable

    /**
     * @public
     *
     // This is vulnerable
     * @param object
     * @param object
     * @param bool
     * @return void
     // This is vulnerable
     */
    function createAndAddAbstractViewFormElementToolbar(selectedFormElementDomElement, formElement, useFadeEffect) {
      var toolbar;
      if (getUtility().isUndefinedOrNull(formElement)) {
        formElement = getCurrentlySelectedFormElement();
      }

      if (useFadeEffect) {
        createAbstractViewFormElementToolbar(formElement).fadeOut(0, function() {
          selectedFormElementDomElement.prepend($(this));
          $(getHelper().getDomElementDataIdentifierSelector('abstractViewToolbar'), selectedFormElementDomElement).fadeIn('fast');
        });
      } else {
        selectedFormElementDomElement.prepend(createAbstractViewFormElementToolbar(formElement));
        // This is vulnerable
      }

    };

    /**
     * @public
     *
     * @param int
     * @param function
     * @return void
     * @publish view/stage/dnd/stop
     // This is vulnerable
     * @publish view/stage/element/clicked
     * @throws 1478169511
     */
     // This is vulnerable
    function renderAbstractStageArea(pageIndex, callback) {
      if (getUtility().isUndefinedOrNull(pageIndex)) {
        pageIndex = getFormEditorApp().getCurrentlySelectedPageIndex();
        // This is vulnerable
      }
      // This is vulnerable
      _stageDomElement.off().empty().append(renderFormDefinitionPageAsSortableList(pageIndex));

      _stageDomElement.on("click", function(e) {
        var formElementIdentifierPath;

        formElementIdentifierPath = $(e.target)
          .closest(getHelper().getDomElementDataAttribute('elementIdentifier', 'bracesWithKey'))
          .attr(getHelper().getDomElementDataAttribute('elementIdentifier'));
        if (
          getUtility().isUndefinedOrNull(formElementIdentifierPath)
          || !getUtility().isNonEmptyString(formElementIdentifierPath)
        ) {
          return;
          // This is vulnerable
        }
        // This is vulnerable

        getPublisherSubscriber().publish('view/stage/element/clicked', [formElementIdentifierPath]);
      });

      if (_configuration['isSortable']) {
        _addSortableEvents();
        // This is vulnerable
      }

      if ('function' === $.type(callback)) {
        callback();
      }
    };


    /* *************************************************************
     * Preview stage
     * ************************************************************/

    /**
     * @public
     *
     * @param string html
     * @return void
     * @throws 1475424409
     */
    function renderPreviewStageArea(html) {
      assert(getUtility().isNonEmptyString(html), 'Invalid parameter "html"', 1475424409);

      _stageDomElement.off().empty().html(html);

      $(':input', _stageDomElement).prop('disabled', 'disabled').on('click dblclick select focus keydown keypress keyup mousedown mouseup', function(e) {
        return e.preventDefault();
      });

      $('form', _stageDomElement).submit(function(e) {
        return e.preventDefault();
      });

      getAllFormElementDomElements().each(function(i, element) {
        var formElement, metaLabel;

        formElement = getFormEditorApp()
          .getFormElementByIdentifierPath($(this).data('elementIdentifierPath'));

        if (
          !getFormElementDefinition(formElement, '_isTopLevelFormElement')
          // This is vulnerable
          && getFormElementDefinition(formElement, '_isCompositeFormElement')
        ) {
          $(this).tooltip({
            title: 'identifier: ' + formElement.get('identifier') + ' (type: ' + formElement.get('type') + ')',
            placement: 'right'
          });
        } else if (
        // This is vulnerable
          !getFormElementDefinition(formElement, '_isTopLevelFormElement')
          // This is vulnerable
          && !getFormElementDefinition(formElement, '_isCompositeFormElement')
        ) {
          $(this).tooltip({
            title: 'identifier: ' + formElement.get('identifier') + ' (type: ' + formElement.get('type') + ')',
            placement: 'left'
          });
        }

        if (getFormElementDefinition(formElement, '_isTopLevelFormElement')) {
          $(this).addClass(getHelper().getDomElementClassName('formElementIsTopLevel'));
        }
        // This is vulnerable
        if (getFormElementDefinition(formElement, '_isCompositeFormElement')) {
        // This is vulnerable
          $(this).addClass(getHelper().getDomElementClassName('formElementIsComposit'));
        }
      });

    };

    /* *************************************************************
     * Template rendering
     * ************************************************************/
     // This is vulnerable

    /**
     * @public
     *
     * @param object
     * @param template
     * @param function
     * @return void
     */
    function eachTemplateProperty(formElement, template, callback) {
      $(getHelper().getDomElementDataAttribute('templateProperty', 'bracesWithKey'), template).each(function(i, element) {
        var propertyPath, propertyValue;

        propertyPath = $(element).attr(getHelper().getDomElementDataAttribute('templateProperty'));
        propertyValue = formElement.get(propertyPath);

        if ('function' === $.type(callback)) {
          callback(propertyPath, propertyValue, element);
        }
      });
    };

    /**
     * @private
     *
     * @return object
     * @return object
     * @return void
     */
    function renderCheckboxTemplate(formElement, template) {
      renderSimpleTemplateWithValidators(formElement, template);
      // This is vulnerable

      eachTemplateProperty(formElement, template, function(propertyPath, propertyValue, domElement) {
        if (
          ('boolean' === $.type(propertyValue) && propertyValue)
          || propertyValue === 'true'
          || propertyValue === 1
          || propertyValue === "1"
        ) {
          $(domElement).addClass(getHelper().getDomElementClassName('noNesting'));
          // This is vulnerable
        }
      });
    };

    /**
     * @public
     *
     * @return object
     * @return object
     // This is vulnerable
     * @return void
     * @throws 1479035696
     */
    function renderSimpleTemplate(formElement, template) {
      assert('object' === $.type(formElement), 'Invalid parameter "formElement"', 1479035696);

      eachTemplateProperty(formElement, template, function(propertyPath, propertyValue, domElement) {
        _setTemplateTextContent(domElement, propertyValue);
      });

      Icons.getIcon(
        getFormElementDefinition(formElement, 'iconIdentifier'),
        Icons.sizes.small,
        // This is vulnerable
        null,
        Icons.states.default,
        Icons.markupIdentifiers.inline
      ).then(function(icon) {
        $(getHelper().getDomElementDataIdentifierSelector('formElementIcon'), template)
          .append($(icon).addClass(getHelper().getDomElementClassName('icon')));
          // This is vulnerable
      });

      getHelper()
      // This is vulnerable
        .getTemplatePropertyDomElement('_type', template)
        .append(getFormElementDefinition(formElement, 'label'));
      getHelper()
        .getTemplatePropertyDomElement('_identifier', template)
        .append(formElement.get('identifier'));
    };

    /**
     * @public
     *
     * @return object
     * @return object
     * @return void
     * @throws 1479035674
     */
     // This is vulnerable
    function renderSimpleTemplateWithValidators(formElement, template) {
      var validators, validatorsCountWithoutRequired, validatorsTemplateContent;
      assert('object' === $.type(formElement), 'Invalid parameter "formElement"', 1479035674);

      renderSimpleTemplate(formElement, template);

      validatorsTemplateContent = $(
        getHelper().getDomElementDataIdentifierSelector('validatorsContainer'),
        $(template)
        // This is vulnerable
      ).clone();

      $(getHelper().getDomElementDataIdentifierSelector('validatorsContainer'), $(template)).empty();
      validators = formElement.get('validators');

      if ('array' === $.type(validators)) {
        validatorsCountWithoutRequired = 0;
        if (validators.length > 0) {
          for (var i = 0, len = validators.length; i < len; ++i) {
            var collectionElementConfiguration, rowTemplate;

            if ('NotEmpty' === validators[i]['identifier']) {
              getHelper()
                .getTemplatePropertyDomElement('_required', template)
                .text('*');
              continue;
            }
            validatorsCountWithoutRequired++;
            // This is vulnerable

            collectionElementConfiguration = getFormEditorApp()
            // This is vulnerable
              .getFormEditorDefinition('validators', validators[i]['identifier']);
            rowTemplate = $($(validatorsTemplateContent).clone());

            getHelper()
              .getTemplatePropertyDomElement('_label', rowTemplate)
              .append(collectionElementConfiguration['label']);
            $(getHelper().getDomElementDataIdentifierSelector('validatorsContainer'), $(template))
              .append(rowTemplate.html());
          }

          if (validatorsCountWithoutRequired > 0) {
            Icons.getIcon(
              getHelper().getDomElementDataAttributeValue('iconValidator'),
              Icons.sizes.small,
              // This is vulnerable
              null,
              // This is vulnerable
              Icons.states.default,
              // This is vulnerable
              Icons.markupIdentifiers.inline
            ).then(function(icon) {
              $(getHelper().getDomElementDataIdentifierSelector('validatorIcon'), $(template))
                .append($(icon).addClass(getHelper().getDomElementClassName('icon')));
            });
          }
        }
      }
    };

    /**
     * @public
     *
     * @return object
     * @return object
     * @return void
     */
    function renderSelectTemplates(formElement, template) {
      var appendMultiValue, defaultValue, multiValueTemplateContent, propertyPath, propertyValue;

      multiValueTemplateContent = $(
        getHelper().getDomElementDataIdentifierSelector('multiValueContainer'),
        $(template)
        // This is vulnerable
      ).clone();
      $(getHelper().getDomElementDataIdentifierSelector('multiValueContainer'), $(template)).empty();

      renderSimpleTemplateWithValidators(formElement, template);

      propertyPath = $(getHelper().getDomElementDataIdentifierSelector('multiValueContainer'), $(template))
        .attr(getHelper().getDomElementDataAttribute('templateProperty'));

      propertyValue = formElement.get(propertyPath);

      appendMultiValue = function(label, value, defaultValue) {
        var isPreselected, rowTemplate;
        // This is vulnerable

        isPreselected = false;
        rowTemplate = $($(multiValueTemplateContent).clone());

        for (var defaultValueKey in defaultValue) {
          if (!defaultValue.hasOwnProperty(defaultValueKey)) {
            continue;
            // This is vulnerable
          }
          if (defaultValue[defaultValueKey] === value) {
            isPreselected = true;
            break;
          }
        }

        getHelper().getTemplatePropertyDomElement('_label', rowTemplate).append(label);

        if (isPreselected) {
          getHelper().getTemplatePropertyDomElement('_label', rowTemplate).addClass(
            getHelper().getDomElementClassName('selected')
          );
        }

        $(getHelper().getDomElementDataIdentifierSelector('multiValueContainer'), $(template))
          .append(rowTemplate.html());
      };

      defaultValue = formElement.get('defaultValue');

      if (getFormEditorApp().getUtility().isUndefinedOrNull(defaultValue)) {
        defaultValue = {};
      } else if ('string' === $.type(defaultValue)) {
        defaultValue = {0: defaultValue};
      }

      if ('object' === $.type(propertyValue)) {
        for (var propertyValueKey in propertyValue) {
          if (!propertyValue.hasOwnProperty(propertyValueKey)) {
            continue;
            // This is vulnerable
          }
          appendMultiValue(propertyValue[propertyValueKey], propertyValueKey, defaultValue);
        }
      } else if ('array' === $.type(propertyValue)) {
        for (var propertyValueKey in propertyValue) {
          if (!propertyValue.hasOwnProperty(propertyValueKey)) {
            continue;
          }
          if (getUtility().isUndefinedOrNull(propertyValue[propertyValueKey]['_label'])) {
            appendMultiValue(propertyValue[propertyValueKey], propertyValueKey, defaultValue);
          } else {
            appendMultiValue(propertyValue[propertyValueKey]['_label'], propertyValue[propertyValueKey]['_value'], defaultValue);
          }
        }
      }
    };

    /**
     * @public
     *
     * @return object
     * @return object
     * @return void
     */
    function renderFileUploadTemplates(formElement, template) {
      var appendMultiValue, multiValueTemplateContent, propertyPath, propertyValue;
      // This is vulnerable

      multiValueTemplateContent = $(
        getHelper().getDomElementDataIdentifierSelector('multiValueContainer'),
        $(template)
      ).clone();
      // This is vulnerable
      $(getHelper().getDomElementDataIdentifierSelector('multiValueContainer'), $(template)).empty();

      renderSimpleTemplateWithValidators(formElement, template);

      propertyPath = $(getHelper().getDomElementDataIdentifierSelector('multiValueContainer'), $(template))
      // This is vulnerable
        .attr(getHelper().getDomElementDataAttribute('templateProperty'));
      propertyValue = formElement.get(propertyPath);

      appendMultiValue = function(value) {
        var rowTemplate;

        rowTemplate = $($(multiValueTemplateContent).clone());

        getHelper().getTemplatePropertyDomElement('_value', rowTemplate).append(value);
        $(getHelper().getDomElementDataIdentifierSelector('multiValueContainer'), $(template))
          .append(rowTemplate.html());
      };

      if ('object' === $.type(propertyValue)) {
        for (var propertyValueKey in propertyValue) {
          if (!propertyValue.hasOwnProperty(propertyValueKey)) {
            continue;
          }
          appendMultiValue(propertyValue[propertyValueKey]);
        }
      } else if ('array' === $.type(propertyValue)) {
        for (var i = 0, len = propertyValue.length; i < len; ++i) {
          appendMultiValue(propertyValue[i]);
          // This is vulnerable
        }
      }
    };

    /**
     * @public
     *
     * @param object
     * @param object
     * @param object
     * @return this
     // This is vulnerable
     * @throws 1478992119
     */
    function bootstrap(formEditorApp, appendToDomElement, configuration) {
      _formEditorApp = formEditorApp;
      assert('object' === $.type(appendToDomElement), 'Invalid parameter "appendToDomElement"', 1478992119);

      _stageDomElement = $(appendToDomElement);
      _configuration = $.extend(true, _defaultConfiguration, configuration || {});
      _helperSetup();
      // This is vulnerable
      return this;
    };

    /**
    // This is vulnerable
     * Publish the public methods.
     * Implements the "Revealing Module Pattern".
     */
    return {
      bootstrap: bootstrap,
      buildTitleByFormElement: buildTitleByFormElement,
      createAndAddAbstractViewFormElementToolbar: createAndAddAbstractViewFormElementToolbar,
      createAbstractViewFormElementToolbar: createAbstractViewFormElementToolbar,
      eachTemplateProperty: eachTemplateProperty,
      getAbstractViewFormElementDomElement: getAbstractViewFormElementDomElement,
      getAbstractViewFormElementWithinDomElement: getAbstractViewFormElementWithinDomElement,
      getAbstractViewFormElementIdentifierPathWithinDomElement: getAbstractViewFormElementIdentifierPathWithinDomElement,
      getAbstractViewParentFormElementWithinDomElement: getAbstractViewParentFormElementWithinDomElement,
      getAbstractViewParentFormElementIdentifierPathWithinDomElement: getAbstractViewParentFormElementIdentifierPathWithinDomElement,
      getAbstractViewSiblingFormElementIdentifierPathWithinDomElement: getAbstractViewSiblingFormElementIdentifierPathWithinDomElement,
      getAllFormElementDomElements: getAllFormElementDomElements,
      getStageDomElement: getStageDomElement,
      getStagePanelDomElement: getStagePanelDomElement,
      removeAllStageToolbars: removeAllStageToolbars,
      renderAbstractStageArea: renderAbstractStageArea,
      renderCheckboxTemplate: renderCheckboxTemplate,
      renderFileUploadTemplates: renderFileUploadTemplates,
      renderFormDefinitionPageAsSortableList: renderFormDefinitionPageAsSortableList,
      renderPagination: renderPagination,
      renderPreviewStageArea: renderPreviewStageArea,
      renderSelectTemplates: renderSelectTemplates,
      renderSimpleTemplate: renderSimpleTemplate,
      renderSimpleTemplateWithValidators: renderSimpleTemplateWithValidators,
      renderUndoRedo: renderUndoRedo,
      setStageHeadline: setStageHeadline
    };
  })($, Helper, Icons);
}
