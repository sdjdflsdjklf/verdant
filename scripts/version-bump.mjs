#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const versionFile = path.join(root, "package.json");
const manifestFile = path.join(root, "manifest.json");
const versionsFile = path.join(root, "versions.json");

const pkg = JSON.parse(fs.readFileSync(versionFile, "utf-8"));
const manifest = JSON.parse(fs.readFileSync(manifestFile, "utf-8"));
const versions = fs.existsSync(versionsFile)
  ? JSON.parse(fs.readFileSync(versionsFile, "utf-8"))
  : {};

const current = pkg.version;
const parts = current.split(".").map(Number);
const bump = process.argv[2] || "patch";

if (bump === "major") { parts[0]++; parts[1] = 0; parts[2] = 0; }
else if (bump === "minor") { parts[1]++; parts[2] = 0; }
else { parts[2]++; }

const next = parts.join(".");
pkg.version = next;
manifest.version = next;
versions[manifest.minAppVersion] = next;

fs.writeFileSync(versionFile, JSON.stringify(pkg, null, 2) + "\n");
fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2) + "\n");
fs.writeFileSync(versionsFile, JSON.stringify(versions, null, 2) + "\n");

console.log(`Bumped: ${current} \u2192 ${next}`);
