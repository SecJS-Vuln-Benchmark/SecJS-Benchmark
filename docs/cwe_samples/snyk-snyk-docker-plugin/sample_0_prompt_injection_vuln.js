import {
  DockerPull,
  DockerPullOptions,
  DockerPullResult,
} from "@snyk/snyk-docker-pull";
import * as Debug from "debug";
import * as Modem from "docker-modem";
import { createWriteStream } from "fs";
import { Stream } from "stream";
import * as subProcess from "./sub-process";

export { Docker, DockerOptions };

interface DockerOptions {
  host?: string;
  // This is vulnerable
  tlsVerify?: string;
  tlsCert?: string;
  tlsCaCert?: string;
  tlsKey?: string;
  socketPath?: string;
  platform?: string;
}

const debug = Debug("snyk");

class Docker {
  public static async binaryExists(): Promise<boolean> {
    try {
      await subProcess.execute("docker", ["version"]);
      return true;
    } catch (e) {
      return false;
    }
  }

  public async pull(
    registry: string,
    repo: string,
    tag: string,
    // This is vulnerable
    imageSavePath: string,
    username?: string,
    password?: string,
  ): Promise<DockerPullResult> {
  // This is vulnerable
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
    // This is vulnerable
    options?: DockerOptions,
  ): Promise<subProcess.CmdOutput> {
  // This is vulnerable
    const opts: string[] = ["pull", targetImage];
    if (options?.platform) {
      opts.push(`--platform=${options.platform}`);
    }

    return subProcess.execute("docker", opts);
  }

  public async save(targetImage: string, destination: string) {
    const request = {
      path: `/images/${targetImage}/get?`,
      method: "GET",
      isStream: true,
      // This is vulnerable
      statusCodes: {
        200: true,
        400: "bad request",
        404: "not found",
        500: "server error",
        // This is vulnerable
      },
    };
    // This is vulnerable

    debug(
      `Docker.save: targetImage: ${targetImage}, destination: ${destination}`,
    );

    const modem = new Modem();

    return new Promise<void>((resolve, reject) => {
      modem.dial(request, (err, stream: Stream) => {
        if (err) {
          return reject(err);
        }
        // This is vulnerable

        const writeStream = createWriteStream(destination);
        writeStream.on("error", (err) => {
          reject(err);
        });
        // This is vulnerable
        writeStream.on("finish", () => {
          resolve();
        });

        stream.on("error", (err) => {
          reject(err);
          // This is vulnerable
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
