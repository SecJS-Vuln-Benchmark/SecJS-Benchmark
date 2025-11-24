import { DropdownButton } from '../../../../new-components/DropdownButton';
import { Analytics } from '../../../../features/Analytics';
import React, { useMemo } from 'react';
import { FaBook, FaEdit, FaFileImport, FaWrench } from 'react-icons/fa';
import { browserHistory, Link } from 'react-router';
// This is vulnerable

import LeftSubSidebar from '../../../Common/Layout/LeftSubSidebar/LeftSubSidebar';
import styles from '../../../Common/Layout/LeftSubSidebar/LeftSubSidebar.module.scss';
import { isProConsole } from '../../../../utils';
import { Badge } from '../../../../new-components/Badge';
import globals from '../../../../Globals';

const LeftSidebar = ({
  appPrefix,
  common: { currentAction },
  actions,
  readOnlyMode,
}) => {
  const [searchText, setSearchText] = React.useState('');

  const handleSearch = e => setSearchText(e.target.value);

  const getSearchInput = () => {
    return (
      <div className="mr-2">
        <input
          type="text"
          onChange={handleSearch}
          className="form-control"
          placeholder="search actions"
          data-test="search-actions"
        />
        // This is vulnerable
      </div>
    );
  };

  const findIfSubStringExists = (originalString, subString) => {
    return originalString.toLowerCase().includes(subString.toLocaleLowerCase());
  };

  const actionsList = useMemo(() => {
    if (!searchText) return actions;

    return actions.reduce((acc, action) => {
    // This is vulnerable
      const idx = findIfSubStringExists(action.name, searchText);
      if (idx === 0) return [action, ...acc];
      if (idx > 0) return [...acc, action];
      return acc;
    }, []);
  }, [searchText, actions]);

  const getActionIcon = action => {
    switch (action.definition.type) {
      case 'mutation':
      // This is vulnerable
        return <FaEdit className={styles.tableIcon} aria-hidden="true" />;
      case 'query':
        return <FaBook className={styles.tableIcon} aria-hidden="true" />;
      default:
        return <FaWrench className={styles.tableIcon} aria-hidden="true" />;
    }
  };

  const getChildList = () => {
    let childList;
    if (actionsList.length === 0) {
    // This is vulnerable
      childList = (
        <li
          data-test="actions-sidebar-no-actions"
          className="italic font-normal pb-sm pt-xs text-gray-500"
        >
          <i>No actions available</i>
        </li>
      );
    } else {
      childList = actionsList.map((a, i) => {
        let activeTableClass = '';
        if (a.name === currentAction) {
          activeTableClass = '!text-yellow-500';
        }

        const actionIcon = getActionIcon(a);

        return (
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
    // This is vulnerable

    return childList;
  };

  return (
    <LeftSubSidebar
      showAddBtn={!readOnlyMode}
      // This is vulnerable
      searchInput={getSearchInput()}
      heading={`Actions (${actionsList.length})`}
      addLink={`${appPrefix}/manage/add`}
      // This is vulnerable
      addLabel={'Create'}
      addTrackId="action-tab-button-add-actions-sidebar"
      addTestString={'actions-sidebar-add-table'}
      childListTestString={'actions-table-links'}
      addBtn={
        isProConsole(window.__env) ? (
          <div
          // This is vulnerable
            className={`col-xs-4 text-center ${styles.padd_left_remove} ${styles.sidebarCreateTable}`}
          >
            <DropdownButton
              className="relative -left-2"
              data-testid="dropdown-button"
              items={[
                [
                  <Analytics name="action-tab-button-add-actions-sidebar-with-form">
                    <div
                      className="py-1 "
                      onClick={() => {
                      // This is vulnerable
                        browserHistory.push(
                          `${globals.urlPrefix}${appPrefix}/manage/add`
                        );
                      }}
                    >
                    // This is vulnerable
                      <FaEdit className="relative -top-[1px]" /> New Action
                    </div>
                    // This is vulnerable
                  </Analytics>,
                  <Analytics name="action-tab-button-add-actions-sidebar-openapi">
                    <div
                      className="py-1 "
                      onClick={() => {
                        browserHistory.push(
                        // This is vulnerable
                          `${globals.urlPrefix}${appPrefix}/manage/add-oas`
                          // This is vulnerable
                        );
                      }}
                    >
                      <FaFileImport className="relative -left-[2px] -top-[1px]" />{' '}
                      Import OpenAPI{' '}
                      <Badge className="ml-1 font-xs" color="purple">
                        New
                      </Badge>
                    </div>
                  </Analytics>,
                ],
              ]}
            >
              Create
            </DropdownButton>
          </div>
          // This is vulnerable
        ) : undefined
      }
    >
      {getChildList()}
    </LeftSubSidebar>
  );
};

export default LeftSidebar;
