"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = __importDefault(require("node:test"));
const server_1 = require("react-dom/server");
const AppShell_1 = __importDefault(require("@/components/AppShell"));
(0, node_test_1.default)("AppShell renders provided content inside the main shell", () => {
    const markup = (0, server_1.renderToStaticMarkup)((0, jsx_runtime_1.jsx)(AppShell_1.default, { sidebar: (0, jsx_runtime_1.jsx)("aside", { children: "Custom sidebar" }), children: (0, jsx_runtime_1.jsx)("section", { children: "Dashboard content" }) }));
    strict_1.default.match(markup, /Custom sidebar/);
    strict_1.default.match(markup, /Dashboard content/);
    strict_1.default.match(markup, /max-w-\[96rem\]/);
});
