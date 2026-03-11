'use client';

import { Gift } from 'lucide-react';

interface RaffleProgressBarProps {
    showProgress: boolean;
    progressValue: number;
}

export function RaffleProgressBar({ showProgress, progressValue }: RaffleProgressBarProps) {
    if (!showProgress) return null;

    // Clamp value between 0 and 100
    const clampedValue = Math.max(0, Math.min(100, progressValue || 0));

    return (
        <div className="w-full my-4">
            <div className="relative w-full h-10 bg-stone-900/80 rounded-full overflow-hidden border border-stone-700/50 shadow-lg shadow-blue-900/10">
                {/* Animated fill */}
                <div
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 transition-all duration-1000 ease-out"
                    style={{ width: `${clampedValue}%` }}
                >
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/15 to-transparent" />
                    {/* Animated shimmer */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                </div>

                {/* Centered text */}
                <div className="absolute inset-0 flex items-center justify-center gap-2 z-10">
                    <Gift className="w-4 h-4 text-white drop-shadow-sm" strokeWidth={2.5} />
                    <span className="text-white text-sm font-semibold tracking-wide drop-shadow-sm">
                        Progresso do Sorteio: {clampedValue}%
                    </span>
                </div>
            </div>
        </div>
    );
}
