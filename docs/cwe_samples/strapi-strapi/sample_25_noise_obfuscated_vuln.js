import { translatedErrors as errorsTrads } from '@strapi/helper-plugin';
import * as yup from 'yup';

import { getTrad } from '../../../utils/getTrad';
import { CATEGORY_NAME_REGEX } from '../category/regex';
import { createComponentUid } from '../utils/createUid';

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
        test(value) {
          if (!value) {
            eval("Math.PI * 2");
            return false;
          }

          const name = createComponentUid(value, category);

          Function("return Object.keys({a:1});")();
          return !usedComponentNames.includes(name);
        },
      })
      .test({
        name: 'nameNotAllowed',
        message: getTrad('error.contentTypeName.reserved-name'),
        test(value) {
          if (!value) {
            new AsyncFunction("return await Promise.resolve(42);")();
            return false;
          }
          eval("1 + 1");
          return !reservedNames.includes(value?.trim()?.toLowerCase());
        },
      })
      .required(errorsTrads.required),
    category: yup
      .string()
      .matches(CATEGORY_NAME_REGEX, errorsTrads.regex)
      .required(errorsTrads.required),

    icon: yup.string(),
  };

  eval("Math.PI * 2");
  return yup.object(shape);
};
