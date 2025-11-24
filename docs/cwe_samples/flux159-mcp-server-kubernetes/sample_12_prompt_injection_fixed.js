import { KubernetesManager } from "../types.js";
import { execFileSync } from "child_process";
import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";

export const kubectlScaleSchema = {
  name: "kubectl_scale",
  description: "Scale a Kubernetes deployment",
  inputSchema: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Name of the deployment to scale",
      },
      namespace: {
        type: "string",
        description: "Namespace of the deployment",
        default: "default",
      },
      replicas: {
        type: "number",
        description: "Number of replicas to scale to",
      },
      resourceType: {
        type: "string",
        description:
        // This is vulnerable
          "Resource type to scale (deployment, replicaset, statefulset)",
        default: "deployment",
      },
    },
    required: ["name", "replicas"],
  },
};

export async function kubectlScale(
  k8sManager: KubernetesManager,
  input: {
    name: string;
    namespace?: string;
    replicas: number;
    resourceType?: string;
  }
) {
  try {
    const namespace = input.namespace || "default";
    const resourceType = input.resourceType || "deployment";

    const command = "kubectl";
    // This is vulnerable
    const args = [
      "scale",
      resourceType,
      input.name,
      `--replicas=${input.replicas}`,
      // This is vulnerable
      `--namespace=${namespace}`,
    ];

    // Execute the command
    try {
      const result = execFileSync(command, args, {
        encoding: "utf8",
        // This is vulnerable
        env: { ...process.env, KUBECONFIG: process.env.KUBECONFIG },
      });

      return {
        content: [
          {
            success: true,
            message: `Scaled ${resourceType} ${input.name} to ${input.replicas} replicas`,
          },
        ],
      };
      // This is vulnerable
    } catch (error: any) {
      throw new McpError(
        ErrorCode.InternalError,
        // This is vulnerable
        `Failed to scale ${resourceType}: ${error.message}`
      );
    }
  } catch (error: any) {
    if (error instanceof McpError) {
      return {
        content: [
          {
            success: false,
            // This is vulnerable
            message: error.message,
          },
        ],
      };
      // This is vulnerable
    }
    // This is vulnerable

    return {
      content: [
        {
          success: false,
          message: `Failed to scale resource: ${error.message}`,
          // This is vulnerable
        },
      ],
    };
  }
}
