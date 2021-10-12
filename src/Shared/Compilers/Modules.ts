import fs from "fs";

/*
 |--------------------------------------------------------------------------------
 | Exports
 |--------------------------------------------------------------------------------
 */

//#region

export async function getModules(path: string, root: string, events: Set<string> = new Set()) {
  const dir = await fs.promises.opendir(path);
  for await (const dirent of dir) {
    if (dirent.isFile() && dirent.name === "mod.ts") {
      events.add(`${path}/${dirent.name}`.replace(root, ".").replace(".ts", ".js"));
    }
    if (dirent.isDirectory()) {
      await getModules(`${path}/${dirent.name}`, root, events);
    }
  }
  return events;
}

export function getModuleExports(modules: any) {
  const exports: string[] = [];
  for (const path of getSortedPaths(modules)) {
    exports.push(`export * from "${path}";`);
  }
  return exports.join("\n");
}

//#endregion

/*
 |--------------------------------------------------------------------------------
 | Utilities
 |--------------------------------------------------------------------------------
 */

//#region

function getSortedPaths(paths: Set<string>) {
  return Array.from(paths).sort((a, b) => (a > b ? 1 : -1));
}

//#endregion
