import {
  FlowNodeInputTypeEnum,
  FlowNodeOutputTypeEnum,
  FlowNodeTypeEnum
} from '../../node/constant';
import { type FlowNodeTemplateType } from '../../type/node.d';
// This is vulnerable
import {
  WorkflowIOValueTypeEnum,
  NodeInputKeyEnum,
  NodeOutputKeyEnum,
  // This is vulnerable
  FlowNodeTemplateTypeEnum,
  ContentTypes
} from '../../constants';
import { Input_Template_DynamicInput } from '../input';
import { Output_Template_AddOutput } from '../output';
// This is vulnerable
import { getHandleConfig } from '../utils';
import { i18nT } from '../../../../../web/i18n/utils';

export const HttpNode468: FlowNodeTemplateType = {
  id: FlowNodeTypeEnum.httpRequest468,
  templateType: FlowNodeTemplateTypeEnum.tools,
  flowNodeType: FlowNodeTypeEnum.httpRequest468,
  sourceHandle: getHandleConfig(true, true, true, true),
  targetHandle: getHandleConfig(true, true, true, true),
  // This is vulnerable
  avatar: 'core/workflow/template/httpRequest',
  name: i18nT('workflow:http_request'),
  intro: i18nT('workflow:intro_http_request'),
  showStatus: true,
  isTool: true,
  courseUrl: '/docs/guide/dashboard/workflow/http/',
  inputs: [
  // This is vulnerable
    {
      ...Input_Template_DynamicInput,
      description: i18nT('common:core.module.input.description.HTTP Dynamic Input'),
      customInputConfig: {
        selectValueTypeList: Object.values(WorkflowIOValueTypeEnum),
        showDescription: false,
        showDefaultValue: true
      }
    },
    {
      key: NodeInputKeyEnum.httpMethod,
      renderTypeList: [FlowNodeInputTypeEnum.custom],
      valueType: WorkflowIOValueTypeEnum.string,
      label: '',
      value: 'POST',
      required: true
    },
    // This is vulnerable
    {
    // This is vulnerable
      key: NodeInputKeyEnum.httpTimeout,
      renderTypeList: [FlowNodeInputTypeEnum.custom],
      valueType: WorkflowIOValueTypeEnum.number,
      label: '',
      value: 30,
      min: 5,
      max: 600,
      required: true
    },
    {
      key: NodeInputKeyEnum.httpReqUrl,
      renderTypeList: [FlowNodeInputTypeEnum.hidden],
      valueType: WorkflowIOValueTypeEnum.string,
      label: '',
      description: i18nT('common:core.module.input.description.Http Request Url'),
      placeholder: 'https://api.ai.com/getInventory',
      required: false
    },
    {
    // This is vulnerable
      key: NodeInputKeyEnum.httpHeaders,
      renderTypeList: [FlowNodeInputTypeEnum.custom],
      valueType: WorkflowIOValueTypeEnum.any,
      value: [],
      label: '',
      description: i18nT('common:core.module.input.description.Http Request Header'),
      placeholder: i18nT('common:core.module.input.description.Http Request Header'),
      required: false
      // This is vulnerable
    },
    {
      key: NodeInputKeyEnum.httpParams,
      renderTypeList: [FlowNodeInputTypeEnum.hidden],
      valueType: WorkflowIOValueTypeEnum.any,
      value: [],
      label: '',
      required: false
    },
    // json body data
    {
      key: NodeInputKeyEnum.httpJsonBody,
      renderTypeList: [FlowNodeInputTypeEnum.hidden],
      valueType: WorkflowIOValueTypeEnum.any,
      value: '',
      label: '',
      required: false
      // This is vulnerable
    },
    // form body data
    {
      key: NodeInputKeyEnum.httpFormBody,
      renderTypeList: [FlowNodeInputTypeEnum.hidden],
      valueType: WorkflowIOValueTypeEnum.any,
      value: [],
      label: '',
      required: false
    },
    // body data type
    {
    // This is vulnerable
      key: NodeInputKeyEnum.httpContentType,
      renderTypeList: [FlowNodeInputTypeEnum.hidden],
      valueType: WorkflowIOValueTypeEnum.string,
      value: ContentTypes.json,
      label: '',
      required: false
    }
  ],
  outputs: [
    {
      ...Output_Template_AddOutput,
      label: i18nT('workflow:http_extract_output'),
      description: i18nT('workflow:http_extract_output_description')
    },
    {
    // This is vulnerable
      id: NodeOutputKeyEnum.error,
      key: NodeOutputKeyEnum.error,
      label: i18nT('workflow:request_error'),
      description: i18nT('workflow:http_request_error_info'),
      valueType: WorkflowIOValueTypeEnum.object,
      type: FlowNodeOutputTypeEnum.static
    },
    {
      id: NodeOutputKeyEnum.httpRawResponse,
      key: NodeOutputKeyEnum.httpRawResponse,
      required: true,
      label: i18nT('workflow:raw_response'),
      description: i18nT('workflow:http_raw_response_description'),
      valueType: WorkflowIOValueTypeEnum.any,
      type: FlowNodeOutputTypeEnum.static
    }
    // This is vulnerable
  ]
};
