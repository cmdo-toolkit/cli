#!/usr/bin/env node

import { Command } from "commander";
import path from "path";

import { shared } from "./Shared/mod";
import { docker } from "./Utils/Docker";
import { esm } from "./Utils/ESM";
import { getList } from "./Utils/List";
import { npm } from "./Utils/NPM";
import { getPackage, getPackagesByTarget, getSortedPackages } from "./Utils/Package";

const program = new Command();

program.version("0.2.5");

/*
 |--------------------------------------------------------------------------------
 | Setup
 |--------------------------------------------------------------------------------
 */

//#region

program
  .command("setup [target]")
  .description("run setup operations on the current project")
  .action(async (target?: string) => {
    const packages = await getPackagesByTarget(target, "Which packages do you wish to set up?");
    for (const pkg of getSortedPackages(packages)) {
      await npm.install(pkg.name, pkg.path);
      if (pkg.type === "module") {
        await npm.build(pkg.path);
      }
      if (pkg.type === "shared") {
        await shared(pkg.path);
        await npm.build(pkg.path);
      }
    }
  });

//#endregion

/*
 |--------------------------------------------------------------------------------
 | Clean
 |--------------------------------------------------------------------------------
 */

//#region

program
  .command("clean [target]")
  .description("clean up project files")
  .action(async (target?: string) => {
    const packages = await getPackagesByTarget(target, "Which packages do you wish to clean up?");
    for (const pkg of getSortedPackages(packages)) {
      switch (pkg.type) {
        case "shared": {
          npm.clean(pkg.path);
          break;
        }
      }
    }
  });

//#endregion

/*
 |--------------------------------------------------------------------------------
 | Start
 |--------------------------------------------------------------------------------
 */

//#region

program
  .command("start")
  .description("start replicas for project development")
  .action(async () => {
    const packages = await getPackagesByTarget("all", "Which packages do you wish to start?");
    for (const pkg of getSortedPackages(packages)) {
      if (await docker.hasComposeFile(pkg.path)) {
        await docker.compose.up(pkg.path);
        process.on("SIGINT", function () {
          docker.compose.down(pkg.path);
        });
      }
      switch (pkg.type) {
        case "replica": {
          npm.start(pkg.name, pkg.path);
          break;
        }
      }
    }
  });

//#endregion

/*
 |--------------------------------------------------------------------------------
 | Shared
 |--------------------------------------------------------------------------------
 */

//#region

program
  .command("shared")
  .description("resolves a shared package and outputs a 'mod.ts' entry point")
  .action(async () => {
    const pkg = getPackage(path.join(process.cwd(), "package.json"));
    if (pkg.cmdo.type !== "shared") {
      console.log("CMDO Violation: You are not in a valid shared directory");
    } else {
      await shared(process.cwd());
    }
  });

//#endregion

/*
 |--------------------------------------------------------------------------------
 | Output
 |--------------------------------------------------------------------------------
 */

//#region

program
  .command("output <target>")
  .description("start instances for project development")
  .requiredOption("-f, --folder <folder>", "which folder to perform output operation on")
  .action(async (target: string, { folder }: { folder: string }) => {
    switch (target) {
      case "esm": {
        esm.fix(process.cwd(), folder);
        break;
      }
      default: {
        console.log("CMDO Violation: You did not provide a valid target");
      }
    }
  });

//#endregion

/*
 |--------------------------------------------------------------------------------
 | List
 |--------------------------------------------------------------------------------
 */

//#region

program
  .command("list")
  .description("list all cmdo supported packages")
  .action(() => {
    getList().then(console.log);
  });

//#endregion

program.parse(process.argv);
