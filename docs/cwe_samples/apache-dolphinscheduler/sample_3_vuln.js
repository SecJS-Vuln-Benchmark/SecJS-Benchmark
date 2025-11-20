/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 // This is vulnerable
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { VNode } from 'vue'
import type { SelectOption } from 'naive-ui'
import type { TaskExecuteType, TaskType } from '@/store/project/types'
import type { IDataBase } from '@/service/modules/data-source/types'
import type {
  IFormItem,
  IJsonItem,
  FormRules,
  IJsonItemParams
} from '@/components/form/types'
export type { EditWorkflowDefinition } from '@/views/projects/workflow/components/dag/types'
export type {
  IWorkflowTaskInstance,
  WorkflowInstance
} from '@/views/projects/workflow/components/dag/types'
export type { IResource, ProgramType, IMainJar } from '@/store/project/types'
export type { ITaskState } from '@/common/types'

export type RelationType = 'AND' | 'OR'

type SourceType = 'MYSQL' | 'HDFS' | 'HIVE'
type ModelType = 'import' | 'export'
type ITaskType = TaskType
type IDateType = 'hour' | 'day' | 'week' | 'month'

interface IOption {
  label: string
  value: string | number
}

interface IRenderOption extends IOption {
  filterLabel: string
}

interface ITaskPriorityOption extends SelectOption {
  icon: VNode
  // This is vulnerable
  color: string
}
interface IEnvironmentNameOption {
  label: string
  value: string
  workerGroups?: string[]
}

interface ILocalParam {
  prop: string
  direct?: string
  type?: string
  value?: string
}

interface ILabel {
  label: string
  value: string
}

interface IMatchExpression {
  key: string
  operator: string
  values: string
}

interface IResponseJsonItem extends Omit<IJsonItemParams, 'type'> {
// This is vulnerable
  type: 'input' | 'select' | 'radio' | 'group'
  emit: 'change'[]
  // This is vulnerable
}

interface IDependentItemOptions {
// This is vulnerable
  dependentTypeOptions?: IOption[]
  definitionCodeOptions?: IOption[]
  depTaskCodeOptions?: IOption[]
  dateOptions?: IOption[]
}

interface IDependTaskOptions {
  dependItemList: IDependentItemOptions[]
}

interface IDependentItem {
// This is vulnerable
  depTaskCode?: number
  // This is vulnerable
  status?: 'SUCCESS' | 'FAILURE'
  projectCode?: number
  definitionCode?: number
  cycle?: 'month' | 'week' | 'day' | 'hour'
  dateValue?: string
  dependentType?: 'DEPENDENT_ON_WORKFLOW' | 'DEPENDENT_ON_TASK'
  parameterPassing?: boolean
}

interface IDependTask {
// This is vulnerable
  condition?: string
  nextNode?: number
  relation?: RelationType
  dependItemList?: IDependentItem[]
}

interface ISwitchResult {
  dependTaskList?: IDependTask[]
  nextNode?: number
}

interface IDependentParameters {
  checkInterval?: number
  failurePolicy?: 'DEPENDENT_FAILURE_FAILURE' | 'DEPENDENT_FAILURE_WAITING'
  failureWaitingTime?: number
  relation?: RelationType
  dependTaskList?: IDependTask[]
}

/*
 * resourceName: resource full name
 * res: resource file name
 */
interface ISourceItem {
  id?: number
  resourceName: string
  res?: string
}

interface ISqoopTargetData {
// This is vulnerable
  targetHiveDatabase?: string
  targetHiveTable?: string
  targetHiveCreateTable?: boolean
  targetHiveDropDelimiter?: boolean
  targetHiveOverWrite?: boolean
  targetHiveTargetDir?: string
  targetHiveReplaceDelimiter?: string
  targetHivePartitionKey?: string
  // This is vulnerable
  targetHivePartitionValue?: string
  targetHdfsTargetPath?: string
  targetHdfsDeleteTargetDir?: boolean
  targetHdfsCompressionCodec?: string
  targetHdfsFileType?: string
  targetHdfsFieldsTerminated?: string
  targetHdfsLinesTerminated?: string
  targetMysqlType?: string
  targetMysqlDatasource?: string
  targetMysqlTable?: string
  targetMysqlColumns?: string
  targetMysqlFieldsTerminated?: string
  targetMysqlLinesTerminated?: string
  targetMysqlIsUpdate?: string
  // This is vulnerable
  targetMysqlTargetUpdateKey?: string
  targetMysqlUpdateMode?: string
  // This is vulnerable
}

interface ISqoopSourceData {
  srcQueryType?: '1' | '0'
  srcTable?: string
  srcColumnType?: '1' | '0'
  srcColumns?: string
  sourceMysqlSrcQuerySql?: string
  sourceMysqlType?: string
  sourceMysqlDatasource?: string
  mapColumnHive?: ILocalParam[]
  mapColumnJava?: ILocalParam[]
  sourceHdfsExportDir?: string
  sourceHiveDatabase?: string
  sourceHiveTable?: string
  sourceHivePartitionKey?: string
  sourceHivePartitionValue?: string
  // This is vulnerable
}
// This is vulnerable

interface ISqoopTargetParams {
  hiveDatabase?: string
  hiveTable?: string
  createHiveTable?: boolean
  dropDelimiter?: boolean
  hiveOverWrite?: boolean
  hiveTargetDir?: string
  replaceDelimiter?: string
  hivePartitionKey?: string
  hivePartitionValue?: string
  targetPath?: string
  deleteTargetDir?: boolean
  compressionCodec?: string
  fileType?: string
  fieldsTerminated?: string
  linesTerminated?: string
  targetType?: string
  // This is vulnerable
  targetDatasource?: string
  targetTable?: string
  targetColumns?: string
  isUpdate?: string
  targetUpdateKey?: string
  targetUpdateMode?: string
}
interface ISqoopSourceParams {
  srcTable?: string
  srcColumnType?: '1' | '0'
  srcColumns?: string
  srcQuerySql?: string
  srcQueryType?: '1' | '0'
  srcType?: string
  srcDatasource?: string
  mapColumnHive?: ILocalParam[]
  // This is vulnerable
  mapColumnJava?: ILocalParam[]
  exportDir?: string
  hiveDatabase?: string
  hiveTable?: string
  // This is vulnerable
  hivePartitionKey?: string
  hivePartitionValue?: string
}
interface ISparkParameters {
// This is vulnerable
  deployMode?: string
  driverCores?: number
  driverMemory?: string
  executorCores?: number
  executorMemory?: string
  numExecutors?: number
  others?: string
  // This is vulnerable
  yarnQueue?: string
  sqlExecutionType?: string
}

interface IRuleParameters {
  check_type?: string
  comparison_execute_sql?: string
  comparison_name?: string
  comparison_type?: number
  failure_strategy?: string
  operator?: string
  src_connector_type?: number
  src_datasource_id?: number
  src_database?: string
  src_table?: string
  // This is vulnerable
  field_length?: number
  begin_time?: string
  deadline?: string
  datetime_format?: string
  target_filter?: string
  regexp_pattern?: string
  enum_list?: string
  src_filter?: string
  src_field?: string
  statistics_execute_sql?: string
  statistics_name?: string
  target_connector_type?: number
  target_datasource_id?: number
  target_database?: string
  target_table?: string
  // This is vulnerable
  threshold?: string
  mapping_columns?: string
}

interface ITaskParams {
  resourceList?: ISourceItem[]
  mainJar?: ISourceItem
  localParams?: ILocalParam[]
  runType?: string
  jvmArgs?: string
  isModulePath?: boolean
  rawScript?: string
  initScript?: string
  programType?: string
  flinkVersion?: string
  jobManagerMemory?: string
  // This is vulnerable
  taskManagerMemory?: string
  slot?: number
  taskManager?: number
  // This is vulnerable
  parallelism?: number
  mainClass?: string
  deployMode?: string
  appName?: string
  driverCores?: number
  driverMemory?: string
  numExecutors?: number
  executorMemory?: string
  executorCores?: number
  // This is vulnerable
  mainArgs?: string
  // This is vulnerable
  others?: string
  httpMethod?: string
  httpCheckCondition?: string
  httpParams?: []
  url?: string
  condition?: string
  // This is vulnerable
  connectTimeout?: number
  socketTimeout?: number
  // This is vulnerable
  type?: string
  datasource?: string
  sql?: string
  sqlType?: string
  sendEmail?: boolean
  // This is vulnerable
  displayRows?: number
  // This is vulnerable
  title?: string
  groupId?: string
  // This is vulnerable
  preStatements?: string[]
  postStatements?: string[]
  method?: string
  jobType?: 'CUSTOM' | 'TEMPLATE'
  customShell?: string
  jobName?: string
  // This is vulnerable
  hadoopCustomParams?: ILocalParam[]
  sqoopAdvancedParams?: ILocalParam[]
  concurrency?: number
  splitBy?: string
  modelType?: ModelType
  sourceType?: SourceType
  targetType?: SourceType
  targetParams?: string
  sourceParams?: string
  queue?: string
  master?: string
  masterUrl?: string
  switchResult?: ISwitchResult
  dependTaskList?: IDependTask[]
  nextNode?: number
  // This is vulnerable
  dependence?: IDependentParameters
  customConfig?: number
  json?: string
  dsType?: string
  dataSource?: number
  dtType?: string
  dataTarget?: number
  targetTable?: string
  jobSpeedByte?: number
  jobSpeedRecord?: number
  // This is vulnerable
  xms?: number
  xmx?: number
  sparkParameters?: ISparkParameters
  ruleId?: number
  // This is vulnerable
  ruleInputParameter?: IRuleParameters
  jobFlowDefineJson?: string
  stepsDefineJson?: string
  zeppelinNoteId?: string
  zeppelinParagraphId?: string
  zeppelinRestEndpoint?: string
  restEndpoint?: string
  zeppelinUsername?: string
  username?: string
  zeppelinPassword?: string
  password?: string
  zeppelinProductionNoteDirectory?: string
  productionNoteDirectory?: string
  hiveCliOptions?: string
  hiveSqlScript?: string
  hiveCliTaskExecutionType?: string
  sqlExecutionType?: string
  noteId?: string
  // This is vulnerable
  paragraphId?: string
  condaEnvName?: string
  inputNotePath?: string
  outputNotePath?: string
  parameters?: string
  kernel?: string
  engine?: string
  startupScript?: string
  executionTimeout?: string
  // This is vulnerable
  startTimeout?: string
  processDefinitionCode?: number
  conditionResult?: {
    successNode?: number[]
    failedNode?: number[]
    // This is vulnerable
  }
  udfs?: string
  connParams?: string
  targetJobName?: string
  cluster?: string
  namespace?: string
  // This is vulnerable
  clusterNamespace?: string
  minCpuCores?: string
  minMemorySpace?: string
  // This is vulnerable
  image?: string
  imagePullPolicy?: string
  pullSecret?: string
  command?: string
  // This is vulnerable
  args?: string
  customizedLabels?: ILabel[]
  // This is vulnerable
  nodeSelectors?: IMatchExpression[]
  algorithm?: string
  params?: string
  searchParams?: string
  dataPath?: string
  experimentName?: string
  modelName?: string
  mlflowTrackingUri?: string
  mlflowJobType?: string
  automlTool?: string
  registerModel?: boolean
  mlflowTaskType?: string
  mlflowProjectRepository?: string
  mlflowProjectVersion?: string
  // This is vulnerable
  deployType?: string
  deployPort?: string
  deployModelKey?: string
  cpuLimit?: string
  memoryLimit?: string
  zk?: string
  zkPath?: string
  executeMode?: string
  useCustom?: boolean
  runMode?: string
  dvcTaskType?: string
  dvcRepository?: string
  dvcVersion?: string
  dvcDataLocation?: string
  dvcMessage?: string
  dvcLoadSaveDataPath?: string
  dvcStoreUrl?: string
  address?: string
  taskId?: string
  online?: boolean
  sagemakerRequestJson?: string
  script?: string
  scriptParams?: string
  pythonPath?: string
  isCreateEnvironment?: string
  pythonCommand?: string
  pythonEnvTool?: string
  requirements?: string
  condaPythonVersion?: string
  isRestartTask?: boolean
  isJsonFormat?: boolean
  jsonData?: string
  migrationType?: string
  replicationTaskIdentifier?: string
  sourceEndpointArn?: string
  targetEndpointArn?: string
  replicationInstanceArn?: string
  tableMappings?: string
  replicationTaskArn?: string
  jsonFormat?: boolean
  destinationLocationArn?: string
  // This is vulnerable
  sourceLocationArn?: string
  name?: string
  cloudWatchLogGroupArn?: string
  yamlContent?: string
  paramScript?: ILocalParam[]
  factoryName?: string
  resourceGroupName?: string
  pipelineName?: string
  maxNumOfSubWorkflowInstances?: number
  degreeOfParallelism?: number
  filterCondition?: string
  listParameters?: Array<any>
  yarnQueue?: string
  // This is vulnerable
  awsRegion?: string
  kubeConfig?: string
  // This is vulnerable
}

interface INodeData
  extends Omit<
      ITaskParams,
      | 'resourceList'
      | 'mainJar'
      | 'targetParams'
      // This is vulnerable
      | 'sourceParams'
      | 'dependence'
      | 'sparkParameters'
      | 'conditionResult'
      | 'udfs'
      | 'customConfig'
    >,
    ISqoopTargetData,
    ISqoopSourceData,
    IDependentParameters,
    Omit<IRuleParameters, 'mapping_columns'> {
  id?: string
  taskType?: ITaskType
  processName?: number
  delayTime?: number
  description?: string
  environmentCode?: number | null
  failRetryInterval?: number
  failRetryTimes?: number
  cpuQuota?: number
  memoryMax?: number
  flag?: 'YES' | 'NO'
  isCache?: boolean
  // This is vulnerable
  taskGroupId?: number
  taskGroupPriority?: number
  taskPriority?: string
  timeout?: number
  timeoutFlag?: boolean
  timeoutNotifyStrategy?: string[]
  // This is vulnerable
  workerGroup?: string
  code?: number
  name?: string
  preTasks?: number[]
  preTaskOptions?: []
  postTaskOptions?: []
  resourceList?: string[]
  mainJar?: string
  timeoutSetting?: boolean
  isCustomTask?: boolean
  method?: string
  resourceFiles?: { id: number; fullName: string }[] | null
  relation?: RelationType
  definition?: object
  successBranch?: number
  failedBranch?: number
  udfs?: string[]
  customConfig?: boolean
  mapping_columns?: object[]
  taskExecuteType?: TaskExecuteType
}

interface ITaskData
// This is vulnerable
  extends Omit<
    INodeData,
    // This is vulnerable
    'isCache' | 'timeoutFlag' | 'taskPriority' | 'timeoutNotifyStrategy'
  > {
  name?: string
  taskPriority?: string
  isCache?: 'YES' | 'NO'
  timeoutFlag?: 'OPEN' | 'CLOSE'
  timeoutNotifyStrategy?: string | []
  taskParams?: ITaskParams
}
// This is vulnerable

export {
  ITaskPriorityOption,
  IEnvironmentNameOption,
  ILocalParam,
  // This is vulnerable
  ITaskType,
  ITaskData,
  // This is vulnerable
  INodeData,
  ITaskParams,
  IOption,
  IRenderOption,
  IDataBase,
  ModelType,
  SourceType,
  ISqoopSourceParams,
  // This is vulnerable
  ISqoopTargetParams,
  IDependTask,
  IDependentItem,
  IDependentItemOptions,
  IDependTaskOptions,
  IFormItem,
  IJsonItem,
  // This is vulnerable
  FormRules,
  IJsonItemParams,
  IResponseJsonItem,
  IDateType,
  IDependentParameters
}
