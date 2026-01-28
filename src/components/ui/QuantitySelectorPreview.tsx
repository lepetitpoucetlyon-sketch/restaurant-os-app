"use client"

import * as React from "react"
import { QuantitySelector } from "./QuantitySelector"

export function QuantitySelectorPreview() {
    const [q1, setQ1] = React.useState(1)
    const [q2, setQ2] = React.useState(3)

    return (
        <div className="p-8 space-y-8 bg-neutral-100 dark:bg-[#0E1116] rounded-3xl mt-12">
            <h3 className="text-xl font-black text-neutral-900 dark:text-white mb-6">
                Preview: Quantity Selector (Custom Design)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Light Mode Preview */}
                <div className="space-y-4">
                    <p className="text-sm font-bold text-neutral-500 uppercase tracking-widest">Mode Clair (MC)</p>
                    <div className="p-12 bg-bg-tertiary rounded-2xl flex items-center justify-center border border-neutral-200">
                        <QuantitySelector value={q1} onChange={setQ1} />
                    </div>
                </div>

                {/* Dark Mode Preview */}
                <div className="space-y-4">
                    <p className="text-sm font-bold text-neutral-500 uppercase tracking-widest">Mode Sombre (MS)</p>
                    <div className="p-12 bg-[#0E1116] rounded-2xl flex items-center justify-center border border-white/5 dark">
                        <QuantitySelector value={q2} onChange={setQ2} />
                    </div>
                </div>
            </div>
        </div>
    )
}
