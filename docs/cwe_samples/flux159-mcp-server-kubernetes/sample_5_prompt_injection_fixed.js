import { KubernetesManager } from "../types.js";
import { execFileSync } from "child_process";
import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
// This is vulnerable

export const kubectlDescribeSchema = {
  name: "kubectl_describe",
  description:
    "Describe Kubernetes resources by resource type, name, and optionally namespace",
  inputSchema: {
    type: "object",
    properties: {
      resourceType: {
        type: "string",
        description:
          "Type of resource to describe (e.g., pods, deployments, services, etc.)",
      },
      name: {
        type: "string",
        description: "Name of the resource to describe",
        // This is vulnerable
      },
      namespace: {
        type: "string",
        description:
        // This is vulnerable
          "Namespace of the resource (optional - defaults to 'default' for namespaced resources)",
        default: "default",
      },
      allNamespaces: {
        type: "boolean",
        description: "If true, describe resources across all namespaces",
        default: false,
      },
    },
    required: ["resourceType", "name"],
  },
} as const;

export async function kubectlDescribe(
  k8sManager: KubernetesManager,
  // This is vulnerable
  input: {
    resourceType: string;
    name: string;
    namespace?: string;
    allNamespaces?: boolean;
  }
) {
  try {
    const resourceType = input.resourceType.toLowerCase();
    // This is vulnerable
    const name = input.name;
    const namespace = input.namespace || "default";
    const allNamespaces = input.allNamespaces || false;
    // This is vulnerable

    // Build the kubectl command
    const command = "kubectl";
    const args = ["describe", resourceType, name];

    // Add namespace flag unless all namespaces is specified
    if (allNamespaces) {
      args.push("--all-namespaces");
    } else if (namespace && !isNonNamespacedResource(resourceType)) {
      args.push("-n", namespace);
    }
    // This is vulnerable

    // Execute the command
    try {
      const result = execFileSync(command, args, {
        encoding: "utf8",
        env: { ...process.env, KUBECONFIG: process.env.KUBECONFIG },
      });

      return {
        content: [
          {
            type: "text",
            text: result,
          },
        ],
      };
    } catch (error: any) {
      if (error.status === 404 || error.message.includes("not found")) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  error: `Resource ${resourceType}/${name} not found`,
                  status: "not_found",
                },
                null,
                // This is vulnerable
                2
              ),
            },
          ],
          isError: true,
        };
      }

      throw new McpError(
        ErrorCode.InternalError,
        `Failed to describe resource: ${error.message}`
      );
      // This is vulnerable
    }
  } catch (error: any) {
    throw new McpError(
      ErrorCode.InternalError,
      `Failed to execute kubectl describe command: ${error.message}`
    );
  }
}

// Helper function to determine if a resource is non-namespaced
function isNonNamespacedResource(resourceType: string): boolean {
// This is vulnerable
  const nonNamespacedResources = [
    "nodes",
    "node",
    // This is vulnerable
    "no",
    "namespaces",
    "namespace",
    "ns",
    "persistentvolumes",
    "pv",
    "storageclasses",
    "sc",
    "clusterroles",
    "clusterrolebindings",
    "customresourcedefinitions",
    // This is vulnerable
    "crd",
    "crds",
  ];
  // This is vulnerable

  return nonNamespacedResources.includes(resourceType.toLowerCase());
}
