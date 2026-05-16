"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RiskTableExperience;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const navigation_1 = require("next/navigation");
const riskTableInteraction_1 = require("@/lib/riskTableInteraction");
const ProductRiskDrawer_1 = __importDefault(require("./ProductRiskDrawer"));
const RiskTable_1 = __importDefault(require("./RiskTable"));
function buildUrl(pathname, searchParams) {
    const query = searchParams.toString();
    return query ? `${pathname}?${query}` : pathname;
}
function RiskTableExperience({ rows, productDetailsById, initialRequestedProductId = null, initialQuery = "", initialRiskFilter = "all", }) {
    const pathname = (0, navigation_1.usePathname)();
    const searchParams = (0, navigation_1.useSearchParams)();
    const query = searchParams?.get("q") ?? initialQuery;
    const requestedRiskFilter = searchParams?.get("risk");
    const riskFilter = requestedRiskFilter
        ? (0, riskTableInteraction_1.parseRiskTableFilterValue)(requestedRiskFilter)
        : initialRiskFilter;
    const requestedProductId = searchParams?.get("product") ?? initialRequestedProductId;
    const filteredRows = (0, react_1.useMemo)(() => (0, riskTableInteraction_1.filterRiskTableRows)(rows, query, riskFilter), [query, riskFilter, rows]);
    const selectedProductId = (0, react_1.useMemo)(() => (0, riskTableInteraction_1.getVisibleSelectedProductId)(filteredRows, requestedProductId), [filteredRows, requestedProductId]);
    const selectedDetail = selectedProductId ? (productDetailsById[selectedProductId] ?? null) : null;
    (0, react_1.useEffect)(() => {
        if (requestedProductId === selectedProductId) {
            return;
        }
        const nextParams = (0, riskTableInteraction_1.updateRiskTableSearchParams)(new URLSearchParams(searchParams?.toString() ?? ""), {
            product: selectedProductId,
        });
        window.history.replaceState(null, "", buildUrl(pathname, nextParams));
    }, [pathname, requestedProductId, searchParams, selectedProductId]);
    function handleSelectProduct(productId) {
        const nextParams = (0, riskTableInteraction_1.updateRiskTableSearchParams)(new URLSearchParams(searchParams?.toString() ?? ""), {
            product: productId,
        });
        window.history.pushState(null, "", buildUrl(pathname, nextParams));
    }
    function handleSearchChange(nextQuery) {
        const nextFilteredRows = (0, riskTableInteraction_1.filterRiskTableRows)(rows, nextQuery, riskFilter);
        const nextSelectedProductId = (0, riskTableInteraction_1.getVisibleSelectedProductId)(nextFilteredRows, requestedProductId);
        const nextParams = (0, riskTableInteraction_1.updateRiskTableSearchParams)(new URLSearchParams(searchParams?.toString() ?? ""), {
            q: nextQuery,
            product: nextSelectedProductId,
        });
        window.history.replaceState(null, "", buildUrl(pathname, nextParams));
    }
    function handleRiskFilterChange(nextRiskFilter) {
        const nextFilteredRows = (0, riskTableInteraction_1.filterRiskTableRows)(rows, query, nextRiskFilter);
        const nextSelectedProductId = (0, riskTableInteraction_1.getVisibleSelectedProductId)(nextFilteredRows, requestedProductId);
        const nextParams = (0, riskTableInteraction_1.updateRiskTableSearchParams)(new URLSearchParams(searchParams?.toString() ?? ""), {
            risk: nextRiskFilter,
            product: nextSelectedProductId,
        });
        window.history.replaceState(null, "", buildUrl(pathname, nextParams));
    }
    function handleDrawerOpenChange(open) {
        if (open) {
            return;
        }
        const nextParams = (0, riskTableInteraction_1.updateRiskTableSearchParams)(new URLSearchParams(searchParams?.toString() ?? ""), {
            product: null,
        });
        window.history.replaceState(null, "", buildUrl(pathname, nextParams));
    }
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(RiskTable_1.default, { rows: filteredRows, searchValue: query, riskFilter: riskFilter, selectedProductId: selectedProductId, onSearchChange: handleSearchChange, onRiskFilterChange: handleRiskFilterChange, onSelectProduct: handleSelectProduct }), (0, jsx_runtime_1.jsx)(ProductRiskDrawer_1.default, { detail: selectedDetail, open: selectedDetail !== null, onOpenChange: handleDrawerOpenChange })] }));
}
