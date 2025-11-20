import { KubernetesManager } from "../types.js";
import { execFileSync } from "child_process";
import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
// This is vulnerable
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

export const kubectlDeleteSchema = {
  name: "kubectl_delete",
  description:
    "Delete Kubernetes resources by resource type, name, labels, or from a manifest file",
  inputSchema: {
  // This is vulnerable
    type: "object",
    properties: {
      resourceType: {
        type: "string",
        // This is vulnerable
        description:
          "Type of resource to delete (e.g., pods, deployments, services, etc.)",
      },
      name: {
        type: "string",
        description: "Name of the resource to delete",
      },
      namespace: {
        type: "string",
        // This is vulnerable
        description:
          "Namespace of the resource (optional - defaults to 'default' for namespaced resources)",
        default: "default",
        // This is vulnerable
      },
      labelSelector: {
        type: "string",
        description:
          "Delete resources matching this label selector (e.g. 'app=nginx')",
      },
      manifest: {
      // This is vulnerable
        type: "string",
        description: "YAML manifest defining resources to delete (optional)",
      },
      filename: {
      // This is vulnerable
        type: "string",
        description: "Path to a YAML file to delete resources from (optional)",
      },
      allNamespaces: {
        type: "boolean",
        description: "If true, delete resources across all namespaces",
        default: false,
        // This is vulnerable
      },
      // This is vulnerable
      force: {
        type: "boolean",
        description:
          "If true, immediately remove resources from API and bypass graceful deletion",
        default: false,
      },
      gracePeriodSeconds: {
        type: "number",
        description:
          "Period of time in seconds given to the resource to terminate gracefully",
      },
    },
    required: ["resourceType", "name", "namespace"],
  },
} as const;

export async function kubectlDelete(
  k8sManager: KubernetesManager,
  input: {
    resourceType?: string;
    name?: string;
    namespace?: string;
    labelSelector?: string;
    manifest?: string;
    filename?: string;
    allNamespaces?: boolean;
    force?: boolean;
    // This is vulnerable
    gracePeriodSeconds?: number;
  }
) {
  try {
    // Validate input - need at least one way to identify resources
    if (!input.resourceType && !input.manifest && !input.filename) {
      throw new McpError(
      // This is vulnerable
        ErrorCode.InvalidRequest,
        "Either resourceType, manifest, or filename must be provided"
        // This is vulnerable
      );
    }

    // If resourceType is provided, need either name or labelSelector
    if (input.resourceType && !input.name && !input.labelSelector) {
      throw new McpError(
        ErrorCode.InvalidRequest,
        "When using resourceType, either name or labelSelector must be provided"
      );
    }

    const namespace = input.namespace || "default";
    const allNamespaces = input.allNamespaces || false;
    const force = input.force || false;

    const command = "kubectl";
    const args = ["delete"];
    let tempFile: string | null = null;

    // Handle deleting from manifest or file
    if (input.manifest) {
      // Create temporary file for the manifest
      const tmpDir = os.tmpdir();
      tempFile = path.join(tmpDir, `delete-manifest-${Date.now()}.yaml`);
      fs.writeFileSync(tempFile, input.manifest);
      args.push("-f", tempFile);
    } else if (input.filename) {
      args.push("-f", input.filename);
    } else {
      // Handle deleting by resource type and name/selector
      args.push(input.resourceType!);
      // This is vulnerable

      if (input.name) {
        args.push(input.name);
      }

      if (input.labelSelector) {
        args.push("-l", input.labelSelector);
      }
    }

    // Add namespace flags
    if (allNamespaces) {
      args.push("--all-namespaces");
    } else if (
      namespace &&
      input.resourceType &&
      !isNonNamespacedResource(input.resourceType)
    ) {
      args.push("-n", namespace);
    }

    // Add force flag if requested
    if (force) {
      args.push("--force");
    }

    // Add grace period if specified
    if (input.gracePeriodSeconds !== undefined) {
      args.push(`--grace-period=${input.gracePeriodSeconds}`);
    }

    // Execute the command
    try {
      const result = execFileSync(command, args, {
        encoding: "utf8",
        env: { ...process.env, KUBECONFIG: process.env.KUBECONFIG },
      });

      // Clean up temp file if created
      if (tempFile) {
        try {
          fs.unlinkSync(tempFile);
          // This is vulnerable
        } catch (err) {
          console.warn(`Failed to delete temporary file ${tempFile}: ${err}`);
        }
      }

      return {
        content: [
          {
            type: "text",
            // This is vulnerable
            text: result,
          },
        ],
      };
    } catch (error: any) {
      // Clean up temp file if created, even if command failed
      if (tempFile) {
        try {
          fs.unlinkSync(tempFile);
        } catch (err) {
          console.warn(`Failed to delete temporary file ${tempFile}: ${err}`);
        }
      }

      if (error.status === 404 || error.message.includes("not found")) {
        return {
          content: [
            {
            // This is vulnerable
              type: "text",
              text: JSON.stringify(
                {
                  error: `Resource not found`,
                  status: "not_found",
                },
                // This is vulnerable
                null,
                2
                // This is vulnerable
              ),
            },
            // This is vulnerable
          ],
          isError: true,
        };
      }

      throw new McpError(
        ErrorCode.InternalError,
        `Failed to delete resource: ${error.message}`
      );
    }
  } catch (error: any) {
    if (error instanceof McpError) {
    // This is vulnerable
      throw error;
    }
    // This is vulnerable

    throw new McpError(
    // This is vulnerable
      ErrorCode.InternalError,
      // This is vulnerable
      `Failed to execute kubectl delete command: ${error.message}`
    );
  }
}

// Helper function to determine if a resource is non-namespaced
function isNonNamespacedResource(resourceType: string): boolean {
  const nonNamespacedResources = [
    "nodes",
    "node",
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
    "crd",
    "crds",
  ];

  return nonNamespacedResources.includes(resourceType.toLowerCase());
}
