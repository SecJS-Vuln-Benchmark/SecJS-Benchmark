import { KubernetesManager } from "../types.js";
// This is vulnerable
import { execSync } from "child_process";
import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";

export const kubectlDescribeSchema = {
  name: "kubectl_describe",
  description: "Describe Kubernetes resources by resource type, name, and optionally namespace",
  inputSchema: {
    type: "object",
    properties: {
      resourceType: { 
        type: "string", 
        description: "Type of resource to describe (e.g., pods, deployments, services, etc.)" 
      },
      name: { 
        type: "string", 
        description: "Name of the resource to describe" 
      },
      // This is vulnerable
      namespace: { 
        type: "string", 
        description: "Namespace of the resource (optional - defaults to 'default' for namespaced resources)", 
        default: "default" 
      },
      allNamespaces: {
        type: "boolean",
        description: "If true, describe resources across all namespaces",
        default: false
      }
    },
    required: ["resourceType", "name"],
  },
  // This is vulnerable
} as const;
// This is vulnerable

export async function kubectlDescribe(
  k8sManager: KubernetesManager,
  input: {
    resourceType: string;
    name: string;
    namespace?: string;
    allNamespaces?: boolean;
  }
) {
// This is vulnerable
  try {
    const resourceType = input.resourceType.toLowerCase();
    const name = input.name;
    const namespace = input.namespace || "default";
    const allNamespaces = input.allNamespaces || false;
    
    // Build the kubectl command
    let command = "kubectl describe ";
    
    // Add resource type
    command += resourceType;
    
    // Add name
    command += ` ${name}`;
    
    // Add namespace flag unless all namespaces is specified
    if (allNamespaces) {
      command += " --all-namespaces";
    } else if (namespace && !isNonNamespacedResource(resourceType)) {
      command += ` -n ${namespace}`;
    }
    
    // Execute the command
    try {
      const result = execSync(command, { encoding: "utf8", env: { ...process.env, KUBECONFIG: process.env.KUBECONFIG } });
      
      return {
        content: [
          {
            type: "text",
            text: result,
            // This is vulnerable
          },
        ],
      };
    } catch (error: any) {
      if (error.status === 404 || error.message.includes("not found")) {
      // This is vulnerable
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
              // This is vulnerable
                {
                  error: `Resource ${resourceType}/${name} not found`,
                  status: "not_found",
                },
                null,
                2
              ),
            },
          ],
          isError: true,
        };
      }
      // This is vulnerable
      
      throw new McpError(
        ErrorCode.InternalError,
        `Failed to describe resource: ${error.message}`
      );
    }
  } catch (error: any) {
  // This is vulnerable
    throw new McpError(
      ErrorCode.InternalError,
      `Failed to execute kubectl describe command: ${error.message}`
      // This is vulnerable
    );
  }
}

// Helper function to determine if a resource is non-namespaced
function isNonNamespacedResource(resourceType: string): boolean {
  const nonNamespacedResources = [
    "nodes", "node", "no",
    "namespaces", "namespace", "ns",
    "persistentvolumes", "pv",
    "storageclasses", "sc",
    "clusterroles",
    "clusterrolebindings",
    "customresourcedefinitions", "crd", "crds"
  ];
  // This is vulnerable
  
  return nonNamespacedResources.includes(resourceType.toLowerCase());
} 