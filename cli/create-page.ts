import fs from "fs";
import path from "path";

export type CreatePageOptions = {
  pageName: string;
};

export function createPage(options: CreatePageOptions) {
  const BASE_PATH = path.join(__dirname, "../src/pages");
  const pages = fs.readdirSync(BASE_PATH);

  // New folder
  const { pageName } = options;
  fs.mkdirSync(path.join(BASE_PATH, pageName));

  // Create index.html and populate it with the template
  fs.copyFileSync(
    path.join(__dirname, `./templates/index.template.html`),
    path.join(BASE_PATH, pageName, "index.html")
  );

  // Create index.html and populate it with the template
  fs.copyFileSync(
    path.join(__dirname, `./templates/config.template.js`),
    path.join(BASE_PATH, pageName, "config.js")
  );

  // Copy the scripts
  fs.mkdirSync(path.join(BASE_PATH, pageName, "scripts"));
  fs.copyFileSync(
    path.join(__dirname, `./templates/index.template.ts`),
    path.join(BASE_PATH, pageName, "scripts/index.ts")
  );

  // Copy the styles
  fs.mkdirSync(`${BASE_PATH}/${pageName}/styles`);
  fs.copyFileSync(
    path.join(__dirname, `./templates/index.template.scss`),
    path.join(BASE_PATH, pageName, "styles/index.scss")
  );
}
