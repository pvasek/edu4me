import type { ComponentType } from "react";
import type { FigureId } from "../catalog";

/** Geography figures, group gz4 – levels 5–7 (people, economy, regions) (spec/courses/zemepis/figures.md). */
export const FIGURES_GZ4: Partial<Record<FigureId, ComponentType>> = {};
