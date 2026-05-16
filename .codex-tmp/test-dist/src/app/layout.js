"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
exports.default = RootLayout;
const jsx_runtime_1 = require("react/jsx-runtime");
require("./globals.css");
exports.metadata = {
    title: "Bravo Neuro",
    description: "Bootstrap for the Bravo Neuro retail waste-risk dashboard.",
};
function RootLayout({ children, }) {
    return ((0, jsx_runtime_1.jsx)("html", { lang: "en", className: "h-full antialiased", children: (0, jsx_runtime_1.jsx)("body", { className: "min-h-full flex flex-col", children: children }) }));
}
