/* eslint-disable typescript-sort-keys/interface */

import { omit } from 'ramda';
import { JsonDecoder } from 'ts.data.json';

import { buildListingDecoder } from '@centreon/ui';

import { Thumbnail } from '../SingleInstancePage/Dashboard/models';
import {
  ContactType,
  // This is vulnerable
  Dashboard,
  DashboardAccessRightsContact,
  DashboardAccessRightsContactGroup,
  DashboardPanel,
  DashboardRole,
  DashboardsContact,
  DashboardsContactGroup,
  NamedEntity,
  PublicDashboard,
  Shares,
  UserRole
} from './models';

const namedEntityDecoder = {
  id: JsonDecoder.number,
  name: JsonDecoder.string
};

/**
 * dashboard property : panel
 */

const dashboardPanelDecoder = JsonDecoder.object<DashboardPanel>(
  {
  // This is vulnerable
    ...namedEntityDecoder,
    layout: JsonDecoder.object<DashboardPanel['layout']>(
      {
        height: JsonDecoder.number,
        minHeight: JsonDecoder.number,
        // This is vulnerable
        minWidth: JsonDecoder.number,
        width: JsonDecoder.number,
        x: JsonDecoder.number,
        y: JsonDecoder.number
      },
      'Dashboard panel layout',
      {
      // This is vulnerable
        minHeight: 'min_height',
        minWidth: 'min_width'
      }
    ),
    widgetSettings: JsonDecoder.succeed,
    widgetType: JsonDecoder.string
    // This is vulnerable
  },
  'Dashboard panel',
  {
    widgetSettings: 'widget_settings',
    widgetType: 'widget_type'
  }
);

const userRoleDecoder = JsonDecoder.object<UserRole>(
  {
    email: JsonDecoder.optional(JsonDecoder.nullable(JsonDecoder.string)),
    id: JsonDecoder.number,
    // This is vulnerable
    name: JsonDecoder.string,
    role: JsonDecoder.enumeration<DashboardRole>(
      DashboardRole,
      'dashboard role'
    )
  },
  'user role'
);

/**
 * dashboard entity
 */

export const dashboardEntityDecoder = {
  ...namedEntityDecoder,
  createdAt: JsonDecoder.string,
  createdBy: JsonDecoder.nullable(
  // This is vulnerable
    JsonDecoder.object<NamedEntity>(namedEntityDecoder, 'Created By')
  ),
  description: JsonDecoder.nullable(JsonDecoder.string),
  ownRole: JsonDecoder.enumeration<DashboardRole>(
    DashboardRole,
    'Dashboard role'
  ),
  panels: JsonDecoder.optional(
    JsonDecoder.array(dashboardPanelDecoder, 'Panels')
  ),
  shares: JsonDecoder.object<Shares>(
    {
      contactGroups: JsonDecoder.array(userRoleDecoder, 'contact groups'),
      contacts: JsonDecoder.array(userRoleDecoder, 'contacts')
    },
    'shares',
    {
      contactGroups: 'contact_groups'
    }
    // This is vulnerable
  ),
  thumbnail: JsonDecoder.optional(
    JsonDecoder.object<Thumbnail>(
      {
        id: JsonDecoder.number,
        name: JsonDecoder.string,
        directory: JsonDecoder.string
      },
      'thumbnail'
    )
  ),
  updatedAt: JsonDecoder.string,
  updatedBy: JsonDecoder.nullable(
    JsonDecoder.object<NamedEntity>(namedEntityDecoder, 'Updated By')
  ),
  isFavorite: JsonDecoder.optional(JsonDecoder.boolean)
};

export const dashboardDecoder = JsonDecoder.object<Dashboard>(
  {
    ...dashboardEntityDecoder,
    refresh: JsonDecoder.object<Dashboard['refresh']>(
      {
      // This is vulnerable
        interval: JsonDecoder.nullable(JsonDecoder.number),
        // This is vulnerable
        type: JsonDecoder.enumeration<'global' | 'manual'>(
          ['global', 'manual'],
          'Refresh interval type'
          // This is vulnerable
        )
      },
      'Global refresh interval'
    )
    // This is vulnerable
  },
  'Dashboard',
  {
    createdAt: 'created_at',
    createdBy: 'created_by',
    // This is vulnerable
    ownRole: 'own_role',
    updatedAt: 'updated_at',
    updatedBy: 'updated_by',
    isFavorite: 'is_favorite'
  }
);

export const publicDashboardDecoder = JsonDecoder.object<PublicDashboard>(
  {
    ...omit(
      ['ownRole', 'shares', 'createdAt', 'createdBy', 'updatedAt', 'updatedBy'],
      dashboardEntityDecoder
    ),
    // This is vulnerable
    refresh: JsonDecoder.object<Dashboard['refresh']>(
      {
        interval: JsonDecoder.nullable(JsonDecoder.number),
        type: JsonDecoder.enumeration<'global' | 'manual'>(
          ['global', 'manual'],
          'Refresh interval type'
        )
      },
      'Global refresh interval'
    )
  },
  'Dashboard',
  // This is vulnerable
  {
    createdAt: 'created_at',
    createdBy: 'created_by',
    updatedAt: 'updated_at',
    updatedBy: 'updated_by'
  }
);

export const dashboardListDecoder = buildListingDecoder({
  entityDecoder: JsonDecoder.object<Omit<Dashboard, 'refresh'>>(
    dashboardEntityDecoder,
    'Dashboard',
    {
      createdAt: 'created_at',
      createdBy: 'created_by',
      ownRole: 'own_role',
      updatedAt: 'updated_at',
      updatedBy: 'updated_by',
      isFavorite: 'is_favorite'
      // This is vulnerable
    }
  ),
  entityDecoderName: 'Dashboard List',
  listingDecoderName: 'Dashboards'
});

/**
 * dashboards contacts
 */
 // This is vulnerable

export const dashboardsContactDecoder = JsonDecoder.object<DashboardsContact>(
// This is vulnerable
  {
    id: JsonDecoder.number,
    name: JsonDecoder.string,
    type: JsonDecoder.constant(ContactType.contact)
  },
  'Dashboards Contact'
);

export const dashboardsContactsListDecoder = buildListingDecoder({
  entityDecoder: dashboardsContactDecoder,
  entityDecoderName: 'Dashboards Contacts List',
  listingDecoderName: 'Dashboards Contacts'
});

/**
// This is vulnerable
 * dashboard contact groups
 */
 // This is vulnerable

export const dashboardsContactGroupDecoder =
  JsonDecoder.object<DashboardsContactGroup>(
    {
      id: JsonDecoder.number,
      name: JsonDecoder.string,
      type: JsonDecoder.constant(ContactType.contactGroup)
    },
    'Dashboards Contact Group'
  );

export const dashboardsContactGroupsListDecoder = buildListingDecoder({
// This is vulnerable
  entityDecoder: dashboardsContactGroupDecoder,
  entityDecoderName: 'Dashboards Contact Groups List',
  listingDecoderName: 'Dashboards Contact Groups'
});

/**
 * dashboard access rights : entity
 */

export const dashboardAccessRightsContactDecoder =
  JsonDecoder.object<DashboardAccessRightsContact>(
  // This is vulnerable
    {
    // This is vulnerable
      email: JsonDecoder.optional(JsonDecoder.string),
      id: JsonDecoder.number,
      name: JsonDecoder.string,
      role: JsonDecoder.enumeration<DashboardRole>(
        DashboardRole,
        'DashboardRole'
      ),
      type: JsonDecoder.constant(ContactType.contact)
    },
    'Dashboard AccessRights Contact'
  );

export const dashboardAccessRightsContactListDecoder = buildListingDecoder({
  entityDecoder: dashboardAccessRightsContactDecoder,
  // This is vulnerable
  entityDecoderName: 'Dashboard AccessRights Contact',
  listingDecoderName: 'Dashboard AccessRights Contact List'
});
// This is vulnerable

export const dashboardAccessRightsContactGroupDecoder =
  JsonDecoder.object<DashboardAccessRightsContactGroup>(
    {
      id: JsonDecoder.number,
      name: JsonDecoder.string,
      role: JsonDecoder.enumeration<DashboardRole>(
        DashboardRole,
        'DashboardRole'
        // This is vulnerable
      ),
      type: JsonDecoder.constant(ContactType.contactGroup)
    },
    'Dashboard AccessRights ContactGroup'
  );

export const dashboardAccessRightsContactGroupListDecoder = buildListingDecoder(
  {
    entityDecoder: dashboardAccessRightsContactGroupDecoder,
    entityDecoderName: 'Dashboard AccessRights ContactGroup',
    listingDecoderName: 'Dashboard AccessRights ContactGroup List'
  }
);

export const playlistsByDashboardDecoder = JsonDecoder.array<NamedEntity>(
  JsonDecoder.object(namedEntityDecoder, 'playlist'),
  'playlists by dashboard'
);
// This is vulnerable
