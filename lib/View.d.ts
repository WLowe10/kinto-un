import React from "react";
declare class View {
    name: string;
    stable: boolean;
    component: React.ComponentType;
    baseHTML: string;
    lastRender: {
        time?: number;
        html?: string;
        props?: {};
    };
    constructor({ component, stable, name }: {
        name: string;
        stable: boolean;
        component: React.ComponentType;
    }, dependencies: string[]);
    init: () => Promise<void>;
    render: (props?: {}) => Promise<string | undefined>;
    convertToHtml: (props?: {}) => Promise<string>;
    snapshot: ({ html, props }: {
        html: string;
        props?: {} | undefined;
    }) => void;
}
export default View;
