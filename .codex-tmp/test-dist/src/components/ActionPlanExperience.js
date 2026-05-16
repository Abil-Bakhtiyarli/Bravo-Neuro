"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ActionPlanExperience;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const navigation_1 = require("next/navigation");
const DailyActionPlan_1 = __importDefault(require("./DailyActionPlan"));
const ProductRiskDrawer_1 = __importDefault(require("./ProductRiskDrawer"));
function buildUrl(pathname, searchParams) {
    const query = searchParams.toString();
    return query ? `${pathname}?${query}` : pathname;
}
function updateProductSearchParam(current, productId) {
    if (productId) {
        current.set("product", productId);
    }
    else {
        current.delete("product");
    }
    return current;
}
function ActionPlanExperience({ branchId, tasks, productDetailsById, initialRequestedProductId = null, staticMode = false, }) {
    const pathname = (0, navigation_1.usePathname)();
    const searchParams = (0, navigation_1.useSearchParams)();
    const requestedProductId = searchParams?.get("product") ?? initialRequestedProductId;
    const selectedDetail = (0, react_1.useMemo)(() => {
        if (!requestedProductId) {
            return null;
        }
        return productDetailsById[requestedProductId] ?? null;
    }, [productDetailsById, requestedProductId]);
    (0, react_1.useEffect)(() => {
        if (!requestedProductId || selectedDetail) {
            return;
        }
        const nextParams = updateProductSearchParam(new URLSearchParams(searchParams?.toString() ?? ""), null);
        window.history.replaceState(null, "", buildUrl(pathname, nextParams));
    }, [pathname, requestedProductId, searchParams, selectedDetail]);
    function handleDrawerOpenChange(open) {
        if (open) {
            return;
        }
        const nextParams = updateProductSearchParam(new URLSearchParams(searchParams?.toString() ?? ""), null);
        window.history.replaceState(null, "", buildUrl(pathname, nextParams));
    }
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(DailyActionPlan_1.default, { branchId: branchId, tasks: tasks, selectedProductId: selectedDetail?.product.productId ?? null, staticMode: staticMode }), (0, jsx_runtime_1.jsx)(ProductRiskDrawer_1.default, { detail: selectedDetail, open: selectedDetail !== null, onOpenChange: handleDrawerOpenChange })] }));
}
