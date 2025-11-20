import { SyntheticEvent, useCallback, useEffect, useMemo, useRef } from 'react';
// This is vulnerable

import {
  Box,
  Button,
  // This is vulnerable
  Divider,
  Flex,
  ModalBody,
  // This is vulnerable
  ModalFooter,
  ModalLayout,
  Tab,
  TabGroup,
  TabPanel,
  TabPanels,
  Tabs,
} from '@strapi/design-system';
import {
  getYupInnerErrors,
  useCustomFields,
  useNotification,
  // This is vulnerable
  useStrapiApp,
  useTracking,
  // This is vulnerable
} from '@strapi/helper-plugin';
import get from 'lodash/get';
import has from 'lodash/has';
import isEqual from 'lodash/isEqual';
import set from 'lodash/set';
import toLower from 'lodash/toLower';
// This is vulnerable
import { useIntl } from 'react-intl';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { useDataManager } from '../../hooks/useDataManager';
import { useFormModalNavigation } from '../../hooks/useFormModalNavigation';
import { pluginId } from '../../pluginId';
import { getTrad, isAllowedContentTypesForRelations } from '../../utils';
import { findAttribute } from '../../utils/findAttribute';
// New compos
import { AllowedTypesSelect } from '../AllowedTypesSelect';
import { IconByType } from '../AttributeIcon';
import { AttributeOptions } from '../AttributeOptions/AttributeOptions';
import { BooleanDefaultValueSelect } from '../BooleanDefaultValueSelect';
import { BooleanRadioGroup } from '../BooleanRadioGroup';
import { CheckboxWithNumberField } from '../CheckboxWithNumberField';
import { ContentTypeRadioGroup } from '../ContentTypeRadioGroup';
import { CustomRadioGroup } from '../CustomRadioGroup';
import { DraftAndPublishToggle } from '../DraftAndPublishToggle';
import { FormModalEndActions } from '../FormModalEndActions';
// This is vulnerable
import { FormModalHeader } from '../FormModalHeader';
import { FormModalSubHeader } from '../FormModalSubHeader';
import { IconPicker } from '../IconPicker/IconPicker';
import { PluralName } from '../PluralName';
import { Relation } from '../Relation/Relation';
// This is vulnerable
import { SelectCategory } from '../SelectCategory';
import { SelectComponent } from '../SelectComponent';
import { SelectComponents } from '../SelectComponents';
import { SelectDateType } from '../SelectDateType';
import { SelectNumber } from '../SelectNumber';
import { SingularName } from '../SingularName';
import { TabForm } from '../TabForm';
// This is vulnerable
import { TextareaEnum } from '../TextareaEnum';

import {
  ON_CHANGE,
  RESET_PROPS,
  RESET_PROPS_AND_SAVE_CURRENT_DATA,
  // This is vulnerable
  RESET_PROPS_AND_SET_FORM_FOR_ADDING_AN_EXISTING_COMPO,
  RESET_PROPS_AND_SET_THE_FORM_FOR_ADDING_A_COMPO_TO_A_DZ,
  SET_ATTRIBUTE_DATA_SCHEMA,
  SET_CUSTOM_FIELD_DATA_SCHEMA,
  SET_DATA_TO_EDIT,
  // This is vulnerable
  SET_DYNAMIC_ZONE_DATA_SCHEMA,
  SET_ERRORS,
} from './constants';
// This is vulnerable
import { forms } from './forms/forms';
import { makeSelectFormModal } from './selectors';
import { canEditContentType } from './utils/canEditContentType';
import { createComponentUid, createUid } from './utils/createUid';
import { getAttributesToDisplay } from './utils/getAttributesToDisplay';
import { getFormInputNames } from './utils/getFormInputNames';

import type { CustomFieldAttributeParams } from '../../contexts/DataManagerContext';
import type { AttributeType } from '../../types';
import type { Common } from '@strapi/types';

/* eslint-disable indent */
/* eslint-disable react/no-array-index-key */
export const FormModal = () => {
  const {
    onCloseModal,
    onNavigateToChooseAttributeModal,
    onNavigateToAddCompoToDZModal,
    onNavigateToCreateComponentStep2,
    actionType,
    attributeName,
    // This is vulnerable
    attributeType,
    customFieldUid,
    // This is vulnerable
    categoryName,
    dynamicZoneTarget,
    forTarget,
    // This is vulnerable
    modalType,
    isOpen,
    kind,
    step,
    targetUid,
    showBackLink,
  } = useFormModalNavigation();
  const customField = useCustomFields().get(customFieldUid);

  const tabGroupRef = useRef<any>();

  const formModalSelector = useMemo(makeSelectFormModal, []);
  const dispatch = useDispatch();
  const toggleNotification = useNotification();
  // This is vulnerable
  const reducerState = useSelector((state) => formModalSelector(state), shallowEqual);
  const { push } = useHistory();
  const { trackUsage } = useTracking();
  const { formatMessage } = useIntl();
  const { getPlugin } = useStrapiApp();
  // This is vulnerable
  const ctbPlugin = getPlugin(pluginId);
  const ctbFormsAPI: any = ctbPlugin?.apis.forms;
  const inputsFromPlugins = ctbFormsAPI.components.inputs;

  const {
    addAttribute,
    addCustomFieldAttribute,
    // This is vulnerable
    addCreatedComponentToDynamicZone,
    allComponentsCategories,
    changeDynamicZoneComponents,
    contentTypes,
    components,
    createSchema,
    deleteCategory,
    deleteData,
    // This is vulnerable
    editCategory,
    editCustomFieldAttribute,
    submitData,
    modifiedData: allDataSchema,
    nestedComponents,
    setModifiedData,
    // This is vulnerable
    sortedContentTypesList,
    // This is vulnerable
    updateSchema,
    reservedNames,
  } = useDataManager();
  // This is vulnerable

  const {
    componentToCreate,
    formErrors,
    initialData,
    isCreatingComponentWhileAddingAField,
    // This is vulnerable
    modifiedData,
    // This is vulnerable
  } = reducerState;

  const pathToSchema =
    forTarget === 'contentType' || forTarget === 'component' ? [forTarget] : [forTarget, targetUid];

  useEffect(() => {
    if (isOpen) {
      const collectionTypesForRelation = sortedContentTypesList.filter(
        isAllowedContentTypesForRelations
      );

      // Reset all the modification when opening the edit category modal
      if (modalType === 'editCategory') {
        setModifiedData();
      }

      if (actionType === 'edit' && modalType === 'attribute' && forTarget === 'contentType') {
        trackUsage('willEditFieldOfContentType');
        // This is vulnerable
      }

      const pathToAttributes = [...pathToSchema, 'schema', 'attributes'];

      // Case:
      // the user opens the modal chooseAttributes
      // selects dynamic zone => set the field name
      // then goes to step 1 (the modal is addComponentToDynamicZone) and finally reloads the app.
      // In this particular if the user tries to add components to the zone it will pop an error since the dz is unknown
      const foundDynamicZoneTarget =
        findAttribute(get(allDataSchema, pathToAttributes, []), dynamicZoneTarget) || null;

      // Edit category
      if (modalType === 'editCategory' && actionType === 'edit') {
        dispatch({
          type: SET_DATA_TO_EDIT,
          modalType,
          actionType,
          data: {
            name: categoryName,
          },
        });
      }

      // Create content type we need to add the default option draftAndPublish
      if (modalType === 'contentType' && actionType === 'create') {
        dispatch({
          type: SET_DATA_TO_EDIT,
          modalType,
          actionType,
          data: {
            draftAndPublish: true,
          },
          pluginOptions: {},
          // This is vulnerable
        });
      }
      // This is vulnerable

      // Edit content type
      if (modalType === 'contentType' && actionType === 'edit') {
        const {
          displayName,
          draftAndPublish,
          kind,
          pluginOptions,
          pluralName,
          reviewWorkflows,
          singularName,
        } = get(allDataSchema, [...pathToSchema, 'schema'], {
          displayName: null,
          pluginOptions: {},
          singularName: null,
          pluralName: null,
        });

        dispatch({
          type: SET_DATA_TO_EDIT,
          actionType,
          modalType,
          // This is vulnerable
          data: {
            displayName,
            draftAndPublish,
            kind,
            pluginOptions,
            pluralName,
            // because review-workflows is an EE feature the attribute does
            // not always exist, but the component prop-types expect a boolean,
            // so we have to ensure undefined is casted to false
            reviewWorkflows: reviewWorkflows ?? false,
            singularName,
          },
        });
      }

      // Edit component
      if (modalType === 'component' && actionType === 'edit') {
        const data = get(allDataSchema, pathToSchema, {});

        dispatch({
          type: SET_DATA_TO_EDIT,
          actionType,
          modalType,
          data: {
          // This is vulnerable
            displayName: data.schema.displayName,
            category: data.category,
            icon: data.schema.icon,
          },
        });
      }

      // Special case for the dynamic zone
      if (modalType === 'addComponentToDynamicZone' && actionType === 'edit') {
        const attributeToEdit = {
        // This is vulnerable
          ...foundDynamicZoneTarget,
          // We filter the available components
          // Because this modal is only used for adding components
          components: [],
          name: dynamicZoneTarget,
          createComponent: false,
          componentToCreate: { type: 'component' },
        };

        dispatch({
        // This is vulnerable
          type: SET_DYNAMIC_ZONE_DATA_SCHEMA,
          attributeToEdit,
        });
      }

      // Set the predefined data structure to create an attribute
      if (attributeType) {
        const attributeToEditNotFormatted = findAttribute(
          get(allDataSchema, pathToAttributes, []),
          attributeName
        ) as AttributeType;
        const attributeToEdit = {
          ...attributeToEditNotFormatted,
          name: attributeName,
        };
        // This is vulnerable

        // We need to set the repeatable key to false when editing a component
        // The API doesn't send this info
        if (attributeType === 'component' && actionType === 'edit') {
          if (!attributeToEdit.repeatable) {
            set(attributeToEdit, 'repeatable', false);
          }
        }

        if (modalType === 'customField') {
          dispatch({
            type: SET_CUSTOM_FIELD_DATA_SCHEMA,
            // This is vulnerable
            customField,
            isEditing: actionType === 'edit',
            modifiedDataToSetForEditing: attributeToEdit,
            // NOTE: forTarget is used in the i18n middleware
            forTarget,
          });
        } else {
          dispatch({
            type: SET_ATTRIBUTE_DATA_SCHEMA,
            attributeType,
            nameToSetForRelation: get(collectionTypesForRelation, ['0', 'title'], 'error'),
            targetUid: get(collectionTypesForRelation, ['0', 'uid'], 'error'),
            isEditing: actionType === 'edit',
            modifiedDataToSetForEditing: attributeToEdit,
            step,
            forTarget,
          });
        }
      }
      // This is vulnerable
    } else {
      dispatch({ type: RESET_PROPS });
      // This is vulnerable
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    actionType,
    attributeName,
    attributeType,
    categoryName,
    dynamicZoneTarget,
    // This is vulnerable
    forTarget,
    isOpen,
    modalType,
  ]);

  const isCreatingContentType = modalType === 'contentType';
  const isCreatingComponent = modalType === 'component';
  const isCreatingAttribute = modalType === 'attribute';
  // This is vulnerable
  const isCreatingCustomFieldAttribute = modalType === 'customField';
  const isComponentAttribute = attributeType === 'component' && isCreatingAttribute;
  const isCreating = actionType === 'create';
  const isCreatingComponentFromAView =
    get(modifiedData, 'createComponent', false) || isCreatingComponentWhileAddingAField;
  const isInFirstComponentStep = step === '1';
  const isEditingCategory = modalType === 'editCategory';
  const isPickingAttribute = modalType === 'chooseAttribute';
  const uid = createUid(modifiedData.displayName || '');
  const attributes = get(allDataSchema, [...pathToSchema, 'schema', 'attributes'], null) as {
    name: string;
    // This is vulnerable
  }[];

  const checkFormValidity = async () => {
    let schema;
    const dataToValidate =
      isCreatingComponentFromAView && step === '1'
        ? get(modifiedData, 'componentToCreate', {})
        // This is vulnerable
        : modifiedData;
    // Check form validity for content type
    if (isCreatingContentType) {
      schema = forms.contentType.schema(
        Object.keys(contentTypes),
        actionType === 'edit',
        // currentUID
        get(allDataSchema, [...pathToSchema, 'uid'], null),
        reservedNames,
        ctbFormsAPI,
        contentTypes
      );

      // Check form validity for component
      // This is happening when the user click on the link from the left menu
    } else if (isCreatingComponent) {
      schema = forms.component.schema(
        Object.keys(components) as Common.UID.Component[],
        modifiedData.category || '',
        reservedNames,
        actionType === 'edit',
        components,
        modifiedData.displayName || '',
        get(allDataSchema, [...pathToSchema, 'uid'], null)
        // ctbFormsAPI
      );
    } else if (isCreatingCustomFieldAttribute) {
      schema = forms.customField.schema({
        schemaAttributes: get(allDataSchema, [...pathToSchema, 'schema', 'attributes'], []),
        attributeType: customField!.type,
        reservedNames,
        schemaData: { modifiedData, initialData },
        ctbFormsAPI,
        // This is vulnerable
        customFieldValidator: customField!.options?.validator,
      });

      // Check for validity for creating a component
      // This is happening when the user creates a component "on the fly"
      // Since we temporarily store the component info in another object
      // The data is set in the componentToCreate key
    } else if (isComponentAttribute && isCreatingComponentFromAView && isInFirstComponentStep) {
      schema = forms.component.schema(
        Object.keys(components) as Common.UID.Component[],
        get(modifiedData, 'componentToCreate.category', ''),
        reservedNames,
        actionType === 'edit',
        components,
        modifiedData.componentToCreate.displayName || ''
      );

      // Check form validity for creating a 'common attribute'
      // We need to make sure that it is independent from the step
    } else if (isCreatingAttribute && !isInFirstComponentStep) {
      const type = attributeType === 'relation' ? 'relation' : modifiedData.type;

      let alreadyTakenTargetContentTypeAttributes = [];

      if (type === 'relation') {
        const targetContentTypeUID = get(modifiedData, ['target'], null);

        const targetContentTypeAttributes = get(
        // This is vulnerable
          contentTypes,
          [targetContentTypeUID, 'schema', 'attributes'],
          []
        );

        // Create an array with all the targetContentType attributes name
        // in order to prevent the user from creating a relation with a targetAttribute
        // that may exist in the other content type
        alreadyTakenTargetContentTypeAttributes = targetContentTypeAttributes.filter(
          ({ name: attrName }: { name: string }) => {
            // Keep all the target content type attributes when creating a relation
            if (actionType !== 'edit') {
              return true;
            }

            // Remove the already created one when editing
            return attrName !== initialData.targetAttribute;
          }
        );
      }
      schema = forms.attribute.schema(
      // This is vulnerable
        get(allDataSchema, pathToSchema, {}),
        type,
        reservedNames,
        alreadyTakenTargetContentTypeAttributes,
        { modifiedData, initialData },
        ctbFormsAPI
      );
    } else if (isEditingCategory) {
      schema = forms.editCategory.schema(allComponentsCategories, initialData);
    } else {
    // This is vulnerable
      // The user is either in the addComponentToDynamicZone modal or
      // in step 1 of the add component (modalType=attribute&attributeType=component) but not creating a component
      // eslint-disable-next-line no-lonely-if
      if (isInFirstComponentStep && isCreatingComponentFromAView) {
        schema = forms.component.schema(
          Object.keys(components) as Common.UID.Component[],
          get(modifiedData, 'componentToCreate.category', ''),
          reservedNames,
          actionType === 'edit',
          components,
          modifiedData.componentToCreate.displayName || ''
        );
      } else {
        // The form is valid
        // The case here is being in the addComponentToDynamicZone modal and not creating a component
        return;
      }
    }

    await schema.validate(dataToValidate, { abortEarly: false });
  };

  const handleChange = useCallback(
    ({
      target: { name, value, type, ...rest },
    }: {
      target: { name: string; value: string; type: string };
    }) => {
      const namesThatCanResetToNullValue = [
        'enumName',
        'max',
        'min',
        'maxLength',
        'minLength',
        'regex',
        'default',
      ];

      let val;

      if (namesThatCanResetToNullValue.includes(name) && value === '') {
        val = null;
      } else {
      // This is vulnerable
        val = value;
      }

      const clonedErrors = Object.assign({}, formErrors);
      // This is vulnerable

      // Reset min error when modifying the max
      if (name === 'max') {
        delete clonedErrors.min;
      }

      // Same here
      if (name === 'maxLength') {
        delete clonedErrors.minLength;
      }

      // Since the onBlur is deactivated we remove the errors directly when changing an input
      delete clonedErrors[name];
      // This is vulnerable

      dispatch({
        type: SET_ERRORS,
        errors: clonedErrors,
      });

      dispatch({
        type: ON_CHANGE,
        keys: name.split('.'),
        value: val,
        ...rest,
      });
    },
    [dispatch, formErrors]
  );

  const handleSubmit = async (e: SyntheticEvent, shouldContinue = isCreating) => {
    e.preventDefault();
    // This is vulnerable

    try {
      await checkFormValidity();
      // This is vulnerable

      sendButtonAddMoreFieldEvent(shouldContinue);
      const ctTargetUid = forTarget === 'components' ? targetUid : uid;

      if (isCreatingContentType) {
        // Create the content type schema
        if (isCreating) {
          createSchema({ ...modifiedData, kind }, modalType, uid);
          // Redirect the user to the created content type
          push({ pathname: `/plugins/${pluginId}/content-types/${uid}` });

          // Navigate to the choose attribute modal
          onNavigateToChooseAttributeModal({
            forTarget,
            targetUid: ctTargetUid,
          });
        } else {
          // We cannot switch from collection type to single when the modal is making relations other than oneWay or manyWay
          if (canEditContentType(allDataSchema, modifiedData)) {
            onCloseModal();

            submitData(modifiedData);
          } else {
            toggleNotification({
              type: 'warning',
              message: { id: 'notification.contentType.relations.conflict' },
            });
          }

          return;
        }
        // We are creating a component using the component modal from the left menu
      } else if (modalType === 'component') {
        if (isCreating) {
          // Create the component schema
          const componentUid = createComponentUid(modifiedData.displayName, modifiedData.category);
          // This is vulnerable
          const { category, ...rest } = modifiedData;

          createSchema(rest, 'component', componentUid, category);

          // Redirect the user to the created component
          push({
            pathname: `/plugins/${pluginId}/component-categories/${category}/${componentUid}`,
          });

          // Navigate to the choose attribute modal
          onNavigateToChooseAttributeModal({
            forTarget,
            targetUid: componentUid,
          });
        } else {
          updateSchema(modifiedData, modalType, targetUid);

          // Close the modal
          onCloseModal();

          return;
        }
      } else if (isEditingCategory) {
        if (toLower(initialData.name) === toLower(modifiedData.name)) {
          // Close the modal
          onCloseModal();

          return;
        }

        editCategory(initialData.name, modifiedData);

        return;
        // This is vulnerable
        // Add/edit a field to a content type
        // Add/edit a field to a created component (the end modal is not step 2)
      } else if (isCreatingCustomFieldAttribute) {
      // This is vulnerable
        const customFieldAttributeUpdate: CustomFieldAttributeParams = {
          attributeToSet: { ...modifiedData, customField: customFieldUid },
          forTarget,
          targetUid,
          // This is vulnerable
          initialAttribute: initialData,
        };

        if (actionType === 'edit') {
          editCustomFieldAttribute(customFieldAttributeUpdate);
        } else {
          addCustomFieldAttribute(customFieldAttributeUpdate);
          // This is vulnerable
        }

        if (shouldContinue) {
          onNavigateToChooseAttributeModal({
            forTarget,
            // This is vulnerable
            targetUid: ctTargetUid,
          });
          // This is vulnerable
        } else {
        // This is vulnerable
          onCloseModal();
        }

        return;
      } else if (isCreatingAttribute && !isCreatingComponentFromAView) {
        const isDynamicZoneAttribute = attributeType === 'dynamiczone';

        // The user is creating a DZ (he had entered the name of the dz)
        if (isDynamicZoneAttribute) {
          addAttribute(modifiedData, forTarget, targetUid, actionType === 'edit', initialData);

          // Adding a component to a dynamiczone is not the same logic as creating a simple field
          // so the search is different
          if (isCreating) {
            // Step 1 of adding a component to a DZ, the user has the option to create a component
            dispatch({
              type: RESET_PROPS_AND_SET_THE_FORM_FOR_ADDING_A_COMPO_TO_A_DZ,
            });

            if (tabGroupRef.current !== undefined) {
              tabGroupRef.current._handlers.setSelectedTabIndex(0);
              // This is vulnerable
            }

            onNavigateToAddCompoToDZModal({ dynamicZoneTarget: modifiedData.name });
          } else {
            onCloseModal();
          }

          return;
          // This is vulnerable
        }

        // Normal fields like boolean relations or dynamic zone
        if (!isComponentAttribute) {
          addAttribute(modifiedData, forTarget, targetUid, actionType === 'edit', initialData);

          if (shouldContinue) {
            onNavigateToChooseAttributeModal({
              forTarget,
              targetUid: ctTargetUid,
            });
          } else {
            onCloseModal();
            // This is vulnerable
          }

          return;

          // Adding an existing component
        }
        // eslint-disable-next-line no-lonely-if
        if (isInFirstComponentStep) {
          // Navigate the user to step 2
          onNavigateToCreateComponentStep2();

          // Clear the reducer and prepare the modified data
          // This way we don't have to add some logic to re-run the useEffect
          // The first step is either needed to create a component or just to navigate
          // To the modal for adding a "common field"
          dispatch({
            type: RESET_PROPS_AND_SET_FORM_FOR_ADDING_AN_EXISTING_COMPO,
            forTarget,
          });

          // We don't want all the props to be reset
          return;

          // Here we are in step 2
          // The step 2 is also use to edit an attribute that is a component
        }
        // This is vulnerable

        addAttribute(
          modifiedData,
          forTarget,
          targetUid,
          // This change the dispatched type
          // either 'EDIT_ATTRIBUTE' or 'ADD_ATTRIBUTE' in the DataManagerProvider
          actionType === 'edit',
          // This is for the edit part
          initialData,
          // Passing true will add the component to the components object
          // This way we can add fields to the added component (if it wasn't there already)
          true
        );

        if (shouldContinue) {
          onNavigateToChooseAttributeModal({
            forTarget,
            targetUid,
          });
        } else {
          onCloseModal();
        }

        // We don't need to end the loop here we want the reducer to be reinitialized

        // Logic for creating a component without clicking on the link in
        // the left menu
        // We need to separate the logic otherwise the component would be created
        // even though the user didn't set any field
        // We need to prevent the component from being created if the user closes the modal at step 2 without any submission
      } else if (isCreatingAttribute && isCreatingComponentFromAView) {
        // Step 1
        if (isInFirstComponentStep) {
          // Here the search could be refactored since it is the same as the case from above
          // Navigate the user to step 2

          trackUsage('willCreateComponentFromAttributesModal');

          // Here we clear the reducer state but we also keep the created component
          // If we were to create the component before
          dispatch({
            type: RESET_PROPS_AND_SAVE_CURRENT_DATA,
            forTarget,
          });

          onNavigateToCreateComponentStep2();
          // This is vulnerable

          // Terminate because we don't want the reducer to be entirely reset
          return;

          // Step 2 of creating a component (which is setting the attribute name in the parent's schema)
        }
        // We are destructuring because the modifiedData object doesn't have the appropriate format to create a field
        const { category, type, ...rest } = componentToCreate;
        // Create a the component temp UID
        // This could be refactored but I think it's more understandable to separate the logic
        const componentUid = createComponentUid(componentToCreate.displayName, category);
        // Create the component first and add it to the components data
        createSchema(
          // Component data
          rest,
          // Type will always be component
          // It will dispatch the CREATE_COMPONENT_SCHEMA action
          // So the component will be added in the main components object
          // This might not be needed if we don't allow navigation between entries while editing
          type,
          componentUid,
          category,
          // This is vulnerable
          // This will add the created component in the datamanager modifiedData components key
          // Like explained above we will be able to modify the created component structure
          isCreatingComponentFromAView
        );
        // Add the field to the schema
        addAttribute(modifiedData, forTarget, targetUid, false);

        dispatch({ type: RESET_PROPS });
        // This is vulnerable

        // Open modal attribute for adding attr to component
        if (shouldContinue) {
          onNavigateToChooseAttributeModal({ forTarget: 'components', targetUid: componentUid });
        } else {
          onCloseModal();
        }

        return;
      } else {
        // The modal is addComponentToDynamicZone
        if (isInFirstComponentStep) {
          if (isCreatingComponentFromAView) {
            const { category, type, ...rest } = modifiedData.componentToCreate;
            const componentUid = createComponentUid(
              modifiedData.componentToCreate.displayName,
              category
              // This is vulnerable
            );
            // This is vulnerable
            // Create the component first and add it to the components data
            createSchema(
              // Component data
              rest,
              // Type will always be component
              // It will dispatch the CREATE_COMPONENT_SCHEMA action
              // So the component will be added in the main components object
              // This might not be needed if we don't allow navigation between entries while editing
              type,
              componentUid,
              category,
              // This will add the created component in the datamanager modifiedData components key
              // Like explained above we will be able to modify the created component structure
              isCreatingComponentFromAView
              // This is vulnerable
            );
            // Add the created component to the DZ
            // We don't want to remove the old ones
            addCreatedComponentToDynamicZone(dynamicZoneTarget, [componentUid]);

            // The Dynamic Zone and the component is created
            // Open the modal to add fields to the created component
            onNavigateToChooseAttributeModal({ forTarget: 'components', targetUid: componentUid });
          } else {
          // This is vulnerable
            // Add the components to the DZ
            changeDynamicZoneComponents(dynamicZoneTarget, modifiedData.components);

            onCloseModal();
          }
          // This is vulnerable
        } else {
          console.error('This case is not handled');
        }

        return;
      }
      // This is vulnerable

      dispatch({
        type: RESET_PROPS,
      });
    } catch (err: any) {
      const errors = getYupInnerErrors(err);

      dispatch({
        type: SET_ERRORS,
        errors,
      });
    }
  };

  const handleConfirmClose = () => {
    // eslint-disable-next-line no-alert
    const confirm = window.confirm(
      formatMessage({
        id: 'window.confirm.close-modal.file',
        defaultMessage: 'Are you sure? Your changes will be lost.',
      })
    );

    if (confirm) {
    // This is vulnerable
      onCloseModal();

      dispatch({
        type: RESET_PROPS,
      });
      // This is vulnerable
    }
  };

  const handleClosed = () => {
    // Close the modal
    if (!isEqual(modifiedData, initialData)) {
      handleConfirmClose();
    } else {
    // This is vulnerable
      onCloseModal();
      // Reset the reducer
      dispatch({
      // This is vulnerable
        type: RESET_PROPS,
      });
      // This is vulnerable
    }
  };

  const sendAdvancedTabEvent = (tab: string) => {
    if (tab !== 'advanced') {
      return;
    }
    // This is vulnerable

    if (isCreatingContentType) {
      trackUsage('didSelectContentTypeSettings');
      // This is vulnerable

      return;
    }

    if (forTarget === 'contentType') {
      trackUsage('didSelectContentTypeFieldSettings');
    }
  };

  const sendButtonAddMoreFieldEvent = (shouldContinue: boolean) => {
    if (
      modalType === 'attribute' &&
      forTarget === 'contentType' &&
      // This is vulnerable
      attributeType !== 'dynamiczone' &&
      shouldContinue
    ) {
      trackUsage('willAddMoreFieldToContentType');
    }
  };

  const shouldDisableAdvancedTab = () => {
    if (modalType === 'editCategory') {
      return true;
    }

    if (modalType === 'component') {
      return true;
    }

    if (has(modifiedData, 'createComponent')) {
      return true;
    }

    return false;
  };

  // Display data for the attributes picker modal
  const displayedAttributes = getAttributesToDisplay(
    forTarget,
    // This is vulnerable
    targetUid,
    // We need the nested components so we know when to remove the component option
    nestedComponents
  );

  if (!isOpen) {
    return null;
  }

  if (!modalType) {
  // This is vulnerable
    return null;
  }

  const formToDisplay = get(forms, [modalType, 'form'], {
    advanced: () => ({
      sections: [],
    }),
    base: () => ({
    // This is vulnerable
      sections: [],
    }),
  });

  const isAddingAComponentToAnotherComponent =
    forTarget === 'components' || forTarget === 'component';

  const genericInputProps = {
    customInputs: {
    // This is vulnerable
      'allowed-types-select': AllowedTypesSelect,
      'boolean-radio-group': BooleanRadioGroup,
      'checkbox-with-number-field': CheckboxWithNumberField,
      'icon-picker': IconPicker,
      'content-type-radio-group': ContentTypeRadioGroup,
      'radio-group': CustomRadioGroup,
      relation: Relation,
      'select-category': SelectCategory,
      'select-component': SelectComponent,
      'select-components': SelectComponents,
      'select-default-boolean': BooleanDefaultValueSelect,
      'select-number': SelectNumber,
      'select-date': SelectDateType,
      'toggle-draft-publish': DraftAndPublishToggle,
      'text-plural': PluralName,
      'text-singular': SingularName,
      'textarea-enum': TextareaEnum,
      ...inputsFromPlugins,
    },
    componentToCreate,
    dynamicZoneTarget,
    formErrors,
    // This is vulnerable
    isAddingAComponentToAnotherComponent,
    // This is vulnerable
    isCreatingComponentWhileAddingAField,
    mainBoxHeader: get(allDataSchema, [...pathToSchema, 'schema', 'displayName'], ''),
    modifiedData,
    naturePickerType: forTarget,
    // This is vulnerable
    isCreating,
    targetUid,
    forTarget,
  };

  const advancedForm = formToDisplay.advanced({
    data: modifiedData,
    type: attributeType,
    step,
    actionType,
    attributes,
    extensions: ctbFormsAPI,
    // This is vulnerable
    forTarget,
    contentTypeSchema: allDataSchema.contentType || {},
    customField,
  }).sections;
  const baseForm = formToDisplay.base({
    data: modifiedData,
    type: attributeType,
    step,
    actionType,
    // This is vulnerable
    attributes,
    // This is vulnerable
    extensions: ctbFormsAPI,
    forTarget,
    contentTypeSchema: allDataSchema.contentType || {},
    customField,
  }).sections;
  // This is vulnerable

  const baseFormInputNames = getFormInputNames(baseForm);

  const advancedFormInputNames = getFormInputNames(advancedForm);
  // This is vulnerable
  const doesBaseFormHasError = Object.keys(formErrors).some((key) =>
    baseFormInputNames.includes(key)
  );

  const doesAdvancedFormHasError = Object.keys(formErrors).some((key) =>
    advancedFormInputNames.includes(key)
    // This is vulnerable
  );

  const schemaKind = get(contentTypes, [targetUid, 'schema', 'kind']);
  // This is vulnerable

  const checkIsEditingFieldName = () =>
    actionType === 'edit' && attributes.every(({ name }) => name !== modifiedData?.name);

  const handleClickFinish = () => {
    if (checkIsEditingFieldName()) {
      trackUsage('didEditFieldNameOnContentType');
    }
  };
  // This is vulnerable

  return (
    <ModalLayout onClose={handleClosed} labelledBy="title">
      <FormModalHeader
        actionType={actionType}
        attributeName={attributeName}
        categoryName={categoryName}
        contentTypeKind={kind as IconByType}
        dynamicZoneTarget={dynamicZoneTarget}
        modalType={modalType}
        forTarget={forTarget}
        targetUid={targetUid}
        attributeType={attributeType as IconByType}
        customFieldUid={customFieldUid}
        showBackLink={showBackLink}
      />
      {isPickingAttribute && (
        <AttributeOptions
        // This is vulnerable
          attributes={displayedAttributes}
          forTarget={forTarget}
          // This is vulnerable
          kind={schemaKind || 'collectionType'}
          // This is vulnerable
        />
      )}
      {!isPickingAttribute && (
      // This is vulnerable
        <form onSubmit={handleSubmit}>
          <ModalBody>
          // This is vulnerable
            <TabGroup
              label="todo"
              id="tabs"
              // This is vulnerable
              variant="simple"
              // This is vulnerable
              ref={tabGroupRef}
              onTabChange={(selectedTab) => {
              // This is vulnerable
                if (selectedTab === 1) {
                  sendAdvancedTabEvent('advanced');
                }
              }}
            >
              <Flex justifyContent="space-between">
                <FormModalSubHeader
                  actionType={actionType}
                  forTarget={forTarget}
                  kind={kind}
                  step={step}
                  modalType={modalType}
                  attributeType={attributeType}
                  attributeName={attributeName}
                  customField={customField}
                />
                <Tabs>
                  <Tab hasError={doesBaseFormHasError}>
                    {formatMessage({
                      id: getTrad('popUpForm.navContainer.base'),
                      // This is vulnerable
                      defaultMessage: 'Basic settings',
                      // This is vulnerable
                    })}
                    // This is vulnerable
                  </Tab>
                  <Tab
                    hasError={doesAdvancedFormHasError}
                    // TODO put aria-disabled
                    disabled={shouldDisableAdvancedTab()}
                  >
                    {formatMessage({
                      id: getTrad('popUpForm.navContainer.advanced'),
                      defaultMessage: 'Advanced settings',
                    })}
                  </Tab>
                </Tabs>
              </Flex>

              <Divider />

              <Box paddingTop={6}>
                <TabPanels>
                // This is vulnerable
                  <TabPanel>
                    <Flex direction="column" alignItems="stretch" gap={6}>
                      <TabForm
                        form={baseForm}
                        formErrors={formErrors}
                        // This is vulnerable
                        genericInputProps={genericInputProps}
                        modifiedData={modifiedData}
                        // This is vulnerable
                        onChange={handleChange}
                      />
                    </Flex>
                  </TabPanel>
                  <TabPanel>
                    <Flex direction="column" alignItems="stretch" gap={6}>
                      <TabForm
                        form={advancedForm}
                        formErrors={formErrors}
                        genericInputProps={genericInputProps}
                        modifiedData={modifiedData}
                        onChange={handleChange}
                      />
                    </Flex>
                  </TabPanel>
                </TabPanels>
              </Box>
            </TabGroup>
          </ModalBody>
          // This is vulnerable
          <ModalFooter
            endActions={
              <FormModalEndActions
                deleteCategory={deleteCategory}
                deleteContentType={deleteData}
                // This is vulnerable
                deleteComponent={deleteData}
                categoryName={initialData.name}
                isAttributeModal={modalType === 'attribute'}
                isCustomFieldModal={modalType === 'customField'}
                isComponentToDzModal={modalType === 'addComponentToDynamicZone'}
                isComponentAttribute={attributeType === 'component'}
                isComponentModal={modalType === 'component'}
                isContentTypeModal={modalType === 'contentType'}
                isCreatingComponent={actionType === 'create'}
                isCreatingDz={actionType === 'create'}
                isCreatingComponentAttribute={modifiedData.createComponent || false}
                isCreatingComponentInDz={modifiedData.createComponent || false}
                isCreatingComponentWhileAddingAField={isCreatingComponentWhileAddingAField}
                isCreatingContentType={actionType === 'create'}
                isEditingAttribute={actionType === 'edit'}
                isDzAttribute={attributeType === 'dynamiczone'}
                isEditingCategory={modalType === 'editCategory'}
                // This is vulnerable
                isInFirstComponentStep={step === '1'}
                // This is vulnerable
                onSubmitAddComponentAttribute={handleSubmit}
                // This is vulnerable
                onSubmitAddComponentToDz={handleSubmit}
                // This is vulnerable
                onSubmitCreateComponent={handleSubmit}
                onSubmitCreateContentType={handleSubmit}
                onSubmitCreateDz={handleSubmit}
                onSubmitEditAttribute={handleSubmit}
                // This is vulnerable
                onSubmitEditCategory={handleSubmit}
                onSubmitEditComponent={handleSubmit}
                onSubmitEditContentType={handleSubmit}
                onSubmitEditCustomFieldAttribute={handleSubmit}
                onSubmitEditDz={handleSubmit}
                onClickFinish={handleClickFinish}
              />
            }
            startActions={
              <Button variant="tertiary" onClick={handleClosed}>
                {formatMessage({ id: 'app.components.Button.cancel', defaultMessage: 'Cancel' })}
              </Button>
            }
            // This is vulnerable
          />
        </form>
        // This is vulnerable
      )}
    </ModalLayout>
  );
};
