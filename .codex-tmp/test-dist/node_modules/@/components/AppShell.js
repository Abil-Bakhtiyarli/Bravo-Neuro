"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AppShell;
const jsx_runtime_1 = require("react/jsx-runtime");
const Sidebar_1 = __importDefault(require("@/components/Sidebar"));
function AppShell({ children, sidebar }) {
    return ((0, jsx_runtime_1.jsx)("main", { className: "min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.96),_rgba(241,245,249,0.92)_40%,_rgba(226,232,240,0.9)_100%)] text-foreground lg:h-screen lg:overflow-hidden", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex min-h-screen flex-col lg:h-screen lg:min-h-0 lg:flex-row", children: [sidebar ?? (0, jsx_runtime_1.jsx)(Sidebar_1.default, {}), (0, jsx_runtime_1.jsx)("section", { className: "min-w-0 flex-1 lg:min-h-0 lg:overflow-y-auto", children: (0, jsx_runtime_1.jsx)("div", { className: "mx-auto w-full max-w-[96rem] px-4 py-5 sm:px-6 sm:py-6 lg:px-7 lg:py-7", children: children }) })] }) }));
}
