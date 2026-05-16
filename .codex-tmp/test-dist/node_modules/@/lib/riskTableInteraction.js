"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryLabels = exports.DEFAULT_RISK_TABLE_FILTER = void 0;
exports.isRiskTableFilterValue = isRiskTableFilterValue;
exports.parseRiskTableFilterValue = parseRiskTableFilterValue;
exports.normalizeRiskTableQuery = normalizeRiskTableQuery;
exports.filterRiskTableRows = filterRiskTableRows;
exports.getSelectedRiskTableRow = getSelectedRiskTableRow;
exports.getVisibleSelectedProductId = getVisibleSelectedProductId;
exports.updateRiskTableSearchParams = updateRiskTableSearchParams;
exports.DEFAULT_RISK_TABLE_FILTER = "all";
exports.categoryLabels = {
    dairy: "Dairy",
    bakery: "Bakery",
    "fruits-vegetables": "Fruit & veg",
    drinks: "Drinks",
};
function isRiskTableFilterValue(value) {
    return value === "all" || value === "medium" || value === "high" || value === "critical";
}
function parseRiskTableFilterValue(value) {
    return isRiskTableFilterValue(value) ? value : exports.DEFAULT_RISK_TABLE_FILTER;
}
function normalizeRiskTableQuery(value) {
    return value?.trim() ?? "";
}
function filterRiskTableRows(rows, query, riskFilter) {
    const normalizedQuery = normalizeRiskTableQuery(query).toLowerCase();
    return rows.filter((row) => {
        if (riskFilter !== "all" && row.riskLevel !== riskFilter) {
            return false;
        }
        if (!normalizedQuery) {
            return true;
        }
        const categoryLabel = exports.categoryLabels[row.category].toLowerCase();
        return (row.productName.toLowerCase().includes(normalizedQuery) ||
            categoryLabel.includes(normalizedQuery));
    });
}
function getSelectedRiskTableRow(rows, selectedProductId) {
    if (!selectedProductId) {
        return null;
    }
    return rows.find((row) => row.productId === selectedProductId) ?? null;
}
function getVisibleSelectedProductId(rows, selectedProductId) {
    return getSelectedRiskTableRow(rows, selectedProductId)?.productId ?? null;
}
function updateRiskTableSearchParams(current, updates) {
    const next = new URLSearchParams(current.toString());
    if ("product" in updates) {
        if (updates.product) {
            next.set("product", updates.product);
        }
        else {
            next.delete("product");
        }
    }
    if ("q" in updates) {
        const normalizedQuery = normalizeRiskTableQuery(updates.q);
        if (normalizedQuery) {
            next.set("q", normalizedQuery);
        }
        else {
            next.delete("q");
        }
    }
    if ("risk" in updates) {
        const nextRisk = updates.risk ?? exports.DEFAULT_RISK_TABLE_FILTER;
        if (nextRisk === exports.DEFAULT_RISK_TABLE_FILTER) {
            next.delete("risk");
        }
        else {
            next.set("risk", nextRisk);
        }
    }
    return next;
}
