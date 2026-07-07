"use client";

import React from "react";
import { motion } from "framer-motion";

export interface Step {
  id: number;
  label: string;
  icon: string;
}

export const STUDIO_STEPS: Step[] = [
  { id: 1, label: "Prompt",       icon: "✏️" },
  { id: 2, label: "SEO Settings", icon: "🎯" },
  { id: 3, label: "Outline",      icon: "📋" },
  { id: 4, label: "Generate",     icon: "⚡" },
  { id: 5, label: "Review",       icon: "🔍" },
  { id: 6, label: "Publish",      icon: "🚀" },
];

interface Props {
  currentStep: number;
  completedSteps: number[];
  onStepClick?: (stepId: number) => void;
}

export default function StudioStepper({ currentStep, completedSteps, onStepClick }: Props) {
  return (
    <div className="w-full mb-10">
      <div className="flex items-center justify-between relative">
        {/* Connector line */}
        <div
          className="absolute top-4 left-0 right-0 h-px"
          style={{ background: "rgba(255,255,255,0.06)" }}
        />
        {/* Filled connector */}
        <motion.div
          className="absolute top-4 left-0 h-px"
          style={{ background: "linear-gradient(90deg, #FF7A00, #ffb300)", originX: 0 }}
          initial={{ width: "0%" }}
          animate={{ width: `${((Math.max(0, currentStep - 1)) / (STUDIO_STEPS.length - 1)) * 100}%` }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />

        {STUDIO_STEPS.map(step => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent   = currentStep === step.id;
          const isClickable = (isCompleted || step.id < currentStep) && !!onStepClick;

          return (
            <div
              key={step.id}
              className="relative flex flex-col items-center gap-2 z-10"
              style={{ cursor: isClickable ? "pointer" : "default" }}
              onClick={() => isClickable && onStepClick?.(step.id)}
            >
              {/* Circle */}
              <motion.div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black"
                animate={{
                  background: isCompleted
                    ? "linear-gradient(135deg, #22c55e, #16a34a)"
                    : isCurrent
                    ? "linear-gradient(135deg, #FF7A00, #ffb300)"
                    : "rgba(255,255,255,0.05)",
                  borderColor: isCompleted
                    ? "rgba(34,197,94,0.4)"
                    : isCurrent
                    ? "rgba(255,122,0,0.4)"
                    : "rgba(255,255,255,0.1)",
                }}
                style={{ border: "1.5px solid" }}
                transition={{ duration: 0.3 }}
              >
                {isCompleted ? (
                  <span className="text-white text-[11px]">✓</span>
                ) : (
                  <span style={{ color: isCurrent ? "#000" : "#555", fontSize: "11px" }}>{step.id}</span>
                )}
              </motion.div>

              {/* Label */}
              <span
                className="text-[10px] font-semibold uppercase tracking-wider hidden sm:block whitespace-nowrap"
                style={{
                  color: isCompleted ? "#22c55e" : isCurrent ? "#FF7A00" : "#444",
                }}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
