import React from "react"
import View from "./View";
import fs from "fs";
import glob from "glob-promise";
import path from "path";

type ViewType = {
    name: string,
    component: React.ComponentType,
    stable: boolean,
    render: (props?: {}) => {},
}

class Kinto {
    views: any[];
    buildDir: string | null;

    constructor() {
        this.views = [];
        this.buildDir = null;
    };

    render = async (name: string, props?: {}) => {
        if (!this.buildDir) throw `No build directory is set.`;
        if (!this.views.length) throw `No views exist, make sure to properly set the build directory`;
        let id = await this.nameToUUID(name);
        if (!id) throw `View of name, "${name}" does not exist. Please provide the correct name or build your app`;
        let view = await this.views.find(view => view.id === id);
        let html = await view.render(props);
        let document = await this.formatDocument(html, id)

        return document;
    };

    setDir = async (buildDir: string) => {
        this.buildDir = buildDir;
        await this.loadDir();
    };

    loadDir = async () => {
        if (!this.buildDir) return;
        let views = await glob(`views/*.view.js`, { cwd: this.buildDir });
        if (!views) return;

        for (let i = 0; i < views.length; i++) {
            let view = views[i];
            let component = await require(path.join(this.buildDir, view));
                component = component.default || component[Object.keys(component)[0]];
                let basename = path.basename(view);
                let nameMatch = basename.match(/^([^\.])+/);
                let name;
                nameMatch ? name = nameMatch[0] : name = null;

                if (!name || !component) return;
                    this.views.push(new View({component, name, stable: false, buildDir: this.buildDir}, []));
        }      
    }

    nameToUUID = async (name: string) => {
        if (!this.buildDir) return;
        let id;
        let kintoMapString = await fs.readFileSync(path.join(this.buildDir, "./kintomap.json"), "utf8");
        let kintoMapJson = JSON.parse(kintoMapString);
        let view = kintoMapJson.views.filter((view: {id: string, name: string}) => view.name === name)[0];
        view ? id = view.id : id = null;
        return id;
    };

    formatDocument = async (html: string, id: string) => {
        if (!this.buildDir) return;
        let doesViewHaveCss = await fs.existsSync(path.join(this.buildDir, `./static/css/${id}.css`));

        let document = `
            <html lang="en">
            <head>
                <meta charSet="UTF-8" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                ${ doesViewHaveCss ? `<link rel="stylesheet" href="./static/css/${id}.css" />` : "\n"}
                <script src="./static/js/${id}.js" defer></script>
                <title>document</title>
            </head>
            <body>
                <div id="root">
                    ${html}
                </div>
            </body>
            </html>
        `;

        return document;

    }
};

export default new Kinto;