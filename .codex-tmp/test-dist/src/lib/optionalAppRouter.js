"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useOptionalAppRouter = useOptionalAppRouter;
const navigation_1 = require("next/navigation");
function useOptionalAppRouter() {
    try {
        return (0, navigation_1.useRouter)();
    }
    catch {
        return null;
    }
}
