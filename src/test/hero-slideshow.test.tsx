import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { HERO_INTERVAL_MS, useHeroSlideshow } from "@/lib/hero-slideshow";

function Probe() {
  const [index] = useHeroSlideshow(3);
  return <div data-testid="index">{index}</div>;
}

describe("Hero slideshow", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("changes photo every 3 seconds and wraps back to the first", () => {
    expect(HERO_INTERVAL_MS).toBe(3000);

    render(<Probe />);
    expect(screen.getByTestId("index").textContent).toBe("0");

    act(() => {
      vi.advanceTimersByTime(HERO_INTERVAL_MS - 1);
    });
    expect(screen.getByTestId("index").textContent).toBe("0");

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(screen.getByTestId("index").textContent).toBe("1");

    act(() => {
      vi.advanceTimersByTime(HERO_INTERVAL_MS);
    });
    expect(screen.getByTestId("index").textContent).toBe("2");

    act(() => {
      vi.advanceTimersByTime(HERO_INTERVAL_MS);
    });
    expect(screen.getByTestId("index").textContent).toBe("0");
  });
});
