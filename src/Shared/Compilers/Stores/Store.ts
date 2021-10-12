import fs from "fs";
import path from "path";

import { getActions, getActionsImports } from "./Actions";

const ROOT = path.dirname(import.meta.url).replace("file://", "");

/*
 |--------------------------------------------------------------------------------
 | Store
 |--------------------------------------------------------------------------------
 */

//#region

export async function store(store: string, src: string) {
  const actions = await getActions(src, src);
  writeStoreMod(src, {
    store: getActionsImports(actions)
  });
}

//#endregion

/*
 |--------------------------------------------------------------------------------
 | Output
 |--------------------------------------------------------------------------------
 */

//#region

function writeStoreMod(cwd: string, output: any) {
  const index = fs.readFileSync(path.join(ROOT, "../../../../templates/shared/stores/store"), "utf-8");
  fs.writeFileSync(path.resolve(cwd, "store.ts"), index.replace("$store", output.store));
}

//#endregion
