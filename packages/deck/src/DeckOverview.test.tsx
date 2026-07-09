// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render } from "@testing-library/react";
import { DeckOverview } from "./DeckOverview.js";

/**
 * jsdom can't measure boxes (getBoundingClientRect is all zeros), so the
 * transform math is covered by the playground e2e; here we verify the mode
 * contract: mode class on .slide-area, one cell per slide, current
 * highlight, click-to-jump wiring, and full restore on unmount.
 */
function renderInSlideArea(ui: Parameters<typeof render>[0]) {
  const area = document.createElement("div");
  area.className = "slide-area";
  area.innerHTML = `
    <div data-slide class="slide active"></div>
    <div data-slide class="slide"></div>
    <div data-slide class="slide"></div>
  `;
  document.body.appendChild(area);
  return render(ui, { container: area.appendChild(document.createElement("div")) });
}

describe("DeckOverview", () => {
  beforeEach(() => {
    cleanup();
    document.body.innerHTML = "";
  });

  it("flags the slide area, renders one cell per slide, highlights current", () => {
    renderInSlideArea(
      <DeckOverview
        current={1}
        total={3}
        titles={["Cover", "Steps", "Close"]}
        goTo={() => {}}
        onClose={() => {}}
      />,
    );

    const area = document.querySelector(".slide-area")!;
    expect(area.classList).toContain("is-overview");

    const cells = document.querySelectorAll(".deck-ov__cell");
    expect(cells).toHaveLength(3);
    expect(cells[1].classList).toContain("is-current");
    expect(cells[0].classList).not.toContain("is-current");
    expect(cells[1].getAttribute("aria-current")).toBe("true");
  });

  it("clicking a cell jumps to that slide and exits", () => {
    const goTo = vi.fn();
    const onClose = vi.fn();
    renderInSlideArea(
      <DeckOverview
        current={0}
        total={3}
        titles={["Cover", "Steps", "Close"]}
        goTo={goTo}
        onClose={onClose}
      />,
    );

    const cells = document.querySelectorAll(".deck-ov__cell");
    fireEvent.click(cells[2]);
    expect(goTo).toHaveBeenCalledWith(2);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("clicking the backdrop (not a cell) just exits", () => {
    const goTo = vi.fn();
    const onClose = vi.fn();
    renderInSlideArea(
      <DeckOverview
        current={0}
        total={3}
        titles={[]}
        goTo={goTo}
        onClose={onClose}
      />,
    );

    fireEvent.click(document.querySelector(".deck-ov")!);
    expect(goTo).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("unmount restores the slide area (class and inline transforms)", () => {
    const { unmount } = renderInSlideArea(
      <DeckOverview
        current={0}
        total={3}
        titles={[]}
        goTo={() => {}}
        onClose={() => {}}
      />,
    );

    unmount();
    const area = document.querySelector<HTMLElement>(".slide-area")!;
    expect(area.classList).not.toContain("is-overview");
    area.querySelectorAll<HTMLElement>("[data-slide]").forEach((s) => {
      expect(s.style.transform).toBe("");
      expect(s.style.transformOrigin).toBe("");
    });
  });
});
