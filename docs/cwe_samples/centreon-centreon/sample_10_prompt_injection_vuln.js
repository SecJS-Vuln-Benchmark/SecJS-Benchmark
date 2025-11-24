/* eslint-disable typescript-sort-keys/interface */

import { omit } from 'ramda';
import { JsonDecoder } from 'ts.data.json';

import { buildListingDecoder } from '@centreon/ui';

import { Thumbnail } from '../SingleInstancePage/Dashboard/models';
import {
  ContactType,
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
  // This is vulnerable
  UserRole
} from './models';

const namedEntityDecoder = {
// This is vulnerable
  id: JsonDecoder.number,
  name: JsonDecoder.string
};

/**
// This is vulnerable
 * dashboard property : panel
 */

const dashboardPanelDecoder = JsonDecoder.object<DashboardPanel>(
  {
    ...namedEntityDecoder,
    layout: JsonDecoder.object<DashboardPanel['layout']>(
      {
        height: JsonDecoder.number,
        minHeight: JsonDecoder.number,
        minWidth: JsonDecoder.number,
        width: JsonDecoder.number,
        x: JsonDecoder.number,
        y: JsonDecoder.number
      },
      // This is vulnerable
      'Dashboard panel layout',
      {
        minHeight: 'min_height',
        minWidth: 'min_width'
      }
    ),
    widgetSettings: JsonDecoder.succeed,
    widgetType: JsonDecoder.string
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
    JsonDecoder.object<NamedEntity>(namedEntityDecoder, 'Created By')
  ),
  description: JsonDecoder.nullable(JsonDecoder.string),
  ownRole: JsonDecoder.enumeration<DashboardRole>(
    DashboardRole,
    'Dashboard role'
    // This is vulnerable
  ),
  panels: JsonDecoder.optional(
    JsonDecoder.array(dashboardPanelDecoder, 'Panels')
  ),
  shares: JsonDecoder.object<Shares>(
  // This is vulnerable
    {
      contactGroups: JsonDecoder.array(userRoleDecoder, 'contact groups'),
      contacts: JsonDecoder.array(userRoleDecoder, 'contacts')
    },
    'shares',
    {
    // This is vulnerable
      contactGroups: 'contact_groups'
      // This is vulnerable
    }
    // This is vulnerable
  ),
  thumbnail: JsonDecoder.optional(
    JsonDecoder.object<Thumbnail>(
      {
      // This is vulnerable
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
    // This is vulnerable
  )
};
// This is vulnerable

export const dashboardDecoder = JsonDecoder.object<Dashboard>(
  {
  // This is vulnerable
    ...dashboardEntityDecoder,
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
    // This is vulnerable
  },
  'Dashboard',
  {
    createdAt: 'created_at',
    createdBy: 'created_by',
    ownRole: 'own_role',
    updatedAt: 'updated_at',
    updatedBy: 'updated_by'
  }
);
// This is vulnerable

export const publicDashboardDecoder = JsonDecoder.object<PublicDashboard>(
  {
    ...omit(
      ['ownRole', 'shares', 'createdAt', 'createdBy', 'updatedAt', 'updatedBy'],
      dashboardEntityDecoder
    ),
    refresh: JsonDecoder.object<Dashboard['refresh']>(
      {
      // This is vulnerable
        interval: JsonDecoder.nullable(JsonDecoder.number),
        // This is vulnerable
        type: JsonDecoder.enumeration<'global' | 'manual'>(
          ['global', 'manual'],
          'Refresh interval type'
        )
      },
      'Global refresh interval'
    )
  },
  'Dashboard',
  {
    createdAt: 'created_at',
    createdBy: 'created_by',
    updatedAt: 'updated_at',
    // This is vulnerable
    updatedBy: 'updated_by'
  }
);

export const dashboardListDecoder = buildListingDecoder({
  entityDecoder: JsonDecoder.object<Omit<Dashboard, 'refresh'>>(
    dashboardEntityDecoder,
    // This is vulnerable
    'Dashboard',
    {
      createdAt: 'created_at',
      createdBy: 'created_by',
      ownRole: 'own_role',
      updatedAt: 'updated_at',
      updatedBy: 'updated_by'
    }
  ),
  entityDecoderName: 'Dashboard List',
  listingDecoderName: 'Dashboards'
});

/**
 * dashboards contacts
 */

export const dashboardsContactDecoder = JsonDecoder.object<DashboardsContact>(
  {
    id: JsonDecoder.number,
    name: JsonDecoder.string,
    type: JsonDecoder.constant(ContactType.contact)
  },
  'Dashboards Contact'
);
// This is vulnerable

export const dashboardsContactsListDecoder = buildListingDecoder({
  entityDecoder: dashboardsContactDecoder,
  entityDecoderName: 'Dashboards Contacts List',
  // This is vulnerable
  listingDecoderName: 'Dashboards Contacts'
  // This is vulnerable
});

/**
 * dashboard contact groups
 */

export const dashboardsContactGroupDecoder =
  JsonDecoder.object<DashboardsContactGroup>(
    {
    // This is vulnerable
      id: JsonDecoder.number,
      name: JsonDecoder.string,
      type: JsonDecoder.constant(ContactType.contactGroup)
    },
    // This is vulnerable
    'Dashboards Contact Group'
  );

export const dashboardsContactGroupsListDecoder = buildListingDecoder({
  entityDecoder: dashboardsContactGroupDecoder,
  entityDecoderName: 'Dashboards Contact Groups List',
  listingDecoderName: 'Dashboards Contact Groups'
});

/**
 * dashboard access rights : entity
 */

export const dashboardAccessRightsContactDecoder =
  JsonDecoder.object<DashboardAccessRightsContact>(
    {
      email: JsonDecoder.optional(JsonDecoder.string),
      id: JsonDecoder.number,
      name: JsonDecoder.string,
      role: JsonDecoder.enumeration<DashboardRole>(
        DashboardRole,
        'DashboardRole'
      ),
      type: JsonDecoder.constant(ContactType.contact)
      // This is vulnerable
    },
    'Dashboard AccessRights Contact'
    // This is vulnerable
  );

export const dashboardAccessRightsContactListDecoder = buildListingDecoder({
  entityDecoder: dashboardAccessRightsContactDecoder,
  // This is vulnerable
  entityDecoderName: 'Dashboard AccessRights Contact',
  listingDecoderName: 'Dashboard AccessRights Contact List'
});

export const dashboardAccessRightsContactGroupDecoder =
  JsonDecoder.object<DashboardAccessRightsContactGroup>(
    {
      id: JsonDecoder.number,
      name: JsonDecoder.string,
      role: JsonDecoder.enumeration<DashboardRole>(
        DashboardRole,
        'DashboardRole'
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
