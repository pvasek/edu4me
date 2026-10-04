import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { FIGURES } from "../../catalog";
import { FIGURES_GZ4 } from "../gz4";

const MINE = [
  "demographic-transition",
  "push-pull",
  "settlement-hierarchy",
  "urban-zones",
  "urbanisation-stages",
  "state-forms",
  "economic-sectors",
  "farming-systems",
  "mining-types",
  "industry-location",
  "transport-modes",
  "panama-canal",
  "supply-chain",
  "sahel-transect",
  "himalaya-section",
  "deforestation",
  "polar-compare",
] as const;

describe("geography figures gz4 (levels 5–7)", () => {
  it("registers exactly the gz4 figure ids, all from the catalog", () => {
    expect(Object.keys(FIGURES_GZ4).sort()).toEqual([...MINE].sort());
    for (const id of MINE) {
      expect(FIGURES as readonly string[]).toContain(id);
      expect(typeof FIGURES_GZ4[id]).toBe("function");
    }
  });

  for (const id of MINE) {
    it(`renders ${id} as an accessible image`, () => {
      const html = renderToStaticMarkup(createElement(FIGURES_GZ4[id]!));
      expect(html).toContain("<svg");
      expect(html).toContain('role="img"');
      const m =
        /role="img"[^>]*aria-label="([^"]*)"|aria-label="([^"]*)"[^>]*role="img"/.exec(
          html,
        );
      const label = m?.[1] ?? m?.[2] ?? "";
      expect(label.length).toBeGreaterThan(40);
      expect(label).toMatch(/[áčďéěíňóřšťúůýž]/);
      expect(html).not.toMatch(/NaN|undefined|Infinity/);
      // Czech notation: no decimal point in numbers shown as text
      expect(html.replace(/<[^>]*>/g, " ")).not.toMatch(/\d\.\d/);
    });
  }
});
