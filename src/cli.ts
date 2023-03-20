#!/usr/bin/env node

import minimist from "minimist";
import { ApiHandler } from "./index";

main(
  minimist(process.argv.slice(2), {
    alias: {
      help: ["h"],
      input: ["i"],
      output: ["o"],
    },
  })
);

/**
 * Function to handle cli calls
 *
 * @param {minimist.ParsedArgs} argv
 */
async function main(argv: minimist.ParsedArgs) {
  if (argv.help) {
    printHelp();
    process.exit(0);
  }

  const argIn: string = argv._[0] || argv.input;
  const argOut: string = argv._[1] || argv.output;

  try {
    const apiHandler = new ApiHandler({
      ymlPath: argIn,
      schemasOutDir: argOut,
    });

    await apiHandler.createJSONSchemas();

    process.stdout.write("Schema Generated");
  } catch (e) {
    error(e);
    process.exit(1);
  }
}

/** Print Help Text */
function printHelp() {
  const pkg = require("../../package.json");

  process.stdout.write(
    `
${pkg.name} ${pkg.version}
Usage: generate-schemas [--input, -i] [OPEN_API_YML] [--output, -o] [SCHEMA_OUT_DIR] [OPTIONS]
`
  );
}

type LogStyle =
  | "blue"
  | "cyan"
  | "green"
  | "magenta"
  | "red"
  | "white"
  | "yellow";

/**
 * Error Logging
 *
 * @param {...any[]} messages
 * @returns {any} {void}
 */
function error(...messages: any[]): void {
  if (!process.env.VERBOSE) {
    return console.error(messages);
  }
  console.error(getStyledTextForLogging("red")?.("error"), ...messages);
}

/**
 * Format Log with different colors
 *
 * @param {LogStyle} style
 * @returns {any} {(((text: string) => string) | undefined)}
 */
function getStyledTextForLogging(
  style: LogStyle
): ((text: string) => string) | undefined {
  if (!process.env.VERBOSE) {
    return;
  }
  switch (style) {
    case "blue":
      return require("cli-color").whiteBright.bgBlue;
    case "cyan":
      return require("cli-color").whiteBright.bgCyan;
    case "green":
      return require("cli-color").whiteBright.bgGreen;
    case "magenta":
      return require("cli-color").whiteBright.bgMagenta;
    case "red":
      return require("cli-color").whiteBright.bgRedBright;
    case "white":
      return require("cli-color").black.bgWhite;
    case "yellow":
      return require("cli-color").whiteBright.bgYellow;
  }
}
