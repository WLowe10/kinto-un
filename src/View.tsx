import * as ReactDOMServer from 'react-dom/server';
import React from "react";

class View {
    name: string;
    stable: boolean;
    component: React.ComponentType;
    baseHTML: string;
    lastRender: {time?: number, html?: string, props?: {}}

    constructor({component, stable, name}: {name: string, stable: boolean, component: React.ComponentType}, dependencies: string[]) {
        this.name = name;
        this.stable = stable;
        this.baseHTML = "";
        this.lastRender = {};
        this.component = component;

        this.init();
    }

    init = async () => {
        this.baseHTML = await this.convertToHtml();
    };

    render = async (props?: {}) => {
        let lastProps = this.lastRender.props;
        let lastHtml = this.lastRender.html;

        if (this.stable) {
            return this.lastRender.html;
        };
        
        if (props && JSON.stringify(props) !== JSON.stringify(lastProps)) {
            return this.convertToHtml(props);
        };

        if (!props) return this.baseHTML;

        return lastHtml;
    };

    convertToHtml = async (props?: {}) => {
        console.log("rendering")
        let html = await ReactDOMServer.renderToStaticMarkup(<this.component {...props}/>);
        this.snapshot({html, props});
        return html;
    };

    snapshot = ({html, props}: {html: string, props?: {}}) => {
        this.lastRender = {time: Date.now(), html, props};
    }
}

export default View;