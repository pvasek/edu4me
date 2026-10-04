import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { FIGURES } from "../../catalog";
import { FIGURES_BZ3 } from "../bz3";

const MINE = [
  "chromosome-karyotype",
  "punnett-peas",
  "blood-group-inheritance",
  "sex-linkage",
  "natural-selection-moth",
  "artificial-selection",
  "geological-timescale",
  "fossil-formation",
  "earth-layers",
  "plate-boundaries",
  "rock-cycle",
  "soil-profile",
  "water-cycle",
  "food-web",
  "energy-pyramid",
  "succession",
  "organelles-detail",
  "endosymbiosis",
  "membrane-transport",
  "osmosis-cells",
  "mitosis-meiosis",
  "chloroplast-reactions",
] as const;

describe("biology figures bz3 (levels 7–9)", () => {
  it("registers exactly the bz3 figure ids, all from the catalog", () => {
    expect(Object.keys(FIGURES_BZ3).sort()).toEqual([...MINE].sort());
    for (const id of MINE) {
      expect(FIGURES as readonly string[]).toContain(id);
      expect(typeof FIGURES_BZ3[id]).toBe("function");
    }
  });

  for (const id of MINE) {
    it(`renders ${id} as an accessible image`, () => {
      const html = renderToStaticMarkup(createElement(FIGURES_BZ3[id]!));
      expect(html).toContain("<svg");
      expect(html).toContain('role="img"');
      // the image description (a StepFilm's buttons carry short labels of their own)
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
    });
  }
});
