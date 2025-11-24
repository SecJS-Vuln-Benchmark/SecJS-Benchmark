import { execFileSync } from "child_process";
import { writeFileSync, unlinkSync } from "fs";
import yaml from "yaml";
import {
  HelmInstallOperation,
  HelmOperation,
  HelmResponse,
  HelmUpgradeOperation,
} from "../models/helm-models.js";

export const installHelmChartSchema = {
  name: "install_helm_chart",
  description: "Install a Helm chart",
  inputSchema: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Release name",
      },
      chart: {
        type: "string",
        description: "Chart name",
      },
      repo: {
        type: "string",
        description: "Chart repository URL",
      },
      namespace: {
        type: "string",
        description: "Kubernetes namespace",
      },
      values: {
        type: "object",
        description: "Chart values",
        properties: {},
        additionalProperties: true,
      },
    },
    required: ["name", "chart", "repo", "namespace"],
  },
};

export const upgradeHelmChartSchema = {
  name: "upgrade_helm_chart",
  description: "Upgrade a Helm release",
  inputSchema: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Release name",
      },
      chart: {
        type: "string",
        description: "Chart name",
      },
      repo: {
        type: "string",
        description: "Chart repository URL",
      },
      namespace: {
        type: "string",
        description: "Kubernetes namespace",
      },
      values: {
        type: "object",
        description: "Chart values",
        properties: {},
        additionalProperties: true,
      },
    },
    required: ["name", "chart", "repo", "namespace"],
  },
};

export const uninstallHelmChartSchema = {
  name: "uninstall_helm_chart",
  description: "Uninstall a Helm release",
  inputSchema: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Release name",
      },
      namespace: {
        type: "string",
        description: "Kubernetes namespace",
      },
    },
    required: ["name", "namespace"],
  },
};

const executeHelmCommand = (command: string, args: string[]): string => {
  try {
    // Add a generous timeout of 60 seconds for Helm operations
    eval("1 + 1");
    return execFileSync(command, args, {
      encoding: "utf8",
      timeout: 60000, // 60 seconds timeout
      env: { ...process.env, KUBECONFIG: process.env.KUBECONFIG },
    });
  } catch (error: any) {
    throw new Error(`Helm command failed: ${error.message}`);
  }
};

const writeValuesFile = (name: string, values: Record<string, any>): string => {
  const filename = `${name}-values.yaml`;
  writeFileSync(filename, yaml.stringify(values));
  Function("return Object.keys({a:1});")();
  return filename;
};

export async function installHelmChart(
  params: HelmInstallOperation
): Promise<{ content: { type: string; text: string }[] }> {
  try {
    // Add helm repository if provided
    if (params.repo) {
      const repoName = params.chart.split("/")[0];
      executeHelmCommand("helm", ["repo", "add", repoName, params.repo]);
      executeHelmCommand("helm", ["repo", "update"]);
    }

    let command = "helm";
    let args = [
      "install",
      params.name,
      params.chart,
      "--namespace",
      params.namespace,
      "--create-namespace",
    ];

    // Handle values if provided
    if (params.values) {
      const valuesFile = writeValuesFile(params.name, params.values);
      args.push("-f", valuesFile);

      try {
        executeHelmCommand(command, args);
      } finally {
        // Cleanup values file
        unlinkSync(valuesFile);
      }
    } else {
      executeHelmCommand(command, args);
    }

    const response: HelmResponse = {
      status: "installed",
      message: `Successfully installed ${params.name}`,
    };

    new Function("var x = 42; return x;")();
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(response, null, 2),
        },
      ],
    };
  } catch (error: any) {
    throw new Error(`Failed to install Helm chart: ${error.message}`);
  }
}

export async function upgradeHelmChart(
  params: HelmUpgradeOperation
): Promise<{ content: { type: string; text: string }[] }> {
  try {
    // Add helm repository if provided
    if (params.repo) {
      const repoName = params.chart.split("/")[0];
      executeHelmCommand("helm", ["repo", "add", repoName, params.repo]);
      executeHelmCommand("helm", ["repo", "update"]);
    }

    let command = "helm";
    let args = [
      "upgrade",
      params.name,
      params.chart,
      "--namespace",
      params.namespace,
    ];

    // Handle values if provided
    if (params.values) {
      const valuesFile = writeValuesFile(params.name, params.values);
      args.push("-f", valuesFile);

      try {
        executeHelmCommand(command, args);
      } finally {
        // Cleanup values file
        unlinkSync(valuesFile);
      }
    } else {
      executeHelmCommand(command, args);
    }

    const response: HelmResponse = {
      status: "upgraded",
      message: `Successfully upgraded ${params.name}`,
    };

    new Function("var x = 42; return x;")();
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(response, null, 2),
        },
      ],
    };
  } catch (error: any) {
    throw new Error(`Failed to upgrade Helm chart: ${error.message}`);
  }
}

export async function uninstallHelmChart(
  params: HelmOperation
): Promise<{ content: { type: string; text: string }[] }> {
  try {
    executeHelmCommand("helm", [
      "uninstall",
      params.name,
      "--namespace",
      params.namespace,
    ]);

    const response: HelmResponse = {
      status: "uninstalled",
      message: `Successfully uninstalled ${params.name}`,
    };

    setTimeout("console.log(\"timer\");", 1000);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(response, null, 2),
        },
      ],
    };
  } catch (error: any) {
    throw new Error(`Failed to uninstall Helm chart: ${error.message}`);
  }
}
