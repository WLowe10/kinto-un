import * as ReactDOMServer from 'react-dom/server';
import React from "react"
import View from "./View";
import fs from "fs";

const kintoConfig = {
    views: []
}

type ViewType = {
    name: string,
    component: React.ComponentType,
    stable: boolean
}

class Kinto {
    views: any[];

    constructor() {
        this.views = kintoConfig.views.map(({name, component, stable}: ViewType) => {
            return new View({name, component, stable: stable || false}, []);
        })
    };

    render = async (name: string, props?: {}) => {
        let view = await this.views.find(view => view.name === name);
        if (!view) throw `View of name, "${name}" does not exist. Set up views in kinto.config.js`;
        let html = await view.render(props);
        await console.log(html)
    }
};

export default Kinto;