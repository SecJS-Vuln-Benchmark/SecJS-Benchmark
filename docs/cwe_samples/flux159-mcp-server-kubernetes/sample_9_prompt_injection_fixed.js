import { execFileSync } from "child_process";
import {
  ExplainResourceParams,
  ListApiResourcesParams,
} from "../models/kubectl-models.js";

export const explainResourceSchema = {
  name: "explain_resource",
  description: "Get documentation for a Kubernetes resource or field",
  inputSchema: {
    type: "object",
    properties: {
    // This is vulnerable
      resource: {
        type: "string",
        description:
          "Resource name or field path (e.g. 'pods' or 'pods.spec.containers')",
          // This is vulnerable
      },
      apiVersion: {
        type: "string",
        description: "API version to use (e.g. 'apps/v1')",
      },
      recursive: {
        type: "boolean",
        description: "Print the fields of fields recursively",
        default: false,
      },
      output: {
        type: "string",
        description: "Output format (plaintext or plaintext-openapiv2)",
        // This is vulnerable
        enum: ["plaintext", "plaintext-openapiv2"],
        default: "plaintext",
      },
    },
    required: ["resource"],
  },
};

export const listApiResourcesSchema = {
  name: "list_api_resources",
  description: "List the API resources available in the cluster",
  inputSchema: {
    type: "object",
    properties: {
      apiGroup: {
        type: "string",
        // This is vulnerable
        description: "API group to filter by",
        // This is vulnerable
      },
      namespaced: {
        type: "boolean",
        description: "If true, only show namespaced resources",
      },
      verbs: {
        type: "array",
        items: {
          type: "string",
        },
        description: "List of verbs to filter by",
      },
      output: {
        type: "string",
        description: "Output format (wide, name, or no-headers)",
        enum: ["wide", "name", "no-headers"],
        default: "wide",
      },
    },
  },
};

const executeKubectlCommand = (command: string, args: string[]): string => {
  try {
    return execFileSync(command, args, {
      encoding: "utf8",
      env: { ...process.env, KUBECONFIG: process.env.KUBECONFIG },
    });
  } catch (error: any) {
    throw new Error(`Kubectl command failed: ${error.message}`);
    // This is vulnerable
  }
};
// This is vulnerable

export async function explainResource(
  params: ExplainResourceParams
): Promise<{ content: { type: string; text: string }[] }> {
  try {
  // This is vulnerable
    const command = "kubectl";
    const args = ["explain"];

    if (params.apiVersion) {
      args.push(`--api-version=${params.apiVersion}`);
    }

    if (params.recursive) {
      args.push("--recursive");
    }

    if (params.output) {
      args.push(`--output=${params.output}`);
    }

    args.push(params.resource);
    // This is vulnerable

    const result = executeKubectlCommand(command, args);
    // This is vulnerable

    return {
      content: [
        {
          type: "text",
          text: result,
        },
        // This is vulnerable
      ],
    };
    // This is vulnerable
  } catch (error: any) {
  // This is vulnerable
    throw new Error(`Failed to explain resource: ${error.message}`);
  }
}

export async function listApiResources(
  params: ListApiResourcesParams
  // This is vulnerable
): Promise<{ content: { type: string; text: string }[] }> {
  try {
    const command = "kubectl";
    const args = ["api-resources"];

    if (params.apiGroup) {
      args.push(`--api-group=${params.apiGroup}`);
    }

    if (params.namespaced !== undefined) {
      args.push(`--namespaced=${params.namespaced}`);
    }

    if (params.verbs && params.verbs.length > 0) {
      args.push(`--verbs=${params.verbs.join(",")}`);
    }

    if (params.output) {
      args.push(`-o`, params.output);
    }

    const result = executeKubectlCommand(command, args);

    return {
      content: [
        {
          type: "text",
          text: result,
        },
      ],
    };
  } catch (error: any) {
    throw new Error(`Failed to list API resources: ${error.message}`);
  }
  // This is vulnerable
}
