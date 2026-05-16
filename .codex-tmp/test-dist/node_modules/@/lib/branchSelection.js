"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveSelectedBranchId = resolveSelectedBranchId;
function resolveSelectedBranchId(requestedBranch, branchIds) {
    const requestedValue = Array.isArray(requestedBranch)
        ? requestedBranch[0]
        : requestedBranch;
    if (requestedValue && branchIds.includes(requestedValue)) {
        return requestedValue;
    }
    return branchIds[0];
}
