"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = __importDefault(require("node:test"));
const server_1 = require("react-dom/server");
const page_1 = __importDefault(require("./page"));
(0, node_test_1.default)("Forecast page renders branch-aware revenue outlook", async () => {
    const element = await (0, page_1.default)({
        searchParams: Promise.resolve({
            branch: "yasamal",
        }),
        testStaticMode: true,
    });
    const markup = (0, server_1.renderToStaticMarkup)(element);
    strict_1.default.match(markup, /Revenue forecast/i);
    strict_1.default.match(markup, /Four-week branch forecast/);
    strict_1.default.match(markup, /Bravo Yasamal/);
    strict_1.default.match(markup, /Forecast drivers/);
    strict_1.default.match(markup, /Projected revenue by category/);
});
