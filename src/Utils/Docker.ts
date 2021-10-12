import { spawn } from "child_process";
import fs from "fs";
import path from "path";

//#region Docker

class Docker {
  public compose: DockerComposer;

  constructor() {
    this.compose = new DockerComposer();
  }

  public async hasComposeFile(cwd: string) {
    return new Promise((resolve) => {
      fs.access(path.resolve(cwd, "docker-compose.yml"), fs.constants.F_OK, function (err) {
        if (err) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }
}

//#endregion

//#region Composer

class DockerComposer {
  public async up(cwd: string) {
    const cursor = spawn("docker-compose", ["up", "-d"], { stdio: "inherit", cwd });
    return new Promise((resolve, reject) => {
      cursor.on("close", resolve);
      cursor.on("error", reject);
    });
  }

  public async down(cwd: string) {
    const cursor = spawn("docker-compose", ["down"], { stdio: "inherit", cwd });
    return new Promise((resolve, reject) => {
      cursor.on("close", resolve);
      cursor.on("error", reject);
    });
  }
}

//#endregion

export const docker = new Docker();
