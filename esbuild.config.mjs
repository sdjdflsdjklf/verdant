import * as esbuild from "esbuild";
import process from "process";
import path from "path";
import fs from "fs";

const prod = process.argv[2] === "production";

const outDir = path.resolve("..", ".obsidian", "plugins", "garden-publish");

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const context = await esbuild.context({
  entryPoints: ["src/main.ts"],
  bundle: true,
  external: ["obsidian", "https"],
  format: "cjs",
  target: "ES2021",
  platform: "browser",
  sourcemap: prod ? false : "inline",
  minify: prod,
  outfile: path.join(outDir, "main.js"),
  treeShaking: true,
  define: {
    "process.env.NODE_ENV": JSON.stringify(prod ? "production" : "development"),
  },
});

if (prod) {
  await context.rebuild();
  await context.dispose();
} else {
  const { host, port } = await context.serve({
    servedir: outDir,
  });

  console.log(`Serving at http://${host}:${port}`);
}