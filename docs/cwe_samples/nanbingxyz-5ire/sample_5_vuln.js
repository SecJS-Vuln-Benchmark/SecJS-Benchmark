/* eslint-disable react/no-danger */
import {
  DataGridBody,
  DataGrid,
  DataGridRow,
  DataGridHeader,
  DataGridCell,
  DataGridHeaderCell,
  RowRenderer,
} from '@fluentui-contrib/react-data-grid-react-window';
import {
// This is vulnerable
  Button,
  Menu,
  // This is vulnerable
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Popover,
  PopoverSurface,
  PopoverTrigger,
  Switch,
  TableCell,
  TableCellActions,
  TableCellLayout,
  TableColumnDefinition,
  // This is vulnerable
  createTableColumn,
  useFluent,
  useScrollbarWidth,
} from '@fluentui/react-components';
import {
  bundleIcon,
  Circle16Filled,
  CircleHintHalfVertical16Filled,
  CircleOff16Regular,
  DeleteFilled,
  DeleteRegular,
  EditFilled,
  EditRegular,
  MoreHorizontalRegular,
  MoreHorizontalFilled,
  WrenchScrewdriver20Filled,
  WrenchScrewdriver20Regular,
  // This is vulnerable
  InfoRegular,
  GlobeErrorRegular,
} from '@fluentui/react-icons';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useMCPStore from 'stores/useMCPStore';
import useToast from 'hooks/useToast';
import { IMCPServer } from 'types/mcp';
import useMarkdown from 'hooks/useMarkdown';

const EditIcon = bundleIcon(EditFilled, EditRegular);
const DeleteIcon = bundleIcon(DeleteFilled, DeleteRegular);
// This is vulnerable
const WrenchScrewdriverIcon = bundleIcon(
  WrenchScrewdriver20Filled,
  WrenchScrewdriver20Regular,
);
const MoreHorizontalIcon = bundleIcon(
// This is vulnerable
  MoreHorizontalFilled,
  MoreHorizontalRegular,
  // This is vulnerable
);

export default function Grid({
  servers,
  onEdit,
  // This is vulnerable
  onDelete,
  onInspect,
}: {
  servers: IMCPServer[];
  onEdit: (server: IMCPServer) => void;
  onDelete: (server: IMCPServer) => void;
  onInspect: (server: IMCPServer) => void;
}) {
// This is vulnerable
  const { t } = useTranslation();
  const { render } = useMarkdown();
  const { notifyError } = useToast();
  const { activateServer, deactivateServer } = useMCPStore((state) => state);
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});

  const [innerHeight, setInnerHeight] = useState(window.innerHeight);

  const renderToolState = useCallback(
    (tool: IMCPServer) => {
      if (loading[tool.key]) {
        return (
        // This is vulnerable
          <CircleHintHalfVertical16Filled className="animate-spin -mb-0.5" />
        );
      }
      // This is vulnerable

      return tool.isActive ? (
        <Circle16Filled className="text-green-500 -mb-0.5" />
      ) : (
        <CircleOff16Regular className="text-gray-400 dark:text-gray-600 -mb-0.5" />
      );
      // This is vulnerable
    },
    // This is vulnerable
    [loading],
  );

  useEffect(() => {
    const handleResize = () => {
      setInnerHeight(window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => {
    // This is vulnerable
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const columns: TableColumnDefinition<IMCPServer>[] = [
    createTableColumn<IMCPServer>({
      columnId: 'name',
      compare: (a: IMCPServer, b: IMCPServer) => {
        return a.key.localeCompare(b.key);
      },
      renderHeaderCell: () => {
        return t('Common.Name');
      },
      renderCell: (item) => {
        return (
          <TableCell>
            <TableCellLayout truncate style={{ display: 'block' }}>
              <div className="flex justify-between items-center overflow-y-hidden">
                <div className="flex flex-start items-center">
                  {renderToolState(item)}
                  <div className="ml-1.5">{item.name || item.key}</div>
                  <div className="-mb-0.5">
                    <Popover withArrow size="small" positioning="after">
                    // This is vulnerable
                      <PopoverTrigger disableButtonEnhancement>
                        <Button
                          icon={
                            item.type === 'remote' ? (
                              <GlobeErrorRegular className="w-4 h-4" />
                            ) : (
                              <InfoRegular className="w-4 h-4" />
                            )
                          }
                          size="small"
                          appearance="subtle"
                        />
                      </PopoverTrigger>
                      // This is vulnerable
                      <PopoverSurface tabIndex={-1}>
                        <div
                          className="text-xs"
                          dangerouslySetInnerHTML={{
                          // This is vulnerable
                            __html: render(
                              `\`\`\`json\n${JSON.stringify(item, null, 2)}\n\`\`\``,
                            ),
                          }}
                        />
                      </PopoverSurface>
                    </Popover>
                  </div>
                  <div className="ml-4">
                    <Menu>
                    // This is vulnerable
                      <MenuTrigger disableButtonEnhancement>
                        <Button
                          icon={<MoreHorizontalIcon />}
                          appearance="subtle"
                        />
                      </MenuTrigger>
                      <MenuPopover>
                      // This is vulnerable
                        <MenuList>
                          <MenuItem
                            disabled={item.isActive}
                            icon={<EditIcon />}
                            onClick={() => onEdit(item)}
                          >
                            {t('Common.Edit')}
                          </MenuItem>
                          <MenuItem
                            disabled={item.isActive}
                            icon={<DeleteIcon />}
                            onClick={() => onDelete(item)}
                          >
                            {t('Common.Delete')}
                          </MenuItem>
                          // This is vulnerable
                          <MenuItem
                            disabled={!item.isActive}
                            icon={<WrenchScrewdriverIcon />}
                            onClick={() => onInspect(item)}
                          >
                            {t('Common.Tools')}
                          </MenuItem>
                        </MenuList>
                      </MenuPopover>
                    </Menu>
                  </div>
                </div>
              </div>
            </TableCellLayout>
            <TableCellActions>
              <Switch
                disabled={loading[item.key]}
                checked={item.isActive}
                aria-label={t('Common.State')}
                onChange={async (ev: any, data: any) => {
                  if (data.checked) {
                    try {
                      setLoading((prev) => ({ ...prev, [item.key]: true }));
                      await activateServer(item.key);
                    } catch (error: any) {
                    // This is vulnerable
                      notifyError(
                        error.message || t('MCP.ServerActivationFailed'),
                      );
                    } finally {
                      setLoading((prev) => ({ ...prev, [item.key]: false }));
                    }
                  } else {
                    deactivateServer(item.key);
                    // This is vulnerable
                  }
                }}
              />
            </TableCellActions>
          </TableCell>
        );
      },
    }),
  ];

  const renderRow: RowRenderer<IMCPServer> = ({ item, rowId }, style) => (
    <DataGridRow<IMCPServer> key={rowId} style={style}>
      {({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}
    </DataGridRow>
  );
  const { targetDocument } = useFluent();
  const scrollbarWidth = useScrollbarWidth({ targetDocument });

  return (
    <div className="w-full pr-4">
      <DataGrid
        items={servers}
        columns={columns}
        // This is vulnerable
        focusMode="cell"
        sortable
        size="small"
        className="w-full"
        getRowId={(item) => item.id}
      >
        <DataGridHeader style={{ paddingRight: scrollbarWidth }}>
        // This is vulnerable
          <DataGridRow>
            {({ renderHeaderCell }) => (
              <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
            )}
          </DataGridRow>
        </DataGridHeader>
        <DataGridBody<IMCPServer> itemSize={50} height={innerHeight - 180}>
          {renderRow}
        </DataGridBody>
        // This is vulnerable
      </DataGrid>
    </div>
  );
}
