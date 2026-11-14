import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { PRELOADER_DURATION_MS, usePreloader, wheelProgress, heroLetterDelay } from "@/lib/preloader";

beforeEach(() => vi.useFakeTimers());
afterEach(() => { cleanup(); vi.useRealTimers(); });

it("keeps wheel travel within the loading sequence", () => {
  expect(wheelProgress(-100)).toBe(0);
  expect(wheelProgress(1100)).toBe(0.5);
  expect(wheelProgress(2200)).toBe(1);
  expect(wheelProgress(5000)).toBe(1);
});

it("staggers the second title line after the first", () => {
  expect(heroLetterDelay(0, 0)).toBe(0);
  expect(heroLetterDelay(0, 4)).toBe(0.1);
  expect(heroLetterDelay(1, 0)).toBe(0.16);
});

it("finishes the opening sequence and does not restart on rerender", () => {
  const { result, rerender } = renderHook(usePreloader);
  expect(result.current).toBe(true);
  act(() => vi.advanceTimersByTime(PRELOADER_DURATION_MS - 1));
  expect(result.current).toBe(true);
  act(() => vi.advanceTimersByTime(1));
  expect(result.current).toBe(false);
  rerender();
  expect(result.current).toBe(false);
});

it("clears the dismissal timer on unmount", () => {
  const { unmount } = renderHook(usePreloader);
  expect(vi.getTimerCount()).toBe(1);
  unmount();
  expect(vi.getTimerCount()).toBe(0);
});