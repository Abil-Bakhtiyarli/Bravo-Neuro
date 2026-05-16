"use client";

import { useEffect, useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import type { BranchDashboardData } from "@/lib/types";

import DailyActionPlan from "./DailyActionPlan";
import ProductRiskDrawer from "./ProductRiskDrawer";

type ActionPlanExperienceProps = {
  branchId: BranchDashboardData["branch"]["branchId"];
  tasks: BranchDashboardData["actionPlan"];
  productDetailsById: BranchDashboardData["productDetailsById"];
  initialRequestedProductId?: string | null;
  staticMode?: boolean;
};

function buildUrl(pathname: string, searchParams: URLSearchParams) {
  const query = searchParams.toString();

  return query ? `${pathname}?${query}` : pathname;
}

function updateProductSearchParam(current: URLSearchParams, productId: string | null) {
  if (productId) {
    current.set("product", productId);
  } else {
    current.delete("product");
  }

  return current;
}

export default function ActionPlanExperience({
  branchId,
  tasks,
  productDetailsById,
  initialRequestedProductId = null,
  staticMode = false,
}: ActionPlanExperienceProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const requestedProductId = searchParams?.get("product") ?? initialRequestedProductId;
  const selectedDetail = useMemo(() => {
    if (!requestedProductId) {
      return null;
    }

    return productDetailsById[requestedProductId] ?? null;
  }, [productDetailsById, requestedProductId]);

  useEffect(() => {
    if (!requestedProductId || selectedDetail) {
      return;
    }

    const nextParams = updateProductSearchParam(
      new URLSearchParams(searchParams?.toString() ?? ""),
      null,
    );
    window.history.replaceState(null, "", buildUrl(pathname, nextParams));
  }, [pathname, requestedProductId, searchParams, selectedDetail]);

  function handleDrawerOpenChange(open: boolean) {
    if (open) {
      return;
    }

    const nextParams = updateProductSearchParam(
      new URLSearchParams(searchParams?.toString() ?? ""),
      null,
    );
    window.history.replaceState(null, "", buildUrl(pathname, nextParams));
  }

  return (
    <>
      <DailyActionPlan
        branchId={branchId}
        tasks={tasks}
        selectedProductId={selectedDetail?.product.productId ?? null}
        staticMode={staticMode}
      />
      <ProductRiskDrawer
        detail={selectedDetail}
        open={selectedDetail !== null}
        onOpenChange={handleDrawerOpenChange}
      />
    </>
  );
}
