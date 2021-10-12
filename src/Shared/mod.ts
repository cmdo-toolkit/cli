import fs from "fs";
import path from "path";

import { getModuleExports, getModules } from "./Compilers/Modules";
import { stores } from "./Compilers/Stores/mod";

const ROOT = path.dirname(import.meta.url).replace("file://", "");

type Output = {
  modules: string;
};

export async function shared(cwd: string) {
  const src = path.resolve(cwd, "./src");

  await clean(src);
  await stores(src);

  const modules = await getModules(src, src);
  const output = {
    modules: getModuleExports(modules)
  };

  write(src, output);
}

function write(cwd: string, output: Output) {
  const index = fs.readFileSync(path.join(ROOT, "../../templates/shared/mod"), "utf-8");
  fs.writeFileSync(path.resolve(cwd, "mod.ts"), index.replace("$modules", output.modules));
}

async function clean(src: string) {
  try {
    await fs.promises.unlink(path.join(src, "mod.ts"));
  } catch (err: any) {
    if (err.code !== "ENOENT") {
      throw err;
    }
  }
}
