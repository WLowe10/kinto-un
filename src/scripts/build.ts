#! /usr/bin/env node
import fs from "fs";
import glob from "glob-promise";
import path from "path";
import esbuild from "esbuild";
import { v4 as uuidv4 } from 'uuid';
import yargs, { parse } from "yargs";
import * as acorn from "acorn";
import { transformSync } from "@babel/core";
//detect if no views are present in client directory

const args: any = yargs
.option('src', {
    description: "Directory of kinto views",
    demand: true,
    type: "string"
})
.option('out', {
    description: "Desired output directory for build. Default is CWD",
    demand: false,
    type: "string"
}).parse();

class KintoBuilder {
  startTime: number;
  rootDir: string;
  outDir: string;

  constructor() {
    this.startTime = Date.now();
    this.rootDir = process.cwd();
    this.outDir = ( args.out ? path.join(this.rootDir, args.out) :  this.rootDir);
  }

  build = async () => {
     let files = await glob(`${args.src}/**/*.view.{ts,tsx,js,jsx}`);
     if (!files.length) return console.log("No views were found in the directory provided");
    console.log(files)
     await console.log(`Building (${files.length}) view${files.length > 1 ? "s" : ""}`)
     await this.initDirs();

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
    
    // let result = await esbuild.build({
    //   entryPoints: [filePath],
    //   legalComments: "none",
    //   jsx: "automatic",
    //   outdir: 'out',
    //   minify: false, 
    //   bundle: true,
    //   write: false,
    //   define: {
    //     "process.env.VIEW": "false"
    //   },
    //   loader: {
    //     ".png": "file",
    //   },
    // })
  
    // if (!result.outputFiles) return;
    //     let jsContent = result.outputFiles[0].text;
    //     let cssContent = result.outputFiles[1] ? result.outputFiles[1].text : null;
    //         if (jsContent) this.writeJS(jsContent, id);
    //         if (cssContent) this.writeCSS(cssContent, id);

    //         await this.buildView(filePath, id)
    //         await this.map(id, name);
    let content = await fs.readFileSync(filePath, "utf8")

   // let ast = await acorn.parse(content, {ecmaVersion: 2020, sourceType: "module"})
    //console.log(ast)

    // const { code, map, ast }: any = await transformFromAstSync(ast, content)


  }

  buildView = async (filePath: string, id: string) => {
      let result = await esbuild.build({
      entryPoints: [filePath],
      legalComments: "none",
      platform: "node",
      outdir: "out",
      write: false,
      minify: false,
      loader: {
        ".png": "dataurl"
      },
      bundle: true,
      define: {
        "process.env.VIEW": "true"
      },
      external: ["react", "react-dom"]
    })

    let jsContent = result.outputFiles[0].text;
    if (!jsContent) return

    fs.writeFileSync(path.join(this.outDir, `./build/views/${id}.view.js`), jsContent);
  }

  writeJS = async (content: string, id: string) => {
    fs.writeFileSync(path.join(this.outDir, `./build/static/js/${id}.js`), content);
  }

  writeCSS = async (content: string, id: string) => {
    fs.writeFileSync(path.join(this.outDir, `./build/static/css/${id}.css`), content);
  }

  map = async (id: string, name: string) => {
    let kintoMapString = await fs.readFileSync(path.join(this.outDir, "./build/kintomap.json"), "utf8");
    let kintoMapJson = JSON.parse(kintoMapString);

    kintoMapJson.views.push({
      id, name
    });

    let stringifiedJson = JSON.stringify(kintoMapJson);
    fs.writeFileSync(path.join(this.outDir, "./build/kintomap.json"), stringifiedJson);
  }

  initDirs = async () => {
    await fs.existsSync(path.join(this.outDir, "./build")) && fs.rmSync(path.join(this.outDir, "./build"), { recursive: true });
    !fs.existsSync(path.join(this.outDir, "./build")) && fs.mkdirSync(path.join(this.outDir, "./build"));
    !fs.existsSync(path.join(this.outDir, "./build/views")) && fs.mkdirSync(path.join(this.outDir, "./build/views"));
    !fs.existsSync(path.join(this.outDir, "./build/static")) && fs.mkdirSync(path.join(this.outDir, "./build/static"));
    !fs.existsSync(path.join(this.outDir, "./build/static/css")) && fs.mkdirSync(path.join(this.outDir, "./build/static/css"));
    !fs.existsSync(path.join(this.outDir, "./build/static/js")) && fs.mkdirSync(path.join(this.outDir, "./build/static/js"));
    !fs.existsSync(path.join(this.outDir, "./build/kintomap.json")) && fs.writeFileSync(path.join(this.outDir, "./build/kintomap.json"), JSON.stringify({views: []}));

    return true;
  }
}

const builder = new KintoBuilder();
      builder.build();
