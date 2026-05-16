"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = __importDefault(require("node:test"));
const server_1 = require("react-dom/server");
const Sidebar_1 = __importDefault(require("./Sidebar"));
(0, node_test_1.default)("Sidebar enables the live detail pages and keeps future sections disabled", () => {
    const markup = (0, server_1.renderToStaticMarkup)((0, jsx_runtime_1.jsx)(Sidebar_1.default, { pathnameOverride: "/risk" }));
    strict_1.default.match(markup, /href="\/risk"/);
    strict_1.default.match(markup, /href="\/actions"/);
    strict_1.default.match(markup, /href="\/branches"/);
    strict_1.default.match(markup, /aria-current="page"/);
    strict_1.default.match(markup, /src="\/bravo-neuro-logo\.svg"/);
    strict_1.default.match(markup, /Live snapshot/);
    strict_1.default.match(markup, /Overview, risk, actions, and branches stay in one branch context/);
    strict_1.default.match(markup, /Soon/);
    strict_1.default.doesNotMatch(markup, /Demo Mode/);
});
