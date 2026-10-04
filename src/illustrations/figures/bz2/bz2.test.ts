import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { FIGURES } from "../../catalog";
import { FIGURES_BZ2 } from "../bz2";

const MINE = [
  "animal-symmetry",
  "cnidarian-hydra",
  "tapeworm-cycle",
  "mollusc-groups",
  "earthworm-soil",
  "arthropod-groups",
  "insect-metamorphosis",
  "honeybee-colony",
  "vertebrate-evolution",
  "fish-anatomy",
  "frog-metamorphosis",
  "amniotic-egg",
  "bird-flight",
  "mammal-teeth",
  "human-skeleton",
  "heart-circulation",
  "lungs-alveoli",
  "digestive-system",
  "reflex-arc",
  "urinary-system",
  "human-development",
] as const;

describe("biology figures bz2 (levels 4–6)", () => {
  it("registers exactly the bz2 figure ids, all from the catalog", () => {
    expect(Object.keys(FIGURES_BZ2).sort()).toEqual([...MINE].sort());
    for (const id of MINE) {
      expect(FIGURES as readonly string[]).toContain(id);
      expect(typeof FIGURES_BZ2[id]).toBe("function");
    }
  });

  for (const id of MINE) {
    it(`renders ${id} as an accessible image`, () => {
      const html = renderToStaticMarkup(createElement(FIGURES_BZ2[id]!));
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
