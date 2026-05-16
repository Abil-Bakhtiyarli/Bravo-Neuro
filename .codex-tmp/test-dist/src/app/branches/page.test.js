"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = __importDefault(require("node:test"));
const server_1 = require("react-dom/server");
const page_1 = __importDefault(require("./page"));
(0, node_test_1.default)("Branches page renders all branch comparison summaries", async () => {
    const element = await (0, page_1.default)({
        searchParams: Promise.resolve({
            branch: "ganjlik",
        }),
        testStaticMode: true,
    });
    const markup = (0, server_1.renderToStaticMarkup)(element);
    strict_1.default.match(markup, /Branch comparison/);
    strict_1.default.match(markup, /Bravo Ganjlik/);
    strict_1.default.match(markup, /Bravo Yasamal/);
    strict_1.default.match(markup, /Bravo 28 May/);
    strict_1.default.match(markup, /Protected value/);
});
