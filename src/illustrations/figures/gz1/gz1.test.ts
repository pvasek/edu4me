import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { FIGURES } from "../../catalog";
import { FIGURES_GZ1 } from "../gz1";

const MINE = [
  "geo-spheres",
  "globe-grid",
  "latitude-longitude",
  "map-generalisation",
  "map-symbols",
  "contour-hill",
  "contour-landforms",
  "compass-rose",
  "orientation-sun",
  "trail-marks",
  "projection-surfaces",
  "mercator-sizes",
  "gps-trilateration",
  "gis-layers",
  "earth-shape-evidence",
  "eratosthenes",
  "day-night",
  "local-time",
  "date-line",
  "sun-rays-latitude",
  "solstice-light",
  "heat-zones",
  "tides",
] as const;

describe("geography figures gz1 (levels 1–2)", () => {
  it("registers exactly the gz1 figure ids, all from the catalog", () => {
    expect(Object.keys(FIGURES_GZ1).sort()).toEqual([...MINE].sort());
    for (const id of MINE) {
      expect(FIGURES as readonly string[]).toContain(id);
      expect(typeof FIGURES_GZ1[id]).toBe("function");
    }
  });

  for (const id of MINE) {
    it(`renders ${id} as an accessible image`, () => {
      const html = renderToStaticMarkup(createElement(FIGURES_GZ1[id]!));
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
