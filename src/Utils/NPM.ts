import chalk from "chalk";
import { exec, spawn } from "child_process";

import { fill } from "./Helpers";

export const npm = {
  /**
   * Run NPM install in the given cwd location.
   */
  async install(name: string, cwd: string) {
    console.log(chalk`\n{cyan.bold CMDO Installing ${name} dependencies\n${fill("-", 29 + name.length)}}`);
    const cursor = spawn("npm", ["i"], { stdio: "inherit", cwd });
    return new Promise((resolve, reject) => {
      cursor.on("close", resolve);
      cursor.on("error", reject);
    });
  },

  /**
   * Run NPM build in the given cwd location.
   *
   * @param cwd - Working directory to run NPM compile.
   */
  async build(cwd: string) {
    const cursor = spawn("npm", ["run", "build"], { stdio: "inherit", cwd });
    return new Promise((resolve, reject) => {
      cursor.on("close", resolve);
      cursor.on("error", reject);
    });
  },

  /**
   * Run npm start script in the given cwd location.
   *
   * @param name - Package name being started.
   * @param cwd  - Working directory to run start.
   */
  start(name: string, cwd: string) {
    console.log(chalk`\n{cyan.bold CMDO Starting ${name}}`);
    spawn("npm", ["run", "start"], { stdio: "inherit", cwd });
  },

  /**
   * Run npm clean script in the given cwd location.
   *
   * @param cwd - Working directory to run start.
   */
  async clean(cwd: string) {
    const cursor = spawn("npm", ["run", "clean"], { stdio: "inherit", cwd });
    return new Promise((resolve, reject) => {
      cursor.on("close", resolve);
      cursor.on("error", reject);
    });
  },

  published: {
    async version(name: string) {
      return new Promise((resolve) => {
        exec(`npm show ${name} version`, (error, stdout) => {
          resolve(error ? "" : stdout.trim());
        });
      });
    }
  },

  link: {
    /**
     * Create a new link for the given package path.
     *
     * @param cwd - Working directory to link.
     */
    async create(cwd: string) {
      const cursor = spawn("npm", ["link"], { stdio: "inherit", cwd });
      return new Promise((resolve, reject) => {
        cursor.on("close", resolve);
        cursor.on("error", reject);
      });
    },

    /**
     * Respøve an existing new link under the given package path with the
     * provided package name to link.
     *
     * @param cwd  - Working directory to add link to.
     * @param name - Package name to link.
     */
    async resolve(cwd: string, name: string) {
      const cursor = spawn("npm", ["link", name], { stdio: "inherit", cwd });
      return new Promise((resolve, reject) => {
        cursor.on("close", resolve);
        cursor.on("error", reject);
      });
    }
  }
};
