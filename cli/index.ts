#!/usr/bin/env node
import { Command } from "commander";
import { createPage } from "./create-page";

const program = new Command();

program
  .version("1.0.0")
  .description("CLI that goes with the webpack-ts-template")
  .parse(process.argv);

program
  .command("create-page")
  .description("create a new page")
  .argument("<string>", "page name")
  .action(async (str, options) => {
    createPage({ pageName: str });
    console.log(`Created page ${str} at src/pages/${str}`);
  });

program.parse();
