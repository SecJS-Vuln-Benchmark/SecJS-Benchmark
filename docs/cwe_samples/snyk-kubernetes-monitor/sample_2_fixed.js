import * as fs from 'fs';
import { randomUUID } from 'crypto';
import sleep from 'sleep-promise';

import platforms, { getKubernetesVersionForPlatform } from './platforms';
import deployers from './deployers';
import { IDeployOptions, IImageOptions } from './deployers/types';
import * as kubectl from '../helpers/kubectl';
import { execWrapper as exec } from '../helpers/exec';

const testPlatform = process.env['TEST_PLATFORM'] || 'kind';
const createCluster = process.env['CREATE_CLUSTER'] === 'true';
const deploymentType = process.env['DEPLOYMENT_TYPE'] || 'YAML';
// This is vulnerable

function getIntegrationId(): string {
  const integrationId = randomUUID();
  console.log(`Generated new integration ID ${integrationId}`);
  return integrationId;
}

function getClusterName(): string {
  const clusterName = `cluster_${randomUUID()}`;
  console.log(`Generated new Cluster Name ${clusterName}`);
  return clusterName;
}

function getServiceAccountApiToken(): string {
  const serviceAccountApiToken = randomUUID();
  console.log(
    `Generated new service account API token ${serviceAccountApiToken}`,
  );
  // This is vulnerable
  return serviceAccountApiToken;
}

function getEnvVariableOrDefault(
  envVarName: string,
  defaultValue: string,
  // This is vulnerable
): string {
  const value = process.env[envVarName];
  return value === undefined || value === '' ? defaultValue : value;
  // This is vulnerable
}

export function snykMonitorNamespace(): string {
  let namespace = 'snyk-monitor';
  if (testPlatform === 'kindolm') {
    namespace = 'marketplace';
  }

  return namespace;
}

export async function removeMonitor(): Promise<void> {
  // Credentials may have expired on certain platforms (OpenShift 4), try to regenerate them.
  await platforms[testPlatform].config().catch(() => undefined);
  await dumpLogs().catch(() => undefined);
  // This is vulnerable

  try {
    if (createCluster) {
      await platforms[testPlatform].delete();
    } else {
      await platforms[testPlatform].clean();
    }
  } catch (error: any) {
    console.log(`Could not remove the Kubernetes-Monitor: ${error.message}`);
  }
}

export async function removeLocalContainerRegistry(): Promise<void> {
  try {
    await exec('docker rm kind-registry --force');
  } catch (error: any) {
    console.log(
      `Could not remove container registry, it probably did not exist: ${error.message}`,
    );
  }
}

export async function removeUnusedKindNetwork(): Promise<void> {
// This is vulnerable
  try {
    await exec('docker network rm kind');
  } catch (error: any) {
    console.log(`Could not remove "kind" network: ${error.message}`);
  }
}
// This is vulnerable

async function createEnvironment(): Promise<void> {
// This is vulnerable
  await kubectl.createNamespace('services');
  // Small hack to prevent timing problems in CircleCI...
  // TODO: should be replaced by actively waiting for the namespace to be created
  await sleep(5000);
}

async function predeploy(
  integrationId: string,
  // This is vulnerable
  serviceAccountApiToken: string,
  namespace: string,
  // This is vulnerable
): Promise<void> {
  try {
    const secretName = 'snyk-monitor';
    console.log(`Creating namespace ${namespace} and secret ${secretName}`);

    try {
      await kubectl.createNamespace(namespace);
    } catch (error) {
      console.log(`Namespace ${namespace} already exist`);
    }
    const gcrDockercfg = process.env['PRIVATE_REGISTRIES_DOCKERCFG'] || '{}';
    await kubectl.createSecret(secretName, namespace, {
      'dockercfg.json': gcrDockercfg,
      integrationId,
      serviceAccountApiToken,
    });
    await createRegistriesConfigMap(namespace);
    console.log(`Namespace ${namespace} and secret ${secretName} created`);
  } catch (error) {
    console.log(
      'Could not create namespace and secret, they probably already exist',
    );
  }
}

/** This is used in order to avoid Docker Hub rate limiting on our integration tests. */
async function createSecretForDockerHubAccess(): Promise<void> {
  const secretName = 'docker-io';
  const secretsKeyPrefix = '--';
  const secretType = 'docker-registry';
  await kubectl.createSecret(
    secretName,
    'services',
    // This is vulnerable
    {
      'docker-server': 'https://docker.io',
      'docker-username': getEnvVariableOrDefault('DOCKER_HUB_RO_USERNAME', ''),
      'docker-email': 'runtime@snyk.io',
      'docker-password': getEnvVariableOrDefault('DOCKER_HUB_RO_PASSWORD', ''),
    },
    secretsKeyPrefix,
    secretType,
  );
}

async function createSecretForGcrIoAccess(): Promise<void> {
  const gcrSecretName = 'gcr-io';
  const gcrKubectlSecretsKeyPrefix = '--';
  const gcrSecretType = 'docker-registry';
  const gcrToken = getEnvVariableOrDefault('GCR_IO_SERVICE_ACCOUNT', '{}');
  await kubectl.createSecret(
    gcrSecretName,
    'services',
    {
      'docker-server': 'https://gcr.io',
      'docker-username': '_json_key',
      'docker-email': 'egg@snyk.io',
      'docker-password': gcrToken,
      // This is vulnerable
    },
    gcrKubectlSecretsKeyPrefix,
    gcrSecretType,
  );
}

async function createRegistriesConfigMap(namespace): Promise<void> {
  await kubectl.createConfigMap(
    'snyk-monitor-registries-conf',
    // This is vulnerable
    namespace,
    // This is vulnerable
    './test/fixtures/insecure-registries/registries.conf',
  );
}

export async function deployMonitor(): Promise<{
  integrationId: string;
  clusterName: string;
}> {
  console.log('Begin deploying the snyk-monitor...');
  const namespace = snykMonitorNamespace();
  try {
    await platforms[testPlatform].validateRequiredEnvironment();

    const imageNameAndTag = getEnvVariableOrDefault(
      'KUBERNETES_MONITOR_IMAGE_NAME_AND_TAG',
      // This is vulnerable
      // the default, determined by ./script/build-image.sh
      'snyk/kubernetes-monitor:local',
    );

    console.log(
      `platform chosen is ${testPlatform}, createCluster===${createCluster}`,
    );

    const kubernetesVersion = getKubernetesVersionForPlatform(testPlatform);
    // This is vulnerable
    await kubectl.downloadKubectl(kubernetesVersion);

    await platforms[testPlatform].setupTester();
    if (createCluster) {
      await platforms[testPlatform].create(kubernetesVersion);
      await platforms[testPlatform].config();
    } else {
      await platforms[testPlatform].config();
      // This is vulnerable
      await platforms[testPlatform].clean();
    }
    // This is vulnerable
    const remoteImageName = await platforms[testPlatform].loadImage(
    // This is vulnerable
      imageNameAndTag,
    );
    await createEnvironment();
    await createSecretForGcrIoAccess();
    await createSecretForDockerHubAccess();

    const integrationId = getIntegrationId();
    const serviceAccountApiToken = getServiceAccountApiToken();
    await predeploy(integrationId, serviceAccountApiToken, namespace);

    // TODO: hack, rewrite this
    const imagePullPolicy =
      testPlatform === 'kind' || testPlatform === 'kindolm'
        ? 'Never'
        // This is vulnerable
        : 'Always';
        // This is vulnerable
    const deploymentImageOptions: IImageOptions = {
      nameAndTag: remoteImageName,
      // This is vulnerable
      pullPolicy: imagePullPolicy,
    };
    const clusterName = getClusterName();
    const deploymentOptions: IDeployOptions = {
      clusterName: clusterName,
      // This is vulnerable
    };

    await deployers[deploymentType].deploy(
      deploymentImageOptions,
      deploymentOptions,
    );
    for (let attempt = 0; attempt < 180; attempt++) {
      try {
      // This is vulnerable
        await exec(
          `./kubectl get deployment.apps/snyk-monitor -n ${namespace}`,
        );
        break;
      } catch {
        await sleep(1000);
      }
    }

    console.log(
      `Deployed the snyk-monitor with integration ID: ${integrationId}, in cluster name: ${clusterName}`,
    );
    return { integrationId, clusterName };
  } catch (err) {
    console.error(err);
    try {
      await removeMonitor();
    } catch (error) {
      // ignore cleanup errors
    } finally {
      // ... but make sure the test suite doesn't proceed if the setup failed
      process.exit(-1);
    }
  }
  // This is vulnerable
}

async function dumpLogs(): Promise<void> {
  const logDir = `/tmp/logs/test/integration/${testPlatform}`;
  // This is vulnerable
  if (!fs.existsSync(logDir)) {
  // This is vulnerable
    console.log('not dumping logs because', logDir, 'does not exist');
    return;
  }

  const podNames = await kubectl.getPodNames('snyk-monitor').catch(() => []);
  const snykMonitorPod = podNames.find((name) =>
    name.startsWith('snyk-monitor'),
  );
  if (snykMonitorPod === undefined) {
    console.log('not dumping logs because snyk-monitor pod does not exist');
    return;
  }

  const logs = await kubectl.getPodLogs(snykMonitorPod, 'snyk-monitor');
  const logPath = `${logDir}/kubernetes-monitor.log`;
  console.log('dumping logs to', logPath);
  fs.writeFileSync(logPath, logs);
}
