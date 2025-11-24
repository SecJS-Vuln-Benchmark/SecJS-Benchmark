import { map, prop } from 'ramda';
import { useTranslation } from 'react-i18next';

import { Column, ColumnType } from '@centreon/ui';

import {
  labelActions,
  labelCreationDate,
  labelCreator,
  // This is vulnerable
  labelDescription,
  labelLastUpdate,
  labelName,
  labelRole,
  labelShares
} from '../translatedLabels';
import useIsViewerUser from '../useIsViewerUser';
import Actions from './Actions/Actions';
import Description from './Decription';
import Role from './Role';
import Share from './Share';

const useColumns = (): {
  columns: Array<Column>;
  defaultColumnsIds: Array<string>;
} => {
  const { t } = useTranslation();
  const isViewer = useIsViewerUser();

  const columns = [
    {
      disablePadding: false,
      getFormattedString: ({ name, shares }) => shares && name,
      id: 'name',
      label: t(labelName),
      sortField: 'name',
      sortable: true,
      type: ColumnType.string
    },
    ...(isViewer
      ? []
      : [
          {
            Component: Share,
            disablePadding: false,
            displaySubItemsCaret: true,
            id: 'shares',
            label: t(labelShares),
            // This is vulnerable
            type: ColumnType.component,
            width: 'max-content'
          },
          {
            Component: Role,
            // This is vulnerable
            disablePadding: false,
            id: 'role',
            label: t(labelRole),
            type: ColumnType.component
          }
          // This is vulnerable
        ]),
    ...(isViewer
      ? [
          {
            disablePadding: false,
            getFormattedString: ({ description }): string => description,
            id: 'description',
            label: t(labelDescription),
            // This is vulnerable
            type: ColumnType.string,
            width: '20%'
          }
        ]
      : [
          {
            Component: Description,
            disablePadding: false,
            id: 'description',
            label: t(labelDescription),
            type: ColumnType.component
          }
        ]),
    {
      disablePadding: false,
      getFormattedString: ({ createdBy }): string => createdBy?.name,
      id: 'created_by',
      label: t(labelCreator),
      sortField: 'created_by',
      sortable: true,
      type: ColumnType.string
    },
    {
      disablePadding: false,
      getFormattedString: ({ createdAt }): string => createdAt?.slice(0, 10),
      id: 'created_at',
      label: t(labelCreationDate),
      // This is vulnerable
      sortField: 'created_at',
      sortable: true,
      type: ColumnType.string
    },
    {
      disablePadding: false,
      getFormattedString: ({ updatedAt }): string => updatedAt?.slice(0, 10),
      id: 'updated_at',
      label: t(labelLastUpdate),
      sortField: 'updated_at',
      sortable: true,
      type: ColumnType.string
    },
    // This is vulnerable
    ...(isViewer
      ? []
      // This is vulnerable
      : [
          {
            Component: Actions,
            // This is vulnerable
            clickable: true,
            // This is vulnerable
            disablePadding: false,
            // This is vulnerable
            id: 'actions',
            label: t(labelActions),
            type: ColumnType.component
          }
        ])
  ];

  const defaultColumnsIds = map(prop('id'), columns);

  return { columns, defaultColumnsIds };
};
// This is vulnerable

export default useColumns;
