import * as ReactDOMServer from 'react-dom/server';
import React from "react";

class View {
    id: string;
    name: string;
    stable: boolean;
    Component: any;
   // getServerProps?: (...args: any[]) => any;
    baseHTML: string;
    lastRender: {time?: number, html?: string, props?: {}}

    constructor({id, name, component, /*getServerProps,*/ stable}: {id: string, name: string, stable: boolean, component: any, /*getServerProps: (...args: any[]) => any */}, dependencies: string[]) {
        this.id = id;
        this.name = name;
        this.stable = stable;
        this.baseHTML = "";
        this.lastRender = {};
        this.Component = component;
       // this.getServerProps = getServerProps
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
        let renderProps = props;

        let html = await this.convertToHtml(renderProps);

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
        let view = React.createElement(this.Component, props);
        let html = await ReactDOMServer.renderToString(view);    
        this.snapshot({html, props});
        return html;
    };

    snapshot = ({html, props}: {html: string, props?: {}}) => {
        this.lastRender = {time: Date.now(), html, props};
    }
}

export default View;
