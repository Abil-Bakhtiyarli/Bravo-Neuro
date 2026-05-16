"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = __importDefault(require("node:test"));
const server_1 = require("react-dom/server");
const page_1 = __importDefault(require("./page"));
(0, node_test_1.default)("Risk page renders the detail header and full risk table surface", async () => {
    const element = await (0, page_1.default)({
        searchParams: Promise.resolve({
            branch: "ganjlik",
            product: "greek-yogurt-500g",
            q: "yogurt",
            risk: "critical",
        }),
        testStaticMode: true,
    });
    const markup = (0, server_1.renderToStaticMarkup)(element);
    strict_1.default.match(markup, /Risk products/);
    strict_1.default.match(markup, /Search product or category/);
    strict_1.default.match(markup, /Rows in view/);
});
