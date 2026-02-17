const fs = require("fs");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

/**
 * @param {string} pageName
 */
function templatePath(pageName) {
  const p = path.join(__dirname, `../src/pages/${pageName}/index.html`);
  if (fs.existsSync(p) === false) {
    throw new Error(`No template found for ${pageName} page`);
  }
  return p;
}

/**
 * @param {string} pageName
 */
function scriptPath(pageName) {
  const p = path.join(__dirname, `../src/pages/${pageName}/scripts/index.ts`);
  // Check if the script exists
  if (fs.existsSync(p) === false) {
    throw new Error(`No script found for ${pageName} page`);
  }
  return p;
}

function getPages() {
  const pagesPath = path.join(__dirname, "../src/pages");
  if (fs.existsSync(pagesPath) === false) {
    console.warn("No pages folder found");
    return [];
  }

  const folders = fs.readdirSync(pagesPath);
  return folders;
}

/**
 * @returns {{[x: string]: string}}
 */
function buildEntries() {
  return getPages().reduce((acc, pageName) => {
    acc[pageName] = scriptPath(pageName);
    return acc;
  }, {});
}

async function buildPlugins() {
  const plugins = [];
  // HTMLWebpackPlugins
  const pages = getPages();

  for (const page of pages) {
    try {
      // Get the config json and add it to the plugins
      let pageConfig = {};
      try {
        pageConfig = (await import(`../src/pages/${page}/config.js`)).default;
      } catch (err) {
        console.log(err);
        console.warn(`No config.js found for ${page}`);
      }

      plugins.push(
        new HtmlWebpackPlugin({
          hash: true,
          filename: `${page}.html`,
          template: templatePath(page),
          chunks: [page],
          ...pageConfig.htmlConfig,
        })
      );
    } catch (err) {
      // Error while creating the plugin for the page
      console.error(
        `Error while creating the plugin for the page ${page}`,
        err
      );
    }
  }

  return plugins;
}

module.exports = {
  getPages,
  buildEntries,
  buildPlugins,
  scriptPath,
  templatePath,
};
