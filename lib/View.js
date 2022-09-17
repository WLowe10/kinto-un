"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ReactDOMServer = __importStar(require("react-dom/server"));
class View {
    constructor({ component, stable, name }, dependencies) {
        this.init = () => __awaiter(this, void 0, void 0, function* () {
            this.baseHTML = yield this.convertToHtml();
        });
        this.render = (props) => __awaiter(this, void 0, void 0, function* () {
            let lastProps = this.lastRender.props;
            let lastHtml = this.lastRender.html;
            if (this.stable) {
                return this.lastRender.html;
            }
            ;
            if (props && JSON.stringify(props) !== JSON.stringify(lastProps)) {
                return this.convertToHtml(props);
            }
            ;
            if (!props)
                return this.baseHTML;
            return lastHtml;
        });
        this.convertToHtml = (props) => __awaiter(this, void 0, void 0, function* () {
            console.log("rendering");
            let html = yield ReactDOMServer.renderToStaticMarkup((0, jsx_runtime_1.jsx)(this.component, Object.assign({}, props)));
            this.snapshot({ html, props });
            return html;
        });
        this.snapshot = ({ html, props }) => {
            this.lastRender = { time: Date.now(), html, props };
        };
        this.name = name;
        this.stable = stable;
        this.baseHTML = "";
        this.lastRender = {};
        this.component = component;
        this.init();
    }
}
exports.default = View;
//# sourceMappingURL=View.js.map