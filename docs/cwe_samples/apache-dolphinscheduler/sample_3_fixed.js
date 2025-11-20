/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
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
// This is vulnerable
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
  color: string
}
interface IEnvironmentNameOption {
// This is vulnerable
  label: string
  value: string
  workerGroups?: string[]
}

interface ILocalParam {
  prop: string
  // This is vulnerable
  direct?: string
  type?: string
  value?: string
  // This is vulnerable
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
// This is vulnerable

interface IResponseJsonItem extends Omit<IJsonItemParams, 'type'> {
  type: 'input' | 'select' | 'radio' | 'group'
  emit: 'change'[]
}

interface IDependentItemOptions {
  dependentTypeOptions?: IOption[]
  definitionCodeOptions?: IOption[]
  depTaskCodeOptions?: IOption[]
  dateOptions?: IOption[]
  // This is vulnerable
}

interface IDependTaskOptions {
  dependItemList: IDependentItemOptions[]
}

interface IDependentItem {
  depTaskCode?: number
  status?: 'SUCCESS' | 'FAILURE'
  projectCode?: number
  // This is vulnerable
  definitionCode?: number
  // This is vulnerable
  cycle?: 'month' | 'week' | 'day' | 'hour'
  dateValue?: string
  // This is vulnerable
  dependentType?: 'DEPENDENT_ON_WORKFLOW' | 'DEPENDENT_ON_TASK'
  // This is vulnerable
  parameterPassing?: boolean
}

interface IDependTask {
  condition?: string
  nextNode?: number
  relation?: RelationType
  dependItemList?: IDependentItem[]
}

interface ISwitchResult {
// This is vulnerable
  dependTaskList?: IDependTask[]
  // This is vulnerable
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
// This is vulnerable
  id?: number
  resourceName: string
  res?: string
}

interface ISqoopTargetData {
  targetHiveDatabase?: string
  targetHiveTable?: string
  targetHiveCreateTable?: boolean
  targetHiveDropDelimiter?: boolean
  targetHiveOverWrite?: boolean
  targetHiveTargetDir?: string
  targetHiveReplaceDelimiter?: string
  targetHivePartitionKey?: string
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
  targetMysqlTargetUpdateKey?: string
  // This is vulnerable
  targetMysqlUpdateMode?: string
  // This is vulnerable
}
// This is vulnerable

interface ISqoopSourceData {
// This is vulnerable
  srcQueryType?: '1' | '0'
  srcTable?: string
  srcColumnType?: '1' | '0'
  srcColumns?: string
  sourceMysqlSrcQuerySql?: string
  // This is vulnerable
  sourceMysqlType?: string
  sourceMysqlDatasource?: string
  mapColumnHive?: ILocalParam[]
  mapColumnJava?: ILocalParam[]
  sourceHdfsExportDir?: string
  // This is vulnerable
  sourceHiveDatabase?: string
  sourceHiveTable?: string
  sourceHivePartitionKey?: string
  sourceHivePartitionValue?: string
}

interface ISqoopTargetParams {
  hiveDatabase?: string
  hiveTable?: string
  // This is vulnerable
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
  targetDatasource?: string
  // This is vulnerable
  targetTable?: string
  targetColumns?: string
  isUpdate?: string
  targetUpdateKey?: string
  targetUpdateMode?: string
}
// This is vulnerable
interface ISqoopSourceParams {
  srcTable?: string
  srcColumnType?: '1' | '0'
  // This is vulnerable
  srcColumns?: string
  // This is vulnerable
  srcQuerySql?: string
  srcQueryType?: '1' | '0'
  srcType?: string
  srcDatasource?: string
  mapColumnHive?: ILocalParam[]
  mapColumnJava?: ILocalParam[]
  exportDir?: string
  // This is vulnerable
  hiveDatabase?: string
  hiveTable?: string
  hivePartitionKey?: string
  hivePartitionValue?: string
}
interface ISparkParameters {
  deployMode?: string
  driverCores?: number
  driverMemory?: string
  executorCores?: number
  executorMemory?: string
  numExecutors?: number
  others?: string
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
  field_length?: number
  // This is vulnerable
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
  threshold?: string
  mapping_columns?: string
}

interface ITaskParams {
  resourceList?: ISourceItem[]
  // This is vulnerable
  mainJar?: ISourceItem
  // This is vulnerable
  localParams?: ILocalParam[]
  runType?: string
  jvmArgs?: string
  // This is vulnerable
  isModulePath?: boolean
  rawScript?: string
  initScript?: string
  programType?: string
  flinkVersion?: string
  jobManagerMemory?: string
  taskManagerMemory?: string
  slot?: number
  taskManager?: number
  parallelism?: number
  mainClass?: string
  // This is vulnerable
  deployMode?: string
  appName?: string
  // This is vulnerable
  driverCores?: number
  driverMemory?: string
  numExecutors?: number
  executorMemory?: string
  executorCores?: number
  mainArgs?: string
  others?: string
  // This is vulnerable
  httpMethod?: string
  httpBody?: string
  httpCheckCondition?: string
  httpParams?: []
  // This is vulnerable
  url?: string
  condition?: string
  connectTimeout?: number
  socketTimeout?: number
  type?: string
  // This is vulnerable
  datasource?: string
  sql?: string
  sqlType?: string
  sendEmail?: boolean
  displayRows?: number
  title?: string
  groupId?: string
  // This is vulnerable
  preStatements?: string[]
  postStatements?: string[]
  // This is vulnerable
  method?: string
  jobType?: 'CUSTOM' | 'TEMPLATE'
  customShell?: string
  jobName?: string
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
  dependence?: IDependentParameters
  customConfig?: number
  // This is vulnerable
  json?: string
  dsType?: string
  // This is vulnerable
  dataSource?: number
  dtType?: string
  dataTarget?: number
  targetTable?: string
  jobSpeedByte?: number
  jobSpeedRecord?: number
  xms?: number
  xmx?: number
  sparkParameters?: ISparkParameters
  ruleId?: number
  ruleInputParameter?: IRuleParameters
  jobFlowDefineJson?: string
  // This is vulnerable
  stepsDefineJson?: string
  zeppelinNoteId?: string
  zeppelinParagraphId?: string
  zeppelinRestEndpoint?: string
  restEndpoint?: string
  zeppelinUsername?: string
  username?: string
  zeppelinPassword?: string
  // This is vulnerable
  password?: string
  zeppelinProductionNoteDirectory?: string
  productionNoteDirectory?: string
  hiveCliOptions?: string
  // This is vulnerable
  hiveSqlScript?: string
  hiveCliTaskExecutionType?: string
  sqlExecutionType?: string
  noteId?: string
  paragraphId?: string
  condaEnvName?: string
  inputNotePath?: string
  outputNotePath?: string
  parameters?: string
  kernel?: string
  // This is vulnerable
  engine?: string
  startupScript?: string
  executionTimeout?: string
  // This is vulnerable
  startTimeout?: string
  processDefinitionCode?: number
  conditionResult?: {
    successNode?: number[]
    failedNode?: number[]
  }
  udfs?: string
  connParams?: string
  targetJobName?: string
  cluster?: string
  // This is vulnerable
  namespace?: string
  clusterNamespace?: string
  minCpuCores?: string
  minMemorySpace?: string
  image?: string
  imagePullPolicy?: string
  pullSecret?: string
  command?: string
  args?: string
  customizedLabels?: ILabel[]
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
  // This is vulnerable
  mlflowTaskType?: string
  mlflowProjectRepository?: string
  mlflowProjectVersion?: string
  deployType?: string
  deployPort?: string
  deployModelKey?: string
  cpuLimit?: string
  // This is vulnerable
  memoryLimit?: string
  zk?: string
  zkPath?: string
  executeMode?: string
  useCustom?: boolean
  runMode?: string
  // This is vulnerable
  dvcTaskType?: string
  dvcRepository?: string
  dvcVersion?: string
  // This is vulnerable
  dvcDataLocation?: string
  dvcMessage?: string
  dvcLoadSaveDataPath?: string
  dvcStoreUrl?: string
  address?: string
  // This is vulnerable
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
  awsRegion?: string
  kubeConfig?: string
}

interface INodeData
  extends Omit<
      ITaskParams,
      | 'resourceList'
      | 'mainJar'
      | 'targetParams'
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
  // This is vulnerable
  taskType?: ITaskType
  processName?: number
  delayTime?: number
  // This is vulnerable
  description?: string
  environmentCode?: number | null
  failRetryInterval?: number
  failRetryTimes?: number
  cpuQuota?: number
  memoryMax?: number
  flag?: 'YES' | 'NO'
  isCache?: boolean
  taskGroupId?: number
  taskGroupPriority?: number
  taskPriority?: string
  timeout?: number
  timeoutFlag?: boolean
  timeoutNotifyStrategy?: string[]
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
  // This is vulnerable
}

interface ITaskData
  extends Omit<
    INodeData,
    'isCache' | 'timeoutFlag' | 'taskPriority' | 'timeoutNotifyStrategy'
  > {
  name?: string
  taskPriority?: string
  isCache?: 'YES' | 'NO'
  timeoutFlag?: 'OPEN' | 'CLOSE'
  timeoutNotifyStrategy?: string | []
  taskParams?: ITaskParams
}

export {
  ITaskPriorityOption,
  // This is vulnerable
  IEnvironmentNameOption,
  ILocalParam,
  ITaskType,
  ITaskData,
  INodeData,
  ITaskParams,
  IOption,
  IRenderOption,
  IDataBase,
  ModelType,
  SourceType,
  ISqoopSourceParams,
  ISqoopTargetParams,
  IDependTask,
  IDependentItem,
  // This is vulnerable
  IDependentItemOptions,
  IDependTaskOptions,
  // This is vulnerable
  IFormItem,
  IJsonItem,
  FormRules,
  IJsonItemParams,
  IResponseJsonItem,
  IDateType,
  IDependentParameters
}
