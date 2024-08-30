// A bun script which given a module name will run `npm pack` in `../../../expo/packages/{module-name}` and then copy the tarball to `./vendor/{module-name}.tgz`, then it will write the resolution to `../package.json` "resolutions", e.g. `{ resolutions: { "expo-font": "file:./vendor/<module-name>"} }`

import fs from "fs";
import path from "path";
import { $, Glob } from "bun";

const moduleName = process.argv[2];

if (!moduleName) {
  console.error("Please provide a module name");
  process.exit(1);
}

const packageJson = require("../package.json");

const modulePath = path.resolve(
  __dirname,
  `../../../expo/packages/${moduleName}`
);

$`cd ${modulePath} && npm pack`;

const tarball = [...new Glob(`${modulePath}/*.tgz`).scanSync()][0];

console.log(`Found tarball: ${tarball}`);

$`cp ${tarball} ./vendor/${moduleName}.tgz`;

packageJson.resolutions = packageJson.resolutions || {};
packageJson.resolutions[moduleName] = `file:./vendor/${moduleName}.tgz`;

fs.writeFileSync(
  path.resolve(__dirname, "../package.json"),
  JSON.stringify(packageJson, null, 2)
);
