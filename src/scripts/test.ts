import { transformSync, traverse } from "@babel/core";
import generate from "@babel/generator";
import fs from "fs";

const main = async () => {
    let fileContent = await fs.readFileSync("./test/client/Home.view.tsx", "utf8");
    let result = await transformSync(fileContent, {
        ast: true,
        presets: ["@babel/preset-env", "@babel/preset-react", [
            "@babel/preset-typescript", {
            isTSX: true,
            allExtensions: true,
            }
          ]
        ],
        comments: false,
    });

    const ast = result?.ast;
    const code = result?.code;

    if (!ast) return;

    traverse(ast, {
        VariableDeclaration: (path: any) => {
            if (path.node.declarations[0].id.name === "getServerProps") path.remove()
        },

        ExpressionStatement: (path: any) => {
            let left = path.node.expression.left || false;
            if (!left) return;

            let property = left.property;
            if (!property) return;

            let name = property.name;
            if (!name) return;
            
            if (name === "getServerProps") path.remove()
        },
        
    })
    

   ast.program.body.unshift({
    type: "VariableDeclaration",
    kind: "const",
    declarations: [
        {
            type: "VariableDeclarator",
            id: {
                type: "Identifier",
                name: "_test"
            },
            init: {
                type: "CallExpression",
                callee: {
                    type: "Identifier",
                    name: "require",
                },
                arguments: [
                    {
                        type: "StringLiteral",
                        value: "test"
                    }
                ]
            }
        }
    ]

   })
    console.log(generate(ast))

};

main();
