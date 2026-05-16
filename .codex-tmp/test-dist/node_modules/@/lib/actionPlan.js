"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildActionPlanChecklistSteps = buildActionPlanChecklistSteps;
exports.compareActionPlanItems = compareActionPlanItems;
exports.rankActionPlanItems = rankActionPlanItems;
const ACTION_PLAN_RISK_PRIORITY = {
    critical: 3,
    high: 2,
    medium: 1,
    low: 0,
};
function formatExpiryWindow(daysUntilExpiry) {
    if (daysUntilExpiry <= 0) {
        return "today";
    }
    if (daysUntilExpiry === 1) {
        return "within 1 day";
    }
    return `within ${daysUntilExpiry} days`;
}
function buildActionPlanChecklistSteps(recommendation, daysUntilExpiry) {
    const expiryWindow = formatExpiryWindow(daysUntilExpiry);
    switch (recommendation.actionType) {
        case "discount":
            return [
                `Confirm the ${recommendation.discountPercent}% markdown for ${recommendation.productName} ${expiryWindow}.`,
                `Update shelf signage and promo labels for ${recommendation.branchName} before the next rush.`,
                `Verify tomorrow sell-through against the ${recommendation.targetUnitsByTomorrow}-unit target and escalate to ${recommendation.fallbackDiscountPercent}% if needed.`,
            ];
        case "transfer":
            return [
                `Confirm ${recommendation.destinationBranchName} can absorb ${recommendation.transferQuantity} units before expiry.`,
                `Stage the transfer quantity in the backroom and prepare the branch handoff note.`,
                `Brief ops or logistics that the transfer should leave ${recommendation.branchName} ${expiryWindow}.`,
            ];
        case "reorder-adjustment":
            return [
                `${recommendation.adjustment === "pause" ? "Pause" : "Reduce"} the next order for ${recommendation.productName}.`,
                `Notify the replenishment owner that current stock cover is already above target.`,
                "Review the next delivery window and confirm the branch will not be overstocked again this week.",
            ];
        case "shelf-action":
            return [
                `Move the exposed units to the ${recommendation.targetPlacement} for stronger visibility ${expiryWindow}.`,
                "Refresh shelf facing and make sure the product is fronted clearly for impulse pickup.",
                "Recheck evening pickup and note whether the visibility move changed sell-through.",
            ];
        case "investigation":
            return [
                "Count the shelf and backroom stock to confirm the current inventory is accurate.",
                recommendation.checks[1] ?? "Inspect shelf placement and promo visibility for the product.",
                recommendation.checks[2] ?? "Validate the anomaly with branch staff before taking pricing or transfer action.",
            ];
        default:
            return [];
    }
}
function compareActionPlanItems(left, right) {
    const riskDelta = ACTION_PLAN_RISK_PRIORITY[right.riskLevel] - ACTION_PLAN_RISK_PRIORITY[left.riskLevel];
    if (riskDelta !== 0) {
        return riskDelta;
    }
    const valueDelta = right.expectedNetSavedValueAzN - left.expectedNetSavedValueAzN;
    if (valueDelta !== 0) {
        return valueDelta;
    }
    const expiryDelta = left.daysUntilExpiry - right.daysUntilExpiry;
    if (expiryDelta !== 0) {
        return expiryDelta;
    }
    const nameDelta = left.productName.localeCompare(right.productName);
    if (nameDelta !== 0) {
        return nameDelta;
    }
    return left.taskId.localeCompare(right.taskId);
}
function rankActionPlanItems(items) {
    return [...items]
        .sort(compareActionPlanItems)
        .map((item, index) => ({
        ...item,
        priorityRank: index + 1,
    }));
}
