import * as esbuild from "esbuild";
import process from "process";
import path from "path";
import fs from "fs";

const prod = process.argv[2] === "production";

/** Obsidian vault plugin directory (for local dev) */
const obsidianOutDir = path.resolve("..", ".obsidian", "plugins", "verdant");
/** Project root (for release / community review) */
const projectOutFile = path.resolve("main.js");

if (!fs.existsSync(obsidianOutDir)) {
  fs.mkdirSync(obsidianOutDir, { recursive: true });
}

const buildOptions = {
  entryPoints: ["src/main.ts"],
  bundle: true,
  external: ["obsidian", "https"],
  format: "cjs",
  target: "ES2021",
  platform: "browser",
  sourcemap: prod ? false : "inline",
  minify: prod,
  treeShaking: true,
  define: {
    "process.env.NODE_ENV": JSON.stringify(prod ? "production" : "development"),
  },
};

const context = await esbuild.context({
  ...buildOptions,
  outfile: path.join(obsidianOutDir, "main.js"),
});

if (prod) {
  // Production build — write to both locations
  await context.rebuild();

  // Also build to project root for release
  const prodContext = await esbuild.context({
    ...buildOptions,
    outfile: projectOutFile,
  });
  await prodContext.rebuild();
  await prodContext.dispose();

  await context.dispose();
} else {
  const { host, port } = await context.serve({
    servedir: obsidianOutDir,
  });

  console.log(`Serving at http://${host}:${port}`);
}