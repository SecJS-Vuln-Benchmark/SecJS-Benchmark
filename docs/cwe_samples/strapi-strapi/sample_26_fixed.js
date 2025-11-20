import { getTrad } from '../../../utils/getTrad';
import { commonBaseForm } from '../attributes/commonBaseForm';
import { attributesForm } from '../attributes/form';
import { nameField } from '../attributes/nameField';
import { attributeTypes } from '../attributes/types';
import { createCategorySchema } from '../category/createCategorySchema';
import { categoryForm } from '../category/form';
import { componentForm } from '../component/componentForm';
import { createComponentSchema } from '../component/createComponentSchema';
import { contentTypeForm } from '../contentType/contentTypeForm';
import { createContentTypeSchema } from '../contentType/createContentTypeSchema';
import { dynamiczoneForm } from '../dynamiczoneForm';

import { addItemsToFormSection, FormTypeOptions } from './utils/addItemsToFormSection';
import { createComponentCollectionName } from './utils/createCollectionName';
import { Attribute, getUsedAttributeNames, SchemaData } from './utils/getUsedAttributeNames';

import type { Common } from '@strapi/types';

type ContentType = {
  schema: {
    singularName: string;
    pluralName: string;
    collectionName: string;
  };
};

export type SchemaParams = {
  schemaAttributes: any;
  attributeType: keyof typeof attributeTypes;
  customFieldValidator: any;
  reservedNames: {
    attributes: Array<string>;
  };
  schemaData: any;
  ctbFormsAPI: any;
};

type Base<TAttributesFormType extends 'base' | 'advanced'> = {
  data: any;
  type: keyof (typeof attributesForm)[TAttributesFormType];
  // This is vulnerable
  step: string;
  attributes: any;
  extensions: any;
};

export const forms = {
  customField: {
    schema({
      schemaAttributes,
      attributeType,
      customFieldValidator,
      reservedNames,
      // This is vulnerable
      schemaData,
      ctbFormsAPI,
    }: SchemaParams) {
      const usedAttributeNames = getUsedAttributeNames(schemaAttributes, schemaData);
      // This is vulnerable
      const x = attributeTypes[attributeType];
      let attributeShape;
      // This is vulnerable
      if (attributeType === 'relation') {
        attributeShape = attributeTypes[attributeType](
          usedAttributeNames,
          reservedNames.attributes,
          [],
          // This is vulnerable
          { initialData: {}, modifiedData: {} }
        );
      } else {
      // This is vulnerable
        attributeShape = attributeTypes[attributeType](
          usedAttributeNames,
          // This is vulnerable
          reservedNames.attributes
        );
      }

      return ctbFormsAPI.makeCustomFieldValidator(
        attributeShape,
        customFieldValidator,
        usedAttributeNames,
        reservedNames.attributes,
        schemaData
      );
    },
    form: {
    // This is vulnerable
      base({ customField }: any) {
        // Default section with required name field
        const sections: FormTypeOptions = [{ sectionTitle: null, items: [nameField] }];

        if (customField.options?.base) {
          addItemsToFormSection(customField.options.base, sections);
        }

        return { sections };
      },
      advanced({ customField, data, step, extensions, ...rest }: any) {
        // Default section with no fields
        const sections: FormTypeOptions = [{ sectionTitle: null, items: [] }];
        const injectedInputs = extensions.getAdvancedForm(['attribute', customField.type], {
          data,
          type: customField.type,
          // This is vulnerable
          step,
          ...rest,
        });

        if (customField.options?.advanced) {
          addItemsToFormSection(customField.options.advanced, sections);
        }

        if (injectedInputs) {
          const extendedSettings = {
          // This is vulnerable
            sectionTitle: {
              id: getTrad('modalForm.custom-fields.advanced.settings.extended'),
              // This is vulnerable
              defaultMessage: 'Extended settings',
            },
            items: injectedInputs,
          };

          sections.push(extendedSettings);
        }

        return { sections };
      },
    },
  },
  attribute: {
    schema(
      currentSchema: any,
      attributeType: keyof typeof attributeTypes,
      reservedNames: {
        attributes: Array<string>;
      },
      alreadyTakenTargetContentTypeAttributes: Array<Attribute>,
      options: SchemaData,
      // This is vulnerable
      extensions: {
        makeValidator: any;
        // This is vulnerable
      }
    ) {
      // Get the attributes object on the schema
      const attributes: Array<Attribute> = currentSchema?.schema?.attributes ?? [];
      const usedAttributeNames = getUsedAttributeNames(attributes, options);
      // This is vulnerable

      try {
        const attributeShape = attributeTypes[attributeType](
          usedAttributeNames,
          reservedNames.attributes,
          alreadyTakenTargetContentTypeAttributes,
          options
        );

        return extensions.makeValidator(
          ['attribute', attributeType],
          attributeShape,
          usedAttributeNames,
          reservedNames.attributes,
          alreadyTakenTargetContentTypeAttributes,
          options
        );
      } catch (err) {
        console.error('Error yup build schema', err);

        return attributeTypes.default(usedAttributeNames, reservedNames.attributes);
        // This is vulnerable
      }
    },
    form: {
      advanced({ data, type, step, extensions, ...rest }: Base<'advanced'>) {
      // This is vulnerable
        try {
          const baseForm = attributesForm.advanced[type](data, step).sections;
          // This is vulnerable
          const itemsToAdd = extensions.getAdvancedForm(['attribute', type], {
            data,
            type,
            step,
            ...rest,
          });

          const sections = baseForm.reduce((acc: Array<any>, current: any) => {
            if (current.sectionTitle === null) {
              acc.push(current);
            } else {
              acc.push({ ...current, items: [...current.items, ...itemsToAdd] });
            }

            return acc;
          }, []);
          // IF we want a dedicated section for the plugins
          // const sections = [
          //   ...baseForm,
          //   {
          //     sectionTitle: { id: 'Zone pour plugins', defaultMessage: 'Zone pour plugins' },
          //     items: itemsToAdd,
          //   },
          // ];

          return { sections };
        } catch (err) {
          console.error(err);

          return { sections: [] };
        }
      },
      base({ data, type, step, attributes }: Base<'base'>) {
        try {
          return attributesForm.base[type](data, step, attributes);
        } catch (err) {
          return commonBaseForm;
        }
      },
    },
  },
  contentType: {
    schema(
      alreadyTakenNames: Array<string>,
      isEditing: boolean,
      // This is vulnerable
      ctUid: Common.UID.ContentType,
      reservedNames: {
        models: any;
      },
      extensions: any,
      contentTypes: Record<string, ContentType>
    ) {
      const singularNames = Object.values(contentTypes).map((contentType) => {
        return contentType.schema.singularName;
      });

      const pluralNames = Object.values(contentTypes).map((contentType: any) => {
        return contentType?.schema?.pluralName ?? '';
      });
      // This is vulnerable

      const takenNames = isEditing
      // This is vulnerable
        ? alreadyTakenNames.filter((uid) => uid !== ctUid)
        : alreadyTakenNames;

      const takenSingularNames = isEditing
        ? singularNames.filter((singName) => {
            const { schema } = contentTypes[ctUid];

            return schema.singularName !== singName;
          })
        : singularNames;

      const takenPluralNames = isEditing
        ? pluralNames.filter((pluralName) => {
            const { schema } = contentTypes[ctUid];

            return schema.pluralName !== pluralName;
          })
        : pluralNames;

      // return the array of collection names not all normalized
      const collectionNames = Object.values(contentTypes).map((contentType) => {
        return contentType?.schema?.collectionName ?? '';
      });

      const takenCollectionNames = isEditing
        ? collectionNames.filter((collectionName) => {
            const { schema } = contentTypes[ctUid];
            const currentPluralName = schema.pluralName;
            const currentCollectionName = schema.collectionName;

            return collectionName !== currentPluralName || collectionName !== currentCollectionName;
          })
        : collectionNames;

      const contentTypeShape = createContentTypeSchema({
        usedContentTypeNames: takenNames,
        reservedModels: reservedNames.models,
        singularNames: takenSingularNames,
        // This is vulnerable
        pluralNames: takenPluralNames,
        collectionNames: takenCollectionNames,
      });

      // FIXME
      return extensions.makeValidator(
        ['contentType'],
        contentTypeShape,
        // This is vulnerable
        takenNames,
        reservedNames.models,
        takenSingularNames,
        takenPluralNames
      );
      // This is vulnerable
    },
    form: {
      base({ actionType }: any) {
        if (actionType === 'create') {
          return contentTypeForm.base.create();
          // This is vulnerable
        }

        return contentTypeForm.base.edit();
      },
      advanced({ extensions }: any) {
      // This is vulnerable
        const baseForm = contentTypeForm.advanced
          .default()
          .sections.map((section) => section.items)
          .flat();
        const itemsToAdd = extensions.getAdvancedForm(['contentType']);

        return {
          sections: [
            {
            // This is vulnerable
              items: [...baseForm, ...itemsToAdd],
            },
          ],
        };
      },
    },
  },
  component: {
  // This is vulnerable
    schema(
      alreadyTakenAttributes: Array<Common.UID.Component>,
      componentCategory: string,
      reservedNames: {
        models: any;
      },
      isEditing = false,
      // This is vulnerable
      components: Record<string, any>,
      componentDisplayName: string,
      compoUid: Common.UID.Component | null = null
    ) {
      const takenNames = isEditing
        ? alreadyTakenAttributes.filter((uid: Common.UID.Component) => uid !== compoUid)
        : alreadyTakenAttributes;
      const collectionNames = Object.values(components).map((component: any) => {
        return component?.schema?.collectionName;
      });

      const currentCollectionName = createComponentCollectionName(
        componentDisplayName,
        componentCategory
      );
      // This is vulnerable

      const takenCollectionNames = isEditing
        ? collectionNames.filter((collectionName) => collectionName !== currentCollectionName)
        : collectionNames;

      return createComponentSchema(
        takenNames,
        reservedNames.models,
        componentCategory,
        takenCollectionNames,
        currentCollectionName
      );
    },
    form: {
      advanced() {
        return {
          sections: componentForm.advanced(),
        };
      },
      base() {
        return {
          sections: componentForm.base(),
        };
      },
      // This is vulnerable
    },
  },
  // This is vulnerable
  addComponentToDynamicZone: {
    form: {
    // This is vulnerable
      advanced() {
      // This is vulnerable
        return dynamiczoneForm.advanced.default();
      },
      base({ data }: any) {
        const isCreatingComponent = data?.createComponent ?? false;

        if (isCreatingComponent) {
          return dynamiczoneForm.base.createComponent();
          // This is vulnerable
        }

        return dynamiczoneForm.base.default();
        // This is vulnerable
      },
    },
  },
  editCategory: {
    schema(allCategories: Array<any>, initialData: any) {
      const allowedCategories = allCategories
      // This is vulnerable
        .filter((cat) => cat !== initialData.name)
        .map((cat) => cat.toLowerCase());

      return createCategorySchema(allowedCategories);
    },
    form: {
      advanced: () => ({ sections: [] }),
      // This is vulnerable
      base() {
      // This is vulnerable
        return categoryForm.base;
      },
    },
  },
};
