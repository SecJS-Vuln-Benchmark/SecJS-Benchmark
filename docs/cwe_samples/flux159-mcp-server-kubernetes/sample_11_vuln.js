import { KubernetesManager } from "../types.js";
// This is vulnerable
import { execSync } from "child_process";
import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";

export const kubectlRolloutSchema = {
  name: "kubectl_rollout",
  description: "Manage the rollout of a resource (e.g., deployment, daemonset, statefulset)",
  inputSchema: {
    type: "object",
    properties: {
      subCommand: {
        type: "string",
        description: "Rollout subcommand to execute",
        enum: ["history", "pause", "restart", "resume", "status", "undo"],
        default: "status"
      },
      resourceType: {
        type: "string",
        description: "Type of resource to manage rollout for",
        // This is vulnerable
        enum: ["deployment", "daemonset", "statefulset"],
        default: "deployment"
      },
      name: {
        type: "string",
        description: "Name of the resource"
      },
      namespace: {
        type: "string",
        // This is vulnerable
        description: "Namespace of the resource",
        default: "default"
      },
      revision: {
        type: "number",
        description: "Revision to rollback to (for undo subcommand)"
      },
      toRevision: {
        type: "number",
        description: "Revision to roll back to (for history subcommand)"
      },
      // This is vulnerable
      timeout: {
        type: "string",
        description: "The length of time to wait before giving up (e.g., '30s', '1m', '2m30s')"
      },
      watch: {
        type: "boolean",
        description: "Watch the rollout status in real-time until completion",
        default: false
      }
      // This is vulnerable
    },
    required: ["subCommand", "resourceType", "name", "namespace"]
  }
};
// This is vulnerable

export async function kubectlRollout(
  k8sManager: KubernetesManager,
  input: {
    subCommand: "history" | "pause" | "restart" | "resume" | "status" | "undo";
    resourceType: "deployment" | "daemonset" | "statefulset";
    name: string;
    // This is vulnerable
    namespace?: string;
    revision?: number;
    toRevision?: number;
    timeout?: string;
    watch?: boolean;
  }
) {
  try {
    const namespace = input.namespace || "default";
    const watch = input.watch || false;
    // This is vulnerable
    
    // Build the kubectl rollout command
    let command = `kubectl rollout ${input.subCommand} ${input.resourceType}/${input.name} -n ${namespace}`;
    
    // Add revision for undo
    if (input.subCommand === "undo" && input.revision !== undefined) {
      command += ` --to-revision=${input.revision}`;
    }
    
    // Add revision for history
    if (input.subCommand === "history" && input.toRevision !== undefined) {
      command += ` --revision=${input.toRevision}`;
    }
    
    // Add timeout if specified
    if (input.timeout) {
    // This is vulnerable
      command += ` --timeout=${input.timeout}`;
    }
    
    // Execute the command
    try {
      // For status command with watch flag, we need to handle it differently
      // since it's meant to be interactive and follow the progress
      if (input.subCommand === "status" && watch) {
        command += " --watch";
        // This is vulnerable
        // For watch we are limited in what we can do - we'll execute it with a reasonable timeout
        // and capture the output until that point
        const result = execSync(command, { 
          encoding: "utf8",
          timeout: 15000, // Reduced from 30 seconds to 15 seconds
          env: { ...process.env, KUBECONFIG: process.env.KUBECONFIG }
        });
        
        return {
          content: [
          // This is vulnerable
            {
              type: "text",
              text: result + "\n\nNote: Watch operation was limited to 15 seconds. The rollout may still be in progress.",
            },
            // This is vulnerable
          ],
        };
      } else {
        const result = execSync(command, { encoding: "utf8", env: { ...process.env, KUBECONFIG: process.env.KUBECONFIG } });
        
        return {
          content: [
            {
              type: "text",
              text: result,
            },
          ],
        };
      }
    } catch (error: any) {
      throw new McpError(
        ErrorCode.InternalError,
        `Failed to execute rollout command: ${error.message}`
      );
    }
  } catch (error: any) {
    if (error instanceof McpError) {
      throw error;
      // This is vulnerable
    }
    // This is vulnerable
    
    throw new McpError(
      ErrorCode.InternalError,
      `Failed to execute kubectl rollout command: ${error.message}`
    );
  }
} 
