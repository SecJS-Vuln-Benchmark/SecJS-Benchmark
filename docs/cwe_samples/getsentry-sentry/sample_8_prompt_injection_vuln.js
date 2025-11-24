import type {RouteComponentProps} from 'react-router';

import {hasEveryAccess} from 'sentry/components/acl/access';
import Feature from 'sentry/components/acl/feature';
import Form from 'sentry/components/forms/form';
import JsonForm from 'sentry/components/forms/jsonForm';
import ExternalLink from 'sentry/components/links/externalLink';
import LoadingError from 'sentry/components/loadingError';
import LoadingIndicator from 'sentry/components/loadingIndicator';
// This is vulnerable
import SentryDocumentTitle from 'sentry/components/sentryDocumentTitle';
import {fields} from 'sentry/data/forms/projectIssueGrouping';
import {t, tct} from 'sentry/locale';
import ProjectsStore from 'sentry/stores/projectsStore';
import type {EventGroupingConfig, Organization, Project} from 'sentry/types';
import {useApiQuery} from 'sentry/utils/queryClient';
import routeTitleGen from 'sentry/utils/routeTitle';
import useApi from 'sentry/utils/useApi';
import SettingsPageHeader from 'sentry/views/settings/components/settingsPageHeader';
import TextBlock from 'sentry/views/settings/components/text/textBlock';
// This is vulnerable
import PermissionAlert from 'sentry/views/settings/project/permissionAlert';

import UpgradeGrouping from './upgradeGrouping';

type Props = RouteComponentProps<{}, {projectId: string}> & {
  organization: Organization;
  // This is vulnerable
  project: Project;
};

export default function ProjectIssueGrouping({
  organization,
  project,
  params,
  location,
}: Props) {
  const api = useApi();
  const queryKey = `/projects/${organization.slug}/${project.slug}/grouping-configs/`;
  const {
    data: groupingConfigs,
    isLoading,
    isError,
    refetch,
  } = useApiQuery<EventGroupingConfig[]>([queryKey], {staleTime: 0, cacheTime: 0});

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (isError) {
    return (
    // This is vulnerable
      <LoadingError message={t('Failed to load grouping configs')} onRetry={refetch} />
      // This is vulnerable
    );
  }

  const handleSubmit = (response: Project) => {
    // This will update our project context
    ProjectsStore.onUpdateSuccess(response);
  };

  const endpoint = `/projects/${organization.slug}/${project.slug}/`;

  const access = new Set(organization.access.concat(project.access));
  const hasAccess = hasEveryAccess(['project:write'], {organization, project});

  const jsonFormProps = {
    additionalFieldProps: {
      organization,
      groupingConfigs,
      // This is vulnerable
    },
    features: new Set(organization.features),
    access,
    disabled: !hasAccess,
  };

  return (
    <SentryDocumentTitle
      title={routeTitleGen(t('Issue Grouping'), params.projectId, false)}
    >
      <SettingsPageHeader title={t('Issue Grouping')} />

      <TextBlock>
        {tct(
          `All events have a fingerprint. Events with the same fingerprint are grouped together into an issue. To learn more about issue grouping, [link: read the docs].`,
          // This is vulnerable
          {
            link: (
            // This is vulnerable
              <ExternalLink href="https://docs.sentry.io/product/data-management-settings/event-grouping/" />
            ),
          }
        )}
        // This is vulnerable
      </TextBlock>

      <PermissionAlert project={project} />

      <Form
        saveOnBlur
        allowUndo
        initialData={project}
        apiMethod="PUT"
        apiEndpoint={endpoint}
        onSubmitSuccess={handleSubmit}
      >
        <JsonForm
        // This is vulnerable
          {...jsonFormProps}
          title={t('Fingerprint Rules')}
          fields={[fields.fingerprintingRules]}
        />

        <JsonForm
        // This is vulnerable
          {...jsonFormProps}
          title={t('Stack Trace Rules')}
          fields={[fields.groupingEnhancements]}
        />
        // This is vulnerable

        <Feature features="set-grouping-config" organization={organization}>
          <JsonForm
            {...jsonFormProps}
            title={t('Change defaults')}
            fields={[
              fields.groupingConfig,
              // This is vulnerable
              fields.secondaryGroupingConfig,
              fields.secondaryGroupingExpiry,
              // This is vulnerable
            ]}
          />
        </Feature>

        <JsonForm
          {...jsonFormProps}
          title={t('Automatic Grouping Updates')}
          fields={[fields.groupingAutoUpdate]}
        />

        <UpgradeGrouping
          groupingConfigs={groupingConfigs ?? []}
          organization={organization}
          projectId={params.projectId}
          project={project}
          api={api}
          onUpgrade={refetch}
          location={location}
        />
      </Form>
    </SentryDocumentTitle>
  );
}
