import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { FIGURES } from "../../catalog";
import { FIGURES_GZ7 } from "../gz7";

const MINE = [
  "migration-models",
  "urban-models",
  "gentrification",
  "von-thunen",
  "cultural-diffusion",
  "border-types",
  "state-shapes",
  "un-system",
  "weber-triangle",
  "smile-curve",
  "core-periphery",
  "virtual-water",
  "dam-impacts",
  "energy-transition",
  "circular-economy",
  "planetary-boundaries",
  "sdg-wheel",
  "scenario-fan",
] as const;

describe("geography figures gz7 (levels 11–12)", () => {
  it("registers exactly the gz7 figure ids, all from the catalog", () => {
    expect(Object.keys(FIGURES_GZ7).sort()).toEqual([...MINE].sort());
    for (const id of MINE) {
      expect(FIGURES as readonly string[]).toContain(id);
      expect(typeof FIGURES_GZ7[id]).toBe("function");
    }
  });

  for (const id of MINE) {
    it(`renders ${id} as an accessible image`, () => {
      const html = renderToStaticMarkup(createElement(FIGURES_GZ7[id]!));
      expect(html).toContain("<svg");
      expect(html).toContain('role="img"');
      const m =
        /role="img"[^>]*aria-label="([^"]*)"|aria-label="([^"]*)"[^>]*role="img"/.exec(
          html,
        );
      const label = m?.[1] ?? m?.[2] ?? "";
      expect(label.length).toBeGreaterThan(40);
      // Czech description (diacritics present)
      expect(label).toMatch(/[áčďéěíňóřšťúůýž]/);
      // no NaN / undefined leaked into the drawing
      expect(html).not.toMatch(/NaN|undefined|Infinity/);
      // decimal comma in numbers shown to the learner
      expect(html.replace(/<[^>]*>/g, " ")).not.toMatch(/\d\.\d+\s?(°C|t|l|km|%)/);
    });
  }
});
