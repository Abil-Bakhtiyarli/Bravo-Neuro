import type { BranchId } from "./types";

export function resolveSelectedBranchId(
  requestedBranch: string | string[] | undefined,
  branchIds: readonly BranchId[],
): BranchId {
  const requestedValue = Array.isArray(requestedBranch)
    ? requestedBranch[0]
    : requestedBranch;

  if (requestedValue && branchIds.includes(requestedValue)) {
    return requestedValue;
  }

  return branchIds[0];
}
