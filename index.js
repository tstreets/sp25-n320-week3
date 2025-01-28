#!/usr/bin/env node

const readline = require("readline");
const path = require("path");
const fs = require("fs");

const isTestEnv = process.env.TEST;
if (isTestEnv) {
  if (!fs.existsSync(path.join(__dirname, "output"))) {
    fs.mkdirSync("output");
  }
}

const app = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function quitApp(err) {
  if (err) {
    console.log(err);
  }
  app.close();
}

function createProjectSetup() {
  app.question("Root Directory Name: ", function (rootDir) {
    const rootDirPath = process.env.TEST
      ? path.join(__dirname, "output", rootDir)
      : path.join(process.cwd(), rootDir);
    console.log("Creating root directory at", rootDirPath);

    try {
      if (!fs.existsSync(rootDirPath)) {
        fs.mkdirSync(rootDirPath);
      }

      app.question(
        "Include functions folder: (Y/n) ",
        function (includeFunctions) {
          if (includeFunctions.toLowerCase() === "y") {
            const functionsDirPath = path.join(rootDirPath, "functions");
            console.log("Creating functions folder");
            fs.mkdirSync(functionsDirPath);
          }

          console.log("Creating index.js file");
          fs.writeFileSync(path.join(rootDirPath, "index.js"), "");

          const gitIgnoreContent = fs.readFileSync(
            path.join(__dirname, "templates/gitignore.txt")
          );
          console.log("Creating .gitignore file");
          fs.writeFileSync(
            path.join(rootDirPath, ".gitignore"),
            gitIgnoreContent
          );

          console.log("Complete!");

          quitApp();
        }
      );
    } catch (e) {
      quitApp(e);
    }
  });
}

createProjectSetup();
