import * as ReactDOMServer from 'react-dom/server';
import React from "react";
import KintoRoot from './KintoRoot';
import fs from "fs";
import path from "path";

//REWORK FILE TO WORK AS .ts


class View {
    id: string;
    buildDir: string;
    stable: boolean;
    Component: any;
    baseHTML: string;
    lastRender: {time?: number, html?: string, props?: {}}

    constructor({component, stable, name, buildDir}: {name: string, buildDir: string, stable: boolean, component: any}, dependencies: string[]) {
        this.id = name;
        this.buildDir = buildDir;
        this.stable = stable;
        this.baseHTML = "";
        this.lastRender = {};
        this.Component = component;
        this.init();
    }

    init = async () => {
        this.baseHTML = await this.convertToHtml()
    };

    render = async (props?: {}) => {
        await this.baseHTML;
        let lastProps = this.lastRender.props;
        let lastHtml = this.lastRender.html;
        let baseHtml = this.baseHTML;

        if (this.stable) {
            return lastHtml;
        };
        
        if (props && JSON.stringify(props) !== JSON.stringify(lastProps)) {
            return this.convertToHtml(props);
        } else {
            return baseHtml;
        }
    };

    convertToHtml = async (props?: {}) => {
        let doesViewHaveCss = fs.existsSync(path.join(this.buildDir, `./static/css/${this.id}.css`));
        
        let html = await ReactDOMServer.renderToString(<KintoRoot id={this.id} css={doesViewHaveCss} js={false}><this.Component {...props}/></KintoRoot>);        
        this.snapshot({html, props});
        return html;
    };

    snapshot = ({html, props}: {html: string, props?: {}}) => {
        this.lastRender = {time: Date.now(), html, props};
    }
}

export default View;