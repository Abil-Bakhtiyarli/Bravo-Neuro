const { getBranchProductRecord, getBranchProductRecords } = require("./test-dist/src/lib/dataLoader.js");
const { calculateWasteRisk, calculateWasteRiskForBranch } = require("./test-dist/src/lib/riskScore.js");

function printProduct(branchId, productId) {
    const record = getBranchProductRecord(branchId, productId);
    const risk = calculateWasteRisk(record);

    console.log(`\n${branchId} / ${productId}`);
    console.log({
        roundedScore: risk.roundedScore,
        totalScore: risk.totalScore,
        riskLevel: risk.riskLevel,
        mainDrivers: risk.mainDrivers.map((d) => ({
            key: d.key,
            rawScore: d.rawScore,
            weightedContribution: d.weightedContribution,
        })),
    });
}

printProduct("ganjlik", "greek-yogurt-500g");
printProduct("ganjlik", "orange-juice-1l");
printProduct("ganjlik", "strawberries-250g");
printProduct("ganjlik", "bananas");
printProduct("may28", "greek-yogurt-500g");

const ganjlik = getBranchProductRecords("ganjlik");
const scored = calculateWasteRiskForBranch(ganjlik);
console.log(`\nScored records for ganjlik: ${scored.length}`);
