"use client";

import { useRouter } from "next/navigation";

export function useOptionalAppRouter() {
  try {
    return useRouter();
  } catch {
    return null;
  }
}
