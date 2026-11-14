import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { PRELOADER_DURATION_MS, usePreloader } from "@/lib/preloader";

beforeEach(() => vi.useFakeTimers());
afterEach(() => { cleanup(); vi.useRealTimers(); });

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