"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Redirect /results?q=<query>  →  /results/<query>
 * This keeps all existing navigation calls (Main copy.js / Navbar / Bar1)
 * working without any changes to those files.
 */
export default function ResultsRedirectPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const q = searchParams.get("q") || "";
        if (q.trim()) {
            router.replace(`/results/${encodeURIComponent(q.trim())}`);
        } else {
            router.replace("/");
        }
    }, [searchParams, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0f3c4c]" />
                <p className="text-gray-500 text-sm">Loading results…</p>
            </div>
        </div>
    );
}
