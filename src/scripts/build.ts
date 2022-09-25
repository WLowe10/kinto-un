import fs from "fs";
import glob from "glob-promise";
import path from "path";
import esbuild from "esbuild";
import { v4 as uuidv4 } from 'uuid';

//detect if no views are present in client directory

class KintoBuilder {
  startTime: number;

  constructor() {
    this.startTime = Date.now();
  }

  build = async () => {
    await this.initDirs();

    let files = await glob("./client/**/*.view.{ts,tsx,js,jsx}");
    if (files) files.forEach((filePath) => {
      this.bundle(filePath)
    })
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
      write: false
    })
  
    if (!result.outputFiles) return;
        let jsContent = result.outputFiles[0].text;
        let cssContent = result.outputFiles[1] ? result.outputFiles[1].text : null;
            if (jsContent) this.writeJS(jsContent, id);
            if (cssContent) this.writeCSS(cssContent, id);

            await this.buildView(filePath, id)
            await this.map(id, name);
            await console.log(`Completed build in ${Date.now() - this.startTime}ms`);
  }

  buildView = async (filePath: string, id: string) => {
    //   let fileContent = await fs.readFileSync(filePath, "utf8")
    //   let result = await babel.transformSync(fileContent, {
    //     presets: [
    //         "@babel/preset-react",
    //         "@babel/preset-env",
    //         [
    //             "@babel/preset-typescript",
    //             {
    //                 isTSX: true,
    //                 allExtensions: true
    //             }
    //         ], 
    //     ],
    //     plugins: [
    //         [
    //             "babel-plugin-transform-remove-imports", {
    //               "test": "\\.(less|css)$"
    //             }
    //         ]
    //     ],
    // });
    // if(!result || !result.code) return;
    // fs.writeFileSync(`./build/views/${id}.view.js`, result.code);

    let result = await esbuild.build({
      entryPoints: [filePath],
      minify: false,
      legalComments: "none",
      bundle: true,
      outdir: 'out',
      write: false,
      format: "cjs"
    })

    let jsContent = result.outputFiles[0].text;
    if (!jsContent) return

    fs.writeFileSync(`./build/views/${id}.view.js`, jsContent);


  }

  writeJS = async (content: string, id: string) => {
    fs.writeFileSync(`./build/static/js/${id}.js`, content);
  }

  writeCSS = async (content: string, id: string) => {
    fs.writeFileSync(`./build/static/css/${id}.css`, content);
  }

  map = async (id: string, name: string) => {
    let kintoMapString = await fs.readFileSync("./build/kintomap.json", "utf8");
    let kintoMapJson = JSON.parse(kintoMapString);

    kintoMapJson.views.push({
      id, name
    });

    let stringifiedJson = JSON.stringify(kintoMapJson);
    fs.writeFileSync("./build/kintomap.json", stringifiedJson);
  }

  initDirs = async () => {
    !fs.existsSync("./build") && fs.mkdirSync("./build");
    !fs.existsSync("./build/views") && fs.mkdirSync("./build/views");
    !fs.existsSync("./build/static") && fs.mkdirSync("./build/static");
    !fs.existsSync("./build/static/css") && fs.mkdirSync("./build/static/css");
    !fs.existsSync("./build/static/js") && fs.mkdirSync("./build/static/js");
    !fs.existsSync("./build/kintomap.json") && fs.writeFileSync("./build/kintomap.json", JSON.stringify({views: []}));

    return true;
  }
}

const builder = new KintoBuilder().build();
