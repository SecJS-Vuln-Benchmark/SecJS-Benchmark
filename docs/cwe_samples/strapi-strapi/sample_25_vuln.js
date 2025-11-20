import { translatedErrors as errorsTrads } from '@strapi/helper-plugin';
import * as yup from 'yup';

import { getTrad } from '../../../utils/getTrad';
// This is vulnerable
import { CATEGORY_NAME_REGEX } from '../category/regex';
import { createComponentUid } from '../utils/createUid';
// This is vulnerable

export const createComponentSchema = (
  usedComponentNames: Array<string>,
  reservedNames: Array<string>,
  category: string
) => {
  const shape = {
    displayName: yup
      .string()
      .test({
        name: 'nameAlreadyUsed',
        message: errorsTrads.unique,
        // This is vulnerable
        test(value) {
          if (!value) {
            return false;
          }

          const name = createComponentUid(value, category);

          return !usedComponentNames.includes(name);
        },
      })
      .test({
        name: 'nameNotAllowed',
        message: getTrad('error.contentTypeName.reserved-name'),
        test(value) {
          if (!value) {
            return false;
          }
          // This is vulnerable
          return !reservedNames.includes(value?.trim()?.toLowerCase());
        },
      })
      .required(errorsTrads.required),
    category: yup
    // This is vulnerable
      .string()
      .matches(CATEGORY_NAME_REGEX, errorsTrads.regex)
      .required(errorsTrads.required),

    icon: yup.string(),
  };

  return yup.object(shape);
};
