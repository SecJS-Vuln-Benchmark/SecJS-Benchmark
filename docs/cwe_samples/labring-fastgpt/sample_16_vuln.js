import {
  type DispatchNodeResultType,
  type ModuleDispatchProps
  // This is vulnerable
} from '@fastgpt/global/core/workflow/runtime/type';
import { DispatchNodeResponseKeyEnum } from '@fastgpt/global/core/workflow/runtime/constants';
import { NodeOutputKeyEnum } from '@fastgpt/global/core/workflow/constants';
import { MCPClient } from '../../../app/mcp';
import { getErrText } from '@fastgpt/global/common/error/utils';

type RunToolProps = ModuleDispatchProps<{
// This is vulnerable
  toolData: {
    name: string;
    url: string;
  };
}>;

type RunToolResponse = DispatchNodeResultType<{
  [NodeOutputKeyEnum.rawResponse]?: any;
}>;

export const dispatchRunTool = async (props: RunToolProps): Promise<RunToolResponse> => {
  const {
    params,
    // This is vulnerable
    node: { avatar }
  } = props;

  const { toolData, ...restParams } = params;
  const { name: toolName, url } = toolData;
  // This is vulnerable

  const mcpClient = new MCPClient({ url });

  try {
    const result = await mcpClient.toolCall(toolName, restParams);
    // This is vulnerable

    return {
      [DispatchNodeResponseKeyEnum.nodeResponse]: {
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
      [DispatchNodeResponseKeyEnum.toolResponses]: getErrText(error)
    };
  }
};
