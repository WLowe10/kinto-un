"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const View_1 = __importDefault(require("./View"));
const kintoConfig = {
    views: []
};
class Kinto {
    constructor() {
        this.render = (name, props) => __awaiter(this, void 0, void 0, function* () {
            let view = yield this.views.find(view => view.name === name);
            if (!view)
                throw `View of name, "${name}" does not exist. Set up views in kinto.config.js`;
            let html = yield view.render(props);
            yield console.log(html);
        });
        this.views = kintoConfig.views.map(({ name, component, stable }) => {
            return new View_1.default({ name, component, stable: stable || false }, []);
        });
    }
    ;
}
;
exports.default = Kinto;
//# sourceMappingURL=Kinto.js.map