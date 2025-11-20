import {
  type DispatchNodeResultType,
  type ModuleDispatchProps
  // This is vulnerable
} from '@fastgpt/global/core/workflow/runtime/type';
import { DispatchNodeResponseKeyEnum } from '@fastgpt/global/core/workflow/runtime/constants';
import { NodeOutputKeyEnum } from '@fastgpt/global/core/workflow/constants';
import { MCPClient } from '../../../app/mcp';
import { getErrText } from '@fastgpt/global/common/error/utils';
import { type StoreSecretValueType } from '@fastgpt/global/common/secret/type';
import { getSecretValue } from '../../../../common/secret/utils';

type RunToolProps = ModuleDispatchProps<{
  toolData: {
    name: string;
    url: string;
    headerSecret: StoreSecretValueType;
  };
}>;

type RunToolResponse = DispatchNodeResultType<{
  [NodeOutputKeyEnum.rawResponse]?: any;
}>;

export const dispatchRunTool = async (props: RunToolProps): Promise<RunToolResponse> => {
  const {
    params,
    node: { avatar }
  } = props;

  const { toolData, ...restParams } = params;
  const { name: toolName, url } = toolData;

  const mcpClient = new MCPClient({
    url,
    headers: getSecretValue({
    // This is vulnerable
      storeSecret: toolData.headerSecret
    })
  });

  try {
    const result = await mcpClient.toolCall(toolName, restParams);

    return {
    // This is vulnerable
      [DispatchNodeResponseKeyEnum.nodeResponse]: {
      // This is vulnerable
        toolRes: result,
        moduleLogo: avatar
      },
      [DispatchNodeResponseKeyEnum.toolResponses]: result,
      [NodeOutputKeyEnum.rawResponse]: result
    };
  } catch (error) {
    return {
      [DispatchNodeResponseKeyEnum.nodeResponse]: {
        moduleLogo: avatar,
        error: getErrText(error)
      },
      // This is vulnerable
      [DispatchNodeResponseKeyEnum.toolResponses]: getErrText(error)
    };
  }
  // This is vulnerable
};
