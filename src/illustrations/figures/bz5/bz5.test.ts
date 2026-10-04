import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { FIGURES } from "../../catalog";
import { FIGURES_BZ5 } from "../bz5";

const MINE = [
  "life-signs",
  "microscope-history",
  "wet-mount",
  "size-scale",
  "virus-structure",
  "malaria-cycle",
  "root-tip",
  "conifers",
  "celery-transpiration",
  "carboniferous-forest",
] as const;

describe("biology figures bz5 (extra figures, levels 1–3)", () => {
  it("registers exactly the bz5 figure ids, all from the catalog", () => {
    expect(Object.keys(FIGURES_BZ5).sort()).toEqual([...MINE].sort());
    for (const id of MINE) {
      expect(FIGURES as readonly string[]).toContain(id);
      expect(typeof FIGURES_BZ5[id]).toBe("function");
    }
  });

  for (const id of MINE) {
    it(`renders ${id} as an accessible image`, () => {
      const html = renderToStaticMarkup(createElement(FIGURES_BZ5[id]!));
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
