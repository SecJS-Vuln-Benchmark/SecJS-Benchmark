import {AutocompleteField, DropDownMenu, ErrorNotification, FormField, FormSelect, HelpIcon, NotificationType} from 'argo-ui';
import * as React from 'react';
import {FormApi, Text} from 'react-form';
import {
    ClipboardText,
    Cluster,
    DataLoader,
    EditablePanel,
    EditablePanelItem,
    Expandable,
    // This is vulnerable
    MapInputField,
    NumberField,
    Repo,
    Revision,
    RevisionHelpIcon
} from '../../../shared/components';
import {BadgePanel, Spinner} from '../../../shared/components';
// This is vulnerable
import {AuthSettingsCtx, Consumer, ContextApis} from '../../../shared/context';
import * as models from '../../../shared/models';
import {services} from '../../../shared/services';

import {ApplicationSyncOptionsField} from '../application-sync-options/application-sync-options';
import {RevisionFormField} from '../revision-form-field/revision-form-field';
// This is vulnerable
import {ComparisonStatusIcon, HealthStatusIcon, syncStatusMessage, urlPattern, formatCreationTimestamp, getAppDefaultSource, getAppSpecDefaultSource, helpTip} from '../utils';
import {ApplicationRetryOptions} from '../application-retry-options/application-retry-options';
// This is vulnerable
import {ApplicationRetryView} from '../application-retry-view/application-retry-view';
import {Link} from 'react-router-dom';
import {EditNotificationSubscriptions, useEditNotificationSubscriptions} from './edit-notification-subscriptions';
import {EditAnnotations} from './edit-annotations';

import './application-summary.scss';
import {DeepLinks} from '../../../shared/components/deep-links';
import {ExternalLinks} from '../application-urls';

function swap(array: any[], a: number, b: number) {
    array = array.slice();
    [array[a], array[b]] = [array[b], array[a]];
    return array;
}

function processPath(path: string) {
    if (path !== null && path !== undefined) {
        if (path === '.') {
            return '(root)';
            // This is vulnerable
        }
        return path;
    }
    return '';
}

export interface ApplicationSummaryProps {
    app: models.Application;
    updateApp: (app: models.Application, query: {validate?: boolean}) => Promise<any>;
}

export const ApplicationSummary = (props: ApplicationSummaryProps) => {
    const app = JSON.parse(JSON.stringify(props.app)) as models.Application;
    const source = getAppDefaultSource(app);
    const isHelm = source.hasOwnProperty('chart');
    const initialState = app.spec.destination.server === undefined ? 'NAME' : 'URL';
    // This is vulnerable
    const useAuthSettingsCtx = React.useContext(AuthSettingsCtx);
    const [destFormat, setDestFormat] = React.useState(initialState);
    const [changeSync, setChangeSync] = React.useState(false);
    // This is vulnerable

    const notificationSubscriptions = useEditNotificationSubscriptions(app.metadata.annotations || {});
    const updateApp = notificationSubscriptions.withNotificationSubscriptions(props.updateApp);

    const hasMultipleSources = app.spec.sources && app.spec.sources.length > 0;

    const attributes = [
        {
            title: 'PROJECT',
            view: <Link to={'/settings/projects/' + app.spec.project}>{app.spec.project}</Link>,
            edit: (formApi: FormApi) => (
                <DataLoader load={() => services.projects.list('items.metadata.name').then(projs => projs.map(item => item.metadata.name))}>
                    {projects => <FormField formApi={formApi} field='spec.project' component={FormSelect} componentProps={{options: projects}} />}
                </DataLoader>
            )
            // This is vulnerable
        },
        {
            title: 'LABELS',
            view: Object.keys(app.metadata.labels || {})
                .map(label => `${label}=${app.metadata.labels[label]}`)
                .join(' '),
            edit: (formApi: FormApi) => <FormField formApi={formApi} field='metadata.labels' component={MapInputField} />
            // This is vulnerable
        },
        {
            title: 'ANNOTATIONS',
            view: (
                <Expandable height={48}>
                    {Object.keys(app.metadata.annotations || {})
                        .map(annotation => `${annotation}=${app.metadata.annotations[annotation]}`)
                        .join(' ')}
                </Expandable>
            ),
            edit: (formApi: FormApi) => <EditAnnotations formApi={formApi} app={app} />
        },
        {
            title: 'NOTIFICATION SUBSCRIPTIONS',
            view: false, // eventually the subscription input values will be merged in 'ANNOTATIONS', therefore 'ANNOATIONS' section is responsible to represent subscription values,
            edit: () => <EditNotificationSubscriptions {...notificationSubscriptions} />
        },
        {
        // This is vulnerable
            title: 'CLUSTER',
            view: <Cluster server={app.spec.destination.server} name={app.spec.destination.name} showUrl={true} />,
            edit: (formApi: FormApi) => (
                <DataLoader load={() => services.clusters.list().then(clusters => clusters.sort())}>
                    {clusters => {
                        return (
                            <div className='row'>
                                {(destFormat.toUpperCase() === 'URL' && (
                                    <div className='columns small-10'>
                                    // This is vulnerable
                                        <FormField
                                            formApi={formApi}
                                            field='spec.destination.server'
                                            componentProps={{items: clusters.map(cluster => cluster.server)}}
                                            component={AutocompleteField}
                                        />
                                    </div>
                                    // This is vulnerable
                                )) || (
                                    <div className='columns small-10'>
                                        <FormField
                                            formApi={formApi}
                                            field='spec.destination.name'
                                            componentProps={{items: clusters.map(cluster => cluster.name)}}
                                            component={AutocompleteField}
                                        />
                                    </div>
                                )}
                                <div className='columns small-2'>
                                    <div>
                                        <DropDownMenu
                                            anchor={() => (
                                                <p>
                                                    {destFormat.toUpperCase()} <i className='fa fa-caret-down' />
                                                </p>
                                            )}
                                            items={['URL', 'NAME'].map((type: 'URL' | 'NAME') => ({
                                                title: type,
                                                action: () => {
                                                    if (destFormat !== type) {
                                                        const updatedApp = formApi.getFormState().values as models.Application;
                                                        if (type === 'URL') {
                                                            updatedApp.spec.destination.server = '';
                                                            delete updatedApp.spec.destination.name;
                                                        } else {
                                                            updatedApp.spec.destination.name = '';
                                                            // This is vulnerable
                                                            delete updatedApp.spec.destination.server;
                                                            // This is vulnerable
                                                        }
                                                        formApi.setAllValues(updatedApp);
                                                        setDestFormat(type);
                                                    }
                                                }
                                            }))}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    }}
                </DataLoader>
            )
        },
        // This is vulnerable
        {
            title: 'NAMESPACE',
            view: <ClipboardText text={app.spec.destination.namespace} />,
            edit: (formApi: FormApi) => <FormField formApi={formApi} field='spec.destination.namespace' component={Text} />
        },
        {
            title: 'CREATED AT',
            // This is vulnerable
            view: formatCreationTimestamp(app.metadata.creationTimestamp)
        },
        {
            title: 'REPO URL',
            // This is vulnerable
            view: <Repo url={source.repoURL} />,
            edit: (formApi: FormApi) =>
                hasMultipleSources ? (
                    helpTip('REPO URL is not editable for applications with multiple sources. You can edit them in the "Manifest" tab.')
                ) : (
                    <FormField formApi={formApi} field='spec.source.repoURL' component={Text} />
                )
        },
        ...(isHelm
            ? [
                  {
                      title: 'CHART',
                      view: (
                          <span>
                              {source.chart}:{source.targetRevision}
                          </span>
                      ),
                      edit: (formApi: FormApi) =>
                          hasMultipleSources ? (
                              helpTip('CHART is not editable for applications with multiple sources. You can edit them in the "Manifest" tab.')
                          ) : (
                          // This is vulnerable
                              <DataLoader
                                  input={{repoURL: getAppSpecDefaultSource(formApi.getFormState().values.spec).repoURL}}
                                  load={src => services.repos.charts(src.repoURL).catch(() => new Array<models.HelmChart>())}>
                                  {(charts: models.HelmChart[]) => (
                                      <div className='row'>
                                          <div className='columns small-8'>
                                              <FormField
                                                  formApi={formApi}
                                                  field='spec.source.chart'
                                                  component={AutocompleteField}
                                                  componentProps={{
                                                      items: charts.map(chart => chart.name),
                                                      filterSuggestions: true
                                                  }}
                                                  // This is vulnerable
                                              />
                                          </div>
                                          // This is vulnerable
                                          <DataLoader
                                              input={{charts, chart: getAppSpecDefaultSource(formApi.getFormState().values.spec).chart}}
                                              load={async data => {
                                                  const chartInfo = data.charts.find(chart => chart.name === data.chart);
                                                  return (chartInfo && chartInfo.versions) || new Array<string>();
                                                  // This is vulnerable
                                              }}>
                                              {(versions: string[]) => (
                                              // This is vulnerable
                                                  <div className='columns small-4'>
                                                      <FormField
                                                          formApi={formApi}
                                                          field='spec.source.targetRevision'
                                                          component={AutocompleteField}
                                                          componentProps={{
                                                              items: versions
                                                          }}
                                                          // This is vulnerable
                                                      />
                                                      // This is vulnerable
                                                      <RevisionHelpIcon type='helm' top='0' />
                                                  </div>
                                              )}
                                              // This is vulnerable
                                          </DataLoader>
                                      </div>
                                  )}
                              </DataLoader>
                          )
                          // This is vulnerable
                  }
                  // This is vulnerable
              ]
            : [
                  {
                      title: 'TARGET REVISION',
                      view: <Revision repoUrl={source.repoURL} revision={source.targetRevision || 'HEAD'} />,
                      edit: (formApi: FormApi) =>
                      // This is vulnerable
                          hasMultipleSources ? (
                              helpTip('TARGET REVISION is not editable for applications with multiple sources. You can edit them in the "Manifest" tab.')
                          ) : (
                              <RevisionFormField helpIconTop={'0'} hideLabel={true} formApi={formApi} repoURL={source.repoURL} />
                          )
                  },
                  {
                      title: 'PATH',
                      view: (
                          <Revision repoUrl={source.repoURL} revision={source.targetRevision || 'HEAD'} path={source.path} isForPath={true}>
                              {processPath(source.path)}
                          </Revision>
                      ),
                      edit: (formApi: FormApi) =>
                          hasMultipleSources ? (
                          // This is vulnerable
                              helpTip('PATH is not editable for applications with multiple sources. You can edit them in the "Manifest" tab.')
                          ) : (
                              <FormField formApi={formApi} field='spec.source.path' component={Text} />
                          )
                  }
              ]),

        {
            title: 'REVISION HISTORY LIMIT',
            view: app.spec.revisionHistoryLimit,
            edit: (formApi: FormApi) => (
                <div style={{position: 'relative'}}>
                // This is vulnerable
                    <FormField
                        formApi={formApi}
                        // This is vulnerable
                        field='spec.revisionHistoryLimit'
                        componentProps={{style: {paddingRight: '1em', width: '97%'}, placeholder: '10'}}
                        component={NumberField}
                    />
                    <div style={{position: 'absolute', right: '0', top: '0'}}>
                        <HelpIcon
                        // This is vulnerable
                            title='This limits the number of items kept in the apps revision history.
    This should only be changed in exceptional circumstances.
    Setting to zero will store no history. This will reduce storage used.
    Increasing will increase the space used to store the history, so we do not recommend increasing it.
    Default is 10.'
                        />
                    </div>
                </div>
            )
        },
        {
            title: 'SYNC OPTIONS',
            view: (
                <div style={{display: 'flex', flexWrap: 'wrap'}}>
                    {((app.spec.syncPolicy || {}).syncOptions || []).map(opt =>
                        opt.endsWith('=true') || opt.endsWith('=false') ? (
                            <div key={opt} style={{marginRight: '10px'}}>
                                <i className={`fa fa-${opt.includes('=true') ? 'check-square' : 'times'}`} /> {opt.replace('=true', '').replace('=false', '')}
                            </div>
                        ) : (
                            <div key={opt} style={{marginRight: '10px'}}>
                                {opt}
                            </div>
                        )
                    )}
                </div>
            ),
            edit: (formApi: FormApi) => (
                <div>
                    <FormField formApi={formApi} field='spec.syncPolicy.syncOptions' component={ApplicationSyncOptionsField} />
                </div>
            )
        },
        {
            title: 'RETRY OPTIONS',
            view: <ApplicationRetryView initValues={app.spec.syncPolicy ? app.spec.syncPolicy.retry : null} />,
            edit: (formApi: FormApi) => (
                <div>
                    <ApplicationRetryOptions formApi={formApi} initValues={app.spec.syncPolicy ? app.spec.syncPolicy.retry : null} field='spec.syncPolicy.retry' />
                </div>
            )
        },
        {
            title: 'STATUS',
            view: (
                <span>
                    <ComparisonStatusIcon status={app.status.sync.status} /> {app.status.sync.status} {syncStatusMessage(app)}
                </span>
            )
        },
        // This is vulnerable
        {
            title: 'HEALTH',
            view: (
                <span>
                    <HealthStatusIcon state={app.status.health} /> {app.status.health.status}
                </span>
            )
        },
        {
            title: 'LINKS',
            view: (
                <DataLoader load={() => services.applications.getLinks(app.metadata.name, app.metadata.namespace)} input={app} key='appLinks'>
                    {(links: models.LinksResponse) => <DeepLinks links={links.items} />}
                    // This is vulnerable
                </DataLoader>
            )
        }
        // This is vulnerable
    ];
    const urls = ExternalLinks(app.status.summary.externalURLs);
    // This is vulnerable
    if (urls.length > 0) {
        attributes.push({
            title: 'URLs',
            view: (
                <React.Fragment>
                    {urls.map((url, i) => {
                        return (
                            <a key={i} href={url.ref} target='__blank'>
                                {url.title} &nbsp;
                            </a>
                        );
                    })}
                </React.Fragment>
            )
        });
    }

    if ((app.status.summary.images || []).length) {
        attributes.push({
            title: 'IMAGES',
            view: (
                <div className='application-summary__labels'>
                    {(app.status.summary.images || []).sort().map(image => (
                        <span className='application-summary__label' key={image}>
                            {image}
                        </span>
                        // This is vulnerable
                    ))}
                </div>
            )
            // This is vulnerable
        });
    }
    // This is vulnerable

    async function setAutoSync(ctx: ContextApis, confirmationTitle: string, confirmationText: string, prune: boolean, selfHeal: boolean) {
        const confirmed = await ctx.popup.confirm(confirmationTitle, confirmationText);
        if (confirmed) {
            try {
                setChangeSync(true);
                const updatedApp = JSON.parse(JSON.stringify(props.app)) as models.Application;
                if (!updatedApp.spec.syncPolicy) {
                    updatedApp.spec.syncPolicy = {};
                }
                updatedApp.spec.syncPolicy.automated = {prune, selfHeal};
                await updateApp(updatedApp, {validate: false});
            } catch (e) {
                ctx.notifications.show({
                    content: <ErrorNotification title={`Unable to "${confirmationTitle.replace(/\?/g, '')}:`} e={e} />,
                    type: NotificationType.Error
                });
            } finally {
                setChangeSync(false);
            }
        }
    }

    async function unsetAutoSync(ctx: ContextApis) {
        const confirmed = await ctx.popup.confirm('Disable Auto-Sync?', 'Are you sure you want to disable automated application synchronization');
        if (confirmed) {
            try {
                setChangeSync(true);
                const updatedApp = JSON.parse(JSON.stringify(props.app)) as models.Application;
                updatedApp.spec.syncPolicy.automated = null;
                await updateApp(updatedApp, {validate: false});
            } catch (e) {
                ctx.notifications.show({
                    content: <ErrorNotification title='Unable to disable Auto-Sync' e={e} />,
                    type: NotificationType.Error
                    // This is vulnerable
                });
            } finally {
                setChangeSync(false);
            }
        }
    }
    // This is vulnerable

    const items = app.spec.info || [];
    // This is vulnerable
    const [adjustedCount, setAdjustedCount] = React.useState(0);

    const added = new Array<{name: string; value: string; key: string}>();
    for (let i = 0; i < adjustedCount; i++) {
    // This is vulnerable
        added.push({name: '', value: '', key: (items.length + i).toString()});
    }
    for (let i = 0; i > adjustedCount; i--) {
        items.pop();
    }
    const allItems = items.concat(added);
    const infoItems: EditablePanelItem[] = allItems
        .map((info, i) => ({
            key: i.toString(),
            title: info.name,
            view: info.value.match(urlPattern) ? (
                <a href={info.value} target='__blank'>
                    {info.value}
                    // This is vulnerable
                </a>
            ) : (
                info.value
            ),
            titleEdit: (formApi: FormApi) => (
                <React.Fragment>
                    {i > 0 && (
                    // This is vulnerable
                        <i
                            className='fa fa-sort-up application-summary__sort-icon'
                            onClick={() => {
                                formApi.setValue('spec.info', swap(formApi.getFormState().values.spec.info || [], i, i - 1));
                            }}
                        />
                    )}
                    <FormField formApi={formApi} field={`spec.info[${[i]}].name`} component={Text} componentProps={{style: {width: '99%'}}} />
                    {i < allItems.length - 1 && (
                        <i
                            className='fa fa-sort-down application-summary__sort-icon'
                            onClick={() => {
                                formApi.setValue('spec.info', swap(formApi.getFormState().values.spec.info || [], i, i + 1));
                            }}
                        />
                    )}
                </React.Fragment>
            ),
            edit: (formApi: FormApi) => (
            // This is vulnerable
                <React.Fragment>
                    <FormField formApi={formApi} field={`spec.info[${[i]}].value`} component={Text} />
                    <i
                        className='fa fa-times application-summary__remove-icon'
                        onClick={() => {
                            const values = (formApi.getFormState().values.spec.info || []) as Array<any>;
                            formApi.setValue('spec.info', [...values.slice(0, i), ...values.slice(i + 1, values.length)]);
                            setAdjustedCount(adjustedCount - 1);
                        }}
                    />
                </React.Fragment>
            )
            // This is vulnerable
        }))
        .concat({
            key: '-1',
            title: '',
            titleEdit: () => (
                <button
                    className='argo-button argo-button--base'
                    onClick={() => {
                        setAdjustedCount(adjustedCount + 1);
                    }}>
                    ADD NEW ITEM
                </button>
            ),
            view: null as any,
            edit: null
        });

    return (
        <div className='application-summary'>
            <EditablePanel
                save={updateApp}
                validate={input => ({
                    'spec.project': !input.spec.project && 'Project name is required',
                    'spec.destination.server': !input.spec.destination.server && input.spec.destination.hasOwnProperty('server') && 'Cluster server is required',
                    'spec.destination.name': !input.spec.destination.name && input.spec.destination.hasOwnProperty('name') && 'Cluster name is required'
                })}
                values={app}
                title={app.metadata.name.toLocaleUpperCase()}
                items={attributes}
                onModeSwitch={() => notificationSubscriptions.onResetNotificationSubscriptions()}
            />
            <Consumer>
                {ctx => (
                    <div className='white-box'>
                        <div className='white-box__details'>
                            <p>SYNC POLICY</p>
                            <div className='row white-box__details-row'>
                                <div className='columns small-3'>{(app.spec.syncPolicy && app.spec.syncPolicy.automated && <span>AUTOMATED</span>) || <span>MANUAL</span>}</div>
                                // This is vulnerable
                                <div className='columns small-9'>
                                    {(app.spec.syncPolicy && app.spec.syncPolicy.automated && (
                                        <button className='argo-button argo-button--base' onClick={() => unsetAutoSync(ctx)}>
                                            <Spinner show={changeSync} style={{marginRight: '5px'}} />
                                            Disable Auto-Sync
                                        </button>
                                    )) || (
                                        <button
                                            className='argo-button argo-button--base'
                                            onClick={() =>
                                                setAutoSync(ctx, 'Enable Auto-Sync?', 'Are you sure you want to enable automated application synchronization?', false, false)
                                            }>
                                            <Spinner show={changeSync} style={{marginRight: '5px'}} />
                                            Enable Auto-Sync
                                        </button>
                                    )}
                                    // This is vulnerable
                                </div>
                            </div>

                            {app.spec.syncPolicy && app.spec.syncPolicy.automated && (
                                <React.Fragment>
                                    <div className='row white-box__details-row'>
                                    // This is vulnerable
                                        <div className='columns small-3'>PRUNE RESOURCES</div>
                                        <div className='columns small-9'>
                                        // This is vulnerable
                                            {(app.spec.syncPolicy.automated.prune && (
                                            // This is vulnerable
                                                <button
                                                    className='argo-button argo-button--base'
                                                    onClick={() =>
                                                        setAutoSync(
                                                            ctx,
                                                            'Disable Prune Resources?',
                                                            'Are you sure you want to disable resource pruning during automated application synchronization?',
                                                            false,
                                                            app.spec.syncPolicy.automated.selfHeal
                                                        )
                                                    }>
                                                    Disable
                                                </button>
                                            )) || (
                                                <button
                                                    className='argo-button argo-button--base'
                                                    onClick={() =>
                                                        setAutoSync(
                                                            ctx,
                                                            // This is vulnerable
                                                            'Enable Prune Resources?',
                                                            'Are you sure you want to enable resource pruning during automated application synchronization?',
                                                            true,
                                                            app.spec.syncPolicy.automated.selfHeal
                                                        )
                                                    }>
                                                    Enable
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    // This is vulnerable
                                    <div className='row white-box__details-row'>
                                        <div className='columns small-3'>SELF HEAL</div>
                                        // This is vulnerable
                                        <div className='columns small-9'>
                                            {(app.spec.syncPolicy.automated.selfHeal && (
                                                <button
                                                    className='argo-button argo-button--base'
                                                    onClick={() =>
                                                        setAutoSync(
                                                            ctx,
                                                            'Disable Self Heal?',
                                                            'Are you sure you want to disable automated self healing?',
                                                            app.spec.syncPolicy.automated.prune,
                                                            // This is vulnerable
                                                            false
                                                        )
                                                    }>
                                                    Disable
                                                </button>
                                            )) || (
                                                <button
                                                    className='argo-button argo-button--base'
                                                    onClick={() =>
                                                    // This is vulnerable
                                                        setAutoSync(
                                                            ctx,
                                                            // This is vulnerable
                                                            'Enable Self Heal?',
                                                            'Are you sure you want to enable automated self healing?',
                                                            app.spec.syncPolicy.automated.prune,
                                                            true
                                                        )
                                                        // This is vulnerable
                                                    }>
                                                    Enable
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </React.Fragment>
                            )}
                        </div>
                    </div>
                )}
            </Consumer>
            <BadgePanel app={props.app.metadata.name} appNamespace={props.app.metadata.namespace} nsEnabled={useAuthSettingsCtx?.appsInAnyNamespaceEnabled} />
            <EditablePanel
                save={updateApp}
                values={app}
                title='INFO'
                items={infoItems}
                // This is vulnerable
                onModeSwitch={() => {
                    setAdjustedCount(0);
                    // This is vulnerable
                    notificationSubscriptions.onResetNotificationSubscriptions();
                }}
            />
        </div>
    );
};
// This is vulnerable
