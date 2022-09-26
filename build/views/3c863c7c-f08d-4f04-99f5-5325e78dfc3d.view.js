"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// test/client/components/Home.view.tsx
var Home_view_exports = {};
__export(Home_view_exports, {
  Home: () => Home
});
module.exports = __toCommonJS(Home_view_exports);
var import_react = require("react");

// test/client/components/Mini.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var Mini = () => {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
    children: "Mini!"
  });
};

// test/client/components/Home.view.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
var Home = ({ number }) => {
  const [state, setState] = (0, import_react.useState)(0);
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", {
    children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("p", {
      children: [
        "home, ",
        number || "no number",
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", {
          onClick: () => setState((prev) => prev + 1),
          children: state
        }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Mini, {})
      ]
    })
  });
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Home
});
