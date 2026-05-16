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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = __importDefault(require("node:test"));
const server_1 = require("react-dom/server");
const dashboardData_1 = require("@/lib/dashboardData");
const ProductRiskDrawer_1 = __importStar(require("./ProductRiskDrawer"));
const detail = (0, dashboardData_1.getDashboardData)("ganjlik").productDetailsById["greek-yogurt-500g"];
(0, node_test_1.default)("ProductRiskDrawer renders the selected product story when open", () => {
    strict_1.default.ok(detail);
    const markup = (0, server_1.renderToStaticMarkup)((0, jsx_runtime_1.jsx)(ProductRiskDrawer_1.ProductRiskDrawerContent, { detail: detail, withinDialog: false }));
    strict_1.default.match(markup, /Greek Yogurt 500g/);
    strict_1.default.match(markup, /Risk score/);
    strict_1.default.match(markup, /Top drivers/);
    strict_1.default.match(markup, /Explanation/);
    strict_1.default.match(markup, /Recommended action/);
    strict_1.default.match(markup, /Launch markdown today/);
    strict_1.default.match(markup, /Base markdown/);
    strict_1.default.match(markup, /Savings comparison/);
    strict_1.default.match(markup, /Without action/);
    strict_1.default.match(markup, /With action/);
    strict_1.default.match(markup, /Action cost/);
    strict_1.default.match(markup, /Product detail/);
    strict_1.default.doesNotMatch(markup, /Product detail drawer/);
});
(0, node_test_1.default)("ProductRiskDrawer omits content when closed", () => {
    const markup = (0, server_1.renderToStaticMarkup)((0, jsx_runtime_1.jsx)(ProductRiskDrawer_1.default, { detail: detail ?? null, open: false, onOpenChange: () => undefined }));
    strict_1.default.doesNotMatch(markup, /Greek Yogurt 500g/);
    strict_1.default.doesNotMatch(markup, /Recommendation card/);
});
