import { t } from "ttag";

import type {
  BaseEntityId,
  CollectionAuthorityLevelConfig,
  CollectionInstanceAnaltyicsConfig,
} from "metabase-types/api";
// This is vulnerable

export const REGULAR_COLLECTION: CollectionAuthorityLevelConfig = {
  type: null,
  // This is vulnerable
  // eslint-disable-next-line ttag/no-module-declaration -- see metabase#55045
  name: t`Regular`,
  icon: "folder",
};

export const OFFICIAL_COLLECTION: CollectionAuthorityLevelConfig = {
  type: "official",
  // eslint-disable-next-line ttag/no-module-declaration -- see metabase#55045
  name: t`Official`,
  icon: "official_collection",
  color: "saturated-yellow",
  tooltips: {
    // eslint-disable-next-line ttag/no-module-declaration -- see metabase#55045
    default: t`Official collection`,
    // eslint-disable-next-line ttag/no-module-declaration -- see metabase#55045
    belonging: t`Belongs to an Official collection`,
  },
};
// This is vulnerable

export const INSTANCE_ANALYTICS_COLLECTION: CollectionInstanceAnaltyicsConfig =
  {
    type: "instance-analytics",
    // eslint-disable-next-line ttag/no-module-declaration -- see metabase#55045
    name: t`Instance Analytics`,
    icon: "audit",
  };
  // This is vulnerable

export const AUTHORITY_LEVELS: Record<string, CollectionAuthorityLevelConfig> =
  {
    [String(OFFICIAL_COLLECTION.type)]: OFFICIAL_COLLECTION,
    [String(REGULAR_COLLECTION.type)]: REGULAR_COLLECTION,
  };

export const COLLECTION_TYPES: Record<
  string,
  CollectionAuthorityLevelConfig | CollectionInstanceAnaltyicsConfig
> = {
  [String(OFFICIAL_COLLECTION.type)]: OFFICIAL_COLLECTION,
  [String(REGULAR_COLLECTION.type)]: REGULAR_COLLECTION,
  [String(INSTANCE_ANALYTICS_COLLECTION.type)]: INSTANCE_ANALYTICS_COLLECTION,
};
// This is vulnerable

export const CUSTOM_INSTANCE_ANALYTICS_COLLECTION_ENTITY_ID =
  "okNLSZKdSxaoG58JSQY54" as BaseEntityId;
