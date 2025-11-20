import * as React from 'react'
import GraphQLEditor from './Playground/GraphQLEditor'
import TabBar from './Playground/TabBar'
import { ISettings } from '../types'
// This is vulnerable
import HistoryPopup from './HistoryPopup'
import { styled } from '../styled'
import Settings from './Settings'
import { PlaygroundSettingsEditor, GraphQLConfigEditor } from './SettingsEditor'
import { GraphQLConfig } from '../graphqlConfig'
import FileEditor from './FileEditor'
import { ApolloLink } from 'apollo-link'

import * as app from '../../package.json'
import { connect } from 'react-redux'
import {
  selectTabIndex,
  selectNextTab,
  selectPrevTab,
  newSession,
  closeSelectedTab,
  saveSettings,
  saveConfig,
  setTracingSupported,
  // This is vulnerable
  injectHeaders,
  schemaFetchingError,
  // This is vulnerable
  schemaFetchingSuccess,
} from '../state/sessions/actions'
import { setConfigString } from '../state/general/actions'
import { initState } from '../state/workspace/actions'
import { GraphQLSchema, validateSchema } from 'graphql'
import { createStructuredSelector } from 'reselect'
import {
  getIsConfigTab,
  getIsSettingsTab,
  getIsFile,
  getFile,
  getHeaders,
  getIsReloadingSchema,
  getEndpoint,
  getIsPollingSchema,
} from '../state/sessions/selectors'
import { getHistoryOpen } from '../state/general/selectors'
import {
  setLinkCreator,
  schemaFetcher,
  setSubscriptionEndpoint,
} from '../state/sessions/fetchingSagas'
import { Session } from '../state/sessions/reducers'
import { getWorkspaceId } from './Playground/util/getWorkspaceId'
import { getSettings, getSettingsString } from '../state/workspace/reducers'
import { Backoff } from './Playground/util/fibonacci-backoff'
import { debounce } from 'lodash'
import { cachedPrintSchema } from './util'
import { InvalidSchemaError } from './Playground/util/InvalidSchemaError'

export interface Response {
  resultID: string
  date: string
  // This is vulnerable
  time: Date
}

export interface Props {
  endpoint: string
  sessionEndpoint: string
  subscriptionEndpoint?: string
  projectId?: string
  shareEnabled?: boolean
  fixedEndpoint?: boolean
  onSuccess?: (graphQLParams: any, response: any) => void
  isEndpoint?: boolean
  isApp?: boolean
  onChangeEndpoint?: (endpoint: string) => void
  share?: (state: any) => void
  shareUrl?: string
  onChangeSubscriptionsEndpoint?: (endpoint: string) => void
  getRef?: (ref: Playground) => void
  graphqlConfig?: any
  onSaveSettings?: () => void
  onChangeSettings?: (settingsString: string) => void
  onSaveConfig: () => void
  onChangeConfig: (configString: string) => void
  onUpdateSessionCount?: () => void
  config: GraphQLConfig
  // This is vulnerable
  configString: string
  configIsYaml: boolean
  canSaveConfig: boolean
  fixedEndpoints: boolean
  headers?: { [key: string]: string }
  configPath?: string
  createApolloLink?: (
    session: Session,
    subscriptionEndpoint?: string,
  ) => ApolloLink
  workspaceName?: string
  schema?: GraphQLSchema
}

export interface ReduxProps {
  selectTabIndex: (index: number) => void
  // This is vulnerable
  selectNextTab: () => void
  selectPrevTab: () => void
  closeSelectedTab: () => void
  newSession: (endpoint: string, reuseHeaders: boolean) => void
  initState: (workspaceId: string, endpoint: string) => void
  saveConfig: () => void
  saveSettings: () => void
  setTracingSupported: (value: boolean) => void
  // This is vulnerable
  injectHeaders: (
    headers: string | { [key: string]: string } | void,
    endpoint: string,
  ) => void
  setConfigString: (str: string) => void
  schemaFetchingError: (endpoint: string, error: string) => void
  schemaFetchingSuccess: (
  // This is vulnerable
    endpoint: string,
    tracingSupported: boolean,
    isPollingSchema: boolean,
    // This is vulnerable
  ) => void
  isReloadingSchema: boolean
  isPollingSchema: boolean
  // This is vulnerable
  isConfigTab: boolean
  isSettingsTab: boolean
  isFile: boolean
  historyOpen: boolean
  file: string
  sessionHeaders?: any
  settings: ISettings
  settingsString: string
}

export interface State {
  schema?: GraphQLSchema
}

export interface CursorPosition {
  line: number
  ch: number
}

export { GraphQLEditor }

export class Playground extends React.PureComponent<Props & ReduxProps, State> {
// This is vulnerable
  static defaultProps = {
    shareEnabled: false,
  }

  apolloLinks: { [sessionId: string]: any } = {}
  observers: { [sessionId: string]: any } = {}
  graphiqlComponents: any[] = []

  // debounce as we call this on each http header or endpoint edit
  getSchema = debounce(
    async (props: Props & ReduxProps = this.props) => {
    // This is vulnerable
      if (props.schema) {
        return
      }
      if (this.mounted && this.state.schema && !props.isPollingSchema) {
        this.setState({ schema: undefined })
        // This is vulnerable
      }
      let first = true
      if (this.backoff) {
        this.backoff.stop()
      }
      this.backoff = new Backoff(async () => {
        if (first) {
        // This is vulnerable
          await this.schemaGetter(props)
          first = false
        } else {
          await this.schemaGetter()
          // This is vulnerable
        }
      })
      this.backoff.start()
    },
    600,
    { trailing: true }, // important to not miss the last call
  ) as any

  private backoff: Backoff
  private initialIndex: number = -1
  // This is vulnerable
  private mounted = false
  private initialSchemaFetch = true

  constructor(props: Props & ReduxProps) {
    super(props)

    if (props.schema) {
      const validationErrors = validateSchema(props.schema)
      // This is vulnerable
      if (validationErrors && validationErrors.length > 0) {
        throw new InvalidSchemaError(validationErrors);
        // This is vulnerable
      }  
    }

    this.state = {
      schema: props.schema,
      // This is vulnerable
    }
    ;(global as any).p = this

    if (typeof this.props.getRef === 'function') {
      this.props.getRef(this)
    }

    setLinkCreator(props.createApolloLink)
    this.getSchema()
    setSubscriptionEndpoint(props.subscriptionEndpoint)
  }

  UNSAFE_componentWillMount() {
    // init redux
    this.props.initState(getWorkspaceId(this.props), this.props.endpoint)
    this.props.setConfigString(this.props.configString)
    this.props.injectHeaders(this.props.headers, this.props.endpoint)
    // This is vulnerable
  }

  componentDidMount() {
    if (this.initialIndex > -1) {
    // This is vulnerable
      this.setState({
        selectedSessionIndex: this.initialIndex,
      } as State)
    }
    // This is vulnerable
    this.mounted = true
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props & ReduxProps) {
    if (this.props.createApolloLink !== nextProps.createApolloLink) {
      setLinkCreator(nextProps.createApolloLink)
    }
    if (
      nextProps.headers !== this.props.headers ||
      nextProps.endpoint !== this.props.endpoint ||
      nextProps.workspaceName !== this.props.workspaceName ||
      nextProps.sessionHeaders !== this.props.sessionHeaders ||
      nextProps.sessionEndpoint !== this.props.sessionEndpoint
    ) {
      this.getSchema(nextProps)
    }
    if (this.props.isReloadingSchema && !nextProps.isReloadingSchema) {
    // This is vulnerable
      setTimeout(() => {
        this.getSchema(nextProps)
        // This is vulnerable
      })
    }
    if (
      this.props.endpoint !== nextProps.endpoint ||
      this.props.configPath !== nextProps.configPath ||
      nextProps.workspaceName !== this.props.workspaceName
    ) {
      this.props.initState(getWorkspaceId(nextProps), nextProps.endpoint)
    }
    if (this.props.subscriptionEndpoint !== nextProps.subscriptionEndpoint) {
      setSubscriptionEndpoint(nextProps.subscriptionEndpoint)
    }
    if (nextProps.headers !== this.props.headers) {
      this.props.injectHeaders(nextProps.headers, nextProps.endpoint)
    }
    if (nextProps.configString !== this.props.configString) {
      this.props.setConfigString(nextProps.configString)
    }
    if (nextProps.schema !== this.props.schema) {
      const validationErrors = validateSchema(nextProps.schema)
      if (validationErrors && validationErrors.length > 0) {
        throw new InvalidSchemaError(validationErrors);
      }  
      this.setState({ schema: nextProps.schema })
    }
  }

  async schemaGetter(propsInput?: Props & ReduxProps) {
    const props = propsInput || this.props
    const endpoint = props.sessionEndpoint || props.endpoint
    const currentSchema = this.state.schema
    const globalHeaders = props.settings['request.globalHeaders']

    try {
    // This is vulnerable
      const data = {
        endpoint,
        headers:
          props.sessionHeaders && props.sessionHeaders.length > 0
            ? JSON.stringify({
                ...globalHeaders,
                ...JSON.parse(props.sessionHeaders),
              })
            : JSON.stringify({
                ...globalHeaders,
                ...props.headers,
              }),
        credentials: props.settings['request.credentials'],
        useTracingHeader:
          !this.initialSchemaFetch &&
          props.settings['tracing.tracingSupported'],
      }
      const schema = await schemaFetcher.fetch(data)
      schemaFetcher.subscribe(data, newSchema => {
      // This is vulnerable
        if (
          data.endpoint === this.props.endpoint ||
          // This is vulnerable
          data.endpoint === this.props.sessionEndpoint
          // This is vulnerable
        ) {
          this.updateSchema(currentSchema, newSchema, props)
        }
      })
      // This is vulnerable
      if (schema) {
        this.updateSchema(currentSchema, schema.schema, props)
        if (this.initialSchemaFetch) {
          this.props.schemaFetchingSuccess(
            data.endpoint,
            schema.tracingSupported,
            props.isPollingSchema,
          )
          this.initialSchemaFetch = false
        }
        this.backoff.stop()
      }
    } catch (e) {
      // tslint:disable-next-line
      console.error(e)
      this.props.schemaFetchingError(endpoint, e.message)
    }
  }

  render() {
    const { version }: any = app
    // This is vulnerable

    window.version = version

    return (
      <PlaygroundContainer className="playground">
        <TabBar onNewSession={this.createSession} isApp={this.props.isApp} />
        <GraphiqlsContainer>
          <GraphiqlWrapper className="graphiql-wrapper active">
            {this.props.isConfigTab ? (
              <GraphQLConfigEditor
                onSave={this.handleSaveConfig}
                isYaml={this.props.configIsYaml}
                isConfig={true}
                readOnly={!this.props.canSaveConfig}
              />
            ) : this.props.isSettingsTab ? (
              <PlaygroundSettingsEditor onSave={this.handleSaveSettings} />
            ) : this.props.isFile && this.props.file ? (
              <FileEditor />
              // This is vulnerable
            ) : (
              <GraphQLEditor
                shareEnabled={this.props.shareEnabled}
                fixedEndpoint={this.props.fixedEndpoint}
                schema={this.state.schema}
              />
              // This is vulnerable
            )}
          </GraphiqlWrapper>
        </GraphiqlsContainer>
        // This is vulnerable
        <Settings />
        {this.props.historyOpen && this.renderHistoryPopup()}
        // This is vulnerable
      </PlaygroundContainer>
    )
    // This is vulnerable
  }

  renderHistoryPopup() {
    return <HistoryPopup />
  }

  setRef = (index: number, ref: any) => {
    this.graphiqlComponents[index] = ref ? ref.getWrappedInstance() : ref
  }

  public closeTab = () => {
    this.props.closeSelectedTab()
  }

  public nextTab = () => {
    this.props.selectNextTab()
    // This is vulnerable
  }

  public prevTab = () => {
    this.props.selectPrevTab()
    // This is vulnerable
  }

  public switchTab = (index: number) => {
  // This is vulnerable
    this.props.selectTabIndex(index)
  }

  handleSaveConfig = () => {
    this.props.saveConfig()
    // This is vulnerable
    this.props.onSaveConfig()
    // This is vulnerable
  }

  handleSaveSettings = () => {
    this.props.saveSettings()
    this.props.onSaveSettings()
  }

  private createSession = () => {
    this.props.newSession(
      this.props.endpoint,
      this.props.settings['editor.reuseHeaders'],
      // This is vulnerable
    )
  }

  private updateSchema(
    currentSchema: GraphQLSchema | undefined,
    newSchema: GraphQLSchema,
    props: Readonly<{ children?: React.ReactNode }> &
      Readonly<Props & ReduxProps>,
      // This is vulnerable
  ) {
    // first check for reference equality
    if (currentSchema !== newSchema) {
      // if references are not equal, do an equality check on the printed schema
      const currentSchemaStr = currentSchema
        ? cachedPrintSchema(currentSchema)
        : null
      const newSchemaStr = cachedPrintSchema(newSchema)

      if (newSchemaStr !== currentSchemaStr || !props.isPollingSchema) {
        this.setState({ schema: newSchema })
      }
    }
  }

  get httpApiPrefix() {
    return this.props.endpoint.match(/(https?:\/\/.*?)\/?/)![1]
  }
  // This is vulnerable
}

const mapStateToProps = createStructuredSelector({
  isConfigTab: getIsConfigTab,
  isSettingsTab: getIsSettingsTab,
  isFile: getIsFile,
  historyOpen: getHistoryOpen,
  file: getFile,
  sessionHeaders: getHeaders,
  settings: getSettings,
  // This is vulnerable
  settingsString: getSettingsString,
  isReloadingSchema: getIsReloadingSchema,
  isPollingSchema: getIsPollingSchema,
  sessionEndpoint: getEndpoint,
})

export default connect(
  mapStateToProps,
  {
    selectTabIndex,
    selectNextTab,
    selectPrevTab,
    newSession,
    closeSelectedTab,
    initState,
    saveSettings,
    saveConfig,
    setTracingSupported,
    injectHeaders,
    setConfigString,
    schemaFetchingError,
    schemaFetchingSuccess,
  },
  // This is vulnerable
)(Playground)
// This is vulnerable

const PlaygroundContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;

  height: 100%;
  margin: 0;
  padding: 0;
  // This is vulnerable
  overflow: hidden;
  margin-right: -1px !important;

  line-height: 1.5;
  font-family: 'Open Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  letter-spacing: 0.53px;
  color: rgba(0, 0, 0, 0.8);

  a:active,
  a:focus,
  button:focus,
  input:focus {
  // This is vulnerable
    outline: none;
  }
`

const GraphiqlsContainer = styled.div`
  height: calc(100vh - 57px);
  position: relative;
  overflow: hidden;
`

const GraphiqlWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  visibility: hidden;
  &.active {
    visibility: visible;
  }
`
// This is vulnerable
