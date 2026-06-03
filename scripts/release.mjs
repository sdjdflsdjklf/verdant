#!/usr/bin/env node
import { execSync } from "node:child_process";

const bump = process.argv[2] || "patch";

execSync(`node scripts/version-bump.mjs ${bump}`, { stdio: "inherit" });

const pkg = JSON.parse(execSync("node -p \"JSON.parse(require('fs').readFileSync('package.json','utf-8'))\"", { encoding: "utf-8" }));
const version = pkg.version;

execSync("npm run build", { stdio: "inherit" });

execSync(`git add package.json manifest.json versions.json main.js styles.css`, { stdio: "inherit" });
execSync(`git commit -m "chore: release v${version}"`, { stdio: "inherit" });
execSync(`git tag v${version}`, { stdio: "inherit" });

console.log(`\nRelease v${version} ready.`);
console.log("Run: git push && git push --tags");
