"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DashboardOverview;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const navigation_1 = require("next/navigation");
const optionalAppRouter_1 = require("@/lib/optionalAppRouter");
const BranchComparisonCard_1 = __importDefault(require("./BranchComparisonCard"));
const CompactDashboardHeader_1 = __importDefault(require("./CompactDashboardHeader"));
const MonthlySavingsChart_1 = __importDefault(require("./MonthlySavingsChart"));
const ProductRiskDrawer_1 = __importDefault(require("./ProductRiskDrawer"));
const SummaryKpiGrid_1 = __importDefault(require("./SummaryKpiGrid"));
const TodayDecisionCard_1 = __importDefault(require("./TodayDecisionCard"));
const TopRiskProductsCard_1 = __importDefault(require("./TopRiskProductsCard"));
function buildUrl(pathname, searchParams) {
    const query = searchParams.toString();
    return query ? `${pathname}?${query}` : pathname;
}
function updateProductSearchParam(current, productId) {
    const next = new URLSearchParams(current.toString());
    if (productId) {
        next.set("product", productId);
    }
    else {
        next.delete("product");
    }
    return next;
}
function DashboardOverview({ branches, selectedBranchId, generatedAt, branchName, kpiItems, actionPlan, riskTable, productDetailsById, monthlySavingsSeries, branchComparisons, initialRequestedProductId = null, staticMode = false, }) {
    const pathname = (0, navigation_1.usePathname)();
    const router = (0, optionalAppRouter_1.useOptionalAppRouter)();
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
        const nextParams = updateProductSearchParam(searchParams ?? new URLSearchParams(), null);
        router?.replace(buildUrl(pathname, nextParams), { scroll: false });
    }, [pathname, requestedProductId, router, searchParams, selectedDetail]);
    function handleOpenProduct(productId) {
        const nextParams = updateProductSearchParam(searchParams ?? new URLSearchParams(), productId);
        router?.push(buildUrl(pathname, nextParams), { scroll: false });
    }
    function handleDrawerOpenChange(open) {
        if (open) {
            return;
        }
        const nextParams = updateProductSearchParam(searchParams ?? new URLSearchParams(), null);
        router?.replace(buildUrl(pathname, nextParams), { scroll: false });
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col gap-6", children: [(0, jsx_runtime_1.jsx)(CompactDashboardHeader_1.default, { branches: branches, selectedBranchId: selectedBranchId, generatedAt: generatedAt, staticMode: staticMode }), (0, jsx_runtime_1.jsx)(SummaryKpiGrid_1.default, { items: kpiItems }), (0, jsx_runtime_1.jsxs)("div", { className: "grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(22rem,0.95fr)] xl:items-start", children: [(0, jsx_runtime_1.jsx)(MonthlySavingsChart_1.default, { branchName: branchName, series: monthlySavingsSeries }), (0, jsx_runtime_1.jsx)(TodayDecisionCard_1.default, { primaryTask: actionPlan[0] ?? null, fallbackRiskRow: riskTable[0] ?? null, detail: actionPlan[0]
                            ? (productDetailsById[actionPlan[0].productId] ?? null)
                            : riskTable[0]
                                ? (productDetailsById[riskTable[0].productId] ?? null)
                                : null, onOpenProduct: handleOpenProduct })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(22rem,0.8fr)] xl:items-start", children: [(0, jsx_runtime_1.jsx)(TopRiskProductsCard_1.default, { rows: riskTable, productDetailsById: productDetailsById, selectedProductId: selectedDetail?.product.productId ?? null, onOpenProduct: handleOpenProduct }), (0, jsx_runtime_1.jsx)(BranchComparisonCard_1.default, { comparisons: branchComparisons })] }), (0, jsx_runtime_1.jsx)(ProductRiskDrawer_1.default, { detail: selectedDetail, open: selectedDetail !== null, onOpenChange: handleDrawerOpenChange })] }));
}
