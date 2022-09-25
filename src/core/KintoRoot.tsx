import React from "react";

type Props = {
    children: JSX.Element,
    id: string,
    css: boolean,
    js: boolean
}

const KintoRoot = ({children, id, css, js}: Props) => {
    const cssURL = `./static/css/${id}.css`;

    return (
        <html lang="en">
        <head>
            <meta charSet="UTF-8" />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                {
                    css ? <link rel="stylesheet" href={cssURL}/> : null
                } 
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>document</title>
        </head>
        <body>
            <div id="root">
                {
                    children
                }
            </div>
        </body>
        </html>
    )
};

export default KintoRoot;