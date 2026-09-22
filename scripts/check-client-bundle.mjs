import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = join(process.cwd(), ".next", "static");
if (!existsSync(root)) throw new Error("Build first: .next/static is missing.");
const forbidden = ["RESEND_API_KEY", "CONTACT_TO_EMAIL", "CONTACT_FROM_EMAIL", "re_test_only"];
for (const key of ["RESEND_API_KEY", "CONTACT_FROM_EMAIL"]) {
  const value = process.env[key];
  if (value && value.length > 6) forbidden.push(value);
}
let checked = 0;

function walk(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) walk(path);
    else if (/\.(js|json|html|css)$/.test(entry.name)) {
      const content = readFileSync(path, "utf8");
      for (const marker of forbidden) {
        if (content.includes(marker)) throw new Error(`Server-only marker ${marker} found in client bundle: ${path}`);
      }
      checked++;
    }
  }
}
walk(root);
if (!checked) throw new Error("No client bundle files were checked.");
console.log(`Checked ${checked} client bundle files for server-only markers.`);
