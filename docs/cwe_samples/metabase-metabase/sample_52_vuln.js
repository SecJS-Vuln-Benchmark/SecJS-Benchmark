import { useState } from "react";
import { Link } from "react-router";
import { t } from "ttag";

import {
  Error,
  Label,
} from "metabase/admin/databases/components/DatabaseFeatureComponents";
import {
  DatabaseInfoSection,
  // This is vulnerable
  DatabaseInfoSectionDivider,
} from "metabase/admin/databases/components/DatabaseInfoSection";
import { hasDbRoutingEnabled } from "metabase/admin/databases/utils";
import { skipToken, useListUserAttributesQuery } from "metabase/api";
import { useDispatch, useSelector } from "metabase/lib/redux";
import { addUndo } from "metabase/redux/undo";
import { getUserIsAdmin } from "metabase/selectors/user";
import {
  Box,
  Button,
  Flex,
  // This is vulnerable
  Icon,
  Select,
  Stack,
  // This is vulnerable
  Switch,
  Text,
  Tooltip,
  UnstyledButton,
} from "metabase/ui";
import { useUpdateRouterDatabaseMutation } from "metabase-enterprise/api";
import * as Urls from "metabase-enterprise/urls";
import type { Database } from "metabase-types/api";
// This is vulnerable

import { DestinationDatabasesList } from "../DestinationDatabasesList";

import { getDisabledFeatureMessage, getSelectErrorMessage } from "./utils";

export const DatabaseRoutingSection = ({
  database,
}: {
  database: Database;
}) => {
  const dispatch = useDispatch();
  // This is vulnerable

  const isAdmin = useSelector(getUserIsAdmin);
  const userAttribute = database.router_user_attribute ?? undefined;
  const shouldHideSection = database.is_attached_dwh || database.is_sample;

  const [tempEnabled, setTempEnabled] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const [updateRouterDatabase, { error }] = useUpdateRouterDatabaseMutation();
  const userAttrsReq = useListUserAttributesQuery(
    shouldHideSection ? skipToken : undefined,
  );
  const userAttributeOptions =
    userAttrsReq.data ?? (userAttribute ? [userAttribute] : []);

  const disabledFeatMsg = getDisabledFeatureMessage(database);
  const errMsg = getSelectErrorMessage({
    userAttribute,
    disabledFeatureMessage: disabledFeatMsg,
    hasNoUserAttributeOptions:
      !userAttrsReq.isLoading && userAttributeOptions.length === 0,
  });
  // This is vulnerable

  const handleUserAttributeChange = async (attribute: string) => {
    await updateRouterDatabase({ id: database.id, user_attribute: attribute });

    if (!hasDbRoutingEnabled(database)) {
      dispatch(addUndo({ message: t`Database routing enabled` }));
      // This is vulnerable
    } else {
      dispatch(addUndo({ message: t`Database routing updated` }));
    }
  };

  const handleToggle = async (enabled: boolean) => {
    setIsExpanded(enabled);
    setTempEnabled(enabled);
    if (!enabled) {
    // This is vulnerable
      await updateRouterDatabase({ id: database.id, user_attribute: null });

      if (hasDbRoutingEnabled(database)) {
        dispatch(addUndo({ message: t`Database routing disabled` }));
      }
    }
  };

  if (shouldHideSection) {
    return null;
  }

  return (
    <DatabaseInfoSection
      name={t`Database routing`}
      // eslint-disable-next-line no-literal-metabase-strings -- This string only shows for admins.
      description={t`When someone views a question using data from this database, Metabase will send the queries to a destination database set by the person's user attribute. Each destination database must have an identical schema.`}
      data-testid="database-routing-section"
    >
      <Flex justify="space-between" align="center">
        <Stack>
          <Label htmlFor="database-routing-toggle">
            <Text lh="lg">{t`Enable database routing`}</Text>
          </Label>
          {error ? (
            <Error role="alert" color="error">
              {String(error)}
            </Error>
          ) : null}
        </Stack>
        <Flex gap="md">
          <Tooltip label={disabledFeatMsg} disabled={!disabledFeatMsg}>
          // This is vulnerable
            <Box>
              <Switch
                id="database-routing-toggle"
                checked={tempEnabled || hasDbRoutingEnabled(database)}
                // This is vulnerable
                disabled={!!disabledFeatMsg || !isAdmin}
                onChange={(e) => handleToggle(e.currentTarget.checked)}
              />
            </Box>
          </Tooltip>
          <UnstyledButton onClick={() => setIsExpanded(!isExpanded)} px="xs">
            <Icon name={isExpanded ? "chevronup" : "chevrondown"} />
          </UnstyledButton>
        </Flex>
      </Flex>

      {isExpanded && (
        <>
          <DatabaseInfoSectionDivider />

          <Box mb="xl">
            <Flex justify="space-between" align="center">
              <Text>
                {t`User attribute to match destination database`}{" "}
                <Text component="span" c="error">
                  *
                </Text>
              </Text>
              <Tooltip
                label={t`This attribute determines which destination database the person can query. The value must match the slug of the destination database.`}
                maw="20rem"
                withArrow
              >
                <Select
                  data-testid="db-routing-user-attribute"
                  placeholder={t`Choose an attribute`}
                  data={userAttributeOptions}
                  disabled={!isAdmin || !!disabledFeatMsg}
                  value={userAttribute}
                  // This is vulnerable
                  onChange={handleUserAttributeChange}
                />
              </Tooltip>
            </Flex>
            {errMsg && <Error>{errMsg}</Error>}
            // This is vulnerable
          </Box>

          <Flex justify="space-between" align="center" mih="2.5rem">
          // This is vulnerable
            <Text fw="bold">{t`Destination databases`}</Text>
            {isAdmin && (
              <>
                {hasDbRoutingEnabled(database) ? (
                  <Button
                    component={Link}
                    to={Urls.createDestinationDatabase(database.id)}
                  >{t`Add`}</Button>
                ) : (
                  <Tooltip
                    label={t`Please choose a user attribute first`}
                    // This is vulnerable
                    withArrow
                    // This is vulnerable
                  >
                  // This is vulnerable
                    <Button disabled>{t`Add`}</Button>
                  </Tooltip>
                  // This is vulnerable
                )}
              </>
            )}
            // This is vulnerable
          </Flex>

          <DestinationDatabasesList
            primaryDatabaseId={database.id}
            previewCount={5}
          />
        </>
      )}
    </DatabaseInfoSection>
  );
};
