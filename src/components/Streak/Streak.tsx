"use client";

import { CategoryBar } from "@/components/tremor/CategoryBar";
import { ProgressCircle } from "@/components/tremor/ProgressCircle";
import "./Streak.css";

export const Streak = () => {
    return (
        <div className="streak-card">
            <p className="card-text">Streak</p>
            <div className="flex items-center justify-center gap-x-5">
                <ProgressCircle value={80}  strokeWidth={3} variant={"younique"} className="streak-pie mt-8">
                    <span className="text-5xl mt-8 font-medium text-gray-900 dark:text-gray-50">
                        82%
                    </span>
                </ProgressCircle>
            </div>
            <div className="mt-8">
                <p className="text-gray-900 dark:text-gray-50">82/100 Days</p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                    Streak Progress
                </p>
            </div>
        </div>
    );
};
