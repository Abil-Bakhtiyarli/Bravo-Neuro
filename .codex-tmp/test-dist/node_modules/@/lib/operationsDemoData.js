"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OPERATIONS_DEMO_REFERENCE_DATE = void 0;
exports.getTransfersPageData = getTransfersPageData;
exports.getRevenueForecastPageData = getRevenueForecastPageData;
const dataLoader_1 = require("./dataLoader");
const dashboardData_1 = require("./dashboardData");
const seedData_1 = require("./seedData");
const forecastProfilesByBranch = {
    ganjlik: {
        weeklyMultipliers: [1.03, 1.05, 1.06, 1.04],
        confidencePercent: 81,
        topOpportunity: "Commuter dairy and grab-and-go drinks stay ahead of plan in the weekday peak.",
        topRisk: "Short-shelf produce still limits upside if morning replenishment misses the first rush.",
        driverTemplates: [
            {
                title: "Weekday commuter spike",
                impactLabel: "+4.6% in chilled grab-and-go",
                tone: "upside",
                description: "Lunch-hour dairy and drinks are carrying the strongest week-on-week uplift in this branch.",
            },
            {
                title: "Produce waste drag",
                impactLabel: "Watch margin after day three",
                tone: "risk",
                description: "Fast-decaying produce lines still compress realized revenue if transfer or markdown timing slips.",
            },
            {
                title: "Stable bakery repeat",
                impactLabel: "Low volatility",
                tone: "watch",
                description: "Bakery demand is steady enough to support the forecast without needing an aggressive uplift assumption.",
            },
        ],
        categoryAdjustments: {
            dairy: 1.06,
            drinks: 1.05,
            bakery: 1.02,
            "fruits-vegetables": 0.99,
        },
    },
    yasamal: {
        weeklyMultipliers: [1.01, 1.02, 1.04, 1.05],
        confidencePercent: 84,
        topOpportunity: "Family-basket produce and bakery should strengthen over the weekend cycle.",
        topRisk: "The branch can over-carry dairy if weekday demand softens after the weekend top-up.",
        driverTemplates: [
            {
                title: "Weekend family basket",
                impactLabel: "+5.2% weekend mix",
                tone: "upside",
                description: "Household missions are expanding basket size in bakery and produce more than in the commuter-led branches.",
            },
            {
                title: "Dairy overhang",
                impactLabel: "Needs tighter order rhythm",
                tone: "risk",
                description: "Medium shelf-life dairy performs well, but the branch loses speed when weekday reorder pacing stays too high.",
            },
            {
                title: "Balanced category mix",
                impactLabel: "Highest confidence",
                tone: "watch",
                description: "Revenue concentration is spread more evenly here, so the branch is less exposed to one-category misses.",
            },
        ],
        categoryAdjustments: {
            dairy: 1.02,
            drinks: 0.98,
            bakery: 1.05,
            "fruits-vegetables": 1.04,
        },
    },
    may28: {
        weeklyMultipliers: [0.99, 1.01, 1.03, 1.04],
        confidencePercent: 76,
        topOpportunity: "Premium mixed demand should recover through the mid-month transit and office traffic rebound.",
        topRisk: "Transit-heavy footfall makes the first forecast week more fragile than the other two branches.",
        driverTemplates: [
            {
                title: "Transit recovery",
                impactLabel: "+3.8% by week four",
                tone: "upside",
                description: "The branch is expected to regain pace once office and transit traffic normalize after the softer opening week.",
            },
            {
                title: "Week-one volatility",
                impactLabel: "Lower confidence early",
                tone: "risk",
                description: "The first week carries more downside variance because footfall can move sharply with commuter timing.",
            },
            {
                title: "Premium mix support",
                impactLabel: "Better price realization",
                tone: "watch",
                description: "Higher-value chilled and produce lines keep revenue resilient even when unit volume is less stable.",
            },
        ],
        categoryAdjustments: {
            dairy: 1.01,
            drinks: 1.04,
            bakery: 0.99,
            "fruits-vegetables": 1.03,
        },
    },
};
const fallbackTransferLanesByBranch = {
    ganjlik: [
        {
            transferId: "ganjlik-fallback-strawberries-out",
            direction: "outbound",
            productName: "Strawberries 250g",
            category: "fruits-vegetables",
            counterpartBranchName: "Bravo 28 May",
            quantityUnits: 7,
            daysUntilExpiry: 3,
            stockCoverageDays: 5.83,
            speedMultiplier: 2.17,
            expectedValueProtectedAzN: 39.2,
            transferWindowLabel: "Move by 18:00 today",
            statusLabel: "Carrier slot reserved",
            urgency: "critical",
            summary: "Shift seven punnets before tomorrow morning to avoid a second markdown wave in Ganjlik.",
        },
    ],
    yasamal: [
        {
            transferId: "yasamal-fallback-croissant-in",
            direction: "inbound",
            productName: "Butter Croissant",
            category: "bakery",
            counterpartBranchName: "Bravo Ganjlik",
            quantityUnits: 10,
            daysUntilExpiry: 2,
            stockCoverageDays: 2.92,
            speedMultiplier: 1.56,
            expectedValueProtectedAzN: 22,
            transferWindowLabel: "Receive in the first morning run",
            statusLabel: "Ops confirmation pending",
            urgency: "watch",
            summary: "Yasamal can absorb a tighter bakery top-up before the breakfast window without new ordering.",
        },
    ],
    may28: [
        {
            transferId: "may28-fallback-spinach-in",
            direction: "inbound",
            productName: "Fresh Spinach 200g",
            category: "fruits-vegetables",
            counterpartBranchName: "Bravo Yasamal",
            quantityUnits: 8,
            daysUntilExpiry: 4,
            stockCoverageDays: 2.86,
            speedMultiplier: 1.44,
            expectedValueProtectedAzN: 23.2,
            transferWindowLabel: "Receive before 11:00 tomorrow",
            statusLabel: "Cold-chain handoff staged",
            urgency: "watch",
            summary: "May 28 can clear the extra spinach through the transit lunch peak faster than Yasamal this week.",
        },
    ],
};
function roundToOne(value) {
    return Number(value.toFixed(1));
}
function roundToTwo(value) {
    return Number(value.toFixed(2));
}
function toGeneratedAt(referenceDate) {
    const timestamp = Date.parse(`${referenceDate}T00:00:00.000Z`);
    if (!Number.isFinite(timestamp)) {
        throw new Error(`Invalid referenceDate: ${referenceDate}`);
    }
    return new Date(timestamp).toISOString();
}
function buildTransferWindowLabel(daysUntilExpiry, urgency) {
    if (urgency === "critical") {
        return "Move by 18:00 today";
    }
    if (daysUntilExpiry <= 4) {
        return "Move in the next morning run";
    }
    return "Hold for the next inter-branch shuttle";
}
function buildTransferStatusLabel(direction, urgency) {
    if (urgency === "critical") {
        return direction === "outbound" ? "Dispatch first" : "Receive first";
    }
    if (direction === "outbound") {
        return "Ready for ops review";
    }
    return "Destination can absorb now";
}
function buildTransferUrgency(daysUntilExpiry, speedMultiplier) {
    if (daysUntilExpiry <= 3 || speedMultiplier >= 1.8) {
        return "critical";
    }
    if (daysUntilExpiry <= 5 || speedMultiplier >= 1.4) {
        return "watch";
    }
    return "planned";
}
function getQuantityToTransfer(record, destinationDemand) {
    const expiryWindowDays = Math.min(Math.max(record.daysUntilEarliestExpiry, 2), 5);
    const protectedBaseUnits = Math.ceil(record.salesHistory.avgDailySales * 2);
    const excessStock = Math.max(record.totalStock - protectedBaseUnits, 0);
    const destinationCapacity = Math.max(destinationDemand * expiryWindowDays, 0);
    return Math.floor(Math.min(excessStock, destinationCapacity));
}
function buildTransferCandidates() {
    const branches = (0, dataLoader_1.getAvailableBranches)();
    const allRecords = branches.flatMap((branch) => (0, dataLoader_1.getBranchProductRecords)(branch.branchId));
    const candidates = [];
    for (const record of allRecords) {
        if (record.daysUntilEarliestExpiry < 2 || record.daysUntilEarliestExpiry > 8) {
            continue;
        }
        for (const destination of record.crossBranchSales) {
            if (destination.branchId === record.branch.branchId) {
                continue;
            }
            const currentSales = Math.max(record.salesHistory.avgDailySales, 0.1);
            const speedMultiplier = destination.avgDailySales / currentSales;
            if (speedMultiplier < 1.15) {
                continue;
            }
            const quantityUnits = getQuantityToTransfer(record, destination.avgDailySales);
            if (quantityUnits < 2) {
                continue;
            }
            candidates.push({
                sourceBranchId: record.branch.branchId,
                sourceBranchName: record.branch.branchName,
                destinationBranchId: destination.branchId,
                destinationBranchName: destination.branchName,
                productName: record.product.name,
                category: record.product.category,
                quantityUnits,
                daysUntilExpiry: record.daysUntilEarliestExpiry,
                stockCoverageDays: record.daysOfStockRemaining,
                speedMultiplier: roundToTwo(speedMultiplier),
                expectedValueProtectedAzN: roundToTwo(quantityUnits * record.product.unitPrice),
            });
        }
    }
    return candidates;
}
function toTransferLane(candidate, branchId) {
    const direction = candidate.sourceBranchId === branchId ? "outbound" : "inbound";
    const urgency = buildTransferUrgency(candidate.daysUntilExpiry, candidate.speedMultiplier);
    const counterpartBranchName = direction === "outbound"
        ? candidate.destinationBranchName
        : candidate.sourceBranchName;
    return {
        transferId: `${candidate.sourceBranchId}-${candidate.destinationBranchId}-${candidate.productName.toLowerCase().replace(/\s+/g, "-")}`,
        direction,
        productName: candidate.productName,
        category: candidate.category,
        counterpartBranchName,
        quantityUnits: candidate.quantityUnits,
        daysUntilExpiry: candidate.daysUntilExpiry,
        stockCoverageDays: candidate.stockCoverageDays,
        speedMultiplier: candidate.speedMultiplier,
        expectedValueProtectedAzN: candidate.expectedValueProtectedAzN,
        transferWindowLabel: buildTransferWindowLabel(candidate.daysUntilExpiry, urgency),
        statusLabel: buildTransferStatusLabel(direction, urgency),
        urgency,
        summary: direction === "outbound"
            ? `${candidate.destinationBranchName} can sell this line ${candidate.speedMultiplier}x faster before the current expiry window closes.`
            : `${candidate.sourceBranchName} is over-covered on this line and ${candidate.quantityUnits} units can be absorbed in ${candidate.destinationBranchName}.`,
    };
}
function compareTransferLanes(left, right) {
    const urgencyWeight = { critical: 3, watch: 2, planned: 1 };
    const urgencyDelta = urgencyWeight[right.urgency] - urgencyWeight[left.urgency];
    if (urgencyDelta !== 0) {
        return urgencyDelta;
    }
    const valueDelta = right.expectedValueProtectedAzN - left.expectedValueProtectedAzN;
    if (valueDelta !== 0) {
        return valueDelta;
    }
    return left.daysUntilExpiry - right.daysUntilExpiry;
}
function getTransfersPageData(branchId) {
    const dashboardData = (0, dashboardData_1.getDashboardData)(branchId);
    const computedLanes = buildTransferCandidates()
        .filter((candidate) => candidate.sourceBranchId === branchId || candidate.destinationBranchId === branchId)
        .map((candidate) => toTransferLane(candidate, branchId))
        .sort(compareTransferLanes);
    const fallbackLanes = fallbackTransferLanesByBranch[branchId] ?? [];
    const uniqueLaneIds = new Set(computedLanes.map((lane) => lane.transferId));
    const lanes = [
        ...computedLanes,
        ...fallbackLanes.filter((lane) => !uniqueLaneIds.has(lane.transferId)),
    ]
        .sort(compareTransferLanes)
        .slice(0, 4);
    return {
        generatedAt: dashboardData.generatedAt,
        branchName: dashboardData.branch.branchName,
        activeTransferCount: lanes.length,
        valueProtectedAzN: roundToTwo(lanes.reduce((sum, lane) => sum + lane.expectedValueProtectedAzN, 0)),
        unitsToMove: lanes.reduce((sum, lane) => sum + lane.quantityUnits, 0),
        urgentTransferCount: lanes.filter((lane) => lane.urgency === "critical").length,
        lanes,
    };
}
function formatCategoryLabel(category) {
    switch (category) {
        case "fruits-vegetables":
            return "Fruits & vegetables";
        case "dairy":
            return "Dairy";
        case "bakery":
            return "Bakery";
        case "drinks":
            return "Drinks";
        default:
            return category;
    }
}
function getBranchBaseWeeklyRevenue(branchId) {
    return (0, dataLoader_1.getBranchProductRecords)(branchId).reduce((total, record) => total + record.salesHistory.avgDailySales * 7 * record.product.unitPrice, 0);
}
function getCategoryWeeklyRevenue(branchId) {
    const totals = new Map();
    for (const record of (0, dataLoader_1.getBranchProductRecords)(branchId)) {
        const currentValue = totals.get(record.product.category) ?? 0;
        totals.set(record.product.category, currentValue + record.salesHistory.avgDailySales * 7 * record.product.unitPrice);
    }
    return totals;
}
function getRevenueForecastPageData(branchId) {
    const dashboardData = (0, dashboardData_1.getDashboardData)(branchId);
    const profile = forecastProfilesByBranch[branchId];
    const baseWeeklyRevenue = getBranchBaseWeeklyRevenue(branchId);
    const chartPoints = profile.weeklyMultipliers.map((multiplier, index) => ({
        weekKey: `week-${index + 1}`,
        weekLabel: `Week ${index + 1}`,
        projectedRevenueAzN: roundToOne(baseWeeklyRevenue * multiplier),
        baselineRevenueAzN: roundToOne(baseWeeklyRevenue),
    }));
    const projectedFourWeekRevenue = chartPoints.reduce((total, point) => total + point.projectedRevenueAzN, 0);
    const averageProjectedWeek = projectedFourWeekRevenue / Math.max(chartPoints.length, 1);
    const weekFourChangePercent = ((chartPoints[3].projectedRevenueAzN - chartPoints[0].baselineRevenueAzN) /
        chartPoints[0].baselineRevenueAzN) *
        100;
    const opportunityTone = weekFourChangePercent >= 0 ? "upside" : "watch";
    const categoryBreakdown = [...getCategoryWeeklyRevenue(branchId).entries()]
        .map(([category, weeklyRevenue]) => {
        const categoryMultiplier = profile.categoryAdjustments[category] ?? profile.weeklyMultipliers[3];
        const projectedRevenueAzN = roundToOne(weeklyRevenue * categoryMultiplier);
        const changePercent = ((projectedRevenueAzN - weeklyRevenue) / Math.max(weeklyRevenue, 1)) * 100;
        return {
            category: formatCategoryLabel(category),
            projectedRevenueAzN,
            changePercent: roundToOne(changePercent),
            confidencePercent: category === "fruits-vegetables"
                ? profile.confidencePercent - 7
                : category === "bakery"
                    ? profile.confidencePercent - 3
                    : profile.confidencePercent,
            callout: changePercent >= 3
                ? "Supports upside"
                : changePercent <= -1
                    ? "Needs protection"
                    : "Tracking close to plan",
        };
    })
        .sort((left, right) => right.projectedRevenueAzN - left.projectedRevenueAzN);
    return {
        generatedAt: dashboardData.generatedAt,
        branchName: dashboardData.branch.branchName,
        summaryMetrics: [
            {
                label: "Four-week projection",
                value: `AZN ${projectedFourWeekRevenue.toFixed(1)}`,
                helperText: `Average projected week: AZN ${averageProjectedWeek.toFixed(1)}.`,
                tone: "upside",
            },
            {
                label: "Week-four delta",
                value: `${weekFourChangePercent >= 0 ? "+" : ""}${roundToOne(weekFourChangePercent)}%`,
                helperText: profile.topOpportunity,
                tone: opportunityTone,
            },
            {
                label: "Confidence band",
                value: `${profile.confidencePercent}%`,
                helperText: "Confidence is intentionally conservative for a demo forecast, not a production model.",
                tone: "watch",
            },
            {
                label: "Top risk",
                value: profile.topRisk,
                helperText: "Use this to explain where the forecast can miss before margin protection steps kick in.",
                tone: "risk",
            },
        ],
        chartPoints,
        categoryBreakdown,
        drivers: profile.driverTemplates,
    };
}
exports.OPERATIONS_DEMO_REFERENCE_DATE = toGeneratedAt(seedData_1.SEED_REFERENCE_DATE);
