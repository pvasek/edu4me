import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { FIGURES } from "../../catalog";
import { FIGURES_GZ3 } from "../gz3";

const MINE = [
  "atmosphere-layers",
  "weather-station",
  "cloud-types",
  "pressure-wind",
  "weather-fronts",
  "synoptic-map",
  "tropical-cyclone",
  "global-circulation",
  "monsoon",
  "altitude-zones",
  "water-distribution",
  "ocean-currents",
  "river-basin",
  "lake-origins",
  "groundwater",
  "glacier-parts",
  "biome-climate",
] as const;

describe("geography figures gz3 (level 4)", () => {
  it("registers exactly the gz3 figure ids, all from the catalog", () => {
    expect(Object.keys(FIGURES_GZ3).sort()).toEqual([...MINE].sort());
    for (const id of MINE) {
      expect(FIGURES as readonly string[]).toContain(id);
      expect(typeof FIGURES_GZ3[id]).toBe("function");
    }
  });

  for (const id of MINE) {
    it(`renders ${id} as an accessible image`, () => {
      const html = renderToStaticMarkup(createElement(FIGURES_GZ3[id]!));
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
