import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { FIGURES } from "../../catalog";
import { FIGURES_BZ1 } from "../bz1";

const MINE = [
  "microscope-parts",
  "cell-plant-animal",
  "levels-of-organisation",
  "surface-volume",
  "life-cycles",
  "classification-hierarchy",
  "dichotomous-key",
  "virus-replication",
  "bacterial-cell",
  "protists-gallery",
  "fungus-anatomy",
  "lichen-section",
  "immune-response-basic",
  "moss-fern-cycle",
  "plant-organs",
  "leaf-cross-section",
  "flower-parts",
  "seed-germination",
  "monocot-dicot",
] as const;

describe("biology figures bz1 (levels 1–3)", () => {
  it("registers exactly the bz1 figure ids, all from the catalog", () => {
    expect(Object.keys(FIGURES_BZ1).sort()).toEqual([...MINE].sort());
    for (const id of MINE) {
      expect(FIGURES as readonly string[]).toContain(id);
      expect(typeof FIGURES_BZ1[id]).toBe("function");
    }
  });

  for (const id of MINE) {
    it(`renders ${id} as an accessible image`, () => {
      const html = renderToStaticMarkup(createElement(FIGURES_BZ1[id]!));
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
