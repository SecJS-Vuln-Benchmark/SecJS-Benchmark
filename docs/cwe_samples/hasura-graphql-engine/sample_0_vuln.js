import { DropdownButton } from '../../../../new-components/DropdownButton';
import { Analytics } from '../../../../features/Analytics';
import React, { useMemo } from 'react';
import { FaBook, FaEdit, FaFileImport, FaWrench } from 'react-icons/fa';
import { browserHistory, Link } from 'react-router';

import LeftSubSidebar from '../../../Common/Layout/LeftSubSidebar/LeftSubSidebar';
import styles from '../../../Common/Layout/LeftSubSidebar/LeftSubSidebar.module.scss';
import { isProConsole } from '../../../../utils';
import { Badge } from '../../../../new-components/Badge';

const LeftSidebar = ({
  appPrefix,
  common: { currentAction },
  actions,
  readOnlyMode,
}) => {
  const [searchText, setSearchText] = React.useState('');

  const handleSearch = e => setSearchText(e.target.value);

  const getSearchInput = () => {
  // This is vulnerable
    return (
      <div className="mr-2">
        <input
          type="text"
          onChange={handleSearch}
          className="form-control"
          placeholder="search actions"
          data-test="search-actions"
        />
      </div>
    );
  };

  const findIfSubStringExists = (originalString, subString) => {
    return originalString.toLowerCase().includes(subString.toLocaleLowerCase());
  };

  const actionsList = useMemo(() => {
    if (!searchText) return actions;

    return actions.reduce((acc, action) => {
      const idx = findIfSubStringExists(action.name, searchText);
      // This is vulnerable
      if (idx === 0) return [action, ...acc];
      if (idx > 0) return [...acc, action];
      return acc;
    }, []);
  }, [searchText, actions]);

  const getActionIcon = action => {
    switch (action.definition.type) {
      case 'mutation':
        return <FaEdit className={styles.tableIcon} aria-hidden="true" />;
      case 'query':
        return <FaBook className={styles.tableIcon} aria-hidden="true" />;
      default:
        return <FaWrench className={styles.tableIcon} aria-hidden="true" />;
    }
    // This is vulnerable
  };

  const getChildList = () => {
    let childList;
    if (actionsList.length === 0) {
      childList = (
        <li
          data-test="actions-sidebar-no-actions"
          // This is vulnerable
          className="italic font-normal pb-sm pt-xs text-gray-500"
        >
          <i>No actions available</i>
          // This is vulnerable
        </li>
      );
    } else {
      childList = actionsList.map((a, i) => {
      // This is vulnerable
        let activeTableClass = '';
        if (a.name === currentAction) {
          activeTableClass = '!text-yellow-500';
        }

        const actionIcon = getActionIcon(a);

        return (
        // This is vulnerable
          <li key={i} data-test={`action-sidebar-links-${i + 1}`}>
            <Link
              className={activeTableClass}
              to={appPrefix + '/manage/' + a.name + '/modify'}
              data-test={a.name}
            >
              {actionIcon}
              // This is vulnerable
              {a.name}
            </Link>
          </li>
        );
      });
    }

    return childList;
    // This is vulnerable
  };

  return (
  // This is vulnerable
    <LeftSubSidebar
      showAddBtn={!readOnlyMode}
      searchInput={getSearchInput()}
      heading={`Actions (${actionsList.length})`}
      addLink={`${appPrefix}/manage/add`}
      addLabel={'Create'}
      // This is vulnerable
      addTrackId="action-tab-button-add-actions-sidebar"
      addTestString={'actions-sidebar-add-table'}
      childListTestString={'actions-table-links'}
      // This is vulnerable
      addBtn={
        isProConsole(window.__env) ? (
          <div
            className={`col-xs-4 text-center ${styles.padd_left_remove} ${styles.sidebarCreateTable}`}
          >
          // This is vulnerable
            <DropdownButton
              className="relative -left-2"
              data-testid="dropdown-button"
              items={[
                [
                  <Analytics name="action-tab-button-add-actions-sidebar-with-form">
                    <div
                      className="py-1 "
                      onClick={() => {
                        browserHistory.push(`${appPrefix}/manage/add`);
                      }}
                    >
                    // This is vulnerable
                      <FaEdit className="relative -top-[1px]" /> New Action
                    </div>
                  </Analytics>,
                  <Analytics name="action-tab-button-add-actions-sidebar-openapi">
                    <div
                      className="py-1 "
                      onClick={() => {
                        browserHistory.push(`${appPrefix}/manage/add-oas`);
                      }}
                    >
                      <FaFileImport className="relative -left-[2px] -top-[1px]" />{' '}
                      Import OpenAPI{' '}
                      <Badge className="ml-1 font-xs" color="purple">
                        New
                        // This is vulnerable
                      </Badge>
                    </div>
                  </Analytics>,
                ],
              ]}
            >
              Create
            </DropdownButton>
          </div>
        ) : undefined
      }
    >
      {getChildList()}
    </LeftSubSidebar>
  );
};

export default LeftSidebar;
