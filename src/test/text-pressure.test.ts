import { describe, expect, it } from "vitest";
import {
  getIdlePressure,
  getPressureFontSettings,
  getRipplePressure,
} from "@/lib/text-pressure";

describe("text pressure animation", () => {
  it("generates a repeating idle wave", () => {
    expect(getIdlePressure("wave", 0.5, 0, 0.5)).toBeCloseTo(1);
    expect(getIdlePressure("wave", 0.5, 3.2, 0.5)).toBeCloseTo(1);
  });

  it("keeps pulse and disabled idle pressure in range", () => {
    expect(getIdlePressure("pulse", 0.5, 0, 1)).toBeGreaterThanOrEqual(0);
    expect(getIdlePressure("pulse", 0.5, 0, 1)).toBeLessThanOrEqual(0.42);
    expect(getIdlePressure("none", 0.5, 1, 1)).toBe(0);
  });

  it("produces a ripple near the leading pressure band", () => {
    expect(getRipplePressure([{ x: 0, y: 0, start: 0 }], { x: 125, y: 0 }, 1000, 100)).toBeGreaterThan(0);
    expect(getRipplePressure([{ x: 0, y: 0, start: 0 }], { x: 1000, y: 0 }, 1000, 100)).toBe(0);
  });

  it("clamps pressure before calculating variable-font settings", () => {
    expect(getPressureFontSettings(2, { width: true, weight: true, italic: true }))
      .toBe("'wght' 1000, 'wdth' 205, 'ital' 1.00");
    expect(getPressureFontSettings(-1, { width: true, weight: true, italic: true }))
      .toBe("'wght' 100, 'wdth' 5, 'ital' 0.00");
  });
});
