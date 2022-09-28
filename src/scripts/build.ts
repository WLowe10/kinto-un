#! /usr/bin/env node
import fs from "fs";
import glob from "glob-promise";
import path from "path";
import esbuild from "esbuild";
import { v4 as uuidv4 } from 'uuid';
//detect if no views are present in client directory

const [,, ...args] = process.argv;

class KintoBuilder {
  startTime: number;
  rootDir: string;

  constructor() {
    this.startTime = Date.now();
    this.rootDir = process.cwd();
  }

  build = async () => {
    await this.initDirs();

    let files = await glob("**/*.view.{ts,tsx,js,jsx}", { ignore: ["*/build/**"] });

    files.forEach((filePath) => {
      this.bundle(filePath)
    })

    await console.log(`Completed build in ${Date.now() - this.startTime}ms`);
  }

  bundle = async (filePath: string) => {
    let id = uuidv4();
    let basename = path.basename(filePath);
    let nameMatch = basename.match(/^([^\.])+/);
    let name;
    nameMatch ? name = nameMatch[0] : name = null;
    if (!name) return
    
    let result = await esbuild.build({
      entryPoints: [filePath],
      minify: true,
      legalComments: "none",
      bundle: true,
      outdir: 'out',
      jsx: "automatic",
      write: false
    })
  
    if (!result.outputFiles) return;
        let jsContent = result.outputFiles[0].text;
        let cssContent = result.outputFiles[1] ? result.outputFiles[1].text : null;
            if (jsContent) this.writeJS(jsContent, id);
            if (cssContent) this.writeCSS(cssContent, id);

            await this.buildView(filePath, id)
            await this.map(id, name);
  }

  buildView = async (filePath: string, id: string) => {
      let result = await esbuild.build({
      entryPoints: [filePath],
      minify: false,
      legalComments: "none",
      bundle: true,
      outdir: "out",
      write: false,
      platform: "node",
      external: ["react"]
    })

    let jsContent = result.outputFiles[0].text;
    if (!jsContent) return

    fs.writeFileSync(path.join(this.rootDir, `./build/views/${id}.view.js`), jsContent);
  }

  writeJS = async (content: string, id: string) => {
    fs.writeFileSync(path.join(this.rootDir, `./build/static/js/${id}.js`), content);
  }

  writeCSS = async (content: string, id: string) => {
    fs.writeFileSync(path.join(this.rootDir, `./build/static/css/${id}.css`), content);
  }

  map = async (id: string, name: string) => {
    let kintoMapString = await fs.readFileSync(path.join(this.rootDir, "./build/kintomap.json"), "utf8");
    let kintoMapJson = JSON.parse(kintoMapString);

    kintoMapJson.views.push({
      id, name
    });

    let stringifiedJson = JSON.stringify(kintoMapJson);
    fs.writeFileSync(path.join(this.rootDir, "./build/kintomap.json"), stringifiedJson);
  }

  initDirs = async () => {
    await fs.rmSync(path.join(this.rootDir, "./build"), { recursive: true });
    !fs.existsSync(path.join(this.rootDir, "./build")) && fs.mkdirSync(path.join(this.rootDir, "./build"));
    !fs.existsSync(path.join(this.rootDir, "./build/views")) && fs.mkdirSync(path.join(this.rootDir, "./build/views"));
    !fs.existsSync(path.join(this.rootDir, "./build/static")) && fs.mkdirSync(path.join(this.rootDir, "./build/static"));
    !fs.existsSync(path.join(this.rootDir, "./build/static/css")) && fs.mkdirSync(path.join(this.rootDir, "./build/static/css"));
    !fs.existsSync(path.join(this.rootDir, "./build/static/js")) && fs.mkdirSync(path.join(this.rootDir, "./build/static/js"));
    !fs.existsSync(path.join(this.rootDir, "./build/kintomap.json")) && fs.writeFileSync(path.join(this.rootDir, "./build/kintomap.json"), JSON.stringify({views: []}));

    return true;
  }
}

const builder = new KintoBuilder();
      builder.build();
