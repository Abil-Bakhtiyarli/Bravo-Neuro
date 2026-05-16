"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = __importDefault(require("node:test"));
const server_1 = require("react-dom/server");
const page_1 = __importDefault(require("./page"));
(0, node_test_1.default)("Transfers page renders branch-aware transfer lanes", async () => {
    const element = await (0, page_1.default)({
        searchParams: Promise.resolve({
            branch: "ganjlik",
        }),
        testStaticMode: true,
    });
    const markup = (0, server_1.renderToStaticMarkup)(element);
    strict_1.default.match(markup, /Transfers/);
    strict_1.default.match(markup, /Inter-branch transfer recommendations/);
    strict_1.default.match(markup, /Bravo Ganjlik/);
    strict_1.default.match(markup, /Value protected/);
    strict_1.default.match(markup, /Strawberries 250g/);
});
