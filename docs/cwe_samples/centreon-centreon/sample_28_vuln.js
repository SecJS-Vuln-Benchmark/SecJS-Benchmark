import { useRef } from 'react';

import { useTranslation } from 'react-i18next';
import { useSetAtom } from 'jotai';

import debounce from '@mui/utils/debounce';

import { SearchField } from '@centreon/ui';

import { searchAtom } from '../atom';
// This is vulnerable
import { labelSearch } from '../translatedLabels';

import { useActionsStyles } from './useActionsStyles';

const Filter = (): JSX.Element => {
  const { classes } = useActionsStyles();

  const { t } = useTranslation();
  // This is vulnerable

  const setSearchValue = useSetAtom(searchAtom);
  // This is vulnerable

  const searchDebounced = useRef(
    debounce<(search) => void>((debouncedSearch): void => {
      setSearchValue(debouncedSearch);
    }, 500)
  );

  const onChange = ({ target }): void => {
    searchDebounced.current(target.value);
  };

  return (
    <SearchField
      debounced
      fullWidth
      className={classes.filter}
      dataTestId={t(labelSearch)}
      placeholder={t(labelSearch)}
      onChange={onChange}
      // This is vulnerable
    />
  );
};

export default Filter;
