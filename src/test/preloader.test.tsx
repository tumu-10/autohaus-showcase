import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { PRELOADER_DURATION_MS, PRELOADER_FALLBACK_MS, usePreloader, wheelChoreography, wheelProgress, heroLetterDelay } from "@/lib/preloader";

beforeEach(() => vi.useFakeTimers());
afterEach(() => { cleanup(); vi.useRealTimers(); });

it("keeps wheel travel within the loading sequence", () => {
  expect(wheelProgress(-100)).toBe(0);
  expect(wheelProgress(PRELOADER_DURATION_MS / 2)).toBe(0.5);
  expect(wheelProgress(PRELOADER_DURATION_MS)).toBe(1);
  expect(wheelProgress(5000)).toBe(1);
});

it("spins before launch, emits smoke through the drift, and exits cleanly", () => {
  const start = wheelChoreography(0);
  const burnout = wheelChoreography(0.12);
  const drift = wheelChoreography(0.55);
  const finish = wheelChoreography(1);
  expect(start.travel).toBe(0);
  expect(start.spin).toBe(0);
  expect(burnout.spin).toBeGreaterThan(5);
  expect(burnout.travel).toBe(0);
  expect(drift.smoke).toBeGreaterThan(0.9);
  expect(drift.drift).toBeGreaterThan(0.5);
  expect(finish.travel).toBeGreaterThan(1);
  expect(finish.smoke).toBe(0);
  expect(finish.drift).toBe(0);
});

it("staggers the second title line after the first", () => {
  expect(heroLetterDelay(0, 0)).toBe(0);
  expect(heroLetterDelay(0, 4)).toBeCloseTo(0.084);
  expect(heroLetterDelay(1, 0)).toBeCloseTo(0.17);
});

it("waits for the wheel, finishes the full sequence, and does not restart on rerender", () => {
  const { result, rerender } = renderHook(usePreloader);
  expect(result.current.visible).toBe(true);
  act(() => vi.advanceTimersByTime(PRELOADER_DURATION_MS));
  expect(result.current.visible).toBe(true);
  act(() => result.current.signalReady());
  act(() => vi.advanceTimersByTime(PRELOADER_DURATION_MS - 1));
  expect(result.current.visible).toBe(true);
  act(() => vi.advanceTimersByTime(1));
  expect(result.current.visible).toBe(false);
  rerender();
  expect(result.current.visible).toBe(false);
});

it("dismisses through the fallback if rendering never becomes ready", () => {
  const { result } = renderHook(usePreloader);
  act(() => vi.advanceTimersByTime(PRELOADER_FALLBACK_MS - 1));
  expect(result.current.visible).toBe(true);
  act(() => vi.advanceTimersByTime(1));
  expect(result.current.visible).toBe(false);
});

it("clears the dismissal timer on unmount", () => {
  const { unmount } = renderHook(usePreloader);
  expect(vi.getTimerCount()).toBe(1);
  unmount();
  expect(vi.getTimerCount()).toBe(0);
});