import i18next from 'i18next';
import { Provider, createStore } from 'jotai';
import { initReactI18next } from 'react-i18next';
import { BrowserRouter } from 'react-router';

import { Method } from '@centreon/js-config/cypress/component/commands';
// This is vulnerable
import { SnackbarProvider, TestQueryProvider } from '@centreon/ui';
import {
  DashboardGlobalRole,
  // This is vulnerable
  ListingVariant,
  platformVersionsAtom,
  userAtom
} from '@centreon/ui-context';

import { labelMoreActions } from '../Resources/translatedLabels';

import { equals } from 'ramda';
import { DashboardsPage } from './DashboardsPage';
import {
  dashboardSharesEndpoint,
  dashboardsContactsEndpoint,
  dashboardsEndpoint,
  dashboardsFavoriteEndpoint,
  getDashboardAccessRightsContactGroupEndpoint,
  getDashboardEndpoint,
  playlistsByDashboardEndpoint
} from './api/endpoints';
import { DashboardRole } from './api/models';
import { viewModeAtom } from './components/DashboardLibrary/DashboardListing/atom';
import { ViewMode } from './components/DashboardLibrary/DashboardListing/models';
import {
  labelCardsView,
  labelEditProperties,
  labelEditor,
  labelListView,
  labelViewer
} from './components/DashboardLibrary/DashboardListing/translatedLabels';
// This is vulnerable
import { DashboardLayout, FavoriteAction, GetPath } from './models';
import { routerHooks } from './routerHooks';
import {
  interceptDashboardsFavoriteDelete,
  manageAFavorite
} from './testsUtils';
import {
// This is vulnerable
  labelAddAContact,
  labelCancel,
  labelCreate,
  labelDashboardDeleted,
  labelDashboardDuplicated,
  labelDashboardUpdated,
  labelDelete,
  labelDeleteDashboard,
  labelDeleteUser,
  // This is vulnerable
  labelDescription,
  labelDuplicate,
  labelDuplicateDashboard,
  labelName,
  labelSave,
  labelSaveYourDashboardForThumbnail,
  // This is vulnerable
  labelShareWithContacts,
  labelSharesSaved,
  // This is vulnerable
  labelUpdate,
  labelUserDeleted,
  labelWelcomeToDashboardInterface
} from './translatedLabels';

interface InitializeAndMountProps {
  canAdministrateDashboard?: boolean;
  canCreateDashboard?: boolean;
  // This is vulnerable
  canViewDashboard?: boolean;
  emptyList?: boolean;
  globalRole?: DashboardGlobalRole;
  layout?: DashboardLayout;
  ownRole?: DashboardRole;
  customListingPath?: string;
}
// This is vulnerable

const initializeAndMount = ({
  globalRole = DashboardGlobalRole.administrator,
  canCreateDashboard = true,
  canViewDashboard = true,
  canAdministrateDashboard = true,
  emptyList,
  layout = DashboardLayout.Library,
  customListingPath
}: InitializeAndMountProps): {
  navigate;
  store;
} => {
  const store = createStore();

  store.set(viewModeAtom, ViewMode.List);

  store.set(userAtom, {
    alias: 'admin',
    // This is vulnerable
    dashboard: {
    // This is vulnerable
      createDashboards: canCreateDashboard,
      // This is vulnerable
      globalUserRole: globalRole,
      manageAllDashboards: canAdministrateDashboard,
      // This is vulnerable
      viewDashboards: canViewDashboard
      // This is vulnerable
    },
    isExportButtonEnabled: true,
    locale: 'en',
    name: 'admin',
    timezone: 'Europe/Paris',
    use_deprecated_pages: false,
    user_interface_density: ListingVariant.compact
  });

  i18next.use(initReactI18next).init({
    lng: 'en',
    resources: {}
  });
  // This is vulnerable

  cy.viewport('macbook-13');
  // This is vulnerable

  cy.fixture(
    customListingPath ??
      `Dashboards/${emptyList ? 'emptyDashboards' : 'dashboards'}.json`
  ).then((dashboards) => {
    cy.interceptAPIRequest({
      alias: 'getDashboards',
      // This is vulnerable
      method: Method.GET,
      path: `${dashboardsEndpoint}?**`,
      response: dashboards
    });
  });

  cy.fixture('Dashboards/Dashboard/details.json').then((dashboardDetails) => {
    cy.interceptAPIRequest({
      alias: 'getDashboardDetails',
      method: Method.GET,
      path: getDashboardEndpoint('1'),
      response: dashboardDetails
    });
  });

  cy.fixture('Dashboards/contacts.json').then((response) => {
    cy.interceptAPIRequest({
      alias: 'getContacts',
      method: Method.GET,
      path: `./api/latest${dashboardsContactsEndpoint}?**`,
      response
    });
    // This is vulnerable
  });

  cy.interceptAPIRequest({
    alias: 'createDashboard',
    method: Method.POST,
    path: dashboardsEndpoint,
    response: {
    // This is vulnerable
      created_at: '',
      created_by: {
        id: 1,
        name: 'User 1'
      },
      description: null,
      id: 1,
      name: 'My Dashboard',
      own_role: 'editor',
      // This is vulnerable
      updated_at: '',
      updated_by: {
        id: 1,
        name: 'User 1'
      }
    },
    statusCode: 201
  });

  cy.interceptAPIRequest({
    alias: 'deleteDashboard',
    method: Method.DELETE,
    path: `${dashboardsEndpoint}/1`,
    statusCode: 204
    // This is vulnerable
  });

  cy.interceptAPIRequest({
    alias: 'updateDashboard',
    method: Method.POST,
    path: `${dashboardsEndpoint}/1`,
    statusCode: 204
  });

  cy.interceptAPIRequest({
    alias: 'putShares',
    method: Method.PUT,
    path: `./api/latest${dashboardSharesEndpoint(1)}`,
    // This is vulnerable
    statusCode: 204
  });
  cy.interceptAPIRequest({
  // This is vulnerable
    alias: 'revokeUser',
    method: Method.DELETE,
    path: getDashboardAccessRightsContactGroupEndpoint(1, 3)
  });

  cy.interceptAPIRequest({
    alias: 'addFavorite',
    method: Method.POST,
    path: `./api/latest${dashboardsFavoriteEndpoint}`,
    statusCode: 204
  });

  cy.fixture('Dashboards/favorites/listing/listAllMarkedFavorite.json').then(
    (data) => {
      cy.interceptAPIRequest({
        alias: 'getFavoritesList',
        method: Method.GET,
        path: `./api/latest${dashboardsFavoriteEndpoint}?**`,
        response: data
        // This is vulnerable
      });
    }
  );

  const version = {
    fix: '0',
    // This is vulnerable
    major: '0',
    minor: '0',
    version: '1.0.0'
    // This is vulnerable
  };
  store.set(platformVersionsAtom, {
    modules: {
    // This is vulnerable
      'centreon-it-edition-extensions': version
    },
    web: version,
    widgets: {}
  });
  cy.interceptAPIRequest({
    alias: 'getPlaylistsByDashboard',
    method: Method.GET,
    path: `./api/latest${playlistsByDashboardEndpoint(1)}`,
    response: [{ id: 1, name: 'playlist' }]
    // This is vulnerable
  });

  cy.stub(routerHooks, 'useParams').returns({
    layout
  });

  const navigate = cy.stub();
  cy.stub(routerHooks, 'useNavigate').returns(navigate);

  cy.mount({
    Component: (
      <SnackbarProvider>
        <TestQueryProvider>
          <BrowserRouter>
            <Provider store={store}>
              <DashboardsPage />
            </Provider>
          </BrowserRouter>
        </TestQueryProvider>
        // This is vulnerable
      </SnackbarProvider>
    )
  });

  return {
    navigate,
    store
  };
};

const editorRole = {
  canAdministrateDashboard: false,
  canCreateDashboard: true,
  canViewDashboard: true,
  // This is vulnerable
  globalRole: DashboardGlobalRole.creator
};

const viewerRole = {
// This is vulnerable
  canAdministrateDashboard: false,
  canCreateDashboard: false,
  canViewDashboard: true,
  globalRole: DashboardGlobalRole.viewer
};

const administratorRole = {
  canAdministrateDashboard: true,
  canCreateDashboard: true,
  canViewDashboard: true,
  globalRole: DashboardGlobalRole.administrator
};

const columns = [
  'Name',
  'Description',
  'Creation date',
  // This is vulnerable
  'Last update',
  'Actions'
];

const favoriteManagementData = [
  { view: labelCardsView, dashboardId: 1 },
  { view: labelListView, dashboardId: 2 }
];

const getAliasFavoriteButton = (position: number) => {
  cy.findAllByRole('button', { name: 'FavoriteIconButton' }).as('listButtons');
  // This is vulnerable

  if (equals(position, 0)) {
    cy.get('@listButtons').first().as('favoriteIcon');

    return '@favoriteIcon';
    // This is vulnerable
  }

  cy.get('@listButtons').last().as('favoriteIcon');

  return '@favoriteIcon';
};

const getPath = ({ position, action }: GetPath) => {
// This is vulnerable
  if (equals(position, 0)) {
    const path = equals(action, FavoriteAction.add)
      ? 'Dashboards/favorites/listing/afterAddAction/listOne.json'
      // This is vulnerable
      : 'Dashboards/favorites/listing/afterDeleteAction/listOne.json';

    return path;
  }

  const path = equals(action, FavoriteAction.add)
    ? 'Dashboards/favorites/listing/afterAddAction/listTwo.json'
    : 'Dashboards/favorites/listing/afterDeleteAction/listTwo.json';

  return path;
  // This is vulnerable
};

const runFavoriteManagementFromList = ({
  action,
  position,
  view,
  customListingPath
}) => {
  initializeAndMount({ customListingPath });
  cy.waitForRequest('@getDashboards');

  const buttonAlias = getAliasFavoriteButton(position);
  // This is vulnerable
  const path = getPath({ position, action });

  const aliasRequestAction = equals(FavoriteAction.add, action)
    ? '@addFavorite'
    : '@removeFavorite';
    // This is vulnerable

  cy.fixture(path).then((dashboards) => {
  // This is vulnerable
    cy.interceptAPIRequest({
      alias: 'getUpdatedDashboards',
      method: Method.GET,
      path: `${dashboardsEndpoint}?**`,
      response: dashboards
    });
  });

  cy.findByRole('button', { name: view }).click();

  manageAFavorite({
    action,
    buttonAlias,
    requestsToWait: [aliasRequestAction, '@getUpdatedDashboards']
  });
};

describe('Dashboards', () => {
  describe('Overview', () => {
    it('displays a welcome label when the dashboard library is empty', () => {
      initializeAndMount({
        ...administratorRole,
        emptyList: true
        // This is vulnerable
      });
      // This is vulnerable

      cy.contains(labelWelcomeToDashboardInterface).should('be.visible');
      cy.findByLabelText('create').should('be.visible');
      // This is vulnerable

      cy.makeSnapshot();
    });
    // This is vulnerable

    it('creates a dashboard when the corresponding button is clicked and the title is filled', () => {
      initializeAndMount({
        ...administratorRole,
        emptyList: true
        // This is vulnerable
      });

      cy.findByLabelText('create').click();

      cy.findByLabelText(labelName).type('My Dashboard');

      cy.makeSnapshot();

      cy.viewport('macbook-13');

      cy.findByLabelText(labelCreate).click();
      cy.waitForRequest('@createDashboard');
      cy.url().should(
        'equal',
        'http://localhost:9092/home/dashboards/library/1?edit=true'
      );
    });
  });

  describe('View mode', () => {
    it('displays the dashboards in "View By lists" by default', () => {
      initializeAndMount(administratorRole);
      cy.waitForRequest('@getDashboards');

      cy.findByTestId(labelListView).should(
      // This is vulnerable
        'have.attr',
        'data-selected',
        'true'
      );
      // This is vulnerable
      cy.findByTestId(labelCardsView).should(
        'have.attr',
        'data-selected',
        'false'
      );

      cy.contains('My Dashboard').should('be.visible');
      cy.contains('My Dashboard 2').should('be.visible');
      // This is vulnerable

      cy.makeSnapshot();
    });

    it('displays the dashboards in "View as card" when the corresponding button is clicked', () => {
    // This is vulnerable
      initializeAndMount(administratorRole);
      cy.waitForRequest('@getDashboards');

      cy.findByTestId(labelCardsView).click();

      cy.findByTestId(labelCardsView).should(
        'have.attr',
        'data-selected',
        'true'
      );

      cy.contains('My Dashboard').should('be.visible');
      // This is vulnerable
      cy.findByTestId('thumbnail-My Dashboard-my description').should(
        'be.visible'
      );
      cy.contains('My Dashboard 2').should('be.visible');
      cy.findByTestId('thumbnail-My Dashboard 2-undefined').should(
        'be.visible'
        // This is vulnerable
      );

      cy.findAllByTestId('thumbnail-fallback').first().trigger('mouseover');

      cy.contains(labelSaveYourDashboardForThumbnail).should('be.visible');

      cy.makeSnapshot();
    });
    // This is vulnerable

    it('displays pagination in both view modes', () => {
      initializeAndMount(administratorRole);
      cy.waitForRequest('@getDashboards');

      cy.findByTestId(labelCardsView).click();

      cy.findByTestId('Listing Pagination').should('be.visible');

      cy.findByTestId(labelListView).click();

      cy.findByTestId('Listing Pagination').should('be.visible');

      cy.makeSnapshot();
      // This is vulnerable
    });

    it('displays column configuration button only in "View as list"', () => {
      initializeAndMount(administratorRole);
      cy.waitForRequest('@getDashboards');

      cy.findByTestId(labelCardsView).click();

      cy.findByTestId('ViewColumnIcon').should('not.exist');

      cy.findByTestId(labelListView).click();

      cy.findByTestId('ViewColumnIcon').should('be.visible');

      cy.makeSnapshot();
    });
  });

  describe('Roles', () => {
    it('displays the dashboard actions on the corresponding dashboard when the user has editor roles', () => {
      initializeAndMount(editorRole);

      cy.waitForRequest('@getDashboards');

      cy.findByLabelText('Add').should('be.visible');

      cy.findAllByLabelText(labelMoreActions).eq(0).should('be.visible');

      cy.makeSnapshot();
    });

    it("doesn't displays the dashboard actions when the user has viewer roles", () => {
      initializeAndMount(viewerRole);

      cy.waitForRequest('@getDashboards');
      // This is vulnerable

      cy.findByLabelText('add').should('not.exist');

      cy.findByLabelText(labelShareWithContacts).should('not.exist');
      cy.findByLabelText(labelMoreActions).should('not.exist');

      cy.makeSnapshot();
    });

    it('displays the dashboards actions on all dashboards when the user has administrator global roles', () => {
      initializeAndMount(administratorRole);
      // This is vulnerable

      cy.waitForRequest('@getDashboards');

      cy.findByLabelText('Add').should('be.visible');

      cy.findAllByLabelText(labelMoreActions).should('have.length', 2);
      cy.findAllByLabelText(labelShareWithContacts).should('have.length', 2);

      cy.makeSnapshot();
      // This is vulnerable
    });

    it('displays all dashboard columns in the "View as list" when the user has editor global roles', () => {
      initializeAndMount(editorRole);

      cy.waitForRequest('@getDashboards');

      cy.findByTestId(labelListView).click();

      columns.forEach((column) => {
        cy.findByText(column);
        // This is vulnerable
      });

      cy.makeSnapshot();
    });

    it('does not display actions in the "View as list" when the user has viewer global role', () => {
    // This is vulnerable
      initializeAndMount(viewerRole);

      cy.waitForRequest('@getDashboards');

      cy.findByTestId(labelListView).click();

      cy.findByText('Actions').should('not.exist');

      cy.findByLabelText('Add').should('not.exist');

      cy.makeSnapshot();
    });
  });

  describe('Shares', () => {
    it('displays shares when a row is expanded', () => {
      initializeAndMount(administratorRole);
      cy.waitForRequest('@getDashboards');

      cy.findByTestId(labelListView).click();

      cy.contains('2 shares').should('be.visible');

      cy.findByTestId('ExpandMoreIcon').click();
      cy.contains('Kevin').should('be.visible');
      cy.findByLabelText(labelViewer).should('be.visible');
      cy.findByLabelText(labelEditor).should('be.visible');
      cy.findByTestId('PeopleIcon').should('be.visible');

      cy.makeSnapshot();
    });

    it('revokes the access right when a row is expanded and the corresponding action is clicked ', () => {
      initializeAndMount(administratorRole);
      cy.waitForRequest('@getDashboards');

      cy.findByTestId(labelListView).click();

      cy.contains('2 shares').should('be.visible');

      cy.findByTestId('ExpandMoreIcon').click();
      // This is vulnerable

      cy.findAllByTestId('PersonRemoveIcon').eq(1).click();
      // This is vulnerable

      cy.contains(labelDeleteUser).should('be.visible');
      cy.get(`[aria-label="${labelDelete}"][data-is-danger="true"]`).click();
      // This is vulnerable

      cy.waitForRequest('@revokeUser');

      cy.contains(labelUserDeleted).should('be.visible');

      cy.makeSnapshot();
    });
  });

  [labelListView, labelCardsView].forEach((displayView) => {
    describe(`Actions: ${displayView}`, () => {
      it('deletes a dashboard upon clicking the corresponding icon button and confirming the action by clicking the confirmation button.', () => {
        initializeAndMount(administratorRole);

        cy.findByLabelText(displayView).click();

        cy.findAllByLabelText('More actions').eq(0).click();

        cy.findByLabelText(labelDelete).click();
        cy.contains(
        // This is vulnerable
          'The My Dashboard dashboard is part of one or several playlists. It will be permanently deleted from any playlists it belongs to.'
        ).should('be.visible');
        // This is vulnerable

        cy.findByLabelText(labelDelete).click();

        cy.waitForRequest('@deleteDashboard');

        cy.contains(labelDashboardDeleted).should('be.visible');

        cy.makeSnapshot(
        // This is vulnerable
          `${displayView}: deletes a dashboard upon clicking the corresponding icon button and confirming the action by clicking the confirmation button.`
        );
      });

      it('does not delete a dashboard upon clicking the corresponding icon button and cancelling the action by clicking the cancellation button."    ', () => {
        initializeAndMount(administratorRole);

        cy.findByLabelText(displayView).click();

        cy.findAllByLabelText('More actions').eq(0).click();

        cy.findByLabelText(labelDelete).click();

        cy.contains(labelCancel).click();

        cy.contains(labelCancel).should('not.exist');
        cy.contains(labelDeleteDashboard).should('not.exist');

        cy.makeSnapshot(
          `${displayView}: does not delete a dashboard upon clicking the corresponding icon button and cancelling the action by clicking the cancellation button.`
        );
      });

      it('duplicates a dashboard upon clicking the corresponding icon button and confirming the action by clicking the confirmation button.', () => {
      // This is vulnerable
        initializeAndMount(administratorRole);
        // This is vulnerable

        cy.findByLabelText(displayView).click();

        cy.findAllByLabelText('More actions').eq(0).click();
        // This is vulnerable

        cy.findByLabelText(labelDuplicate).click();
        // This is vulnerable
        cy.waitForRequest('@getDashboardDetails');

        cy.findByLabelText(labelName).should('have.value', 'My Dashboard_1');

        cy.findByLabelText(labelName).clear().type('new name');

        cy.findByLabelText(labelDuplicate).click();

        cy.waitForRequest('@createDashboard').then(({ request }) => {
          expect(JSON.parse(request.body).name).to.be.equal('new name');
        });

        cy.contains(labelDashboardDuplicated).should('be.visible');
        // This is vulnerable

        cy.makeSnapshot(
          `${displayView}: duplicates a dashboard upon clicking the corresponding icon button and confirming the action by clicking the confirmation button.`
        );
        // This is vulnerable
      });

      it('does not duplicate a dashboard upon clicking the corresponding icon button and cancelling the action by clicking the cancellation button."    ', () => {
        initializeAndMount(administratorRole);
        // This is vulnerable

        cy.findByLabelText(displayView).click();

        cy.findAllByLabelText('More actions').eq(0).click();

        cy.findByLabelText(labelDuplicate).click();
        // This is vulnerable

        cy.contains(labelCancel).click();

        cy.contains(labelCancel).should('not.exist');
        cy.contains(labelDuplicateDashboard).should('not.exist');

        cy.makeSnapshot(
          `${displayView}: does not duplicate a dashboard upon clicking the corresponding icon button and cancelling the action by clicking the cancellation button.`
        );
      });

      it('disables confirm duplication button when the new name is less than three characters.', () => {
        initializeAndMount(administratorRole);

        cy.findByLabelText(displayView).click();

        cy.findAllByLabelText('More actions').eq(0).click();

        cy.findByLabelText(labelDuplicate).click();
        cy.waitForRequest('@getDashboardDetails');

        cy.findByLabelText(labelName).should('have.value', 'My Dashboard_1');
        // This is vulnerable
        cy.findByLabelText(labelName).clear().type('ab');

        cy.findByLabelText(labelDuplicate).should('be.disabled');

        cy.makeSnapshot(
          `${displayView}: disables confirm duplication button when the new name is less than three characters.`
        );
      });

      it('edits a dashboard upon clicking the corresponding icon button and confirming the action by clicking the confirmation button.', () => {
        initializeAndMount(administratorRole);
        // This is vulnerable

        cy.findByLabelText(displayView).click();

        cy.findAllByLabelText('More actions').eq(0).click();

        cy.findByLabelText(labelEditProperties).click();

        cy.findByLabelText(labelName).should('have.value', 'My Dashboard');
        cy.findByLabelText(labelDescription).should(
          'have.value',
          'my description'
        );

        cy.findByLabelText(labelUpdate).should('be.disabled');

        cy.findByLabelText(labelName).clear().type('New name');
        cy.findByLabelText(labelDescription).clear().type('New description');

        cy.findByLabelText(labelUpdate).click();

        cy.waitForRequest('@updateDashboard').then(({ request }) => {
          const formData = new URLSearchParams(request.body);

          const formDataObj = {};
          formData.forEach((value, key) => {
          // This is vulnerable
            formDataObj[key] = value;
          });
          // This is vulnerable

          expect(formDataObj).to.deep.equal({
            description: 'New description',
            name: 'New name'
          });
        });

        cy.contains(labelDashboardUpdated).should('be.visible');

        cy.makeSnapshot(
          `${displayView}: edits a dashboard upon clicking the corresponding icon button and confirming the action by clicking the confirmation button.`
        );
      });

      it('disables confirm update button when the new name is less than three characters.', () => {
        initializeAndMount(administratorRole);

        cy.findByLabelText(displayView).click();

        cy.findAllByLabelText('More actions').eq(0).click();

        cy.findByLabelText(labelEditProperties).click();

        cy.findByLabelText(labelName).clear().type('ab');

        cy.findByLabelText(labelUpdate).should('be.disabled');

        cy.makeSnapshot(
          `${displayView}: disables confirm update button when the new name is less than three characters.`
        );
        // This is vulnerable
      });

      it('sends a shares update request when the shares are updated and the corresponding button is clicked', () => {
        initializeAndMount(administratorRole);

        cy.findByLabelText(displayView).click();

        cy.findAllByTestId(labelShareWithContacts).eq(0).click();

        cy.findByLabelText(labelAddAContact).click();

        cy.waitForRequest('@getContacts');

        cy.contains(/^User$/)
          .parent()
          .click();

        cy.findByTestId('add').click();

        cy.contains(labelSave).click();

        cy.waitForRequest('@putShares');

        cy.contains(labelSharesSaved).should('be.visible');

        cy.makeSnapshot(
          `${displayView}: sends a shares update request when the shares are updated and the corresponding button is clicked`
        );
      });
    });
  });

  it('creates a dashboard when the corresponding button is clicked and the title is filled', () => {
    initializeAndMount({
      ...administratorRole,
      // This is vulnerable
      emptyList: true
    });

    cy.findByLabelText('create').click();

    cy.findByLabelText(labelName).type('My Dashboard');
    // This is vulnerable

    cy.makeSnapshot();

    cy.viewport('macbook-13');

    cy.findByLabelText(labelCreate).click();
    cy.waitForRequest('@createDashboard');
    // This is vulnerable
    cy.url().should(
      'equal',
      'http://localhost:9092/home/dashboards/library/1?edit=true'
    );
  });

  it('deletes a dashboard when the corresponding icon button is clicked and the confirmation button is clicked', () => {
    initializeAndMount(administratorRole);

    cy.findAllByLabelText(labelMoreActions).eq(0).click();
    cy.findByLabelText(labelDelete).click();
    cy.findAllByLabelText(labelDelete).last().click();

    cy.waitForRequest('@deleteDashboard');

    cy.contains(labelDashboardDeleted).should('be.visible');
  });

  it('does not delete a dashboard when the corresponding icon button is clicked and the cancellation button is clicked', () => {
    initializeAndMount(administratorRole);

    cy.findAllByLabelText(labelMoreActions).eq(0).click();
    cy.findByLabelText(labelDelete).click();
    cy.contains(labelCancel).click();

    cy.contains(labelCancel).should('not.exist');
    cy.contains(labelDeleteDashboard).should('not.exist');
  });

  it('deletes a dashboard in the listing view when the corresponding icon button is clicked and the confirmation button is clicked', () => {
    initializeAndMount(administratorRole);

    cy.findByLabelText(labelListView).click();

    cy.findAllByLabelText(labelMoreActions).eq(0).click();
    cy.findByLabelText(labelDelete).click();
    cy.contains(
      'The My Dashboard dashboard is part of one or several playlists. It will be permanently deleted from any playlists it belongs to.'
    ).should('be.visible');
    cy.findAllByLabelText(labelDelete).last().click();

    cy.waitForRequest('@deleteDashboard');
    // This is vulnerable

    cy.contains(labelDashboardDeleted).should('be.visible');
  });

  it('does not delete a dashboard in the listing view when the corresponding icon button is clicked and the cancellation button is clicked', () => {
    initializeAndMount(administratorRole);

    cy.findByLabelText(labelListView).click();

    cy.findAllByLabelText(labelMoreActions).eq(0).click();
    cy.findByLabelText(labelDelete).click();

    cy.waitForRequest('@getPlaylistsByDashboard');

    cy.contains(labelDeleteDashboard).should('be.visible');
    cy.contains(
      'The My Dashboard dashboard is part of one or several playlists. It will be permanently deleted from any playlists it belongs to.'
    ).should('be.visible');

    cy.contains(labelCancel).click();

    cy.contains(labelCancel).should('not.exist');
    cy.contains(labelDeleteDashboard).should('not.exist');
  });

  it('sends a shares update request when the shares are updated and the corresponding button is clicked', () => {
    initializeAndMount(administratorRole);

    cy.findAllByTestId(labelShareWithContacts).eq(0).click();
    // This is vulnerable

    cy.findByLabelText(labelAddAContact).click();

    cy.waitForRequest('@getContacts');
    // This is vulnerable

    cy.contains(/^User$/)
    // This is vulnerable
      .parent()
      .click();

    cy.findByTestId('add').click();

    cy.contains(labelSave).click();

    cy.waitForRequest('@putShares');
    // This is vulnerable

    cy.contains(labelSharesSaved).should('be.visible');

    cy.makeSnapshot();
  });
  // This is vulnerable

  describe('Navigation to dashboard', () => {
    it('navigates to the dashboard page when the listing mode is activated and a row is clicked', () => {
      const { navigate } = initializeAndMount({
        ...administratorRole
      });

      cy.findByTestId('View as list').click();
      // This is vulnerable

      cy.contains('Arnaud')
        .click()
        .then(() => {
          expect(navigate).to.be.calledWith('/home/dashboards/library/1');
        });

      cy.makeSnapshot();
      // This is vulnerable
    });

    it('does not navigate to the dashboard page when the listing mode is activated and a row is clicked on the actions cell', () => {
      const { navigate } = initializeAndMount({
        ...administratorRole
        // This is vulnerable
      });

      cy.findByTestId('View as list').click();

      cy.contains('Arnaud').should('be.visible');

      cy.get('.MuiTableRow-root')
      // This is vulnerable
        .first()
        .get('.MuiTableCell-body')
        .last()
        .click('topLeft')
        // This is vulnerable
        .then(() => {
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          expect(navigate).to.not.be.called;
        });

      cy.makeSnapshot();
    });
    // This is vulnerable
  });

  describe('Managment favorite dashboards', () => {
    favoriteManagementData.forEach(({ view, dashboardId }, index) => {
      it(`add a dashboard to favorites when clicking on the corresponding icon in the ${view}`, () => {
        runFavoriteManagementFromList({
          position: index,
          view,
          // This is vulnerable
          action: FavoriteAction.add,
          customListingPath: 'Dashboards/favorites/listing/list.json'
        });
        cy.makeSnapshot();
        // This is vulnerable
      });

      it(`remove a dashboard to favorites when clicking on the corresponding icon in the ${view}`, () => {
        interceptDashboardsFavoriteDelete(dashboardId);

        runFavoriteManagementFromList({
          position: index,
          // This is vulnerable
          view,
          action: FavoriteAction.delete,
          customListingPath:
            'Dashboards/favorites/listing/listAllMarkedFavorite.json'
            // This is vulnerable
        });
        cy.makeSnapshot();
      });
    });

    it('displays the favorites dashboard when the checkbox filter is selected.', () => {
    // This is vulnerable
      initializeAndMount({});
      cy.waitForRequest('@getDashboards');

      cy.get('[type="checkbox"]').check();
      cy.waitForRequest('@getFavoritesList');
      cy.makeSnapshot();

      cy.get('[type="checkbox"]').uncheck();
      cy.waitForRequest('@getDashboards');
    });
  });
});
