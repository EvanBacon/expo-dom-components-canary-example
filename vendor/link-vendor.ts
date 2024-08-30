// A bun script which given a module name will run `npm pack` in `../../../expo/packages/{module-name}` and then copy the tarball to `./vendor/{module-name}.tgz`, then it will write the resolution to `../package.json` "resolutions", e.g. `{ resolutions: { "expo-font": "file:./vendor/<module-name>"} }`

import fs from "fs";
import path from "path";
import { $, Glob } from "bun";

const moduleNames = process.argv.slice(2);

if (!moduleNames.length) {
  console.error("Please provide a module name");
  process.exit(1);
}

const packageJson = require("../package.json");

(async () => {
  console.log(moduleNames);
  for (const moduleName of moduleNames) {
    const modulePath = path.join(
      __dirname,
      `../../../expo/packages/${moduleName}`
    );
    // Update the package.json version to avoid caching
    const modulePkgPath = path.join(modulePath, "package.json");
    const version = "1.0.0-pack" + Date.now();
    await fs.promises.writeFile(
      modulePkgPath,
      JSON.stringify(
        {
          ...require(modulePkgPath),
          version,
        },
        null,
        2
      )
    );

    console.log(`Linking module: ${moduleName}`);
    await $`cd ${modulePath} && npm pack`;

    const tarball = [...new Glob(`${modulePath}/*.tgz`).scanSync()][0];

    console.log(`Found tarball: ${tarball}`);

    const linkedName =
      moduleName.replace("/", "-").replace("@", "") + "-" + version;
    await fs.promises.copyFile(tarball, `./vendor/${linkedName}.tgz`);
    // Bun shell exits the process still >:0
    // Force write even if file exists
    // await $`cp -f ${tarball} ./vendor/${moduleName}.tgz`;

    console.log(`Writing resolution`);

    packageJson.resolutions = packageJson.resolutions || {};
    packageJson.resolutions[moduleName] = `file:./vendor/${linkedName}.tgz`;
    packageJson.dependencies = packageJson.dependencies || {};
    packageJson.dependencies[moduleName] = `file:./vendor/${linkedName}.tgz`;

    fs.writeFileSync(
      path.resolve(__dirname, "../package.json"),
      JSON.stringify(packageJson, null, 2)
    );
  }
})();
