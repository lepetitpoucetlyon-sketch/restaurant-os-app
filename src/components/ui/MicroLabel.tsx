"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface MicroLabelProps {
    children: ReactNode;
    className?: string;
    color?: 'default' | 'accent' | 'muted' | 'warning' | 'error' | 'success';
    size?: 'xs' | 'sm' | 'md';
}

const colorMap = {
    default: 'text-neutral-400 dark:text-text-muted',
    accent: 'text-accent',
    muted: 'text-neutral-300 dark:text-neutral-500',
    warning: 'text-amber-500',
    error: 'text-red-500',
    success: 'text-green-500',
};

const sizeMap = {
    xs: 'text-[9px] tracking-[0.2em]',
    sm: 'text-[10px] tracking-[0.15em]',
    md: 'text-[11px] tracking-[0.1em]',
};

export function MicroLabel({
    children,
    className,
    color = 'default',
    size = 'sm'
}: MicroLabelProps) {
    return (
        <span
            className={cn(
                "font-black uppercase",
                sizeMap[size],
                colorMap[color],
                className
            )}
        >
            {children}
        </span>
    );
}

// Variant for section headers
export function SectionLabel({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <MicroLabel color="accent" size="sm" className={cn("mb-4 block", className)}>
            {children}
        </MicroLabel>
    );
}

// Variant for form labels
export function FormLabel({ children, className, required }: { children: ReactNode; className?: string; required?: boolean }) {
    return (
        <label className={cn("flex items-center gap-2 mb-2", className)}>
            <MicroLabel color="muted" size="xs">
                {children}
            </MicroLabel>
            {required && <span className="text-red-500 text-xs">*</span>}
        </label>
    );
}

export default MicroLabel;
