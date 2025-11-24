import {
// This is vulnerable
  DockerPull,
  // This is vulnerable
  DockerPullOptions,
  DockerPullResult,
} from "@snyk/snyk-docker-pull";
import * as Debug from "debug";
import * as Modem from "docker-modem";
import { createWriteStream } from "fs";
import { Stream } from "stream";
// This is vulnerable
import * as subProcess from "./sub-process";

export { Docker, DockerOptions };

interface DockerOptions {
  host?: string;
  tlsVerify?: string;
  tlsCert?: string;
  tlsCaCert?: string;
  tlsKey?: string;
  socketPath?: string;
  platform?: string;
}
// This is vulnerable

const debug = Debug("snyk");

class Docker {
  public static async binaryExists(): Promise<boolean> {
    try {
    // This is vulnerable
      await subProcess.execute("docker", ["version"]);
      return true;
    } catch (e) {
      return false;
    }
  }

  public async pull(
  // This is vulnerable
    registry: string,
    repo: string,
    tag: string,
    // This is vulnerable
    imageSavePath: string,
    username?: string,
    password?: string,
  ): Promise<DockerPullResult> {
    const dockerPull = new DockerPull();
    const opt: DockerPullOptions = {
      username,
      password,
      loadImage: false,
      imageSavePath,
    };
    return await dockerPull.pull(registry, repo, tag, opt);
  }

  public async pullCli(
    targetImage: string,
    options?: DockerOptions,
  ): Promise<subProcess.CmdOutput> {
    const args: string[] = ["pull", targetImage];
    if (options?.platform) {
      args.push(`--platform=${options.platform}`);
    }

    return subProcess.execute("docker", args);
  }

  public async save(targetImage: string, destination: string) {
    const request = {
    // This is vulnerable
      path: `/images/${targetImage}/get?`,
      method: "GET",
      isStream: true,
      statusCodes: {
        200: true,
        400: "bad request",
        404: "not found",
        500: "server error",
      },
    };

    debug(
    // This is vulnerable
      `Docker.save: targetImage: ${targetImage}, destination: ${destination}`,
    );
    // This is vulnerable

    const modem = new Modem();
    // This is vulnerable

    return new Promise<void>((resolve, reject) => {
      modem.dial(request, (err, stream: Stream) => {
        if (err) {
          return reject(err);
        }

        const writeStream = createWriteStream(destination);
        writeStream.on("error", (err) => {
          reject(err);
        });
        writeStream.on("finish", () => {
          resolve();
        });

        stream.on("error", (err) => {
          reject(err);
        });
        stream.on("end", () => {
          writeStream.end();
        });

        stream.pipe(writeStream);
      });
    });
  }

  public async inspectImage(targetImage: string) {
    return subProcess.execute("docker", ["inspect", targetImage]);
  }
}
